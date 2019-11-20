#!/usr/bin/env node
if (require('./isTurbo')) {
  module.exports = require('./build-turbo/postgraphile/cli.js');
} else {
  module.exports = require('./build/postgraphile/cli.js');
}
