// src/commands/music/history.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const QueueHistory = require('../../models/queuehistory');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('Displays the last 5 songs that were stopped in this server.'),

  async execute(interaction) {
    const logs = await QueueHistory.find({ guildId: interaction.guildId })
      .sort({ timestamp: -1 })
      .limit(5);

    if (!logs.length) {
      return interaction.reply({ content: '🕳️ No history found for this server yet.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`🕘 Recent Track History`)
      .setColor('Blue')
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    logs.forEach((entry, index) => {
      embed.addFields({
        name: `#${index + 1} • ${entry.track.name}`,
        value: `🔗 [Link](${entry.track.url}) | ⏱️ ${entry.track.duration}\n👤 Stopped by <@${entry.userId}>`,
      });
    });

    return interaction.reply({ embeds: [embed] });
  },
};
