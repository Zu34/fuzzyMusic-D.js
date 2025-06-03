
const { SlashCommandBuilder } = require('discord.js');
const playdl = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a YouTube video or search query in your voice channel')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('YouTube URL or search term')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query').trim();
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ You need to be in a voice channel to use this command!', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const isValidUrl = await playdl.validate(query);
      let urlToPlay = query;

      if (!isValidUrl) {
        const results = await playdl.search(query, { limit: 1 });
        if (!results.length) {
          return interaction.followUp({ content: '❌ No results found for your query.', ephemeral: true });
        }
        urlToPlay = results[0].url;
      }

      console.log('Playing URL:', urlToPlay);

      await interaction.client.distube.play(voiceChannel, urlToPlay, {
        member: interaction.member,
        textChannel: interaction.channel,
      });

      await interaction.followUp(`🎶 Now playing: \`${urlToPlay}\``);

    } catch (error) {
      console.error('Error playing track:', error);
      await interaction.followUp({ content: '❌ Could not play the provided URL or query.', ephemeral: true });
    }
  }
};
