const queryFromResolveData = require("../queryFromResolveData");
const debugSql = require("debug")("graphql-build-pg:sql");

module.exports = async function PgAllRows(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        parseResolveInfo,
        extend,
        getTypeByName,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      },
      { buildFieldWithHooks, scope: { isRootQuery } }
    ) => {
      if (!isRootQuery) {
        return fields;
      }
      return extend(
        fields,
        introspectionResultsByKind.class
          .filter(table => table.isSelectable)
          .reduce((memo, table) => {
            const TableType = getTypeByName(
              inflection.tableType(table.name, table.namespace.name)
            );
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
              .filter(con => ["p"].includes(con.type))[0];
            const primaryKeys =
              primaryKeyConstraint &&
              primaryKeyConstraint.keyAttributeNums.map(
                num => attributes.filter(attr => attr.num === num)[0]
              );
            if (!ConnectionType) {
              throw new Error(
                `Could not find GraphQL connection type for table '${table.name}'`
              );
            }
            const schema = table.namespace;
            const sqlFullTableName = sql.identifier(schema.name, table.name);
            if (TableType && ConnectionType) {
              const fieldName = inflection.allRows(table.name, schema.name);
              memo[fieldName] = buildFieldWithHooks(
                fieldName,
                ({ getDataFromParsedResolveInfoFragment }) => {
                  return {
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
                        {},
                        builder => {
                          if (primaryKeys) {
                            builder.beforeFinalize(() => {
                              // append order by primary key to the list of orders
                              primaryKeys.forEach(key => {
                                builder.orderBy(
                                  sql.fragment`${builder.getTableAlias()}.${sql.identifier(
                                    key.name
                                  )}`,
                                  true
                                );
                              });
                            });
                          }
                        }
                      );
                      const { text, values } = sql.compile(query);
                      if (debugSql.enabled)
                        debugSql(require("sql-formatter").format(text));
                      const { rows } = await pgClient.query(text, values);
                      return rows || [];
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
};
