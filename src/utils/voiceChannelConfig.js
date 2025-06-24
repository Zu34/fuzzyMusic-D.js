// src/utils/voiceChannelConfig.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../../database/allowedVoiceChannels.json');

// Load or initialize
function loadAllowedVoiceChannels() {
  try {
    if (!fs.existsSync(filePath)) return new Map();
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    return new Map(Object.entries(json));
  } catch (e) {
    console.error('Failed to load allowedVoiceChannels:', e);
    return new Map();
  }
}

// Save to disk
function saveAllowedVoiceChannels(map) {
  try {
    const obj = Object.fromEntries(map);
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save allowedVoiceChannels:', e);
  }
}

module.exports = {
  loadAllowedVoiceChannels,
  saveAllowedVoiceChannels,
};
