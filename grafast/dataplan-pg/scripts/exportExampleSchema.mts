#!/usr/bin/env -S node --experimental-strip-types

import { writeFile } from "node:fs/promises";
import { exportSchema } from "graphile-export";
import { printSchema } from "graphql";

import { makeExampleSchema } from "../examples/exampleSchema.mts";

const mode = process.argv[2] as "graphql-js" | "typeDefs" | "sdl" | undefined;
const __dirname = import.meta.dirname;

const schema = makeExampleSchema();
if (mode === "sdl") {
  const sdl = printSchema(schema) + "\n";
  await writeFile(`${__dirname}/../__tests__/schema.graphql`, sdl);
} else {
  exportSchema(schema, `${__dirname}/exampleSchemaExport.mjs`, { mode });
}
