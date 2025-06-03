// src/events/distube/playSong.js
const { EmbedBuilder } = require('discord.js');
const QueueHistory = require('../../models/QueueHistory');


module.exports = {
  name: 'playSong',
  once: false,
  async execute(queue, song) {
    // Send now playing message
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Blurple')
          .setTitle('Now Playing 🎵')
          .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
          .setFooter({ text: `Requested by ${song.user?.tag || 'Unknown'}` }),
      ],
    });

    // Save to MongoDB queue history
    try {
      await QueueHistory.findOneAndUpdate(
        { guildId: queue.id },
        {
          $push: {
            songs: {
              title: song.name,
              url: song.url,
              requestedBy: song.user?.id || 'Unknown',
              playedAt: new Date(),
            },
          },
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('MongoDB QueueHistory error:', error);
    }
  },
};
