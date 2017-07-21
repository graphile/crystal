// @flow

// This script detects if you're running on Node v8 or above; if so it runs the
// code directly, otherwise it falls back to the babel-compiled version

if (process.versions.node.match(/^([89]|[1-9][0-9]+)\./)) {
  // Modern node
  module.exports = require("./node8plus");
} else {
  // Older node
  module.exports = require("./node7minus");
}
