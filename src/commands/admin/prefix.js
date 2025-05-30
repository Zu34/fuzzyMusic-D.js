const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('Set or clear the custom prefix for this server')
    .addStringOption(option =>
      option.setName('value')
        .setDescription('Prefix value or "none" to clear')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ You must be an administrator to use this command.', ephemeral: true });
    }

    const input = interaction.options.getString('value');
    const guildId = interaction.guildId;

    if (!client.prefixes) client.prefixes = new Map();

    if (input.toLowerCase() === 'none') {
      client.prefixes.delete(guildId);
      return interaction.reply('✅ Prefix cleared.');
    }

    client.prefixes.set(guildId, input);
    return interaction.reply(`✅ Prefix set to \`${input}\``);
  },
};
