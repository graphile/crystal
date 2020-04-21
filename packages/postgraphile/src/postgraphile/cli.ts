#!/usr/bin/env node
// tslint:disable no-console

/*
 * IMPORTANT: the './postgraphilerc' import MUST come first!
 *
 * Reason: enables user to apply modifications to their Node.js environment
 * (e.g. sourcing modules that affect global state, like dotenv) before any of
 * our other require()s occur.
 */
import config from "./postgraphilerc";

import { createServer } from "http";
import chalk from "chalk";
import program from "commander";
import jwt from "jsonwebtoken";
import { parse as parsePgConnectionString } from "pg-connection-string";
import postgraphile, { getPostgraphileSchemaBuilder } from "./postgraphile";
import { makePgSmartTagsFromFilePlugin } from "../plugins";
import { Pool, PoolConfig } from "pg";
import cluster from "cluster";
import { makePluginHook, PostGraphilePlugin } from "./pluginHook";
import debugFactory from "debug";
import { mixed } from "../interfaces";
// @ts-ignore
import * as manifest from "../../package.json";
// @ts-ignore
import sponsors from "../../sponsors.json";
import { enhanceHttpServerWithSubscriptions } from "./http/subscriptions";
import { existsSync } from "fs";

const tagsFile = process.cwd() + "/postgraphile.tags.json5";
/*
 * Watch mode on the tags file is non-trivial, so only load the plugin if the
 * file exists when PostGraphile starts.
 */
const smartTagsPlugin = existsSync(tagsFile)
  ? makePgSmartTagsFromFilePlugin()
  : null;

const isDev = process.env.POSTGRAPHILE_ENV === "development";

function isString(str: unknown): str is string {
  return typeof str === "string";
}

const sponsor = sponsors[Math.floor(sponsors.length * Math.random())];

const debugCli = debugFactory("postgraphile:cli");

// TODO: Demo Postgres database
const DEMO_PG_URL = null;

function extractPlugins(
  rawArgv: Array<string>,
): {
  argv: Array<string>;
  plugins: Array<PostGraphilePlugin>;
} {
  let argv;
  let pluginStrings = [];
  if (rawArgv[2] === "--plugins") {
    pluginStrings = rawArgv[3].split(",");
    argv = [...rawArgv.slice(0, 2), ...rawArgv.slice(4)];
  } else {
    pluginStrings =
      (config && config["options"] && config["options"]["plugins"]) || [];
    argv = rawArgv;
  }
  const plugins = pluginStrings.map((pluginString: string) => {
    debugCli("Loading plugin %s", pluginString);
    const rawPlugin = require(pluginString); // tslint:disable-lin no-var-requires
    if (rawPlugin["default"] && typeof rawPlugin["default"] === "object") {
      return rawPlugin["default"];
    } else {
      return rawPlugin;
    }
  });
  return { argv, plugins };
}

const { argv: argvSansPlugins, plugins: extractedPlugins } = extractPlugins(
  process.argv,
);

const pluginHook = makePluginHook(extractedPlugins);

program
  .version(manifest.version)
  .usage("[options...]")
  .description(manifest.description);
// .option('-d, --demo', 'run PostGraphile using the demo database connection')

export type AddFlagFn = (
  optionString: string,
  description: string,
  parse?: (option: string) => mixed,
) => AddFlagFn;

function addFlag(
  optionString: string,
  description: string,
  parse?: (option: string) => mixed,
): AddFlagFn {
  program.option(optionString, description, parse);
  return addFlag;
}

