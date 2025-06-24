// src/commands/util/userinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows information about a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to get info about')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Info`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 User ID', value: user.id, inline: true },
        { name: '🗓️ Created At', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '📅 Joined Server', value: member?.joinedAt ? `<t:${Math.floor(member.joinedAt / 1000)}:F>` : 'Unknown', inline: true },
        { name: '🤖 Bot?', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: '🎭 Roles', value: member?.roles.cache.size > 1 ? member.roles.cache.filter(r => r.name !== '@everyone').map(r => r.toString()).join(', ') : 'None', inline: false }
      )
      .setColor('Blue')
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
