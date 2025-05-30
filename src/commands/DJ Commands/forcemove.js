const { SlashCommandBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forceremove')
    .setDescription('Removes all songs added by a specific user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to remove tracks from')
        .setRequired(true)),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const queue = client.queues.get(interaction.guildId);
    const member = interaction.member;
    
    if (!queue) return interaction.reply({ content: '❌ Nothing is playing!', ephemeral: true });
  if (!isDJ(member)) {
        return interaction.reply({
          content: '❌ You need the DJ role or Admin permissions to use this command.',
          ephemeral: true,
        });
      }
    const before = queue.length;
    const newQueue = queue.filter(track => track.requestedBy?.id !== user.id);
    client.queues.set(interaction.guildId, newQueue);

    const removed = before - newQueue.length;
    await interaction.reply(`🗑️ Removed ${removed} track(s) added by ${user.username}.`);
  }
}