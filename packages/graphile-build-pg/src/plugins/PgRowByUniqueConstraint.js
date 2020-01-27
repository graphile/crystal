// @flow
import type { Plugin } from "graphile-build";
import debugSql from "./debugSql";

export default (async function PgRowByUniqueConstraint(
  builder,
  { subscriptions }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        parseResolveInfo,
        pgGetGqlTypeByTypeIdAndModifier,
        pgGetGqlInputTypeByTypeIdAndModifier,
        gql2pg,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        graphql: { GraphQLNonNull },
        inflection,
        pgQueryFromResolveData: queryFromResolveData,
        pgOmit: omit,
        pgPrepareAndRun,
      } = build;
      const {
        scope: { isRootQuery },
        fieldWithHooks,
      } = context;

      if (!isRootQuery) {
        return fields;
      }

      return extend(
        fields,
        introspectionResultsByKind.class.reduce((memo, table) => {
          // PERFORMANCE: These used to be .filter(...) calls
          if (!table.namespace) return memo;
          if (omit(table, "read")) return memo;

          const TableType = pgGetGqlTypeByTypeIdAndModifier(
            table.type.id,
            null
          );
          const sqlFullTableName = sql.identifier(
            table.namespace.name,
            table.name
          );
          if (TableType) {
            const uniqueConstraints = table.constraints.filter(
              con => con.type === "u" || con.type === "p"
            );
            uniqueConstraints.forEach(constraint => {
              if (omit(constraint, "read")) {
                return;
              }
              const keys = constraint.keyAttributes;
              if (keys.some(key => omit(key, "read"))) {
                return;
              }
              if (!keys.every(_ => _)) {
                throw new Error(
                  "Consistency error: could not find an attribute!"
                );
              }
              const fieldName = inflection.rowByUniqueKeys(
                keys,
                table,
                constraint
              );
              const keysIncludingMeta = keys.map(key => ({
                ...key,
                sqlIdentifier: sql.identifier(key.name),
                columnName: inflection.column(key),
              }));
              // Precomputation for performance
              const queryFromResolveDataOptions = {
                useAsterisk: false, // Because it's only a single relation, no need
              };
              const queryFromResolveDataCallback = (queryBuilder, args) => {
                if (subscriptions && table.primaryKeyConstraint) {
                  queryBuilder.selectIdentifiers(table);
                }
                const sqlTableAlias = queryBuilder.getTableAlias();
                keysIncludingMeta.forEach(
                  ({ sqlIdentifier, columnName, type, typeModifier }) => {
                    queryBuilder.where(
                      sql.fragment`${sqlTableAlias}.${sqlIdentifier} = ${gql2pg(
                        args[columnName],
                        type,
                        typeModifier
                      )}`
                    );
                  }
                );
              };

              memo[fieldName] = fieldWithHooks(
                fieldName,
                ({ getDataFromParsedResolveInfoFragment }) => {
                  return {
                    type: TableType,
                    args: keysIncludingMeta.reduce(
                      (memo, { typeId, typeModifier, columnName, name }) => {
                        const InputType = pgGetGqlInputTypeByTypeIdAndModifier(
                          typeId,
                          typeModifier
                        );
                        if (!InputType) {
                          throw new Error(
                            `Could not find input type for key '${name}' on type '${TableType.name}'`
                          );
                        }
                        memo[columnName] = {
                          type: new GraphQLNonNull(InputType),
                        };
                        return memo;
                      },
                      {}
                    ),
                    async resolve(parent, args, resolveContext, resolveInfo) {
                      const { pgClient } = resolveContext;
                      const liveRecord =
                        resolveInfo.rootValue &&
                        resolveInfo.rootValue.liveRecord;
                      const parsedResolveInfoFragment = parseResolveInfo(
                        resolveInfo
                      );
                      parsedResolveInfoFragment.args = args; // Allow overriding via makeWrapResolversPlugin
                      const resolveData = getDataFromParsedResolveInfoFragment(
                        parsedResolveInfoFragment,
                        TableType
                      );
                      const query = queryFromResolveData(
                        sqlFullTableName,
                        undefined,
                        resolveData,
                        queryFromResolveDataOptions,
                        queryBuilder =>
                          queryFromResolveDataCallback(queryBuilder, args),
                        resolveContext,
                        resolveInfo.rootValue
                      );
                      const { text, values } = sql.compile(query);
                      if (debugSql.enabled) debugSql(text);
                      const {
                        rows: [row],
                      } = await pgPrepareAndRun(pgClient, text, values);
                      if (subscriptions && liveRecord && row) {
                        liveRecord("pg", table, row.__identifiers);
                      }
                      return row;
                    },
                  };
                },
                {
                  isPgRowByUniqueConstraintField: true,
                  pgFieldIntrospection: constraint,
                }
              );
            });
          }
          return memo;
        }, {}),
        `Adding "row by unique constraint" fields to root Query type`
      );
    },
    ["PgRowByUniqueConstraint"]
  );
}: Plugin);
