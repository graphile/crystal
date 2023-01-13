const mod = require(".");
module.exports = {
  require: {
    "devil-you-know": mod,
  },
  globals: {
    dyk: mod.dyk,
  },
};
