
// src/models/QueueHistory.js
const mongoose = require('mongoose');

const queueHistorySchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  songs: [
    {
      title: String,
      url: String,
      thumbnail: String,
      duration: String,
      addedBy: String,
      addedAt: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('QueueHistory', queueHistorySchema);
