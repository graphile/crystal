import { glob } from "glob";
import { resolvePresets } from "graphile-config";
import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { loadConfig } from "graphile-config/load";
import { isSchema } from "graphql";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import type { GrafastBenchConfig } from ".";
import { bench } from ".";

export function options(yargs: Argv) {
  return yargs
    .usage("$0", "Benchmark a Grafast schema")
    .option("schema", {
      alias: "s",
      type: "string",
      description: "path to the GraphQL schema",
    })
    .option("operations", {
      alias: "o",
      type: "string",
      description: "glob pattern for the operations to test",
    })
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the graphile.config.mjs (or similar) file",
      normalize: true,
    });
}

async function configFromArgs(args: ArgsFromOptions<typeof options>) {
  const { schema, operations, config: configFileLocation } = args;

  const userPreset = await loadConfig(configFileLocation);

  const preset = {
    extends: [...(userPreset ? [userPreset] : [])],
    bench: {} as GrafastBenchConfig,
  } satisfies GraphileConfig.Preset;

  if (schema) {
    preset.bench.schema = schema;
  }
  if (operations) {
    preset.bench.operations = operations;
  }

  const config = resolvePresets([preset]);
  return config;
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const config = await configFromArgs(args);
  const {
    schema: schemaFile = "schema.mjs",
    operations: operationsGlob = "queries/*.graphql",
  } = config.bench ?? {};
  const mod = await import(schemaFile);
  const schema = isSchema(mod.default)
    ? mod.default
    : isSchema(mod.schema)
    ? mod.schema
    : isSchema(mod)
    ? mod
    : isSchema(mod.default.default)
    ? mod.default.default
    : isSchema(mod.default.schema)
    ? mod.default.schema
    : null;
  if (!schema) {
    throw new Error(
      `Could not find a schema exported from that file - please export the schema as 'schema' or 'default'. Exports: ${Object.keys(
        mod,
      )}`,
    );
  }
  const operationFiles = await glob(operationsGlob);
  operationFiles.sort();
  const operations = await Promise.all(
    operationFiles.map(async (f) => {
      return {
        name: path.basename(path.dirname(f)) + "/" + path.basename(f),
        source: await fsp.readFile(f, "utf8"),
      };
    }),
  );
  await bench(schema, operations, config.bench ?? {});
}
