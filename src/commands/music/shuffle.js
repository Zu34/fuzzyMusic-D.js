const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the upcoming songs in the queue.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue || queue.songs.length <= 1) {
      return interaction.reply({ content: '❌ Not enough songs in the queue to shuffle.', ephemeral: true });
    }

    const currentSong = queue.songs[0];
    const upcomingSongs = queue.songs.slice(1);

    // Fisher–Yates shuffle algorithm
    for (let i = upcomingSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [upcomingSongs[i], upcomingSongs[j]] = [upcomingSongs[j], upcomingSongs[i]];
    }

    // Replace queue songs with current + shuffled upcoming
    queue.songs = [currentSong, ...upcomingSongs];

    return interaction.reply('🔀 Queue shuffled!');
  },
};
