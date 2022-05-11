import { loadConfig, resolvePresets } from "graphile-config";
import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { createServer } from "node:http";

import { postgraphile } from "./middleware/index.js";
import { defaultPreset } from "./preset.js";
import { makePgDatabasesFromConnectionString } from "./schema.js";

export function options(yargs: Argv) {
  return yargs
    .usage("$0", "Run a PostGraphile HTTP server")
    .example(
      "$0 --connection postgres://localhost:5432/dbname --schema public --allow-explain",
      "Run PostGraphile connecting to the given PostgreSQL connection string, exposing the 'public' schema as GraphQL and allowing clients to request details of what went on 'under the hood' when executing operations ('explain')",
    )
    .option("connection", {
      alias: "c",
      type: "string",
      description: "The PostgreSQL connection string to connect to",
    })
    .option("schema", {
      alias: "s",
      type: "string",
      description:
        "The database schema (or comma separated list of schemas) to expose over GraphQL",
    })
    .option("watch", {
      alias: "w",
      type: "boolean",
      description: "Watch mode (monitor DB for schema changes)",
      default: false,
    })
    .option("port", {
      alias: "p",
      type: "number",
      description: "The port number on which to run our HTTP server",
      default: 5678,
    })
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the config file",
      normalize: true,
    })
    .option("allow-explain", {
      alias: "e",
      type: "boolean",
      description:
        "Allow visitors to view the plan/SQL queries/etc related to each GraphQL operation",
    });
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const {
    connection: connectionString,
    schema: rawSchema,
    port: rawPort,
    config: configFileLocation,
    allowExplain: rawAllowExplain,
    watch,
  } = args;

  // Try and load the preset
  const userPreset = await loadConfig(configFileLocation);
  const preset: GraphileConfig.Preset = {
    extends: userPreset
      ? [userPreset]
      : [
          // TODO: require a named preset
          defaultPreset,
        ],
  };

  // Apply CLI options to preset
  if (connectionString || rawSchema) {
    const schemas = rawSchema?.split(",") ?? ["public"];
    const newPgSources = makePgDatabasesFromConnectionString(
      connectionString,
      schemas,
    );
    preset.pgSources = newPgSources;
  }
  preset.server = preset.server || {};
  if (rawPort != null) {
    preset.server!.port = rawPort;
  }
  if (rawAllowExplain === true) {
    preset.server!.exposePlan = true;
  }
  preset.server!.watch = watch;

  const config = resolvePresets([preset]);
  if (!config.pgSources || config.pgSources.length === 0) {
    // TODO: respect envvars here?
    throw new Error(
      "Please specify `-c` so we know which database to connect to (or populate the configuration with the relevant options)",
    );
  }

  const middleware = postgraphile(config);

  const server = createServer(middleware as RequestListener);
  let started = false;
  server.on("error", (e) => {
    console.error("Server raised an error:", e);
    if (!started) {
      // Listen failed; exit
      process.exit(2);
    }
  });
  server.on("listening", () => {
    started = true;
    const address = server.address();
    if (typeof address === "string") {
      console.log(`Server listening at ${address}`);
    } else if (address) {
      console.log(
        `Server listening on port ${address.port} at http://localhost:${address.port}/graphql`,
      );
    } else {
      console.error(`Could not determine server address`);
    }
  });

  const port = config.server?.port ?? 0;
  server.listen(port);
}
