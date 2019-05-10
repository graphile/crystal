#!/usr/bin/env node
if (process.env.GRAPHILE_TURBO === '1') {
  const major = parseInt(process.version.replace(/\..*$/, ''), 10);
  if (major < 12) {
    throw new Error('Turbo mode requires Node v12 or higher');
  }
  module.exports = require('./build-turbo/postgraphile/cli.js');
} else {
  module.exports = require('./build/postgraphile/cli.js');
}
