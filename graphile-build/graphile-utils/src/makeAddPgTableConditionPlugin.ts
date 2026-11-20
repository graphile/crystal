import type {
  GetPgResourceAttributes,
  PgCondition,
  PgConditionCapableParent,
} from "@dataplan/pg";
import { sqlValueWithCodec } from "@dataplan/pg";
import type { GrafastInputFieldConfig } from "grafast";
import type { SQL, sql } from "pg-sql2";

import { EXPORTABLE } from "./exportable.ts";
import type { ScopedTableMatch, TableResource } from "./resolveTableMatch.ts";
import { resolveTableMatch } from "./resolveTableMatch.ts";

type TableCondition<
  TScope extends keyof GraphileBuild.PluginScopes,
  TMatch,
> = PgCondition<
  PgConditionCapableParent,
  keyof GetPgResourceAttributes<TableResource<TScope, TMatch>> & string
>;

type ConditionFieldConfig<TCondition, TValue> = Omit<
  GrafastInputFieldConfig<TCondition, TValue>,
  "extensions"
> & {
  extensions?: Omit<
    NonNullable<GrafastInputFieldConfig["extensions"]>,
    "grafast"
  > & {
    grafast?: Omit<Grafast.InputFieldExtensions, "apply"> &
      Pick<GrafastInputFieldConfig<TCondition, TValue>, "apply">;
  };
};

export type TableConditionArgs<
  TScope extends keyof GraphileBuild.PluginScopes,
  TValue,
  TMatch extends ScopedTableMatch<TScope>,
> = Parameters<typeof addPgTableCondition<TScope, TValue, TMatch>>;

/** Adds a condition typed to the matched table's generated resource. */
export function addPgTableCondition<
  TScope extends keyof GraphileBuild.PluginScopes = "default",
  TValue = any,
  const TMatch extends ScopedTableMatch<TScope> = ScopedTableMatch<TScope>,
>(
  match: TMatch,
  conditionFieldName: string,
  conditionFieldSpecGenerator: (
    build: GraphileBuild.ScopedBuild<TScope>,
  ) => ConditionFieldConfig<TableCondition<TScope, TMatch>, TValue>,
  // DEPRECATED! Use `apply` instead.
  conditionGenerator?: (
    value: TValue,
    helpers: {
      sql: typeof sql;
      sqlTableAlias: SQL;
      sqlValueWithCodec: typeof sqlValueWithCodec;
      // The build must be pruned before it can be exported.
      build: PrunedBuild<TScope>;
      /** @internal */
      condition: TableCondition<TScope, TMatch>;
    },
  ) => SQL | null | undefined,
): GraphileConfig.Plugin {
  const { serviceName, schemaName, tableName } = resolveTableMatch(match);
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
          const conditionFieldSpec = conditionFieldSpecGenerator(
            build as GraphileBuild.ScopedBuild<TScope>,
          );
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
            const _build = pruneBuild(
              build as GraphileBuild.ScopedBuild<TScope>,
            );
            conditionFieldSpec.apply = EXPORTABLE(
              (_build, conditionGenerator, sql, sqlValueWithCodec) =>
                function apply(condition: TableCondition<TScope, TMatch>, val) {
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

type PrunedBuild<TScope extends keyof GraphileBuild.PluginScopes> = Pick<
  GraphileBuild.ScopedBuild<TScope>,
  "sql" | "grafast" | "graphql" | "dataplanPg"
> & {
  input: Pick<GraphileBuild.ScopedBuild<TScope>["input"], "pgRegistry">;
};

function pruneBuild<TScope extends keyof GraphileBuild.PluginScopes>(
  build: GraphileBuild.ScopedBuild<TScope>,
): PrunedBuild<TScope> {
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
