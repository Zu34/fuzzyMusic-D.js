// src/commands/general/botinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Shows information about the bot'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Info')
      .addFields(
        { name: 'Developer', value: 'YourNameHere', inline: true },
        { name: 'Guilds', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${client.users.cache.size}`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'Platform', value: os.platform(), inline: true },
        { name: 'Uptime', value: `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`, inline: true }
      )
      .setColor('Green');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
