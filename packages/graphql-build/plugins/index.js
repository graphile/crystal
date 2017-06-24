const fs = require("fs");

const files = fs.readdirSync(__dirname);
files.forEach(file => {
  if (file.match(/^[A-Z]/)) {
    const name = file.replace(/\.js$/, "");
    exports[name] = require(`./${file}`);
  }
});
