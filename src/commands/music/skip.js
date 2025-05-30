const { SlashCommandBuilder } = require('discord.js');
const { voteSkips } = require('../../utils/voteState');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the currently playing song.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });
    }

    try {
      await client.distube.skip(interaction.guildId);
      voteSkips.delete(interaction.guildId);
      await interaction.reply('⏭️ Skipped to the next song!');
    } catch (error) {
      console.error('Skip error:', error);
      await interaction.reply({ content: '❌ Failed to skip the song.', ephemeral: true });
    }
  },
};
