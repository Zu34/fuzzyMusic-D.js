const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the currently playing track.'),

  async execute(interaction) {
    const currentTracks = interaction.client.currentTracks;
    const track = currentTracks.get(interaction.guildId);

    if (!track) {
      return interaction.reply({ content: '❌ Nothing is playing right now.', ephemeral: true });
    }

    return interaction.reply(
      `🎶 Now playing: **${track.name}** by ${track.author}\n` +
      `Duration: \`${track.duration}\`\n` +
      `${track.url}`
    );
  }
};
