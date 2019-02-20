// @flow
import type { Plugin } from "graphile-build";
import debugSql from "./debugSql";

export default (async function PgRowByUniqueConstraint(
  builder,
  { subscriptions }
) {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
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

        const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
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
            memo[fieldName] = fieldWithHooks(
              fieldName,
              ({ getDataFromParsedResolveInfoFragment }) => {
                return {
                  type: TableType,
                  args: keys.reduce((memo, key) => {
                    const InputType = pgGetGqlInputTypeByTypeIdAndModifier(
                      key.typeId,
                      key.typeModifier
                    );
                    if (!InputType) {
                      throw new Error(
                        `Could not find input type for key '${
                          key.name
                        }' on type '${TableType.name}'`
                      );
                    }
                    memo[inflection.column(key)] = {
                      type: new GraphQLNonNull(InputType),
                    };
                    return memo;
                  }, {}),
                  async resolve(parent, args, resolveContext, resolveInfo) {
                    const { pgClient, liveRecord } = resolveContext;
                    const parsedResolveInfoFragment = parseResolveInfo(
                      resolveInfo
                    );
                    const resolveData = getDataFromParsedResolveInfoFragment(
                      parsedResolveInfoFragment,
                      TableType
                    );
                    const query = queryFromResolveData(
                      sqlFullTableName,
                      undefined,
                      resolveData,
                      {},
                      queryBuilder => {
                        if (subscriptions && table.primaryKeyConstraint) {
                          queryBuilder.selectIdentifiers(table);
                        }
                        keys.forEach(key => {
                          queryBuilder.where(
                            sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                              key.name
                            )} = ${gql2pg(
                              args[inflection.column(key)],
                              key.type,
                              key.typeModifier
                            )}`
                          );
                        });
                      },
                      resolveContext
                    );
                    const { text, values } = sql.compile(query);
                    if (debugSql.enabled) debugSql(text);
                    const {
                      rows: [row],
                    } = await pgClient.query(text, values);
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
  });
}: Plugin);
