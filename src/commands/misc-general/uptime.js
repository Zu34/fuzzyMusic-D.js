// src/commands/general/uptime.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Shows how long the bot has been online'),

  async execute(interaction, client) {
    const uptimeMs = client.uptime;
    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / 1000 / 60) % 60);
    const hours = Math.floor((uptimeMs / 1000 / 60 / 60) % 24);
    const days = Math.floor(uptimeMs / 1000 / 60 / 60 / 24);

    const formatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    await interaction.reply(`⏱️ Bot has been online for **${formatted}**`);
  }
};
