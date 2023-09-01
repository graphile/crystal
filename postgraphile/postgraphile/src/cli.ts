import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { inspect } from "node:util";

import type { MakePgServiceOptions } from "@dataplan/pg";
import { grafserv } from "grafserv/node";
import { resolvePresets } from "graphile-config";
import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { loadConfig } from "graphile-config/load";

import { postgraphile } from "./index.js";

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
    .option("superuser-connection", {
      alias: "S",
      type: "string",
      description:
        "The PostgreSQL connection string to use to install the watch fixtures, requires superuser privileges",
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
    .option("subscriptions", {
      type: "boolean",
      description:
        "Enable GraphQL subscriptions over websockets, if the schema supports them",
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

function isGraphileConfigPreset(
  foo: unknown,
  d = 0,
): foo is GraphileConfig.Preset {
  if (typeof foo !== "object") return false;
  if (foo === null) return false;
  const prototype = Object.getPrototypeOf(foo);
  if (prototype !== null && prototype !== Object.prototype) {
    return false;
  }
  if (
    (foo as any).default &&
    (d > 0 || isGraphileConfigPreset((foo as any).default, d + 1))
  ) {
    return false;
  }
  return true;
}

async function loadPresets(
  presetSpecs: string,
): Promise<GraphileConfig.Preset[]> {
  const specs = presetSpecs.split(",");
  const presets: GraphileConfig.Preset[] = [];
  for (const spec of specs) {
    // This is for compatibility with Windows: `C:\Users\Benjie\Some Folder\myfile.js:myExport`
    let colonIndex = spec.lastIndexOf(":");
    if (colonIndex === 1) {
      colonIndex = -1;
    }
    const moduleName = colonIndex >= 0 ? spec.substring(0, colonIndex) : spec;
    const exportName = colonIndex >= 0 ? spec.substring(colonIndex + 1) : null;
    let mod;
    try {
      mod = require(moduleName);
    } catch (e) {
      if (e.code === "ERR_REQUIRE_ESM") {
        const importSpecifier = moduleName.match(/^([a-z]:|\.\/|\/)/i)
          ? pathToFileURL(moduleName).href
          : moduleName;
        mod = await import(importSpecifier);
      } else {
        throw e;
      }
    }
    const possiblePreset =
      exportName !== null
        ? mod[exportName]
        : isGraphileConfigPreset(mod)
        ? mod
        : mod.default;
    if (isGraphileConfigPreset(possiblePreset)) {
      presets.push(possiblePreset);
    } else {
      throw new Error(
        `Imported '${spec}' but ${
          exportName ? `the '${exportName}' export` : `it`
        } doesn't look like a preset: ${inspect(
          possiblePreset,
        )} - other exports: ${Object.keys(mod).join(", ")}`,
      );
    }
  }
  return presets;
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const {
    connection: connectionString,
    superuserConnection: superuserConnectionString,
    schema: rawSchema,
    port: rawPort,
    host: rawHost,
    config: configFileLocation,
    allowExplain: rawAllowExplain,
    watch,
    preset: rawPresets,
    subscriptions: rawSubscriptions,
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
  if (connectionString || rawSchema || superuserConnectionString) {
    if (superuserConnectionString && !connectionString) {
      throw new Error(
        "--superuser-connection must not be specified without --connection",
      );
    }
    const schemas = rawSchema?.split(",") ?? ["public"];
    const adaptor =
      preset.pgServices?.[0]?.adaptor ?? "@dataplan/pg/adaptors/pg";

    const importSpecifier = adaptor.match(/^([a-z]:|\.\/|\/)/i)
      ? pathToFileURL(adaptor).href
      : adaptor;

    const mod = await import(importSpecifier);
    const makePgService = (mod.makePgService ?? mod.default?.makePgService) as (
      options: MakePgServiceOptions,
    ) => GraphileConfig.PgServiceConfiguration;
    if (typeof makePgService !== "function") {
      throw new Error(
        `Loaded adaptor '${adaptor}' but it does not export a 'makePgService' helper`,
      );
    }
    const newPgServices = [
      makePgService({
        connectionString,
        schemas,
        superuserConnectionString,
        ...(rawSubscriptions ? { pubsub: true } : null),
      }),
    ];
    preset.pgServices = newPgServices;
  }
  preset.grafserv = preset.grafserv || {};
  if (rawPort != null) {
    preset.grafserv!.port = rawPort;
  }
  if (rawHost != null) {
    preset.grafserv!.host = rawHost;
  }
  if (rawSubscriptions) {
    preset.grafserv!.websockets = true;
  }
  preset.grafast = preset.grafast || {};
  if (rawAllowExplain != null) {
    preset.grafast!.explain = rawAllowExplain;
  }
  if (watch != null) {
    preset.grafserv!.watch = watch;
  }

  const config = resolvePresets([preset]);
  if (!Array.isArray(config.pgServices) || config.pgServices.length === 0) {
    // ENHANCE: respect envvars here?
    console.error(
      `ERROR: Please specify \`--connection\` so we know which database to connect to (or add details to your \`graphile.config.js\`):\n\n  postgraphile${
        process.argv.length > 2 ? ` ${process.argv.slice(2).join(" ")}` : ""
      } --connection postgres://user:password@server:port/database_name?ssl=true`,
    );
    process.exit(2);
  }

  const pgl = postgraphile(config);

  const serv = pgl.createServ(grafserv);

  const server = createServer();
  serv.onRelease(() => {
    server.close();
    process.exitCode = 1;
  });
  serv.addTo(server).catch((e) => {
    console.error("Initializing server failed");
    console.error(e);
    process.exit(1);
  });
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
        `Server listening on port ${address.port} at http://${host}:${
          address.port
        }${config.grafserv?.graphqlPath ?? "/graphql"}`,
      );
    } else {
      console.error(`Could not determine server address`);
    }
  });

  const port = config.grafserv?.port;
  const host = config.grafserv?.host;

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
