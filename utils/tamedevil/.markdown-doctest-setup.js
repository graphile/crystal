const mod = require(".");
class Source {}
module.exports = {
  require: {
    "devil-you-know": mod,
  },
  globals: {
    dyk: mod.dyk,
    Source,
  },
};
