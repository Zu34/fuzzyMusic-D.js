// src/models/QueueHistory.js
const { Schema, model } = require('mongoose');

const songSchema = new Schema({
  title: String,
  url: String,
  requestedBy: String,
  playedAt: { type: Date, default: Date.now },
});

const queueHistorySchema = new Schema({
  guildId: String,
  songs: [songSchema],
});

module.exports = model('QueueHistory', queueHistorySchema);
