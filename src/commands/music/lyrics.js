const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const stringSimilarity = require('string-similarity');
const LyricCache = require('../../models/LyricCache');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get lyrics for the current or specified song.')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Optional: Artist - Title or just title')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    let input = interaction.options.getString('song');
    let query = '';

    // 1. Get current song if no input
    if (!input) {
      const queue = client.distube.getQueue(interaction.guildId);
      if (!queue || !queue.songs.length) {
        return interaction.followUp('❌ No music is playing and no song name was provided.');
      }
      query = queue.songs[0].name;
    } else {
      query = input;
    }

    // Normalize query to lower case trimmed
    const normalizedQuery = query.toLowerCase().trim();

    try {
      // 2. Check cache first
      let cached = await LyricCache.findOne({ title: normalizedQuery });
      if (cached) {
        // Return cached lyrics embed
        const embed = new EmbedBuilder()
          .setTitle(`🎤 Lyrics for: ${cached.title}`)
          .setDescription(cached.lyrics.length > 2048 ? cached.lyrics.slice(0, 2045) + '...' : cached.lyrics)
          .setURL(cached.songUrl || null)
          .setThumbnail(cached.albumArt || null)
          .setFooter({ text: 'Cached lyrics' });

        return interaction.followUp({ embeds: [embed] });
      }

      // 3. Search Genius API
      const searchRes = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${process.env.GENIUS_TOKEN}` }
      });

      const hits = searchRes.data.response.hits;
      if (!hits.length) {
        return interaction.followUp('❌ No results found on Genius.');
      }

      // 4. Fuzzy match best hit
      const titles = hits.map(hit => hit.result.full_title.toLowerCase());
      const bestMatchIndex = stringSimilarity.findBestMatch(normalizedQuery, titles).bestMatchIndex;
      const song = hits[bestMatchIndex].result;

      // 5. Fetch lyrics page and scrape lyrics
      const lyricsPage = await axios.get(song.url);
      
      // Try to parse lyrics with two common patterns on Genius pages
      let lyrics = '';
      const regex1 = /<div class="lyrics">([\s\S]*?)<\/div>/;
      const regex2 = /<div data-lyrics-container="true">([\s\S]*?)<\/div>/g;

      const match1 = lyricsPage.data.match(regex1);
      if (match1) {
        lyrics = match1[1].replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, '').trim();
      } else {
        // fallback to multiple containers
        const matches = [...lyricsPage.data.matchAll(regex2)];
        lyrics = matches.map(m =>
          m[1].replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, '')
        ).join('\n').trim();
      }

      if (!lyrics) {
        return interaction.followUp(`❌ Could not extract lyrics for **${song.full_title}**.`);
      }

      // 6. Prepare embed with album art
      const embed = new EmbedBuilder()
        .setTitle(`🎤 Lyrics for: ${song.full_title}`)
        .setURL(song.url)
        .setThumbnail(song.song_art_image_thumbnail_url)
        .setDescription(lyrics.length > 2048 ? lyrics.slice(0, 2045) + '...' : lyrics);

      // 7. Cache the lyrics for future use
      await LyricCache.findOneAndUpdate(
        { title: normalizedQuery },
        {
          title: normalizedQuery,
          artist: song.primary_artist.name,
          lyrics,
          albumArt: song.song_art_image_thumbnail_url,
          songUrl: song.url,
          lastUpdated: new Date(),
        },
        { upsert: true }
      );

      return interaction.followUp({ embeds: [embed] });

    } catch (error) {
      console.error('Lyrics command error:', error);
      return interaction.followUp('❌ Something went wrong fetching lyrics.');
    }
  }
};
