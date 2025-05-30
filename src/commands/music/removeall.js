const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeall')
    .setDescription('Removes all songs in the queue (except the current).'),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guildId);

    if (!queue || queue.length <= 1) {
      return interaction.reply({ content: '❌ No songs to remove from the queue.', ephemeral: true });
    }

    client.queues.set(interaction.guildId, [queue[0]]);
    return interaction.reply('🧹 Queue cleared (except current track).');
  },
};
