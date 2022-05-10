import { withPgClientFromPgSource } from "graphile-build-pg";
import { loadConfig, resolvePresets } from "graphile-plugin";
import type { ArgsFromOptions, Argv } from "graphile-plugin/cli";
import type { IncomingMessage, RequestListener } from "node:http";
import { createServer } from "node:http";

import type { ContextCallback } from "./interfaces.js";
import { postgraphile } from "./middleware/index.js";
import { defaultPreset } from "./preset.js";
import {
  makePgDatabasesAndContextFromConnectionString,
  makeSchema,
} from "./schema.js";

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
  } = args;

  // Try and load the preset
  const userPreset = await loadConfig(configFileLocation);
  const preset: GraphilePlugin.Preset = {
    extends: userPreset ? [userPreset] : [defaultPreset],
  };
  let contextCallback: ContextCallback | null = null;

  // Apply CLI options to preset
  if (connectionString || rawSchema) {
    const schemas = rawSchema?.split(",") ?? ["public"];
    const [newPgSources, newContextCallback] =
      makePgDatabasesAndContextFromConnectionString(connectionString, schemas);
    contextCallback = newContextCallback;
    preset.pgSources = newPgSources;
  }
  preset.server = preset.server || {};
  if (rawPort != null) {
    preset.server!.port = rawPort;
  }
  if (rawAllowExplain === true) {
    preset.server!.exposePlan = true;
  }

  const config = resolvePresets([preset]);

  if (contextCallback === null) {
    if (!config.pgSources || config.pgSources.length === 0) {
      throw new Error(
        "Please specify `-c` so we know which database to connect to (or populate the configuration with the relevant options)",
      );
    }
    const contextValue = {};
    for (const pgSource of config.pgSources) {
      if (pgSource.pgSettingsKey != null) {
        // TODO! How do we determine the pgSettings to use from CLI? Presumably there's a callback function...
        contextValue[pgSource.pgSettingsKey] = undefined;
      }
      contextValue[pgSource.withPgClientKey] = withPgClientFromPgSource.bind(
        null,
        pgSource,
      );
    }
    contextCallback = () => contextValue;
  }

  const pgSettings = config.server?.pgSettings;
  if (pgSettings || !contextCallback) {
    const oldContextCallback = contextCallback;
    contextCallback = (req: IncomingMessage): object => {
      return {
        ...oldContextCallback(req),
        ...(pgSettings
          ? {
              pgSettings:
                typeof pgSettings === "function" ? pgSettings(req) : pgSettings,
            }
          : null),
      };
    };
  }

  const schemaResult = await makeSchema(config, contextCallback);
  const middleware = postgraphile(schemaResult);
  const server = createServer(middleware as RequestListener);
  const port = config.server?.port ?? 0;
  server.once("error", (e) => {
    console.error(e);
    process.exit(2);
  });
  server.on("listening", () => {
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
  server.listen(port);
}
