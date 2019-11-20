if (require('./isTurbo')) {
  module.exports = require('./build-turbo/plugins.js');
} else {
  module.exports = require('./build/plugins.js');
}
