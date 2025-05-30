const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leaves the voice channel and clears the queue.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({ content: '❌ I am not in a voice channel or nothing is playing.', ephemeral: true });
    }

    try {
      await client.distube.voices.leave(interaction.guild);
      await interaction.reply('👋 Left the voice channel and cleared the queue.');
    } catch (error) {
      console.error('Leave error:', error);
      await interaction.reply({ content: '❌ Failed to leave the voice channel.', ephemeral: true });
    }
  },
};
