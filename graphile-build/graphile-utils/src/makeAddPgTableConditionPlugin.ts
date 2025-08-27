import type { PgCondition } from "@dataplan/pg";
import { sqlValueWithCodec } from "@dataplan/pg";
import type { GrafastInputFieldConfig } from "grafast";
import type { SQL, sql } from "pg-sql2";

import { EXPORTABLE } from "./exportable.js";

export function addPgTableCondition(
  match: { serviceName?: string; schemaName: string; tableName: string },
  conditionFieldName: string,
  conditionFieldSpecGenerator: (
    build: GraphileBuild.Build,
  ) => GrafastInputFieldConfig,
  // DEPRECATED! Use `apply` instead.
  conditionGenerator?: (
    value: unknown,
    helpers: {
      sql: typeof sql;
      sqlTableAlias: SQL;
      sqlValueWithCodec: typeof sqlValueWithCodec;
      // We can't afford to make the entire of build EXPORTABLE, and people
      // really ought to move to using the `apply` method, so...
      build: ReturnType<typeof pruneBuild>;
      /** @internal We might expose this in future if needed */
      condition: PgCondition;
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
            const _build = pruneBuild(build);
            conditionFieldSpec.apply = EXPORTABLE(
              (_build, conditionGenerator, sql, sqlValueWithCodec) =>
                function apply(condition: PgCondition, val) {
                  const expression = conditionGenerator!(val, {
                    sql,
                    sqlTableAlias: condition.alias,
                    sqlValueWithCodec,
                    build: _build,
                    condition,
                  });
                  if (expression) {
                    condition.where(expression);
                  }
                },
              [_build, conditionGenerator, sql, sqlValueWithCodec],
              "addPgTableCondition_generator",
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

/** @deprecated renamed to addPgTableCondition */
export const makeAddPgTableConditionPlugin = addPgTableCondition;

function pruneBuild(build: GraphileBuild.Build) {
  const {
    sql,
    grafast,
    graphql,
    dataplanPg,
    input: { pgRegistry },
  } = build;
  return EXPORTABLE(
    (dataplanPg, grafast, graphql, pgRegistry, sql) => ({
      sql,
      grafast,
      graphql,
      dataplanPg,
      input: { pgRegistry },
    }),
    [dataplanPg, grafast, graphql, pgRegistry, sql],
  );
}
