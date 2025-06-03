// src/commands/admin/setvc.js
const { SlashCommandBuilder } = require('discord.js');
const { saveAllowedVoiceChannels } = require('../../utils/voiceChannelConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setvc')
    .setDescription('Sets or clears the allowed voice channel for playing music')
    .addStringOption(option =>
      option.setName('channel')
        .setDescription('Voice channel ID or "none" to clear restriction')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ You must be an administrator to use this command.', ephemeral: true });
    }

    const input = interaction.options.getString('channel');
    const guildId = interaction.guildId;

    if (!client.allowedVoiceChannels) client.allowedVoiceChannels = new Map();

    if (input.toLowerCase() === 'none') {
      client.allowedVoiceChannels.delete(guildId);
      saveAllowedVoiceChannels(client.allowedVoiceChannels);
      return interaction.reply('✅ Music playback is no longer restricted to a specific voice channel.');
    }

    const channel = interaction.guild.channels.cache.get(input);

    if (!channel || channel.type !== 2) { // 2 = GuildVoice
      return interaction.reply({ content: '❌ Please provide a valid voice channel ID or "none".', ephemeral: true });
    }

    client.allowedVoiceChannels.set(guildId, channel.id);
    saveAllowedVoiceChannels(client.allowedVoiceChannels);
    return interaction.reply(`✅ Music playback restricted to <#${channel.id}>`);
  }
};
