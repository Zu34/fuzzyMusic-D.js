const { SlashCommandBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Turn repeat mode on or off')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('Repeat mode')
        .setRequired(true)
        .addChoices(
          { name: 'on', value: 'on' },
          { name: 'off', value: 'off' },
        )
    ),

  async execute(interaction, client) {
    const member = interaction.member;
    const guildId = interaction.guildId;

    // Standard DJ permission check
    const hasPermission = await isDJ(member);
    if (!hasPermission) {
      return interaction.reply({
        content: '❌ You need the DJ role or be an admin to use this command.',
        ephemeral: true,
      });
    }

    const mode = interaction.options.getString('mode');
    const enableRepeat = mode === 'on';

    if (!client.repeatMap) client.repeatMap = new Map();
    client.repeatMap.set(guildId, enableRepeat);

    return interaction.reply(`🔁 Repeat has been ${enableRepeat ? 'enabled' : 'disabled'}.`);
  },
};
