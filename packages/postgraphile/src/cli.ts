#!/usr/bin/env node
import { $$setPlanGraph } from "dataplanner";
import { exportSchema } from "graphile-export";
import type { Preset } from "graphile-plugin";
import { loadConfig, resolvePresets } from "graphile-plugin";
import type { IncomingMessage, RequestListener } from "http";
import { createServer } from "http";
// TODO: bug in TypeScript claiming allowSyntheticDefaultImports is required but then ignoring that setting.
// @ts-ignore
import parseArgs from "minimist";
import { resolve } from "path";

import type { ContextCallback } from "./interfaces.js";
import { postgraphile } from "./middleware/index.js";
import { defaultPreset } from "./preset.js";
import {
  makePgDatabasesAndContextFromConnectionString,
  makeSchema,
} from "./schema.js";

async function main() {
  const argv = parseArgs(process.argv.slice(2), {
    string: ["connection", "schema", "port", "config"],
    boolean: ["plan"],
    alias: {
      connection: ["c"],
      schema: ["s"],
      port: ["p"],
      config: ["C"],
      plan: ["P"],
    },
    stopEarly: true,
    unknown: (arg: string) => {
      throw new Error(`Argument '${arg}' not understood`);
    },
  });

  const {
    connection: connectionString,
    schema: rawSchema,
    port: rawPort,
    config: configFileLocation,
    plan,
  } = argv;
  const schemas = rawSchema?.split(",");

  // Try and load the preset
  const userPreset = await loadConfig(configFileLocation);
  const preset: Preset = {
    extends: userPreset ? [userPreset] : [defaultPreset],
  };
  let contextCallback: ContextCallback | null = null;

  // Apply CLI options to preset
  if (connectionString || rawSchema) {
    const schemas = rawSchema?.split(",") ?? ["public"];
    const [newPgDatabases, newContextCallback] =
      makePgDatabasesAndContextFromConnectionString(connectionString, schemas);
    contextCallback = newContextCallback;
    preset.gather = preset.gather || { pgDatabases: [] };
    preset.gather!.pgDatabases = newPgDatabases;
  }
  preset.server = preset.server || {};
  if (rawPort != null) {
    preset.server!.port = parseInt(rawPort, 10);
  }
  if (plan === true) {
    preset.server!.exposePlan = true;
  }

  const config = resolvePresets([preset]);

  if (contextCallback === null) {
    const withPgClient = config.gather?.pgDatabases?.[0]?.withPgClient;
    if (!withPgClient) {
      throw new Error(
        "Please specify `-c` so we know which database to connect to (or populate the configuration with the relevant options)",
      );
    }
    const contextValue = { withPgClient };
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