// Standard options
program
  .option(
    "--plugins <string>",
    "a list of PostGraphile server plugins (not Graphile Engine schema plugins) to load; if present, must be the _first_ option",
  )
  .option(
    "-c, --connection <string>",
    "the PostgreSQL database name or connection string. If omitted, inferred from environmental variables (see https://www.postgresql.org/docs/current/static/libpq-envars.html). Examples: 'db', 'postgres:///db', 'postgres://user:password@domain:port/db?ssl=1'",
  )
  .option(
    "-C, --owner-connection <string>",
    "as `--connection`, but for a privileged user (e.g. for setting up watch fixtures, logical decoding, etc); defaults to the value from `--connection`",
  )
  .option(
    "-s, --schema <string>",
    "a Postgres schema to be introspected. Use commas to define multiple schemas",
    (option: string) => option.split(","),
  )
  .option(
    "-S, --subscriptions",
    "Enable GraphQL websocket transport support for subscriptions (you still need a subscriptions plugin currently)",
  )
  .option(
    "-L, --live",
    "[EXPERIMENTAL] Enables live-query support via GraphQL subscriptions (sends updated payload any time nested collections/records change). Implies --subscriptions",
  )
  .option(
    "-w, --watch",
    "automatically updates your GraphQL schema when your database schema changes (NOTE: requires DB superuser to install `postgraphile_watch` schema)",
  )
  .option(
    "-n, --host <string>",
    "the hostname to be used. Defaults to `localhost`",
  )
  .option(
    "-p, --port <number>",
    "the port to be used. Defaults to 5000",
    parseFloat,
  )
  .option(
    "-m, --max-pool-size <number>",
    "the maximum number of clients to keep in the Postgres pool. defaults to 10",
    parseFloat,
  )
  .option(
    "-r, --default-role <string>",
    "the default Postgres role to use when a request is made. supercedes the role used to connect to the database",
  )
  .option(
    "--retry-on-init-fail",
    "if an error occurs building the initial schema, this flag will cause PostGraphile to keep trying to build the schema with exponential backoff rather than exiting",
  );

pluginHook("cli:flags:add:standard", addFlag);

// Schema configuration
program
  .option(
    "-j, --dynamic-json",
    "[RECOMMENDED] enable dynamic JSON in GraphQL inputs and outputs. PostGraphile uses stringified JSON by default",
  )
  .option(
    "-N, --no-setof-functions-contain-nulls",
    "[RECOMMENDED] if none of your `RETURNS SETOF compound_type` functions mix NULLs with the results then you may enable this to reduce the nullables in the GraphQL schema",
  )
  .option(
    "-a, --classic-ids",
    "use classic global id field name. required to support Relay 1",
  )
  .option(
    "-M, --disable-default-mutations",
    "disable default mutations, mutation will only be possible through Postgres functions",
  )
  .option(
    "--simple-collections <omit|both|only>",
    '"omit" (default) - relay connections only, "only" - simple collections only (no Relay connections), "both" - both',
  )
  .option(
    "--no-ignore-rbac",
    "[RECOMMENDED] set this to exclude fields, queries and mutations that are not available to any possible user (determined from the user in connection string and any role they can become); this will be enabled by default in v5",
  )
  .option(
    "--no-ignore-indexes",
    "[RECOMMENDED] set this to exclude filters, orderBy, and relations that would be expensive to access due to missing indexes",
  )
  .option(
    "--include-extension-resources",
    "by default, tables and functions that come from extensions are excluded; use this flag to include them (not recommended)",
  );

pluginHook("cli:flags:add:schema", addFlag);

// Error enhancements
program
  .option(
    "--show-error-stack [json|string]",
    "show JavaScript error stacks in the GraphQL result errors (recommended in development)",
  )
  .option(
    "--extended-errors <string>",
    "a comma separated list of extended Postgres error fields to display in the GraphQL result. Recommended in development: 'hint,detail,errcode'. Default: none",
    (option: string) => option.split(",").filter(_ => _),
  );

pluginHook("cli:flags:add:errorHandling", addFlag);

// Plugin-related options
program
  .option(
    "--append-plugins <string>",
    "a comma-separated list of plugins to append to the list of Graphile Engine schema plugins",
  )
  .option(
    "--prepend-plugins <string>",
    "a comma-separated list of plugins to prepend to the list of Graphile Engine schema plugins",
  )
  .option(
    "--skip-plugins <string>",
    "a comma-separated list of Graphile Engine schema plugins to skip",
  );

