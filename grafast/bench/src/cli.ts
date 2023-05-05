import type { ArgsFromOptions, Argv } from "graphile-config/cli";

export function options(yargs: Argv) {
  return yargs
    .usage("$0", "Benchmark a Grafast schema")
    .option("schema", {
      alias: "s",
      type: "string",
      description: "path to the GraphQL schema",
      default: "schema.mjs",
    })
    .option("operations", {
      alias: "o",
      type: "string",
      description: "glob pattern for the operations to test",
      default: "queries/*.graphql",
    });
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const { schema: schemaFile, operations: operationsGlob } = args;
  console.log({ schemaFile, operationsGlob });
}
