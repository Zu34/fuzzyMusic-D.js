const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the currently playing music.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({ content: '❌ Nothing is playing right now!', ephemeral: true });
    }

    if (queue.paused) {
      return interaction.reply({ content: '⏸️ Music is already paused.', ephemeral: true });
    }

    queue.pause();
    await interaction.reply('⏸️ Music paused.');
  },
};
