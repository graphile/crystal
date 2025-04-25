#!/usr/bin/env node
// @ts-check
import { rm, cp, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sidebars from "../sidebars.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
process.chdir(`${__dirname}/..`);

await rm("versioned_docs/version-5", { recursive: true, force: true });
await cp("postgraphile", "versioned_docs/version-5", { recursive: true });
await writeFile(
  `${__dirname}/../versioned_sidebars/version-5-sidebars.json`,
  JSON.stringify(sidebars, null, 2) + "\n",
);
