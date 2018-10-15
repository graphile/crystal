// @flow

import type { Plugin } from "graphile-build";
import debugSql from "./debugSql";

export default (async function PgAllRows(
  builder,
  { pgViewUniqueKey, pgSimpleCollections }
) {
  const hasConnections = pgSimpleCollections !== "only";
  const hasSimpleCollections =
    pgSimpleCollections === "only" || pgSimpleCollections === "both";
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
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
      introspectionResultsByKind.class
        .filter(table => table.isSelectable)
        .filter(table => table.namespace)
        .filter(table => !omit(table, "all"))
        .reduce((memo, table) => {
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
          const attributes = introspectionResultsByKind.attribute.filter(
            attr => attr.classId === table.id
          );
          const primaryKeyConstraint = introspectionResultsByKind.constraint
            .filter(con => con.classId === table.id)
            .filter(con => con.type === "p")[0];
          const primaryKeys =
            primaryKeyConstraint &&
            primaryKeyConstraint.keyAttributeNums.map(
              num => attributes.filter(attr => attr.num === num)[0]
            );
          const isView = t => t.classKind === "v";
          const viewUniqueKey = table.tags.uniqueKey || pgViewUniqueKey;
          const uniqueIdAttribute = viewUniqueKey
            ? attributes.find(attr => attr.name === viewUniqueKey)
            : undefined;
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
                  async resolve(parent, args, { pgClient }, resolveInfo) {
                    const parsedResolveInfoFragment = parseResolveInfo(
                      resolveInfo
                    );
                    const resolveData = getDataFromParsedResolveInfoFragment(
                      parsedResolveInfoFragment,
                      resolveInfo.returnType
                    );
                    const query = queryFromResolveData(
                      sqlFullTableName,
                      undefined,
                      resolveData,
                      {
                        withPaginationAsFields: isConnection,
                      },
                      queryBuilder => {
                        if (primaryKeys) {
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
                      }
                    );
                    const { text, values } = sql.compile(query);
                    if (debugSql.enabled) debugSql(text);
                    const result = await pgClient.query(text, values);
                    if (isConnection) {
                      const {
                        rows: [row],
                      } = result;
                      return addStartEndCursor(row);
                    } else {
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
  });
}: Plugin);
