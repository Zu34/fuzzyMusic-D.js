const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue || !queue.songs || queue.songs.length === 0) {
      return interaction.reply('📭 The queue is empty.');
    }

    const tracks = queue.songs
      .map((song, index) => {
        const prefix = index === 0 ? '▶️ Now playing' : `${index}.`;
        return `${prefix} **${song.name}** - \`${song.formattedDuration}\``;
      })
      .slice(0, 10);

    const additional = queue.songs.length > 10
      ? `\n...and ${queue.songs.length - 10} more song(s)`
      : '';

    // Total duration in seconds
    const totalSeconds = queue.songs.reduce((acc, song) => acc + song.duration, 0);

    // Format duration helper
    function formatDuration(seconds) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return [
        hrs > 0 ? hrs : null,
        mins < 10 && hrs > 0 ? '0' + mins : mins,
        secs < 10 ? '0' + secs : secs,
      ].filter(Boolean).join(':');
    }

    // Estimated wait time is total queue duration minus elapsed on current song
    const waitSeconds = totalSeconds - queue.currentTime;
    const waitTimeFormatted = waitSeconds > 0 ? formatDuration(waitSeconds) : '0:00';

    return interaction.reply(
      `🎶 **Music Queue:**\n${tracks.join('\n')}${additional}\n\n` +
      `⏳ **Total queue duration:** \`${formatDuration(totalSeconds)}\`\n` +
      `⌛ **Estimated wait time:** \`${waitTimeFormatted}\``
    );
  }
};
