
const mongoose = require('mongoose');

const queueHistorySchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  track: {
    name: String,
    url: String,
    thumbnail: String,
    duration: String,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QueueHistory', queueHistorySchema);
