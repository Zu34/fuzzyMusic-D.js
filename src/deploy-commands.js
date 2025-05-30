// require('dotenv').config();
// const { REST, Routes } = require('discord.js');
// const fs = require('fs');
// const path = require('path');

// const CLIENT_ID = process.env.CLIENT_ID;
// const GUILD_ID = process.env.GUILD_ID;
// const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// function getCommandFiles(dir) {
//   const entries = fs.readdirSync(dir, { withFileTypes: true });

//   return entries.flatMap(entry => {
//     const fullPath = path.join(dir, entry.name);
//     if (entry.isDirectory()) {
//       return getCommandFiles(fullPath);
//     } else if (entry.isFile() && entry.name.endsWith('.js')) {
//       // skip utility files if needed, e.g., 'factUtils.js'
//       if (entry.name.endsWith('Utils.js')) return [];
//       return [fullPath];
//     }
//     return [];
//   });
// }

// async function main() {
//   const commandsDir = path.join(__dirname, 'commands'); // adjust if needed
//   const commandFiles = getCommandFiles(commandsDir);

//   const commands = [];

//   for (const file of commandFiles) {
//     const command = require(file);
//     if (!command.data) {
//       console.warn(`❌ Command at ${file} is missing .data export, skipping.`);
//       continue;
//     }
//     commands.push(command.data.toJSON());
//   }

//   const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

//   try {
//     console.log('Started refreshing application (/) commands.');

//     await rest.put(
//       Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
//       { body: commands }
//     );

//     console.log('✅ Successfully reloaded guild commands.');
//   } catch (error) {
//     console.error('❌ Error reloading commands:', error);
//   }
// }

// main();

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN) {
  console.error('❌ CLIENT_ID, GUILD_ID, or DISCORD_TOKEN is missing from .env');
  process.exit(1);
}

function getCommandFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return getCommandFiles(fullPath);
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.js') &&
      !entry.name.toLowerCase().includes('util')
    ) {
      return [fullPath];
    }
    return [];
  });
}

async function main() {
  const commandsDir = path.join(__dirname, 'commands');
  const commandFiles = getCommandFiles(commandsDir);

  const commands = [];

  console.log(`🔍 Found ${commandFiles.length} command files.`);

  for (const file of commandFiles) {
    try {
      const command = require(file);
      if (!command.data || typeof command.data.toJSON !== 'function') {
        console.warn(`⚠️  Skipping invalid command at ${file}`);
        continue;
      }
      commands.push(command.data.toJSON());
      console.log(`✅ Loaded command: /${command.data.name}`);
    } catch (err) {
      console.error(`❌ Failed to load command at ${file}:`, err);
    }
  }

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  try {
    console.log('🌐 Deploying slash commands to Discord...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Successfully reloaded guild commands.');
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
    if (error.rawError?.errors) {
      console.error(JSON.stringify(error.rawError.errors, null, 2));
    }
  }
}

main();
