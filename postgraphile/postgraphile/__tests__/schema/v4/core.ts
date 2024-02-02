import type { PromiseOrDirect } from "grafast";
import type { GraphQLSchema } from "grafast/graphql";
import { lexicographicSortSchema, printSchema } from "grafast/graphql";
import { makeSchema } from "graphile-build";
import { exportSchemaAsString } from "graphile-export";
import type { PoolClient } from "pg";

import AmberPreset from "../../../src/presets/amber.js";
import type { V4Options } from "../../../src/presets/v4.js";
import { makeV4Preset } from "../../../src/presets/v4.js";
import { snapshot, withPoolClientTransaction } from "../../helpers.js";

let countByPath = Object.create(null);

export const test =
  (
    testPath: string,
    schemata: string | string[],
    options: V4Options = {},
    setup?: string | ((pgClient: PoolClient) => PromiseOrDirect<unknown>),
    finalCheck?: (schema: GraphQLSchema) => PromiseOrDirect<unknown>,
    sort = true,
    additionalPreset: GraphileConfig.Preset = {},
  ) =>
  () =>
    withPoolClientTransaction(async (client) => {
      if (setup) {
        if (typeof setup === "function") {
          await setup(client);
        } else {
          await client.query(setup);
        }
      }
      const v4Preset = makeV4Preset(options);
      const schemas = Array.isArray(schemata) ? schemata : [schemata];
      const graphileBuildOptions = {};
      const preset: GraphileConfig.Preset = {
        extends: [AmberPreset, v4Preset, additionalPreset],
        pgServices: [
          {
            adaptor: "@dataplan/pg/adaptors/pg",
            name: "main",
            withPgClientKey: "withPgClient",
            pgSettingsKey: "pgSettings",
            pgSettingsForIntrospection:
              options.ignoreRBAC == false
                ? {
                    role: "postgraphile_test_authenticator",
                  }
                : null,
            pgSettings:
              options.ignoreRBAC === false
                ? () => ({
                    role: "postgraphile_test_visitor",
                    "jwt.claims.user_id": "3",
                  })
                : undefined,
            schemas: schemas,
            adaptorSettings: {
              poolClient: client,
            },
          } as any, //GraphileConfig.PgServiceConfiguration<"@dataplan/pg/adaptors/pg">,
        ],
        schema: {
          ...graphileBuildOptions,
        },
      };
      const { schema, resolvedPreset: _resolvedPreset } =
        await makeSchema(preset);
      const i = testPath in countByPath ? countByPath[testPath] + 1 : 1;
      countByPath[testPath] = i;
      const sorted = sort ? lexicographicSortSchema(schema) : schema;
      const printed = printSchema(sorted);
      const filePath = `${testPath.replace(/\.test\.[jt]s$/, "")}${
        sort || i > 1 ? `.${i}` : ""
      }.graphql`;
      await snapshot(printed + "\n", filePath);
      if (finalCheck) {
        await finalCheck(schema);
      }
      // Now check the schema exports
      const { code: exportString } = await exportSchemaAsString(schema, {
        mode: "typeDefs",
        prettier: true,
      });
      const executableSchemaPath = `${testPath.replace(/\.test\.[jt]s$/, "")}${
        sort || i > 1 ? `.${i}` : ""
      }.export.mjs`;
      await snapshot(exportString.trim() + "\n", executableSchemaPath);
      // And finally check that we can load the schema
      const { schema: schema2 } = await import(executableSchemaPath);
      const sorted2 = sort ? lexicographicSortSchema(schema2) : schema2;
      const printed2 = printSchema(sorted2);
      expect(printed2).toEqual(printed);
    });
