
const { loadAllowedVoiceChannels } = require('../../utils/voiceChannelConfig');
const { loadPrefixes } = require('../../utils/prefixConfig');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      console.log(`✅ Logged in as ${client.user.tag}`);
      client.allowedVoiceChannels = loadAllowedVoiceChannels();
     client.prefixes = loadPrefixes();
    }
  };
  