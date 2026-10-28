#!/usr/bin/env -S node --experimental-strip-types

import { exportSchema } from "graphile-export";

import { makeExampleSchema } from "../examples/exampleSchema.mts";

exportSchema(makeExampleSchema(), `${import.meta.dirname}/exampleSchemaExport.mjs`, {
  mode: process.argv[2] as "graphql-js" | "typeDefs" | undefined,
});
