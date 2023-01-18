const mod = require(".");
class Source {}
module.exports = {
  require: {
    tamedevil: mod,
  },
  globals: {
    te: mod.te,
    Source,
  },
};
