const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeall')
    .setDescription('Removes all songs in the queue (except the current one).'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue || queue.songs.length <= 1) {
      return interaction.reply({ content: '❌ No songs to remove from the queue.', ephemeral: true });
    }

    // DJ check
    if (!isDJ(interaction.member)) {
      return interaction.reply({
        content: '❌ You must be a DJ or have Administrator permissions to use this command.',
        ephemeral: true
      });
    }

    // Confirmation buttons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirm_removeall')
        .setLabel('✅ Yes, clear the queue')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('cancel_removeall')
        .setLabel('❌ Cancel')
        .setStyle(ButtonStyle.Secondary)
    );

    const reply = await interaction.reply({
      content: '⚠️ Are you sure you want to remove all songs from the queue (except the current one)?',
      components: [row],
      ephemeral: true
    });

    // Await user response
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    collector.on('collect', async (btnInteraction) => {
      if (btnInteraction.user.id !== interaction.user.id) {
        return btnInteraction.reply({ content: "❌ You can't respond to this interaction.", ephemeral: true });
      }

      if (btnInteraction.customId === 'confirm_removeall') {
        queue.songs = [queue.songs[0]];
        await btnInteraction.update({
          content: '🧹 Queue cleared (except the current track).',
          components: []
        });
      } else if (btnInteraction.customId === 'cancel_removeall') {
        await btnInteraction.update({
          content: '❎ Cancelled clearing the queue.',
          components: []
        });
      }

      collector.stop();
    });

    collector.on('end', async (_, reason) => {
      if (reason === 'time') {
        await interaction.editReply({
          content: '⌛ Confirmation timed out.',
          components: []
        });
      }
    });
  },
};