pluginHook("cli:flags:add:plugins", addFlag);

// Things that relate to -X
program
  .option(
    "--read-cache <path>",
    "[experimental] reads cached values from local cache file to improve startup time (you may want to do this in production)",
  )
  .option(
    "--write-cache <path>",
    "[experimental] writes computed values to local cache file so startup can be faster (do this during the build phase)",
  )
  .option(
    "--export-schema-json <path>",
    "enables exporting the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten.",
  )
  .option(
    "--export-schema-graphql <path>",
    "enables exporting the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten.",
  )
  .option(
    "--sort-export",
    "lexicographically (alphabetically) sort exported schema for more stable diffing.",
  )
  .option(
    "-X, --no-server",
    "[experimental] for when you just want to use --write-cache or --export-schema-* and not actually run a server (e.g. CI)",
  );

pluginHook("cli:flags:add:noServer", addFlag);

// Webserver configuration
program
  .option(
    "-q, --graphql <path>",
    "the route to mount the GraphQL server on. defaults to `/graphql`",
  )
  .option(
    "-i, --graphiql <path>",
    "the route to mount the GraphiQL interface on. defaults to `/graphiql`",
  )
  .option(
    "--enhance-graphiql",
    "[DEVELOPMENT] opt in to additional GraphiQL functionality (this may change over time - only intended for use in development; automatically enables with `subscriptions` and `live`)",
  )
  .option(
    "-b, --disable-graphiql",
    "disables the GraphiQL interface. overrides the GraphiQL route option",
  )
  .option(
    "-o, --cors",
    "enable generous CORS settings; disabled by default, if possible use a proxy instead",
  )
  .option(
    "-l, --body-size-limit <string>",
    "set the maximum size of the HTTP request body that can be parsed (default 100kB). The size can be given as a human-readable string, such as '200kB' or '5MB' (case insensitive).",
  )
  .option(
    "--timeout <number>",
    "set the timeout value in milliseconds for sockets",
    parseFloat,
  )
  .option(
    "--cluster-workers <count>",
    "[experimental] spawn <count> workers to increase throughput",
    parseFloat,
  )
  .option(
    "--enable-query-batching",
    "[experimental] enable the server to process multiple GraphQL queries in one request",
  )
  .option(
    "--disable-query-log",
    "disable logging queries to console (recommended in production)",
  )
  .option(
    "--allow-explain",
    "[EXPERIMENTAL] allows users to use the Explain button in GraphiQL to view the plan for the SQL that is executed (DO NOT USE IN PRODUCTION)",
  );

pluginHook("cli:flags:add:webserver", addFlag);

// JWT-related options
program
  .option(
    "-e, --jwt-secret <string>",
    "the secret to be used when creating and verifying JWTs. if none is provided auth will be disabled",
  )
  .option(
    "--jwt-verify-algorithms <string>",
    "a comma separated list of the names of the allowed jwt token algorithms",
    (option: string) => option.split(","),
  )
  .option(
    "-A, --jwt-verify-audience <string>",
    "a comma separated list of JWT audiences that will be accepted; defaults to 'postgraphile'. To disable audience verification, set to ''.",
    (option: string) => option.split(",").filter(_ => _),
  )
  .option(
    "--jwt-verify-clock-tolerance <number>",
    "number of seconds to tolerate when checking the nbf and exp claims, to deal with small clock differences among different servers",
    parseFloat,
  )
  .option("--jwt-verify-id <string>", "the name of the allowed jwt token id")
  .option(
    "--jwt-verify-ignore-expiration",
    "if `true` do not validate the expiration of the token defaults to `false`",
  )
  .option(
    "--jwt-verify-ignore-not-before",
    "if `true` do not validate the notBefore of the token defaults to `false`",
  )
  .option(
    "--jwt-verify-issuer <string>",
    "a comma separated list of the names of the allowed jwt token issuer",
    (option: string) => option.split(","),
  )
  .option(
    "--jwt-verify-subject <string>",
    "the name of the allowed jwt token subject",
  )
  .option(
    "--jwt-role <string>",
    "a comma seperated list of strings that create a path in the jwt from which to extract the postgres role. if none is provided it will use the key `role` on the root of the jwt.",
    (option: string) => option.split(","),
  )
  .option(
    "-t, --jwt-token-identifier <identifier>",
    "the Postgres identifier for a composite type that will be used to create JWT tokens",
  );

