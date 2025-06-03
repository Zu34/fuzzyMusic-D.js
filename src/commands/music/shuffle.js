const { SlashCommandBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');
const shuffleArray = require('../../utils/shuffle');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the upcoming songs in the queue.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue || queue.songs.length <= 1) {
      return interaction.reply({ content: '❌ Not enough songs in the queue to shuffle.', ephemeral: true });
    }

    if (!isDJ(interaction.member)) {
      return interaction.reply({
        content: '❌ You must be a DJ or have Administrator permissions to use this command.',
        ephemeral: true
      });
    }

    const currentSong = queue.songs[0];
    const shuffled = shuffleArray(queue.songs.slice(1));
    queue.songs = [currentSong, ...shuffled];

    return interaction.reply('🔀 Queue shuffled!');
  },
};
