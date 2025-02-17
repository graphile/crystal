import type { PgCondition } from "@dataplan/pg";
import { sqlValueWithCodec } from "@dataplan/pg";
import type { GrafastInputFieldConfig } from "grafast";
import type { SQL, sql } from "pg-sql2";

import { EXPORTABLE } from "./exportable.js";

export function makeAddPgTableConditionPlugin(
  match: { serviceName?: string; schemaName: string; tableName: string },
  conditionFieldName: string,
  conditionFieldSpecGenerator: (
    build: GraphileBuild.Build,
  ) => GrafastInputFieldConfig,
  conditionGenerator?: (
    value: unknown,
    helpers: {
      $condition: PgCondition;
      sql: typeof sql;
      sqlTableAlias: SQL;
      build: GraphileBuild.Build;
      sqlValueWithCodec: typeof sqlValueWithCodec;
    },
  ) => SQL | null | undefined,
): GraphileConfig.Plugin {
  const { serviceName = "main", schemaName, tableName } = match;
  const displayName = `makeAddPgTableConditionPlugin__${schemaName}__${tableName}__${conditionFieldName}`;
  const plugin: GraphileConfig.Plugin = {
    name: displayName,
    version: "0.0.0",
    // Make sure we're loaded before PgConnectionArgOrderBy, otherwise
    // ordering added by conditions will be overridden by the default
    // ordering.
    before: ["PgConnectionArgOrderByPlugin"],

    schema: {
      hooks: {
        build(build) {
          const meta = (build._pluginMeta[displayName] = Object.create(null));
          meta.seen = false;
          return build;
        },
        finalize(schema, build) {
          const meta = build._pluginMeta[displayName]!;
          if (!meta.seen) {
            // eslint-disable-next-line no-console
            console.error(
              `WARNING: failed to add condition '${conditionFieldName}' to table "${schemaName}"."${tableName}"; did you get the schema/table name right?`,
            );
          }
          return schema;
        },

        GraphQLInputObjectType_fields(fields, build, context) {
          const { sql } = build;
          const {
            scope: { isPgCondition, pgCodec: table },
            fieldWithHooks,
          } = context;
          if (
            !isPgCondition ||
            !table ||
            !table.attributes ||
            table.extensions?.pg?.serviceName !== serviceName ||
            table.extensions?.pg?.schemaName !== schemaName ||
            table.extensions?.pg?.name !== tableName
          ) {
            return fields;
          }
          const conditionFieldSpec = conditionFieldSpecGenerator(build);
          if (
            conditionFieldSpec.apply ||
            conditionFieldSpec.extensions?.grafast?.apply
          ) {
            if (conditionGenerator) {
              throw new Error(
                `${displayName}: You supplied 'apply' for your field spec, so you cannot also supply a 'conditionGenerator'`,
              );
            }
            // Done.
          } else {
            if (!conditionGenerator) {
              throw new Error(
                `${displayName}: You have not supplied 'applyPlan' for your field spec, nor a 'conditionGenerator', so we don't know what to do with this condition`,
              );
            }
            // build applyPlan
            conditionFieldSpec.apply = EXPORTABLE(
              (build, conditionGenerator, sql, sqlValueWithCodec) => function applyPlan($condition: PgCondition, val) {
                  const expression = conditionGenerator!(val, {
                    $condition,
                    sql,
                    sqlTableAlias: $condition.alias,
                    build,
                    sqlValueWithCodec,
                  });
                  if (expression) {
                    $condition.where(expression);
                  }
                },
              [build, conditionGenerator, sql, sqlValueWithCodec],
            );
          }
          const meta = build._pluginMeta[displayName]!;
          meta.seen = true;
          return build.extend(
            fields,
            {
              [conditionFieldName]: fieldWithHooks(
                {
                  fieldName: conditionFieldName,
                },
                conditionFieldSpec,
              ),
            },
            `Adding condition from ${displayName}`,
          );
        },
      },
    },
  };
  return plugin;
}
