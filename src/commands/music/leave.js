const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the voice channel and clear the music queue.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue || !queue.voice || !queue.voice.channel) {
      return interaction.reply({
        content: '❌ I am not connected to a voice channel or there is no queue.',
        ephemeral: true
      });
    }

    try {
      await client.distube.voices.leave(interaction.guild);
      return interaction.reply('👋 Left the voice channel and cleared the queue.');
    } catch (error) {
      console.error('❌ Error while leaving:', error);
      return interaction.reply({
        content: '❌ Something went wrong while trying to leave the voice channel.',
        ephemeral: true
      });
    }
  }
};