pluginHook("cli:flags:add:jwt", addFlag);

// Any other options
pluginHook("cli:flags:add", addFlag);

// Deprecated
program
  .option(
    "--token <identifier>",
    "[DEPRECATED] Use --jwt-token-identifier instead. This option will be removed in v5.",
  )
  .option(
    "--secret <string>",
    "[DEPRECATED] Use --jwt-secret instead. This option will be removed in v5.",
  )
  .option(
    "--jwt-audiences <string>",
    "[DEPRECATED] Use --jwt-verify-audience instead. This option will be removed in v5.",
    (option: string) => option.split(","),
  )
  .option(
    "--legacy-functions-only",
    "[DEPRECATED] PostGraphile 4.1.0 introduced support for PostgreSQL functions than declare parameters with IN/OUT/INOUT or declare RETURNS TABLE(...); enable this flag to ignore these types of functions. This option will be removed in v5.",
  );

pluginHook("cli:flags:add:deprecated", addFlag);

// Awkward application workarounds / legacy support
program
  .option(
    "--legacy-relations <omit|deprecated|only>",
    "some one-to-one relations were previously detected as one-to-many - should we export 'only' the old relation shapes, both new and old but mark the old ones as 'deprecated', or 'omit' the old relation shapes entirely",
  )
  .option(
    "--legacy-json-uuid",
    `ONLY use this option if you require the v3 typenames 'Json' and 'Uuid' over 'JSON' and 'UUID'`,
  );

pluginHook("cli:flags:add:workarounds", addFlag);

program.on("--help", () => {
  console.log(`
Get started:

  $ postgraphile
  $ postgraphile -c postgres://localhost/my_db
  $ postgraphile --connection postgres://user:pass@localhost/my_db --schema my_schema --watch --dynamic-json
`);
  process.exit(0);
});

program.parse(argvSansPlugins);

function exitWithErrorMessage(message: string): never {
  console.error(message);
  console.error();
  console.error("For help, run `postgraphile --help`");
  process.exit(1);
}

if (program.args.length) {
  exitWithErrorMessage(
    `ERROR: some of the parameters you passed could not be processed: '${program.args.join(
      "', '",
    )}'`,
  );
}

if (program["plugins"]) {
  exitWithErrorMessage(
    `--plugins must be the first argument to postgraphile if specified`,
  );
}

// Kill server on exit.
process.on("SIGINT", () => {
  process.exit(1);
});

// For `--no-*` options, `program` automatically contains the default,
// overriding our options. We typically want the CLI to "win", but not
// with defaults! So this code extracts those `--no-*` values and
// re-overwrites the values if necessary.
const configOptions = config["options"] || {};
const overridesFromOptions = {};
["ignoreIndexes", "ignoreRbac", "setofFunctionsContainNulls"].forEach(
  option => {
    if (option in configOptions) {
      overridesFromOptions[option] = configOptions[option];
    }
  },
);

