const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a specific song from the queue.')
    .addIntegerOption(option =>
      option.setName('song_number')
        .setDescription('The number of the song to remove (see /queue)')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const songNumber = interaction.options.getInteger('song_number');
    const queue = client.queues.get(interaction.guildId);

    if (!queue || queue.length < 2) {
      return interaction.reply({ content: '❌ No songs in the queue to remove.', ephemeral: true });
    }

    if (songNumber <= 1 || songNumber > queue.length) {
      return interaction.reply({ content: '❌ Invalid song number. Use /queue to view the list.', ephemeral: true });
    }

    const removed = queue.splice(songNumber - 1, 1);
    client.queues.set(interaction.guildId, queue);
    return interaction.reply(`🗑️ Removed: ${removed[0]}`);
  },
};
