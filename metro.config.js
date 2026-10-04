const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for @noble/hashes subpath imports
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle @noble/hashes subpath imports for compatibility
  if (moduleName.startsWith('@noble/hashes/')) {
    // For newer versions of @noble/hashes, we need to resolve the actual file
    // This is a compatibility fix for packages that still use old import patterns
    try {
      const resolvedPath = require.resolve(moduleName);
      return {
        type: 'sourceFile',
        filePath: resolvedPath,
      };
    } catch (e) {
      // Fallback to default resolution
      return context.resolveRequest(context, moduleName, platform);
    }
  }
  // Use default resolution for other modules
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
