if (process.env.GRAPHILE_TURBO === '1') {
  const major = parseInt(process.version.replace(/\..*$/, ''), 10);
  if (major < 14) {
    throw new Error(
      'Turbo mode currently requires Node v14 or higher, please upgrade Node.js or remove the GRAPHILE_TURBO environmental variable.',
    );
  }
  module.exports = true;
} else {
  module.exports = false;
}
