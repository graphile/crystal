// BELOW HERE, IMPORTS ARE ONLY TYPES (not values)
import "graphile-build";
import { SQL, sql as sqlType, QueryBuilder } from "graphile-build-pg";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLInputObjectTypeFieldsField {
      addPgTableCondition?: {
        schemaName: string;
        tableName: string;
        conditionFieldSpec: import("graphql").GraphQLInputFieldConfig;
        conditionFieldName: string;
      };
    }
  }
}

export default function makeAddPgTableConditionPlugin(
  schemaName: string,
  tableName: string,
  conditionFieldName: string,
  conditionFieldSpecGenerator: (
    build: GraphileEngine.Build,
  ) => import("graphql").GraphQLInputFieldConfig,
  conditionGenerator: (
    value: unknown,
    helpers: {
      queryBuilder: QueryBuilder;
      sql: typeof sqlType;
      sqlTableAlias: SQL;
    },
    build: GraphileEngine.Build,
  ) => SQL | null | void,
) {
  const displayName = `makeAddPgTableConditionPlugin__${schemaName}__${tableName}__${conditionFieldName}`;
  const plugin: GraphileEngine.Plugin = (builder) => {
    const instance = Symbol(displayName);
    builder.hook("build", function trackSeen(build) {
      if (!build._pluginMeta) {
        // eslint-disable-next-line no-param-reassign
        build._pluginMeta = {};
      }
      // eslint-disable-next-line no-param-reassign
      build._pluginMeta[instance] = {
        seen: false,
      };
      return build;
    });
    builder.hook("finalize", function checkSeen(schema, build) {
      const meta = build._pluginMeta[instance];
      if (!meta.seen) {
        // eslint-disable-next-line no-console
        console.error(
          `WARNING: failed to add condition '${conditionFieldName}' to table "${schemaName}"."${tableName}"; did you get the schema/table name right?`,
        );
      }
      return schema;
    });

    builder.hook(
      "GraphQLInputObjectType:fields",
      function addConditionInputField(fields, build, context) {
        const {
          scope: { isPgCondition, pgIntrospection: table },
          fieldWithHooks,
        } = context;
        if (
          !isPgCondition ||
          !table ||
          table.kind !== "class" ||
          table.namespaceName !== schemaName ||
          table.name !== tableName
        ) {
          return fields;
        }
        const conditionFieldSpec = conditionFieldSpecGenerator(build);
        const meta = build._pluginMeta[instance];
        meta.seen = true;
        return build.extend(
          fields,
          {
            [conditionFieldName]: fieldWithHooks(
              conditionFieldName,
              conditionFieldSpec,
              {
                addPgTableCondition: {
                  schemaName,
                  tableName,
                  conditionFieldSpec,
                  conditionFieldName,
                },
              },
            ),
          },
          `Adding '${conditionFieldName}' condition to '${table.name}'`,
        );
      },
    );
    builder.hook(
      "GraphQLObjectType:fields:field:args",
      function addSqlWhereClause(args, build, context) {
        const { pgSql: sql } = build;
        const {
          scope: {
            isPgFieldConnection,
            isPgFieldSimpleCollection,
            pgFieldIntrospection: procOrTable,
            pgFieldIntrospectionTable: tableIfProc,
          },
          addArgDataGenerator,
        } = context;
        const table = tableIfProc || procOrTable;
        if (
          (!isPgFieldConnection && !isPgFieldSimpleCollection) ||
          !table ||
          table.kind !== "class" ||
          table.namespaceName !== schemaName ||
          table.name !== tableName
        ) {
          return args;
        }

        addArgDataGenerator(function conditionSQLBuilder({
          condition,
        }: {
          condition: { [key: string]: any } | null;
        }) {
          if (!condition || !(conditionFieldName in condition)) {
            return {};
          }
          const { [conditionFieldName]: conditionValue } = condition;
          return {
            pgQuery: (queryBuilder: QueryBuilder) => {
              const sqlCondition = conditionGenerator(
                conditionValue,
                {
                  queryBuilder,
                  sql,
                  sqlTableAlias: queryBuilder.getTableAlias(),
                },
                build,
              );
              if (sqlCondition) {
                queryBuilder.where(sqlCondition);
              }
            },
          };
        });

        return args;
      },
    );
  };
  plugin.displayName = displayName;
  return plugin;
}
