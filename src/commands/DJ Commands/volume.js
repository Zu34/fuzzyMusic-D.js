const { SlashCommandBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Sets or shows the volume')
    .addIntegerOption(opt =>
      opt.setName('value')
        .setDescription('Volume (0-150)')
        .setMinValue(0)
        .setMaxValue(150)),

  async execute(interaction, client) {
    const value = interaction.options.getInteger('value');
    const member = interaction.member;
    if (!isDJ(member)) {
                return interaction.reply({
                  content: '❌ You need the DJ role or Admin permissions to use this command.',
                  ephemeral: true,
                });
              }


    if (value !== null) {
      client.volumeMap = client.volumeMap || new Map();
      client.volumeMap.set(interaction.guildId, value);
      await interaction.reply(`🔊 Volume set to ${value}.`);
    } else {
      const current = client.volumeMap?.get(interaction.guildId) ?? 100;
      await interaction.reply(`🔊 Current volume is ${current}.`);
    }
  }
};
