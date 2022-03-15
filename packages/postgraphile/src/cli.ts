#!/usr/bin/env node
import { exportSchema } from "graphile-exporter";
import type { Preset } from "graphile-plugin";
import { resolvePresets } from "graphile-plugin";
import type { IncomingMessage, RequestListener } from "http";
import { createServer } from "http";
import parseArgs from "minimist";
import { resolve } from "path";

import type { ContextCallback } from "./interfaces";
import { postgraphile } from "./middleware";
import { defaultPreset } from "./preset";
import {
  makePgDatabasesAndContextFromConnectionString,
  makeSchema,
} from "./schema";

async function tryLoadPreset(configPath?: string): Promise<Preset | null> {
  try {
    return (
      await import(resolve(process.cwd(), configPath ?? "graphile.config.js"))
    ).default;
  } catch (e) {
    if (configPath != null) {
      throw e;
    }
    console.error(e);
    // TODO: if file exists but errored, throw the error
    return null;
  }
}

async function main() {
  const argv = parseArgs(process.argv.slice(2), {
    string: ["connection", "schema", "port", "config"],
    alias: {
      connection: ["c"],
      schema: ["s"],
      port: ["p"],
      config: ["C"],
    },
    stopEarly: true,
    unknown: (arg) => {
      throw new Error(`Argument '${arg}' not understood`);
    },
  });

  const {
    connection: connectionString,
    schema: rawSchema,
    port: rawPort,
    config: configFileLocation,
  } = argv;
  const schemas = rawSchema?.split(",");

  // Try and load the preset
  const userPreset = await tryLoadPreset(configFileLocation);
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
  if (rawPort != null) {
    preset.server = preset.server || {};
    preset.server!.port = parseInt(rawPort, 10);
  }

  const config = resolvePresets([preset]);

  if (contextCallback === null) {
    const withPgClient = config.gather?.pgDatabases?.[0]?.withPgClient;
    if (!withPgClient) {
      console.dir(config);
      throw new Error("Could not determine the withPgClient to use");
    }
    const contextValue = { withPgClient };
    contextCallback = () => contextValue;
  }

  if (config.server?.pgSettings) {
    const oldContextCallback = contextCallback;
    contextCallback = (req: IncomingMessage): object => {
      return {
        ...oldContextCallback(req),
        pgSettings: config.server!.pgSettings!(req),
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
