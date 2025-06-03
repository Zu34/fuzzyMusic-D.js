// src/commands/music/stop.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');
const QueueHistory = require('../../models/queuehistory');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the music and clears the queue (DJ only).'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({ content: '❌ No music is playing!', ephemeral: true });
    }

    if (!isDJ(interaction.member)) {
      return interaction.reply({
        content: '❌ You must be a DJ or have Administrator permissions to use this command.',
        ephemeral: true,
      });
    }

    const currentSong = queue.songs[0];

    // Save to DB before stopping
    try {
      await QueueHistory.create({
        guildId: interaction.guildId,
        userId: interaction.user.id,
        track: {
          name: currentSong.name,
          url: currentSong.url,
          thumbnail: currentSong.thumbnail,
          duration: currentSong.formattedDuration,
        },
      });
    } catch (error) {
      console.error('🛑 Failed to log track to DB:', error);
    }

    // Stop and reply with embed
    await client.distube.stop(interaction.guildId);

    const embed = new EmbedBuilder()
      .setTitle('⏹️ Music Stopped')
      .setDescription(`[${currentSong.name}](${currentSong.url})\nDuration: \`${currentSong.formattedDuration}\``)
      .setThumbnail(currentSong.thumbnail)
      .setColor('Red')
      .setFooter({ text: `Stopped by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    return interaction.reply({ embeds: [embed] });
  },
};
