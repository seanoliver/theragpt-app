const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure we're only building for mobile platforms
config.resolver.platforms = ['ios', 'android'];

module.exports = config;