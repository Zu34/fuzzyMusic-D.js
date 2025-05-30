const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins your voice channel without playing music.'),

  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ You need to be in a voice channel first!', ephemeral: true });
    }

    try {
      // Play a short silent audio track that finishes instantly
      // YouTube has many short "silent" videos — use one here
      const silentTrack = 'https://www.youtube.com/watch?v=2Vv-BfVoq4g'; // Placeholder

      await client.distube.play(voiceChannel, silentTrack, {
        textChannel: interaction.channel,
        member: interaction.member,
        metadata: { joinOnly: true }
      });

      await interaction.reply(`✅ Joined **${voiceChannel.name}**!`);
    } catch (err) {
      console.error('❌ Error joining voice channel:', err);
      await interaction.reply({ content: '❌ Failed to join voice channel.', ephemeral: true });
    }
  },
};
