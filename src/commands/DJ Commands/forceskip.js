const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forceskip')
    .setDescription('Force skips the current song'),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guildId);
    const member = interaction.member;
    
    if (!queue || queue.length === 0) {
      return interaction.reply({ content: '❌ No song is currently playing.', ephemeral: true });
    }

    if (!isDJ(member)) {
        return interaction.reply({
          content: '❌ You need the DJ role or Admin permissions to use this command.',
          ephemeral: true,
        });
      }

    const connection = getVoiceConnection(interaction.guildId);
    if (connection?.state.subscription?.player) {
      connection.state.subscription.player.stop();
      await interaction.reply('⏭️ Force skipped the current song.');
    } else {
      await interaction.reply({ content: '❌ Player is not active.', ephemeral: true });
    }
  }
};