const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Display the currently playing song.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue || !queue.songs.length) {
      return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });
    }

    const song = queue.songs[0];
    const embed = new EmbedBuilder()
      .setTitle('🎶 Now Playing')
      .setDescription(`[${song.name}](${song.url})`)
      .addFields(
        { name: '👤 Requested by', value: `${song.user}`, inline: true },
        { name: '⏱️ Duration', value: song.formattedDuration || 'N/A', inline: true },
        { name: '🔁 Loop Mode', value: getLoopMode(queue.repeatMode), inline: true }
      )
      .setThumbnail(song.thumbnail || null)
      .setColor('Random');

    return interaction.reply({ embeds: [embed] });
  }
};

function getLoopMode(mode) {
  switch (mode) {
    case 0: return 'Off';
    case 1: return 'This Song';
    case 2: return 'Queue';
    default: return 'Unknown';
  }
}
