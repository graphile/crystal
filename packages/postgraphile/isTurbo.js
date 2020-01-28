if (process.env.GRAPHILE_TURBO === '1') {
  const major = parseInt(process.version.replace(/\..*$/, ''), 10);
  if (major < 12) {
    throw new Error('Turbo mode requires Node v12 or higher');
  }
  module.exports = true;
} else {
  module.exports = false;
}
