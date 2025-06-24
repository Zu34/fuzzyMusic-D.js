// src/commands/DJCommands/stop.js
const { SlashCommandBuilder } = require('discord.js');
const { isDJ } = require('../../utils/isDJ');
const { voteSkips } = require('../../utils/voteState');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stophere')
    .setDescription('Stops the music and clears the queue (DJ only).'),

  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const member = interaction.member;

    // DJ check
    const hasPermission = await isDJ(member);
    if (!hasPermission) {
      return interaction.reply({ content: '❌ You must be a DJ to use this command.', ephemeral: true });
    }

    const queue = client.distube.getQueue(guildId);
    if (!queue) {
      return interaction.reply({ content: '❌ No music is playing!', ephemeral: true });
    }

    try {
      await client.distube.stop(guildId);
      voteSkips.delete(guildId); // Clear any vote skips if ongoing
      await interaction.reply('⏹️ Music stopped and queue cleared!');
    } catch (error) {
      console.error('Stop error:', error);
      await interaction.reply({ content: '❌ Failed to stop the music.', ephemeral: true });
    }
  },
};
