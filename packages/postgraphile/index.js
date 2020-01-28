if (require('./isTurbo')) {
  module.exports = require('./build-turbo/index.js');
} else {
  module.exports = require('./build/index.js');
}
