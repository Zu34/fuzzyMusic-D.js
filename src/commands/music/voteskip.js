const { SlashCommandBuilder } = require('discord.js');
const { voteSkips } = require('../../utils/voteState');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voteskip')
    .setDescription('Vote to skip the current song.'),

  async execute(interaction, client) {
    const guildId = interaction.guildId;
    const voiceChannel = interaction.member.voice.channel;
    const queue = client.distube.getQueue(guildId);

    if (!voiceChannel || !queue) {
      return interaction.reply({ content: '❌ Nothing is playing to vote skip.', ephemeral: true });
    }

    const members = voiceChannel.members.filter(m => !m.user.bot);
    const totalUsers = members.size;

    if (totalUsers <= 1) {
      voteSkips.delete(guildId);
      await client.distube.skip(guildId);
      return interaction.reply('⏭️ Skipped (you were the only one in the channel).');
    }

    if (!voteSkips.has(guildId)) voteSkips.set(guildId, new Set());
    const voters = voteSkips.get(guildId);

    if (voters.has(interaction.user.id)) {
      return interaction.reply({ content: '❌ You already voted to skip.', ephemeral: true });
    }

    voters.add(interaction.user.id);

    const required = Math.ceil(totalUsers / 2);
    if (voters.size >= required) {
      voteSkips.delete(guildId);
      await client.distube.skip(guildId);
      return interaction.reply(`⏭️ Vote passed! Skipping track.`);
    } else {
      return interaction.reply(`✅ You voted to skip. ${voters.size}/${required} votes.`);
    }
  },
};
