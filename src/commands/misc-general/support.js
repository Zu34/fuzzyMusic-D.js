const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get a link to the support server or documentation.'),

  async execute(interaction) {
    return interaction.reply({
      content: '🆘 Need help? Join our support server: [Support Server](https://discord.gg/your-invite)',
      ephemeral: true
    });
  }
};
