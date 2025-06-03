const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the currently paused music.'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue || !queue.paused) {
      return interaction.reply({
        content: '❌ There is no paused music to resume.',
        ephemeral: true,
      });
    }

    try {
      queue.resume();
      return interaction.reply('▶️ Music resumed.');
    } catch (err) {
      console.error('Resume error:', err);
      return interaction.reply({
        content: '❌ Failed to resume the music.',
        ephemeral: true,
      });
    }
  },
};
