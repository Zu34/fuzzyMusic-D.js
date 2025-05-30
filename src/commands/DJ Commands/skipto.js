const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('Skips to a specific track in the queue')
    .addIntegerOption(opt =>
      opt.setName('position')
        .setDescription('Track number in queue')
        .setRequired(true)),

     async execute(interaction, client) {
    const pos = interaction.options.getInteger('position') - 1;
    const queue = client.queues.get(interaction.guildId);

    if (!queue || pos < 0 || pos >= queue.length) {
      return interaction.reply({ content: '❌ Invalid track position.', ephemeral: true });
    }

    queue.splice(0, pos);
    const connection = getVoiceConnection(interaction.guildId);
    if (connection?.state.subscription?.player) {
      connection.state.subscription.player.stop();
    }

    await interaction.reply(`⏭️ Skipped to track ${pos + 1}.`);
  }
};
