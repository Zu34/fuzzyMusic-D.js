const { SlashCommandBuilder } = require('discord.js');
const playdl = require('play-dl');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playnext')
    .setDescription('Play a song next in the queue')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song name or URL')
        .setRequired(true)),

  async execute(interaction, client) {
    // ✅ DJ check
    if (!isDJ(interaction.member, client)) {
      return interaction.reply({
        content: '❌ You need the DJ role or be an admin to use this command.',
        ephemeral: true,
      });
    }

    const query = interaction.options.getString('query');
    let url;

    const validation = playdl.yt_validate(query);
    if (validation === 'video') {
      url = query;
    } else {
      const result = await playdl.search(query, { limit: 1 });
      if (!result.length) return interaction.reply('❌ No results found.');
      url = result[0].url;
    }

    if (!client.queues.has(interaction.guildId)) {
      client.queues.set(interaction.guildId, []);
    }

    const queue = client.queues.get(interaction.guildId);
    queue.splice(1, 0, { url, requestedBy: interaction.user });

    await interaction.reply(`⏭️ Queued next: ${url}`);
  }
};
