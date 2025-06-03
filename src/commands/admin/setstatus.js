// src/commands/admin/setstatus.js
const { SlashCommandBuilder, ActivityType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setstatus')
    .setDescription('Sets the bot status and activity (Admin only)')
    .addStringOption(option =>
      option.setName('status')
        .setDescription('Bot status')
        .setRequired(true)
        .addChoices(
          { name: 'Online', value: 'online' },
          { name: 'Idle', value: 'idle' },
          { name: 'Do Not Disturb', value: 'dnd' },
          { name: 'Invisible', value: 'invisible' }
        )
    )
    .addStringOption(option =>
      option.setName('activity_type')
        .setDescription('Type of activity')
        .setRequired(true)
        .addChoices(
          { name: 'Playing', value: 'Playing' },
          { name: 'Listening', value: 'Listening' },
          { name: 'Watching', value: 'Watching' },
          { name: 'Competing', value: 'Competing' }
        )
    )
    .addStringOption(option =>
      option.setName('activity')
        .setDescription('The activity message')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    // No need for manual permission check due to setDefaultMemberPermissions,
    // but double-checking doesn't hurt if you want explicit error message:
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Only administrators can use this command.', ephemeral: true });
    }

    const status = interaction.options.getString('status');
    const activityType = interaction.options.getString('activity_type');
    const activityMessage = interaction.options.getString('activity');

    const typeMap = {
      Playing: ActivityType.Playing,
      Listening: ActivityType.Listening,
      Watching: ActivityType.Watching,
      Competing: ActivityType.Competing,
    };

    try {
      await client.user.setPresence({
        status,
        activities: [{ name: activityMessage, type: typeMap[activityType] }],
      });

      return interaction.reply(`✅ Status updated to **${status}**, Activity set to **${activityType} ${activityMessage}**`);
    } catch (error) {
      console.error('Failed to set status/activity:', error);
      return interaction.reply({ content: '❌ Failed to set status or activity.', ephemeral: true });
    }
  },
};
