const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setdj')
    .setDescription('Sets or clears the DJ role')
    .addStringOption(option =>
      option.setName('role')
        .setDescription('Role name or "none" to clear')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ You must be an administrator to use this command.', ephemeral: true });
    }

    const roleInput = interaction.options.getString('role');
    const guildId = interaction.guildId;

    if (!client.djRoles) client.djRoles = new Map();

    if (roleInput.toLowerCase() === 'none') {
      client.djRoles.delete(guildId);
      return interaction.reply('✅ DJ role cleared.');
    }

    const role = interaction.guild.roles.cache.find(r => r.name === roleInput);
    if (!role) return interaction.reply('❌ Role not found.');

    client.djRoles.set(guildId, role.id);
    return interaction.reply(`✅ DJ role set to **${role.name}**`);
  }
};
