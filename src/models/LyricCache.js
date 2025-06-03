const mongoose = require('mongoose');

const lyricCacheSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // store normalized title
  artist: String,
  lyrics: String,
  albumArt: String,
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LyricCache', lyricCacheSchema);
