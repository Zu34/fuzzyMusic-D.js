// src/commands/general/help.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands by category'),

  async execute(interaction, client) {
    const commandList = [...client.commands.values()];
    const categorized = {};

    for (const cmd of commandList) {
      const category = cmd.category || 'Uncategorized';
      if (!categorized[category]) categorized[category] = [];
      categorized[category].push(`• \`/${cmd.data.name}\` - ${cmd.data.description}`);
    }

    const embed = new EmbedBuilder()
      .setTitle('📘 Available Commands')
      .setColor('Blue');

    for (const category in categorized) {
      embed.addFields({ name: `📂 ${category}`, value: categorized[category].join('\n') });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
