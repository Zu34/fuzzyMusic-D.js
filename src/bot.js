
// src/bot.js

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const ffmpegPath = require('ffmpeg-static');
const mongoose = require('mongoose');

// Validate environment variables
const { DISCORD_TOKEN, MONGO_URI } = process.env;
if (!DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN not found in .env');
  process.exit(1);
}
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}



// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Configure DisTube
const distube = new DisTube(client, {
  emitNewSongOnly: true,
  ffmpeg: ffmpegPath,
  plugins: [
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

// Attach to client
client.distube = distube;
client.commands = new Collection();
client.queues = new Map();
client.repeatMap = new Map();
client.configs = new Map();
client.prefix = '!';
client.currentTracks = new Map();

/**
 * Recursively load all command files from a directory
 */
function loadCommands(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      loadCommands(fullPath);
    } else if (file.name.endsWith('.js')) {
      const command = require(fullPath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: /${command.data.name}`);
      } else {
        console.warn(`⚠️ Skipped ${fullPath} — missing "data" or "execute"`);
      }
    }
  }
}

/**
 * Recursively load events from a directory and bind them to a given emitter (e.g., client or distube)
 */
function loadEvents(dir, emitter) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      loadEvents(filePath, emitter);
    } else if (file.name.endsWith('.js')) {
      const event = require(filePath);
      if (!event || !event.name || !event.execute) {
        console.warn(`⚠️ Invalid event file: ${filePath}`);
        continue;
      }

      if (event.once) {
        emitter.once(event.name, (...args) => event.execute(...args, client));
      } else {
        emitter.on(event.name, (...args) => event.execute(...args, client));
      }

      console.log(`🎧 Bound event: ${event.name} (${emitter === client ? 'client' : 'distube'})`);
    }
  }
}

// Load all commands
loadCommands(path.join(__dirname, 'commands'));

// Load all events
loadEvents(path.join(__dirname, 'events/client'), client);
loadEvents(path.join(__dirname, 'events/distube'), distube);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🟢 Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);});

// Login to Discord
client.login(DISCORD_TOKEN);
