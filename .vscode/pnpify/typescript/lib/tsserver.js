#!/usr/bin/env node

const {existsSync} = require(`fs`);
const {createRequire, createRequireFromPath} = require(`module`);
const {resolve} = require(`path`);

const relPnpApiPath = "../../../../.pnp.js";

const absPnpApiPath = resolve(__dirname, relPnpApiPath);
const absRequire = (createRequire || createRequireFromPath)(absPnpApiPath);

if (existsSync(absPnpApiPath)) {
  // Setup the environment to be able to require typescript/lib/tsserver.js
  require(absPnpApiPath).setup();
}

// Defer to the real typescript/lib/tsserver.js your application uses
module.exports = absRequire(`typescript/lib/tsserver.js`);
