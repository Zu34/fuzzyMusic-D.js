const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reportbug')
    .setDescription('Report a bug to the developers.')
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Describe the bug you encountered')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const description = interaction.options.getString('description');

    const bugChannel = client.channels.cache.get('YOUR_REPORT_CHANNEL_ID');
    if (!bugChannel) {
      return interaction.reply({ content: '❌ Bug report channel not found.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('🐞 Bug Report')
      .setDescription(description)
      .addFields(
        { name: 'Reporter', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
        { name: 'Server', value: `${interaction.guild.name} (${interaction.guild.id})`, inline: true }
      )
      .setTimestamp()
      .setColor('Red');

    await bugChannel.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Your bug report has been submitted!', ephemeral: true });
  }
};
