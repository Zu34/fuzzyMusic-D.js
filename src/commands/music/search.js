const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const playdl = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches YouTube and lets you pick a song.')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Search term')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const query = interaction.options.getString('query');
    await interaction.deferReply();

    const results = await playdl.search(query, { limit: 5 });
    if (!results.length) {
      return interaction.followUp('❌ No results found.');
    }

    const options = results.map((video, index) => ({
      label: `${index + 1}. ${video.title.substring(0, 80)}`,
      description: video.channel.name,
      value: video.url,
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ytsearch_select')
        .setPlaceholder('Choose a song to play')
        .addOptions(options)
    );

    const reply = await interaction.followUp({ content: '🎵 Select a song:', components: [row], ephemeral: true });

    const collector = reply.createMessageComponentCollector({
      time: 15_000,
      max: 1,
    });

    collector.on('collect', async (selectInteraction) => {
      const url = selectInteraction.values[0];

      if (!client.queues) client.queues = new Map();
      const queue = client.queues.get(interaction.guildId) || [];
      queue.push(url);
      client.queues.set(interaction.guildId, queue);

      await selectInteraction.update({ content: `✅ Added to queue: ${url}`, components: [] });

      if (queue.length === 1) {
        const playCommand = require('./play'); // make sure play is modular
        playCommand.execute(interaction, client, url);
      }
    });

    collector.on('end', collected => {
      if (!collected.size) {
        reply.edit({ content: '⏱️ Search timed out.', components: [] });
      }
    });
  },
};
