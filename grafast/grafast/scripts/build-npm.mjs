#!/usr/bin/env zx

import "zx/globals";

import { esmHack, transformPackageJson } from "../../../scripts/build-core.mjs";

cd(__dirname + "/..");
await $`rm -Rf tsconfig.tsbuildinfo dist release`;
await $`tsc -b`;
await $`find dist -type d -exec mkdir -p release/{} \\;`;
await $`find dist -type f -name '*.js' -exec cp {} release/{} \\;`;
await $`find dist -type f -name '*.d.ts' -exec cp {} release/{} \\;`;
await $`find fwd -type d -exec mkdir -p release/{} \\;`;
await $`find fwd -type f -name '*.js' -exec cp {} release/{} \\;`;
await $`find fwd -type f -name '*.d.ts' -exec cp {} release/{} \\;`;
await $`cp src/.npmignore release/dist/.npmignore`;
await $`cp LICENSE.md release/LICENSE.md`;
await $`cp README.md release/README.md`;

await transformPackageJson(
  __dirname + "/../package.json",
  __dirname + "/../release/package.json",
);

// TODO: force GRAPHILE_ENV="production" and eliminate all related dead branches

//await esmHack(__dirname + "/../release/dist/index.js");
//await esmHack(__dirname + "/../release/dist/envelop.js");
//await esmHack(__dirname + "/../release/dist/mermaid.js");
