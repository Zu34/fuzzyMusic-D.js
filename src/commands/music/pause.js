const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the currently playing music.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return interaction.reply({
        content: '❌ Nothing is currently playing.',
        ephemeral: true,
      });
    }

    if (queue.paused) {
      return interaction.reply({
        content: '⏸️ The music is already paused.',
        ephemeral: true,
      });
    }

    try {
      queue.pause();
      return interaction.reply('⏸️ Music paused.');
    } catch (err) {
      console.error('Pause error:', err);
      return interaction.reply({
        content: '❌ Failed to pause the music.',
        ephemeral: true,
      });
    }
  },
};