// Destruct our configuration file and command line arguments, use defaults, and rename options to
// something appropriate for JavaScript.
const {
  demo: isDemo = false,
  connection: pgConnectionString,
  ownerConnection,
  subscriptions,
  live,
  watch: watchPg,
  schema: dbSchema,
  host: hostname = "localhost",
  port = 5000,
  timeout: serverTimeout,
  maxPoolSize,
  defaultRole: pgDefaultRole,
  retryOnInitFail,
  graphql: graphqlRoute = "/graphql",
  graphiql: graphiqlRoute = "/graphiql",
  enhanceGraphiql = false,
  disableGraphiql = false,
  secret: deprecatedJwtSecret,
  jwtSecret,
  jwtPublicKey,
  jwtAudiences,
  jwtVerifyAlgorithms,
  jwtVerifyAudience,
  jwtVerifyClockTolerance,
  jwtVerifyId,
  jwtVerifyIgnoreExpiration,
  jwtVerifyIgnoreNotBefore,
  jwtVerifyIssuer,
  jwtVerifySubject,
  jwtSignOptions = {},
  jwtVerifyOptions: rawJwtVerifyOptions,
  jwtRole = ["role"],
  token: deprecatedJwtPgTypeIdentifier,
  jwtTokenIdentifier: jwtPgTypeIdentifier,
  cors: enableCors = false,
  classicIds = false,
  dynamicJson = false,
  disableDefaultMutations = false,
  ignoreRbac = true,
  includeExtensionResources = false,
  exportSchemaJson: exportJsonSchemaPath,
  exportSchemaGraphql: exportGqlSchemaPath,
  sortExport = false,
  showErrorStack: rawShowErrorStack,
  extendedErrors = [],
  bodySizeLimit,
  appendPlugins: appendPluginNames,
  prependPlugins: prependPluginNames,
  // replaceAllPlugins is NOT exposed via the CLI
  skipPlugins: skipPluginNames,
  readCache,
  writeCache,
  legacyRelations: rawLegacyRelations = "deprecated",
  server: yesServer,
  clusterWorkers,
  enableQueryBatching,
  setofFunctionsContainNulls = true,
  legacyJsonUuid,
  disableQueryLog,
  allowExplain,
  simpleCollections,
  legacyFunctionsOnly,
  ignoreIndexes,
  // tslint:disable-next-line no-any
} = {
  ...config["options"],
  ...program,
  ...overridesFromOptions,
} as typeof program;

const showErrorStack = (val => {
  switch (val) {
    case "string":
    case true:
      return true;
    case null:
    case undefined:
      return undefined;
    case "json":
      return "json";
    default: {
      exitWithErrorMessage(
        `Invalid argument for '--show-error-stack' - expected no argument, or 'string' or 'json'`,
      );
    }
  }
})(rawShowErrorStack);

if (allowExplain && !disableGraphiql && !enhanceGraphiql) {
  exitWithErrorMessage(
    "`--allow-explain` requires `--enhance-graphiql` or `--disable-graphiql`",
  );
}

let legacyRelations: "omit" | "deprecated" | "only";
if (!["omit", "only", "deprecated"].includes(rawLegacyRelations)) {
  exitWithErrorMessage(
    `Invalid argument to '--legacy-relations' - expected on of 'omit', 'deprecated', 'only'; but received '${rawLegacyRelations}'`,
  );
} else {
  legacyRelations = rawLegacyRelations;
}

const noServer = !yesServer;

// Add custom logic for getting the schemas from our CLI. If we are in demo
// mode, we want to use the `forum_example` schema. Otherwise the `public`
// schema is what we want.
const schemas: Array<string> =
  dbSchema || (isDemo ? ["forum_example"] : ["public"]);

const ownerConnectionString =
  ownerConnection || pgConnectionString || process.env.DATABASE_URL;

// Work around type mismatches between parsePgConnectionString and PoolConfig
const coerce = (o: ReturnType<typeof parsePgConnectionString>): PoolConfig => {
  return {
    ...o,
    application_name: o["application_name"] || undefined,
    ssl: o.ssl != null ? !!o.ssl : undefined,
    user: typeof o.user === "string" ? o.user : undefined,
    database: typeof o.database === "string" ? o.database : undefined,
    password: typeof o.password === "string" ? o.password : undefined,
    port:
      o.port || typeof o.port === "number" ? parseInt(o.port, 10) : undefined,
    host: typeof o.host === "string" ? o.host : undefined,
  };
};

