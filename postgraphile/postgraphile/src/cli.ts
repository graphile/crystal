import { resolvePresets } from "graphile-config";
import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { loadConfig } from "graphile-config/load";
import { createServer } from "node:http";
import { inspect } from "node:util";

import { postgraphile } from "./index.js";
import { makePgSources } from "./schema.js";

// The preset we recommend if the user doesn't specify one
const RECOMMENDED_PRESET = "--preset postgraphile/presets/amber";

export function options(yargs: Argv) {
  return yargs
    .parserConfiguration({
      // Last option wins - do NOT make duplicates into arrays!
      "duplicate-arguments-array": false,
    })
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
    })
    .option("host", {
      alias: "n",
      type: "string",
      description: "The host to bind our HTTP server to",
      default: "localhost",
    })
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the config file",
      normalize: true,
    })
    .option("preset", {
      alias: "P",
      type: "string",
      description: "A comma separated list of the preset(s) to use",
    })
    .option("allow-explain", {
      alias: "e",
      type: "boolean",
      description:
        "Allow visitors to view the plan/SQL queries/etc related to each GraphQL operation",
    });
}

function isGraphileConfigPreset(foo: unknown): foo is GraphileConfig.Preset {
  if (typeof foo !== "object") return false;
  if (foo === null) return false;
  const prototype = Object.getPrototypeOf(foo);
  if (prototype === null || prototype === Object.prototype) {
    return true;
  }
  return false;
}

async function loadPresets(
  presetSpecs: string,
): Promise<GraphileConfig.Preset[]> {
  const specs = presetSpecs.split(",");
  const presets: GraphileConfig.Preset[] = [];
  for (const spec of specs) {
    const [moduleName, exportName = "default"] = spec.split(":");
    const mod = await import(moduleName);
    const possiblePreset = mod[exportName];
    if (isGraphileConfigPreset(possiblePreset)) {
      presets.push(possiblePreset);
    } else {
      throw new Error(
        `Imported '${spec}' but the '${exportName}' export doesn't look like a preset: ${inspect(
          spec,
        )}`,
      );
    }
  }
  return presets;
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const {
    connection: connectionString,
    schema: rawSchema,
    port: rawPort,
    host: rawHost,
    config: configFileLocation,
    allowExplain: rawAllowExplain,
    watch,
    preset: rawPresets,
  } = args;

  const cliPresets = rawPresets ? await loadPresets(rawPresets) : [];

  // Try and load the preset
  const userPreset = await loadConfig(configFileLocation);
  const preset: GraphileConfig.Preset = {
    extends: [...(userPreset ? [userPreset] : []), ...cliPresets],
  };

  if (preset.extends!.length === 0) {
    console.error(
      `ERROR: You must either specify a --preset or have a \`graphile.config.js\` file that provides one. One option is to add \`${RECOMMENDED_PRESET}\` to your command line:\n\n  postgraphile ${RECOMMENDED_PRESET}${
        process.argv.length > 2 ? ` ${process.argv.slice(2).join(" ")}` : ""
      }`,
    );
    process.exit(1);
  }

  // Apply CLI options to preset
  if (connectionString || rawSchema) {
    const schemas = rawSchema?.split(",") ?? ["public"];
    const newPgSources = makePgSources(connectionString, schemas);
    preset.pgSources = newPgSources;
  }
  preset.server = preset.server || {};
  if (rawPort != null) {
    preset.server!.port = rawPort;
  }
  if (rawHost != null) {
    preset.server!.host = rawHost;
  }
  preset.grafast = preset.grafast || {};
  if (rawAllowExplain != null) {
    preset.grafast!.explain = rawAllowExplain;
  }
  if (watch != null) {
    preset.server!.watch = watch;
  }

  const config = resolvePresets([preset]);
  if (!config.pgSources || config.pgSources.length === 0) {
    // TODO: respect envvars here?
    console.error(
      `ERROR: Please specify \`--connection\` so we know which database to connect to (or add details to your \`graphile.config.js\`):\n\n  postgraphile${
        process.argv.length > 2 ? ` ${process.argv.slice(2).join(" ")}` : ""
      } --connection postgres://user:password@server:port/database_name?ssl=true`,
    );
    process.exit(2);
  }

  const instance = postgraphile(config);

  const serv = await instance.getGrafserv();

  const server = createServer(serv.handler);
  server.once("listening", () => {
    server.on("error", (e) => {
      console.error("Server raised an error:", e);
    });
    const address = server.address();
    if (typeof address === "string") {
      console.log(`Server listening at ${address}`);
    } else if (address) {
      const host =
        address.family === "IPv6" ? `[${address.address}]` : address.address;
      console.log(
        `Server listening on port ${address.port} at http://${host}:${address.port}/graphql`,
      );
    } else {
      console.error(`Could not determine server address`);
    }
  });

  const port = config.server?.port;
  const host = config.server?.host;

  const listenFailed = (e: Error) => {
    // Listen failed; exit
    console.error("Failed to listen", e);
    process.exit(2);
  };

  if (port != null) {
    server.on("error", listenFailed);
    server.once("listening", () => {
      server.removeListener("error", listenFailed);
    });
    server.listen({ port, host });
  } else {
    const tryPortZero = () => {
      server.removeListener("error", tryPortZero);
      server.on("error", listenFailed);
      server.once("listening", () => {
        server.removeListener("error", listenFailed);
      });
      server.listen({ host, port: 0 });
    };
    server.on("error", tryPortZero);
    server.once("listening", () => {
      server.removeListener("error", tryPortZero);
    });
    server.listen({ host, port: 5678 });
  }
}
