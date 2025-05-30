// const { SlashCommandBuilder } = require('discord.js');
// const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
// const ytdl = require('ytdl-core');

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('play')
//     .setDescription('Play a YouTube video in your voice channel')
//     .addStringOption(option =>
//       option.setName('query')
//         .setDescription('YouTube URL')
//         .setRequired(true)
//     ),

//   async execute(interaction, client) {
//     const url = interaction.options.getString('query');
//     const voiceChannel = interaction.member.voice.channel;

//     if (!voiceChannel) {
//       return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });
//     }

//     if (!ytdl.validateURL(url)) {
//       return interaction.reply({ content: '❌ Please provide a valid YouTube URL.', ephemeral: true });
//     }

//     await interaction.deferReply();

//     // Get or create queue for this guild
//     const guildId = interaction.guild.id;
//     if (!client.queues.has(guildId)) {
//       client.queues.set(guildId, []);
//     }

//     const queue = client.queues.get(guildId);
//     queue.push(url);

//     // If something is already playing, just queue
//     if (queue.length > 1) {
//       return interaction.followUp(`✅ Added to queue: ${url}`);
//     }

//     try {
//       const connection = joinVoiceChannel({
//         channelId: voiceChannel.id,
//         guildId: voiceChannel.guild.id,
//         adapterCreator: voiceChannel.guild.voiceAdapterCreator
//       });

//       const player = createAudioPlayer();

//       const play = (link) => {
//         const stream = ytdl(link, { filter: 'audioonly', highWaterMark: 1 << 25 });
//         const resource = createAudioResource(stream);
//         player.play(resource);
//         connection.subscribe(player);
//       };

//       play(url);

//       player.on(AudioPlayerStatus.Idle, () => {
//         queue.shift(); // remove current
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           connection.destroy();
//           client.queues.delete(guildId);
//         }
//       });

//       player.on('error', error => {
//         console.error('Player error:', error);
//         queue.shift();
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           connection.destroy();
//           client.queues.delete(guildId);
//         }
//       });

//       interaction.followUp(`🎶 Now playing: ${url}`);

//     } catch (err) {
//       console.error(err);
//       interaction.followUp({ content: '❌ Failed to play the track.', ephemeral: true });
//     }
//   }
// };



// const { SlashCommandBuilder } = require('discord.js');
// const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
// const ytdl = require('ytdl-core');

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('play')
//     .setDescription('Play a YouTube video in your voice channel')
//     .addStringOption(option =>
//       option.setName('query')
//         .setDescription('YouTube URL')
//         .setRequired(true)
//     ),

//   async execute(interaction) {
//     const url = interaction.options.getString('query');
//     const voiceChannel = interaction.member.voice.channel;

//     if (!voiceChannel) {
//       return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });
//     }

//     if (!ytdl.validateURL(url)) {
//       return interaction.reply({ content: '❌ Please provide a valid YouTube URL.', ephemeral: true });
//     }

//     await interaction.deferReply();

//     const guildId = interaction.guild.id;
//     const client = interaction.client;

//     if (!client.queues) {
//       client.queues = new Map();
//     }

//     if (!client.queues.has(guildId)) {
//       client.queues.set(guildId, []);
//     }

//     const queue = client.queues.get(guildId);
//     queue.push(url);

//     // If already playing, just queue the song
//     if (queue.length > 1) {
//       return interaction.followUp(`✅ Added to queue: ${url}`);
//     }

//     try {
//       const connection = joinVoiceChannel({
//         channelId: voiceChannel.id,
//         guildId: voiceChannel.guild.id,
//         adapterCreator: voiceChannel.guild.voiceAdapterCreator
//       });

//       const player = createAudioPlayer();

//       const play = (link) => {
//         const stream = ytdl(link, {
//           filter: 'audioonly',
//           highWaterMark: 1 << 25,
//           requestOptions: {
//             headers: {
//               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
//             }
//           }
//         });

//         const resource = createAudioResource(stream);
//         player.play(resource);
//         connection.subscribe(player);
//       };

//       play(url);

//       player.on(AudioPlayerStatus.Idle, () => {
//         queue.shift(); // remove finished song
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           connection.destroy();
//           client.queues.delete(guildId);
//         }
//       });

//       player.on('error', error => {
//         console.error('Player error:', error);
//         queue.shift();
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           connection.destroy();
//           client.queues.delete(guildId);
//         }
//       });

//       await interaction.followUp(`🎶 Now playing: ${url}`);

//     } catch (err) {
//       console.error(err);
//       await interaction.followUp({ content: '❌ Failed to play the track.', ephemeral: true });
//     }
//   }
// };


