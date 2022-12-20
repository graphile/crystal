#!/usr/bin/env zx

import "zx/globals";

import {
  encryptSourceFile,
  transformPackageJson,
  writePrereleaseLicense,
} from "../../../scripts/build-core.mjs";

cd(__dirname + "/..");
await $`rm -Rf tsconfig.tsbuildinfo dist release`;
await $`tsc -b`;
await $`webpack --mode=production`;
await $`cp dist/*.d.ts release/dist/`;
await $`cp README.npm.md release/README.md`;

await writePrereleaseLicense(__dirname + "/../release/LICENSE.md");
await transformPackageJson(
  __dirname + "../package.json",
  __dirname + "/../release/package.json",
);
await encryptSourceFile(__dirname + "/../release/dist/index.js");
