// src/events/distube/addSong.js
const { Events } = require("distube");
const { EmbedBuilder } = require("discord.js");

/**
 * @param {import("distube").Queue} queue 
 * @param {import("distube").Song} song 
 */
module.exports = {
  name: Events.ADD_SONG,
  
  async execute(queue, song) {
    const interaction = song.metadata?.interaction;
    if (!interaction) return;

    try {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("🎶 Added to Queue")
            .setDescription(`**[${song.name}](${song.url})** has been added to the queue.`)
            .setFooter({ text: `Requested by ${song.user?.username || "Unknown"}` }),
        ],
      });

      // Optional: MongoDB history logging
      if (queue.client?.db?.History) {
        await queue.client.db.History.create({
          guildId: queue.id,
          song: {
            title: song.name,
            url: song.url,
            duration: song.formattedDuration,
            requestedBy: song.user?.id,
          },
          addedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Failed to handle addSong event:", error);
    }
  }
};