// const { SlashCommandBuilder } = require('discord.js');
// const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
// const playdl = require('play-dl');

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('play')
//     .setDescription('Play a YouTube video in your voice channel')
//     .addStringOption(option =>
//       option.setName('query')
//         .setDescription('YouTube URL or search query')
//         .setRequired(true)
//     ),

//   async execute(interaction) {
//     const query = interaction.options.getString('query');
//     const voiceChannel = interaction.member.voice.channel;
//     const client = interaction.client;

//     if (!voiceChannel) {
//       return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });
//     }

//     await interaction.deferReply();

//     // Validate or search for URL
//     let url;
//     try {
//       if (playdl.yt_validate(query) === 'video') {
//         url = query;
//       } else {
//         // Search and get first video URL if query is not a direct link
//         const searchResults = await playdl.search(query, { limit: 1 });
//         if (!searchResults.length) {
//           return interaction.followUp({ content: '❌ No results found for your query.', ephemeral: true });
//         }
//         url = searchResults[0].url;
//       }
//     } catch (error) {
//       console.error('Error validating/searching YouTube:', error);
//       return interaction.followUp({ content: '❌ Failed to search or validate the query.', ephemeral: true });
//     }

//     const guildId = interaction.guild.id;

//     if (!client.queues) client.queues = new Map();
//     if (!client.queues.has(guildId)) {
//       client.queues.set(guildId, []);
//     }

//     const queue = client.queues.get(guildId);
//     queue.push(url);

//     // If already playing, just queue the song
//     if (queue.length > 1) {
//       return interaction.followUp(`✅ Added to queue: ${url}`);
//     }

//     try {
//       const connection = joinVoiceChannel({
//         channelId: voiceChannel.id,
//         guildId: voiceChannel.guild.id,
//         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
//       });

//       const player = createAudioPlayer();

//       const play = async (link) => {
//         try {
//           const stream = await playdl.stream(link, { quality: 2 });
//           const resource = createAudioResource(stream.stream, { inputType: stream.type });
//           player.play(resource);
//           connection.subscribe(player);
//         } catch (err) {
//           console.error('Error streaming track:', err);
//           queue.shift(); // remove bad link
//           if (queue.length > 0) {
//             play(queue[0]);
//           } else {
//             if (connection.state.status !== 'destroyed') {
//               connection.destroy();
//             }
//             client.queues.delete(guildId);
//           }
//         }
//       };

//       await play(url);