// Create our Postgres config.
const pgConfig: PoolConfig = {
  // If we have a Postgres connection string, parse it and use that as our
  // config. If we don’t have a connection string use some environment
  // variables or final defaults. Other environment variables should be
  // detected and used by `pg`.
  ...(pgConnectionString || process.env.DATABASE_URL || isDemo
    ? coerce(
        parsePgConnectionString(
          pgConnectionString || process.env.DATABASE_URL || DEMO_PG_URL,
        ),
      )
    : {
        host: process.env.PGHOST || process.env.PGHOSTADDR || "localhost",
        port:
          (process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : null) ||
          5432,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
      }),
  // Add the max pool size to our config.
  max: maxPoolSize,
};

const loadPlugins = (rawNames: mixed) => {
  if (!rawNames) {
    return undefined;
  }
  const names = Array.isArray(rawNames)
    ? rawNames
    : String(rawNames).split(",");
  return names.map(rawName => {
    if (typeof rawName === "function") {
      return rawName;
    }
    const name = String(rawName);
    const parts = name.split(":");
    let root;
    try {
      root = require(String(parts.shift()));
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(`Failed to load plugin '${name}'`);
      throw e;
    }
    let plugin = root;
    let part: string | void;
    while ((part = parts.shift())) {
      plugin = plugin[part];
      if (plugin == null) {
        throw new Error(
          `No plugin found matching spec '${name}' - failed at '${part}'`,
        );
      }
    }
    if (typeof plugin === "function") {
      return plugin;
    } else if (plugin === root && typeof plugin.default === "function") {
      return plugin.default; // ES6 workaround
    } else {
      throw new Error(
        `No plugin found matching spec '${name}' - expected function, found '${typeof plugin}'`,
      );
    }
  });
};

if (jwtAudiences != null && jwtVerifyAudience != null) {
  exitWithErrorMessage(
    `Provide either '--jwt-audiences' or '-A, --jwt-verify-audience' but not both`,
  );
}

