import type { PgConditionStep, PgSelectStep } from "@dataplan/pg";
import type { FieldArgs, GrafastInputFieldConfig } from "grafast";
import type { SQL, sql } from "pg-sql2";

import { EXPORTABLE } from "./exportable.js";

export function makeAddPgTableConditionPlugin(
  match: { databaseName?: string; schemaName: string; tableName: string },
  conditionFieldName: string,
  conditionFieldSpecGenerator: (
    build: GraphileBuild.Build,
  ) => GrafastInputFieldConfig<any, any, any, any, any>,
  conditionGenerator?: (
    value: FieldArgs,
    helpers: {
      $condition: PgConditionStep<PgSelectStep>;
      sql: typeof sql;
      sqlTableAlias: SQL;
      build: GraphileBuild.Build;
    },
  ) => SQL | null | undefined,
): GraphileConfig.Plugin {
  const { databaseName = "main", schemaName, tableName } = match;
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
            !table.columns ||
            table.extensions?.pg?.databaseName !== databaseName ||
            table.extensions?.pg?.schemaName !== schemaName ||
            table.extensions?.pg?.name !== tableName
          ) {
            return fields;
          }
          const conditionFieldSpec = conditionFieldSpecGenerator(build);
          if (
            conditionFieldSpec.applyPlan ||
            conditionFieldSpec.extensions?.grafast?.applyPlan
          ) {
            if (conditionGenerator) {
              throw new Error(
                `${displayName}: You supplied 'applyPlan' for your field spec, so you cannot also supply a 'conditionGenerator'`,
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
            conditionFieldSpec.applyPlan = EXPORTABLE(
              (build, conditionGenerator, sql) =>
                function applyPlan(
                  $condition: PgConditionStep<PgSelectStep>,
                  val,
                ) {
                  const expression = conditionGenerator!(val, {
                    $condition,
                    sql,
                    sqlTableAlias: $condition.alias,
                    build,
                  });
                  if (expression) {
                    $condition.where(expression);
                  }
                },
              [build, conditionGenerator, sql],
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
