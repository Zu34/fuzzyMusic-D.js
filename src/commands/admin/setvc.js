const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setvc')
    .setDescription('Sets or clears the allowed voice channel for playing music')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Voice channel or "none" to clear')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ You must be an administrator to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const guildId = interaction.guildId;

    if (!client.allowedVoiceChannels) client.allowedVoiceChannels = new Map();

    client.allowedVoiceChannels.set(guildId, channel.id);
    return interaction.reply(`✅ Music playback restricted to <#${channel.id}>`);
  }
};
