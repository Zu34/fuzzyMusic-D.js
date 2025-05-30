const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settc')
    .setDescription('Sets or clears the allowed text channel for music commands')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Text channel or "none" to clear')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ You must be an administrator to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const guildId = interaction.guildId;

    if (!client.allowedTextChannels) client.allowedTextChannels = new Map();

    client.allowedTextChannels.set(guildId, channel.id);
    return interaction.reply(`✅ Music commands restricted to <#${channel.id}>`);
  }
};
