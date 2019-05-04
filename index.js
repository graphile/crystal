if (process.env.GRAPHILE_TURBO === '1') {
  const major = parseInt(process.version.replace(/\..*$/, ''), 10);
  if (major < 12) {
    throw new Error('Turbo mode requires Node v12 or higher');
  }
  require('./build-turbo/index.js');
} else {
  require('./build/index.js');
}
