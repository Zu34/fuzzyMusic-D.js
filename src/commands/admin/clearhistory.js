// src/commands/admin/clearhistory.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const QueueHistory = require('../../models/QueueHistory');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearhistory')
    .setDescription('Deletes the queue history for this server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only admins can use it

  async execute(interaction) {
    try {
      const result = await QueueHistory.deleteMany({ guildId: interaction.guildId });

      return interaction.reply({
        content: `🧹 Cleared ${result.deletedCount} entries from the queue history.`,
        ephemeral: true,
      });
    } catch (err) {
      console.error('❌ Error clearing history:', err);
      return interaction.reply({
        content: '❌ Failed to clear history. Check logs for more info.',
        ephemeral: true,
      });
    }
  },
};
