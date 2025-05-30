// src/commands/DJCommands/movetrack.js

const { SlashCommandBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movetrack')
    .setDescription('Move a track to a different position in the queue')
    .addIntegerOption(opt => opt.setName('from').setDescription('Original position (starts from 2)').setRequired(true))
    .addIntegerOption(opt => opt.setName('to').setDescription('New position (starts from 2)').setRequired(true)),

  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const from = interaction.options.getInteger('from') - 2; // -2 to skip currently playing
    const to = interaction.options.getInteger('to') - 2;
    const member = interaction.member;

    // Check DJ permissions
    const hasPermission = await isDJ(member);
    if (!hasPermission) {
      return interaction.reply({
        content: '❌ You need the DJ role or Admin permissions to use this command.',
        ephemeral: true,
      });
    }

    const queue = client.distube.getQueue(guildId);
    if (!queue || !queue.songs || queue.songs.length <= 2) {
      return interaction.reply({ content: '❌ Not enough tracks in the queue to move.', ephemeral: true });
    }

    const tracks = queue.songs.slice(1); // Exclude currently playing
    if (from < 0 || to < 0 || from >= tracks.length || to >= tracks.length) {
      return interaction.reply({ content: '❌ Invalid track positions.', ephemeral: true });
    }

    const [moved] = tracks.splice(from, 1);
    tracks.splice(to, 0, moved);

    // Reconstruct the full queue
    queue.songs = [queue.songs[0], ...tracks];
    await interaction.reply(`📦 Moved track from position ${from + 2} to ${to + 2}.`);
  },
};
