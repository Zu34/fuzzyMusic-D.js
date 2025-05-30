const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get lyrics for the current or specified song.')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Optional: Provide artist - title (e.g. Eminem - Lose Yourself)')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    let input = interaction.options.getString('song');
    let artist = '', title = '';

    if (!input) {
      // Fallback to current song from DisTube
      const queue = client.distube.getQueue(interaction.guildId);

      if (!queue || !queue.songs || queue.songs.length === 0) {
        return interaction.followUp('❌ No music is playing and no song name was provided.');
      }

      input = queue.songs[0].name;
    }

    const parts = input.split(' - ');
    if (parts.length > 1) {
      artist = parts[0];
      title = parts.slice(1).join(' ');
    } else {
      title = input;
    }

    try {
      const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
      const lyrics = res.data.lyrics;

      if (!lyrics) {
        return interaction.followUp('❌ No lyrics found.');
      }

      if (lyrics.length > 2000) {
        return interaction.followUp('📜 Lyrics too long to display in one message.');
      }

      return interaction.followUp(`🎤 **Lyrics for:** \`${artist ? artist + ' - ' : ''}${title}\`\n\n${lyrics}`);
    } catch (error) {
      console.error('Lyrics fetch error:', error.message);
      return interaction.followUp('❌ Could not find lyrics for that song.');
    }
  }
};

