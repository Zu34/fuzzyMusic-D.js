const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the music and clears the queue.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({ content: '❌ No music is playing!', ephemeral: true });
    }

    await client.distube.stop(interaction.guildId);
    await interaction.reply('⏹️ Music stopped and queue cleared!');
  },
};
