// src/utils/prefixConfig.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../database/prefixes.json');

function loadPrefixes() {
  try {
    if (!fs.existsSync(filePath)) return new Map();
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    return new Map(Object.entries(json));
  } catch (e) {
    console.error('Failed to load prefixes:', e);
    return new Map();
  }
}

function savePrefixes(map) {
  try {
    const obj = Object.fromEntries(map);
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save prefixes:', e);
  }
}

module.exports = {
  loadPrefixes,
  savePrefixes
};
