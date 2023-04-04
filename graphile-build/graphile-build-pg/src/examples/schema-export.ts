/* eslint-disable no-restricted-syntax */

/*
 * This script demonstrates how to export your executable GraphQL schema to a file;
 * later you would just `import { schema } from 'path/to/file';` to pull it back in.
 */

import { buildInflection, buildSchema, gather } from "graphile-build";
import { resolvePresets } from "graphile-config";
import { exportSchema } from "graphile-export";
import * as jsonwebtoken from "jsonwebtoken";

import { getPool, makeSharedPresetAndClient } from "./config.js";

const pool = getPool();

async function main() {
  // Get our preset (common across examples)
  const { preset } = await makeSharedPresetAndClient(pool);

  // ---------------------------------------------------------------------------
  // Resolve the preset(s)

  /** Our final resolved preset; containing all plugins and configs */
  const config = resolvePresets([preset]);

  // ---------------------------------------------------------------------------
  // Perform the "inflection" phase

  /** Shared data used across other phases. Mostly inflection at this point */
  const shared = { inflection: buildInflection(config) };

  // ---------------------------------------------------------------------------
  // Perform the "data gathering" phase

  /** The result of the gather phase, ready to feed into 'buildSchema' */
  const input = await gather(config, shared);

  // NOTE: at this point `input.pgRegistry.pgResources` contains all your
  // Postgres sources (tables, views, functions, etc).

  // ---------------------------------------------------------------------------
  // Perform the "schema build" phase

  /** Our executable GraphQL schema */
  const schema = buildSchema(config, input, shared);

  // 'schema' is now an executable GraphQL schema. You could print it with:
  // console.log(chalk.blue(printSchema(schema)));

  // ---------------------------------------------------------------------------
  // Export the GraphQL schema to an executable file

  // const exportFileLocation = new URL("../../temp.js", import.meta.url);
  const exportFileLocation = `${__dirname}/../../schema-export-output.mjs`;
  await exportSchema(schema, exportFileLocation, {
    mode: "graphql-js",
    // or:
    // mode: "typeDefs",
    modules: {
      jsonwebtoken: jsonwebtoken,
    },
  });

  console.log(`Exported GraphQL schema to ${exportFileLocation}`);
}

main()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
