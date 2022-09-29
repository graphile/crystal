import { loadConfig, resolvePresets } from "graphile-config";
import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { createServer } from "node:http";
import { inspect } from "node:util";

import { postgraphile } from "./index.js";
// TODO: there should be no default preset
import defaultPreset from "./presets/amber.js";
import { makePgSourcesFromConnectionString } from "./schema.js";

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
      default: 5678,
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
    throw new Error(
      "You must either specify a --preset or have a `graphile.config.js` file that provides one",
    );
  }

  // Apply CLI options to preset
  if (connectionString || rawSchema) {
    const schemas = rawSchema?.split(",") ?? ["public"];
    const newPgSources = makePgSourcesFromConnectionString(
      connectionString,
      schemas,
    );
    preset.pgSources = newPgSources;
  }
  preset.server = preset.server || {};
  if (rawPort != null) {
    preset.server!.port = rawPort;
  }
  if (rawAllowExplain != null) {
    preset.server!.exposePlan = rawAllowExplain;
  }
  if (watch != null) {
    preset.server!.watch = watch;
  }

  const config = resolvePresets([preset]);
  if (!config.pgSources || config.pgSources.length === 0) {
    // TODO: respect envvars here?
    throw new Error(
      "Please specify `-c` so we know which database to connect to (or populate the configuration with the relevant options)",
    );
  }

  const serv = postgraphile(config);

  const server = createServer(serv.handler);
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
