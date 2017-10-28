// @flow
import queryFromResolveData from "../queryFromResolveData";
import debugFactory from "debug";
import addStartEndCursor from "./addStartEndCursor";

import type { Plugin } from "graphile-build";

const debugSql = debugFactory("graphile-build-pg:sql");

export default (async function PgAllRows(
  builder,
  { pgInflection: inflection, pgViewUniqueKey: viewUniqueKey }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      {
        parseResolveInfo,
        extend,
        getTypeByName,
        pgGetGqlTypeByTypeId,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      },
      { fieldWithHooks, scope: { isRootQuery } }
    ) => {
      if (!isRootQuery) {
        return fields;
      }
      return extend(
        fields,
        introspectionResultsByKind.class
          .filter(table => table.isSelectable)
          .filter(table => table.namespace)
          .reduce((memo, table) => {
            const TableType = pgGetGqlTypeByTypeId(table.type.id);
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
            if (TableType && ConnectionType) {
              const fieldName = inflection.allRows(table.name, schema.name);
              memo[fieldName] = fieldWithHooks(
                fieldName,
                ({ getDataFromParsedResolveInfoFragment }) => {
                  return {
                    description: `Reads and enables pagination through a set of \`${tableTypeName}\`.`,
                    type: ConnectionType,
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
                          withPaginationAsFields: true,
                        },
                        builder => {
                          if (primaryKeys) {
                            builder.beforeLock("orderBy", () => {
                              if (!builder.isOrderUnique(false)) {
                                // Order by PK if no order specified
                                builder.data.cursorPrefix = ["primary_key_asc"];
                                primaryKeys.forEach(key => {
                                  builder.orderBy(
                                    sql.fragment`${builder.getTableAlias()}.${sql.identifier(
                                      key.name
                                    )}`,
                                    true
                                  );
                                });
                                builder.setOrderIsUnique();
                              }
                            });
                          } else if (isView(table) && !!uniqueIdAttribute) {
                            builder.beforeLock("orderBy", () => {
                              if (!builder.isOrderUnique(false)) {
                                builder.data.cursorPrefix = [
                                  "view_unique_key_asc",
                                ];
                                builder.orderBy(
                                  sql.fragment`${builder.getTableAlias()}.${sql.identifier(
                                    uniqueIdAttribute.name
                                  )}`,
                                  true
                                );
                                builder.setOrderIsUnique();
                              }
                            });
                          }
                        }
                      );
                      const { text, values } = sql.compile(query);
                      if (debugSql.enabled) debugSql(text);
                      const { rows: [row] } = await pgClient.query(
                        text,
                        values
                      );
                      return addStartEndCursor(row);
                    },
                  };
                },
                {
                  isPgConnectionField: true,
                  pgIntrospection: table,
                }
              );
            }
            return memo;
          }, {})
      );
    }
  );
}: Plugin);
