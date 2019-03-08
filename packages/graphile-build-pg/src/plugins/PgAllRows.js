// @flow

import type { Plugin } from "graphile-build";
import debugSql from "./debugSql";

export default (async function PgAllRows(
  builder,
  { pgViewUniqueKey, pgSimpleCollections, subscriptions }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        parseResolveInfo,
        extend,
        getTypeByName,
        pgGetGqlTypeByTypeIdAndModifier,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        inflection,
        graphql: { GraphQLList, GraphQLNonNull },
        pgQueryFromResolveData: queryFromResolveData,
        pgAddStartEndCursor: addStartEndCursor,
        pgOmit: omit,
      } = build;
      const {
        fieldWithHooks,
        scope: { isRootQuery },
      } = context;
      if (!isRootQuery) {
        return fields;
      }
      return extend(
        fields,
        introspectionResultsByKind.class.reduce((memo, table) => {
          // PERFORMANCE: These used to be .filter(...) calls
          if (!table.isSelectable) return memo;
          if (!table.namespace) return memo;
          if (omit(table, "all")) return memo;

          const TableType = pgGetGqlTypeByTypeIdAndModifier(
            table.type.id,
            null
          );
          if (!TableType) {
            return memo;
          }
          const tableTypeName = TableType.name;
          const ConnectionType = getTypeByName(
            inflection.connection(TableType.name)
          );
          if (!TableType) {
            throw new Error(
              `Could not find GraphQL type for table '${table.name}'`
            );
          }
          const attributes = table.attributes;
          const primaryKeyConstraint = table.primaryKeyConstraint;
          const primaryKeys =
            primaryKeyConstraint && primaryKeyConstraint.keyAttributes;
          const isView = t => t.classKind === "v";
          const viewUniqueKey = table.tags.uniqueKey || pgViewUniqueKey;
          const uniqueIdAttribute = viewUniqueKey
            ? attributes.find(attr => attr.name === viewUniqueKey)
            : undefined;
          if (isView && table.tags.uniqueKey && !uniqueIdAttribute) {
            throw new Error(
              `Could not find the named unique key '${
                table.tags.uniqueKey
              }' on view '${table.namespaceName}.${table.name}'`
            );
          }
          if (!ConnectionType) {
            throw new Error(
              `Could not find GraphQL connection type for table '${table.name}'`
            );
          }
          const schema = table.namespace;
          const sqlFullTableName = sql.identifier(schema.name, table.name);
          function makeField(isConnection) {
            const fieldName = isConnection
              ? inflection.allRows(table)
              : inflection.allRowsSimple(table);
            memo[fieldName] = fieldWithHooks(
              fieldName,
              ({ getDataFromParsedResolveInfoFragment }) => {
                return {
                  description: isConnection
                    ? `Reads and enables pagination through a set of \`${tableTypeName}\`.`
                    : `Reads a set of \`${tableTypeName}\`.`,
                  type: isConnection
                    ? ConnectionType
                    : new GraphQLList(new GraphQLNonNull(TableType)),
                  args: {},
                  async resolve(parent, args, resolveContext, resolveInfo) {
                    const { pgClient } = resolveContext;
                    const parsedResolveInfoFragment = parseResolveInfo(
                      resolveInfo
                    );
                    parsedResolveInfoFragment.args = args; // Allow overriding via makeWrapResolversPlugin
                    const resolveData = getDataFromParsedResolveInfoFragment(
                      parsedResolveInfoFragment,
                      resolveInfo.returnType
                    );
                    let checkerGenerator;
                    const query = queryFromResolveData(
                      sqlFullTableName,
                      undefined,
                      resolveData,
                      {
                        useAsterisk: table.canUseAsterisk,
                        withPaginationAsFields: isConnection,
                      },
                      queryBuilder => {
                        if (subscriptions) {
                          queryBuilder.makeLiveCollection(
                            table,
                            _checkerGenerator => {
                              checkerGenerator = _checkerGenerator;
                            }
                          );
                        }
                        if (primaryKeys) {
                          if (subscriptions) {
                            queryBuilder.selectIdentifiers(table);
                          }
                          queryBuilder.beforeLock("orderBy", () => {
                            if (!queryBuilder.isOrderUnique(false)) {
                              // Order by PK if no order specified
                              queryBuilder.data.cursorPrefix = [
                                "primary_key_asc",
                              ];
                              primaryKeys.forEach(key => {
                                queryBuilder.orderBy(
                                  sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                                    key.name
                                  )}`,
                                  true
                                );
                              });
                              queryBuilder.setOrderIsUnique();
                            }
                          });
                        } else if (isView(table) && !!uniqueIdAttribute) {
                          queryBuilder.beforeLock("orderBy", () => {
                            if (!queryBuilder.isOrderUnique(false)) {
                              queryBuilder.data.cursorPrefix = [
                                "view_unique_key_asc",
                              ];
                              queryBuilder.orderBy(
                                sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                                  uniqueIdAttribute.name
                                )}`,
                                true
                              );
                              queryBuilder.setOrderIsUnique();
                            }
                          });
                        }
                      },
                      resolveContext
                    );
                    const { text, values } = sql.compile(query);
                    if (debugSql.enabled) debugSql(text);
                    const result = await pgClient.query(text, values);

                    if (
                      subscriptions &&
                      resolveContext.liveCollection &&
                      checkerGenerator
                    ) {
                      const checker = checkerGenerator();
                      resolveContext.liveCollection("pg", table, checker);
                    }

                    if (isConnection) {
                      const {
                        rows: [row],
                      } = result;
                      return addStartEndCursor(row);
                    } else {
                      if (primaryKeys && resolveContext.liveRecord) {
                        result.rows.forEach(
                          row =>
                            row &&
                            resolveContext.liveRecord(
                              "pg",
                              table,
                              row.__identifiers
                            )
                        );
                      }
                      return result.rows;
                    }
                  },
                };
              },
              {
                isPgFieldConnection: isConnection,
                isPgFieldSimpleCollection: !isConnection,
                pgFieldIntrospection: table,
              }
            );
          }
          const simpleCollections =
            table.tags.simpleCollections || pgSimpleCollections;
          const hasConnections = simpleCollections !== "only";
          const hasSimpleCollections =
            simpleCollections === "only" || simpleCollections === "both";
          if (TableType && ConnectionType && hasConnections) {
            makeField(true);
          }
          if (TableType && hasSimpleCollections) {
            makeField(false);
          }
          return memo;
        }, {}),
        `Adding 'all*' relations to root Query`
      );
    },
    ["PgAllRows"],
    [],
    ["PgTables"]
  );
}: Plugin);