//       player.on(AudioPlayerStatus.Idle, () => {
//         queue.shift(); // remove finished song
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           if (connection.state.status !== 'destroyed') {
//             connection.destroy();
//           }
//           client.queues.delete(guildId);
//         }
//       });

//       player.on('error', error => {
//         console.error('Player error:', error);
//         queue.shift();
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           if (connection.state.status !== 'destroyed') {
//             connection.destroy();
//           }
//           client.queues.delete(guildId);
//         }
//       });

//       await interaction.followUp(`🎶 Now playing: ${url}`);

//     } catch (err) {
//       console.error(err);
//       await interaction.followUp({ content: '❌ Failed to play the track.', ephemeral: true });
//     }
//   }
// };


// const { SlashCommandBuilder } = require('discord.js');
// const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
// const playdl = require('play-dl');
// playdl.setFfmpegPath('/usr/bin/ffmpeg'); // Replace if your path is different


// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('play')
//     .setDescription('Play a YouTube video in your voice channel')
//     .addStringOption(option =>
//       option.setName('query')
//         .setDescription('YouTube URL or search query')
//         .setRequired(true)
//     ),

//   async execute(interaction) {
//     const rawQuery = interaction.options.getString('query');
//     const query = rawQuery.trim();
//     const voiceChannel = interaction.member.voice.channel;
//     const client = interaction.client;

//     if (!voiceChannel) {
//       return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });
//     }

//     await interaction.deferReply();

//     let url;
//     try {
//       const validation = playdl.yt_validate(query);
//       if (validation === 'video') {
//         url = query;
//       } else if (validation === false) {
//         const searchResults = await playdl.search(query, { limit: 1 });
//         if (!searchResults.length) {
//           return interaction.followUp({ content: '❌ No results found for your query.', ephemeral: true });
//         }
//         url = searchResults[0].url;
//       } else {
//         return interaction.followUp({ content: '❌ Please provide a single video URL or search term.', ephemeral: true });
//       }

//       // Force URL parsing to catch invalid URLs early
//       try {
//         new URL(url);
//       } catch {
//         return interaction.followUp({ content: '❌ The URL you provided is invalid.', ephemeral: true });
//       }

//     } catch (error) {
//       console.error('Error validating/searching YouTube:', error);
//       return interaction.followUp({ content: '❌ Failed to search or validate the query.', ephemeral: true });
//     }

//     if (!client.queues) client.queues = new Map();
//     if (!client.queues.has(interaction.guild.id)) {
//       client.queues.set(interaction.guild.id, []);
//     }

//     const queue = client.queues.get(interaction.guild.id);
//     queue.push(url);

//     if (queue.length > 1) {
//       return interaction.followUp(`✅ Added to queue: ${url}`);
//     }

//     try {
//       const connection = joinVoiceChannel({
//         channelId: voiceChannel.id,
//         guildId: voiceChannel.guild.id,
//         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
//       });

//       const player = createAudioPlayer();

//       const play = async (link) => {
//         console.log('Streaming URL:', link);
//         try {
//           const stream = await playdl.stream(link, { quality: 2 });
//           const resource = createAudioResource(stream.stream, { inputType: stream.type });
//           player.play(resource);
//           connection.subscribe(player);
//         } catch (err) {
//           console.error('Error streaming track:', err);
//           queue.shift();
//           if (queue.length > 0) {
//             play(queue[0]);
//           } else {
//             if (connection.state.status !== 'destroyed') connection.destroy();
//             client.queues.delete(interaction.guild.id);
//           }
//         }
//       };

//       await play(url);

//       player.on(AudioPlayerStatus.Idle, () => {
//         queue.shift();
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           if (connection.state.status !== 'destroyed') connection.destroy();
//           client.queues.delete(interaction.guild.id);
//         }
//       });

//       player.on('error', error => {
//         console.error('Player error:', error);
//         queue.shift();
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           if (connection.state.status !== 'destroyed') connection.destroy();
//           client.queues.delete(interaction.guild.id);
//         }
//       });

//       await interaction.followUp(`🎶 Now playing: ${url}`);

//     } catch (err) {
//       console.error(err);
//       await interaction.followUp({ content: '❌ Failed to play the track.', ephemeral: true });
//     }
//   }
// };


// const { SlashCommandBuilder } = require('discord.js');
// const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
// const playdl = require('play-dl');

// // Set the ffmpeg path (adjust if necessary)
// // playdl.setFfmpegPath('/usr/bin/ffmpeg'); // Replace with your actual ffmpeg path if different

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('play')
//     .setDescription('Play a YouTube video in your voice channel')
//     .addStringOption(option =>
//       option.setName('query')
//         .setDescription('YouTube URL or search query')
//         .setRequired(true)
//     ),

//   async execute(interaction) {
//     const rawQuery = interaction.options.getString('query');
//     const query = rawQuery.trim();
//     const voiceChannel = interaction.member.voice.channel;
//     const client = interaction.client;

//     if (!voiceChannel) {
//       return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });
//     }

//     await interaction.deferReply();

//     let url;
//     try {
//       const validation = playdl.yt_validate(query);
//       if (validation === 'video') {
//         url = query;
//       } else if (validation === false) {
//         const searchResults = await playdl.search(query, { limit: 1 });
//         if (!searchResults.length) {
//           return interaction.followUp({ content: '❌ No results found for your query.', ephemeral: true });
//         }
//         url = searchResults[0].url;
//       } else {
//         return interaction.followUp({ content: '❌ Please provide a single video URL or search term.', ephemeral: true });
//       }

//       // Force URL parsing to catch invalid URLs early
//       try {
//         new URL(url);
//       } catch {
//         return interaction.followUp({ content: '❌ The URL you provided is invalid.', ephemeral: true });
//       }

//     } catch (error) {
//       console.error('Error validating/searching YouTube:', error);
//       return interaction.followUp({ content: '❌ Failed to search or validate the query.', ephemeral: true });
//     }

//     url = url.trim().split('&')[0]; 

//     if (!client.queues) client.queues = new Map();
//     if (!client.queues.has(interaction.guild.id)) {
//       client.queues.set(interaction.guild.id, []);
//     }

//     const queue = client.queues.get(interaction.guild.id);
//     queue.push(url);

//     if (queue.length > 1) {
//       return interaction.followUp(`✅ Added to queue: ${url}`);
//     }

//     try {
//       const connection = joinVoiceChannel({
//         channelId: voiceChannel.id,
//         guildId: voiceChannel.guild.id,
//         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
//         selfDeaf: false,  // 👈 
//         selfMute: false,  // 👈 
//       });
      

//       const player = createAudioPlayer();

//       player.on(AudioPlayerStatus.Playing, () => {
//         console.log('🎧 AudioPlayer is now playing!');
//       });

//       player.on(AudioPlayerStatus.Idle, () => {
//         console.log('⏹️ AudioPlayer is idle.');
//         queue.shift();
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           if (connection.state.status !== 'destroyed') connection.destroy();
//           client.queues.delete(interaction.guild.id);
//         }
//       });

//       player.on('error', error => {
//         console.error('Player error:', error);
//         queue.shift();
//         if (queue.length > 0) {
//           play(queue[0]);
//         } else {
//           if (connection.state.status !== 'destroyed') connection.destroy();
//           client.queues.delete(interaction.guild.id);
//         }
//       });

//       // const play = async (link) => {
//       //   console.log('▶️ Streaming URL:', link);
      
//       //   try {
//       //     const stream = await playdl.stream(link, { quality: 2 });
      
//       //     // Debug logs
//       //     console.log('▶️ Stream type:', stream.type);
//       //     console.log('▶️ stream.stream:', typeof stream.stream);
//       //     console.log('▶️ stream.url:', stream.url);
      
//       //     const resource = createAudioResource(stream.stream, {
//       //       inputType: stream.type,
//       //     });
      
//       //     player.play(resource);
//       //     connection.subscribe(player);
//       //   } catch (err) {
//       //     console.error('❌ Error streaming track:', err);
//       //     queue.shift();
//       //     if (queue.length > 0) {
//       //       play(queue[0]);
//       //     } else {
//       //       if (connection.state.status !== 'destroyed') connection.destroy();
//       //       client.queues.delete(interaction.guild.id);
//       //     }
//       //   }
//       // };

//       const play = async (link) => {
//         console.log('▶️ Streaming URL:', link);
//         try {
//           const stream = await playdl.stream(link, { quality: 2 });
      
//           // Log details for debug
//           console.log('▶️ Stream type:', stream.type);
//           console.log('▶️ stream.stream:', typeof stream.stream);
      
//           const resource = createAudioResource(stream.stream, {
//             inputType: stream.type,
//           });
      
//           player.play(resource);
//           connection.subscribe(player);
//         } catch (err) {
//           console.error('❌ Error streaming track:', err);
//           queue.shift();
//           if (queue.length > 0) {
//             play(queue[0]);
//           } else {
//             if (connection.state.status !== 'destroyed') connection.destroy();
//             client.queues.delete(interaction.guild.id);
//           }
//         }
//       };
      

//       await play(url);

//       await interaction.followUp(`🎶 Now playing: ${url}`);

//     } catch (err) {
//       console.error(err);
//       await interaction.followUp({ content: '❌ Failed to play the track.', ephemeral: true });
//     }
//   }
// };

// commands/music/play.js
// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('play')
//     .setDescription('Play a song from YouTube or other supported services')
//     .addStringOption(option => 
//       option.setName('query')
//         .setDescription('Song name or URL')
//         .setRequired(true)
//     ),

//   async execute(interaction) {
//     const query = interaction.options.getString('query').trim();
//     const voiceChannel = interaction.member.voice.channel;

//     if (!voiceChannel) {
//       return interaction.reply({ content: '❌ You need to be in a voice channel to play music.', ephemeral: true });
//     }

//     try {
//       await interaction.deferReply();
//       await interaction.client.distube.play(voiceChannel, query, {
//         member: interaction.member,
//         textChannel: interaction.channel,
//       });
//       await interaction.followUp(`🎶 Searching and playing: \`${query}\``);
//     } catch (error) {
//       console.error('Error playing track:', error);
//       await interaction.followUp({ content: `❌ Could not play that URL or query. Please check your input.`, ephemeral: true });
//     }
//   },
// };

const { SlashCommandBuilder } = require('discord.js');
const playdl = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a YouTube video or search query in your voice channel')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('YouTube URL or search term')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query').trim();
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ You need to be in a voice channel to use this command!', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      // Validate if query is a valid URL that play-dl supports
      const isValidUrl = await playdl.validate(query);
      let urlToPlay = query;

      if (!isValidUrl) {
        // Not a valid URL — search YouTube for the query
        const results = await playdl.search(query, { limit: 1 });
        if (!results.length) {
          return interaction.followUp({ content: '❌ No results found for your query.', ephemeral: true });
        }
        urlToPlay = results[0].url;
      }

      console.log('Playing URL:', urlToPlay);

      // Play with DisTube
      await interaction.client.distube.play(voiceChannel, urlToPlay, {
        member: interaction.member,
        textChannel: interaction.channel,
      });

      await interaction.followUp(`🎶 Now playing: \`${urlToPlay}\``);

    } catch (error) {
      console.error('Error playing track:', error);
      await interaction.followUp({ content: '❌ Could not play the provided URL or query.', ephemeral: true });
    }
  }
};
