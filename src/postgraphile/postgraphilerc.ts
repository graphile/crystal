// tslint:disable no-console
let postgraphileRCFile: string | null = null;
try {
  postgraphileRCFile = require.resolve(process.cwd() + '/.postgraphilerc');
} catch (e) {
  // No postgraphileRC; carry on
}

const config = postgraphileRCFile ? require(postgraphileRCFile) : {}; // tslint:disable-line no-var-requires
if (postgraphileRCFile && !config.hasOwnProperty('options')) {
  console.warn('WARNING: Your configuration file does not export any options');
}

export default config;
