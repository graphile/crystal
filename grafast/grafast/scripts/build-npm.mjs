#!/usr/bin/env zx

import "zx/globals";

import fsp from "fs/promises";

cd(__dirname + "/..");
await $`rm -Rf tsconfig.tsbuildinfo dist release`;
await $`tsc -b`;
await $`webpack --mode=production`;
await $`cp dist/*.d.ts release/dist/`;
await $`cp README.npm.md release/README.md`;

const packageJson = require("../package.json");
const newJson = { ...packageJson };
delete newJson.scripts;
delete newJson.devDependencies;

await fsp.writeFile(
  __dirname + "/../release/package.json",
  JSON.stringify(newJson, null, 2),
);