function trimNulls(obj: object): object {
  return Object.keys(obj).reduce((memo, key) => {
    if (obj[key] != null) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
}

if (
  rawJwtVerifyOptions &&
  (jwtVerifyAlgorithms ||
    jwtVerifyAudience ||
    jwtVerifyClockTolerance ||
    jwtVerifyId ||
    jwtVerifyIgnoreExpiration ||
    jwtVerifyIgnoreNotBefore ||
    jwtVerifyIssuer ||
    jwtVerifySubject)
) {
  exitWithErrorMessage(
    "You may not mix `jwtVerifyOptions` with the legacy `jwtVerify*` settings; please only provide `jwtVerifyOptions`.",
  );
}
const jwtVerifyOptions: jwt.VerifyOptions = rawJwtVerifyOptions
  ? rawJwtVerifyOptions
  : trimNulls({
      algorithms: jwtVerifyAlgorithms,
      audience: jwtVerifyAudience,
      clockTolerance: jwtVerifyClockTolerance,
      jwtId: jwtVerifyId,
      ignoreExpiration: jwtVerifyIgnoreExpiration,
      ignoreNotBefore: jwtVerifyIgnoreNotBefore,
      issuer: jwtVerifyIssuer,
      subject: jwtVerifySubject,
    });

const appendPlugins = loadPlugins(appendPluginNames);
const prependPlugins = loadPlugins(prependPluginNames);
const skipPlugins = loadPlugins(skipPluginNames);

// The options to pass through to the schema builder, or the middleware
const postgraphileOptions = pluginHook(
  "cli:library:options",
  {
    ...config["options"],
    classicIds,
    dynamicJson,
    disableDefaultMutations,
    ignoreRBAC: ignoreRbac,
    includeExtensionResources,
    graphqlRoute,
    graphiqlRoute,
    graphiql: !disableGraphiql,
    enhanceGraphiql: enhanceGraphiql ? true : undefined,
    jwtPgTypeIdentifier: jwtPgTypeIdentifier || deprecatedJwtPgTypeIdentifier,
    jwtSecret: jwtSecret || deprecatedJwtSecret,
    jwtPublicKey,
    jwtAudiences,
    jwtSignOptions,
    jwtRole,
    jwtVerifyOptions,
    retryOnInitFail,
    pgDefaultRole,
    subscriptions: subscriptions || live,
    live,
    watchPg,
    showErrorStack,
    extendedErrors,
    disableQueryLog,
    allowExplain: allowExplain ? true : undefined,
    enableCors,
    exportJsonSchemaPath,
    exportGqlSchemaPath,
    sortExport,
    bodySizeLimit,
    appendPlugins: smartTagsPlugin
      ? [smartTagsPlugin, ...(appendPlugins || [])]
      : appendPlugins,
    prependPlugins,
    skipPlugins,
    readCache,
    writeCache,
    legacyRelations,
    setofFunctionsContainNulls,
    legacyJsonUuid,
    enableQueryBatching,
    pluginHook,
    simpleCollections,
    legacyFunctionsOnly,
    ignoreIndexes,
    ownerConnectionString,
  },
  { config, cliOptions: program },
);

function killAllWorkers(signal = "SIGTERM"): void {
  for (const id in cluster.workers) {
    const worker = cluster.workers[id];
    if (Object.prototype.hasOwnProperty.call(cluster.workers, id) && worker) {
      worker.kill(signal);
    }
  }
}

if (noServer) {
  // No need for a server, let's just spin up the schema builder
  (async (): Promise<void> => {
    const pgPool = new Pool(pgConfig);
    pgPool.on("error", err => {
      // tslint:disable-next-line no-console
      console.error("PostgreSQL client generated error: ", err.message);
    });
    const { getGraphQLSchema } = getPostgraphileSchemaBuilder(
      pgPool,
      schemas,
      postgraphileOptions,
    );
    await getGraphQLSchema();
    if (!watchPg) {
      await pgPool.end();
    }
  })().then(null, e => {
    console.error("Error occurred!");
    console.error(e);
    process.exit(1);
  });
} else {
  if (clusterWorkers >= 2 && cluster.isMaster) {
    let shuttingDown = false;
    const shutdown = () => {
      if (!shuttingDown) {
        shuttingDown = true;
        process.exitCode = 1;
        const fallbackTimeout = setTimeout(() => {
          const remainingCount = Object.keys(cluster.workers).length;
          if (remainingCount > 0) {
            console.log(
              `  [cluster] ${remainingCount} workers did not die fast enough, sending SIGKILL`,
            );
            killAllWorkers("SIGKILL");
            const ultraFallbackTimeout = setTimeout(() => {
              console.log(
                `  [cluster] really should have exited automatically, but haven't - exiting`,
              );
              process.exit(3);
            }, 5000);
            ultraFallbackTimeout.unref();
          } else {
            console.log(
              `  [cluster] should have exited automatically, but haven't - exiting`,
            );
            process.exit(2);
          }
        }, 5000);
        fallbackTimeout.unref();
        console.log(`  [cluster] killing other workers with SIGTERM`);
        killAllWorkers("SIGTERM");
      }
    };

    cluster.on("exit", (worker, code, signal) => {
      console.log(
        `  [cluster] worker pid=${worker.process.pid} exited (code=${code}, signal=${signal})`,
      );
      shutdown();
    });

    for (let i = 0; i < clusterWorkers; i++) {
      const worker = cluster.fork({
        POSTGRAPHILE_WORKER_NUMBER: String(i + 1),
      });
      console.log(
        `  [cluster] started worker ${i + 1} (pid=${worker.process.pid})`,
      );
    }
  } else {
    // Create’s our PostGraphile server
    const rawMiddleware = postgraphile(pgConfig, schemas, postgraphileOptions);

    // You probably don't want this hook; likely you want
    // `postgraphile:middleware` instead. This hook will likely be removed in
    // future without warning.
    const middleware = pluginHook(
      /* DO NOT USE -> */ "cli:server:middleware" /* <- DO NOT USE */,
      rawMiddleware,
      {
        options: postgraphileOptions,
      },
    );

    const server = createServer(middleware);
    if (serverTimeout) {
      server.timeout = serverTimeout;
    }

    if (postgraphileOptions.subscriptions) {
      enhanceHttpServerWithSubscriptions(server, middleware);
    }

    pluginHook("cli:server:created", server, {
      options: postgraphileOptions,
      middleware,
    });

    // Start our server by listening to a specific port and host name. Also log
    // some instructions and other interesting information.
    server.listen(port, hostname, () => {
      const address = server.address();
      const actualPort = typeof address === "string" ? port : address.port;
      const self = cluster.isMaster
        ? isDev
          ? `server (pid=${process.pid})`
          : "server"
        : `worker ${process.env.POSTGRAPHILE_WORKER_NUMBER} (pid=${process.pid})`;
      const versionString = `v${manifest.version}`;
      if (cluster.isMaster || process.env.POSTGRAPHILE_WORKER_NUMBER === "1") {
        console.log("");
        console.log(
          `PostGraphile ${versionString} ${self} listening on port ${chalk.underline(
            actualPort.toString(),
          )} 🚀`,
        );
        console.log("");
        const {
          host: rawPgHost,
          port: rawPgPort,
          database: pgDatabase,
          user: pgUser,
          password: pgPassword,
        } = pgConfig;
        // Not using default because want to handle the empty string also.
        const pgHost = rawPgHost || "localhost";
        const pgPort = (rawPgPort && parseInt(String(rawPgPort), 10)) || 5432;
        const safeConnectionString = isDemo
          ? "postgraphile_demo"
          : `postgres://${pgUser ? pgUser : ""}${
              pgPassword ? ":[SECRET]" : ""
            }${pgUser || pgPassword ? "@" : ""}${
              pgUser || pgPassword || pgHost !== "localhost" || pgPort !== 5432
                ? pgHost
                : ""
            }${pgPort !== 5432 ? `:${pgConfig.port || 5432}` : ""}${
              pgDatabase ? `/${pgDatabase}` : ""
            }`;

        const information: Array<string> = pluginHook(
          "cli:greeting",
          [
            `GraphQL API:         ${chalk.underline.bold.blue(
              `http://${hostname}:${actualPort}${graphqlRoute}`,
            )}` +
              (postgraphileOptions.subscriptions
                ? ` (${
                    postgraphileOptions.live ? "live " : ""
                  }subscriptions enabled)`
                : ""),
            !disableGraphiql &&
              `GraphiQL GUI/IDE:    ${chalk.underline.bold.blue(
                `http://${hostname}:${actualPort}${graphiqlRoute}`,
              )}` +
                (postgraphileOptions.enhanceGraphiql ||
                postgraphileOptions.live ||
                postgraphileOptions.subscriptions
                  ? ""
                  : ` (enhance with '--enhance-graphiql')`),
            `Postgres connection: ${chalk.underline.magenta(
              safeConnectionString,
            )}${postgraphileOptions.watchPg ? " (watching)" : ""}`,
            `Postgres schema(s):  ${schemas
              .map(schema => chalk.magenta(schema))
              .join(", ")}`,
            `Documentation:       ${chalk.underline(
              `https://graphile.org/postgraphile/introduction/`,
            )}`,
            extractedPlugins.length === 0
              ? `Join ${chalk.bold(
                  sponsor,
                )} in supporting PostGraphile development: ${chalk.underline.bold.blue(
                  `https://graphile.org/sponsor/`,
                )}`
              : null,
          ],
          {
            options: postgraphileOptions,
            middleware,
            port: actualPort,
            chalk,
          },
        ).filter(isString);
        console.log(information.map(msg => `  ‣ ${msg}`).join("\n"));

        console.log("");
        console.log(chalk.gray("* * *"));
      } else {
        console.log(
          `PostGraphile ${versionString} ${self} listening on port ${chalk.underline(
            actualPort.toString(),
          )} 🚀`,
        );
      }
      console.log("");
    });
  }
}
/* eslint-enable */
