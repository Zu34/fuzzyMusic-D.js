const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  prefix: {
    type: String,
    default: '!'
  },
  djRoleId: {
    type: String,
    default: null
  },
  textChannelId: {
    type: String,
    default: null
  },
  voiceChannelId: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
