const queryFromResolveData = require("../queryFromResolveData");
const { GraphQLNonNull } = require("graphql");
module.exports = async function PgRowByUniqueConstraint(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        extend,
        parseResolveInfo,
        getTypeByName,
        gql2pg,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        pgGqlInputTypeByTypeId: gqlInputTypeByTypeId,
      },
      { scope: { isRootQuery }, buildFieldWithHooks }
    ) => {
      if (!isRootQuery) {
        return fields;
      }
      return extend(
        fields,
        introspectionResultsByKind.class.reduce((memo, table) => {
          const TableType = getTypeByName(
            inflection.tableType(table.name, table.namespace.name)
          );
          const sqlFullTableName = sql.identifier(
            table.namespace.name,
            table.name
          );
          if (TableType) {
            const uniqueConstraints = introspectionResultsByKind.constraint
              .filter(con => con.classId === table.id)
              .filter(con => ["u", "p"].includes(con.type));
            const attributes = introspectionResultsByKind.attribute
              .filter(attr => attr.classId === table.id)
              .sort((a, b) => a.num - b.num);
            uniqueConstraints.forEach(constraint => {
              const keys = constraint.keyAttributeNums.map(
                num => attributes.filter(attr => attr.num === num)[0]
              );
              if (!keys.every(_ => _)) {
                throw new Error(
                  "Consistency error: could not find an attribute!"
                );
              }
              const simpleKeys = keys.map(k => ({
                column: k.name,
                table: k.class.name,
                schema: k.class.namespace.name,
              }));
              const fieldName = inflection.singleRelationByKeys(
                simpleKeys,
                table.name,
                table.namespace.name
              );
              memo[
                fieldName
              ] = buildFieldWithHooks(
                fieldName,
                ({ getDataFromParsedResolveInfoFragment }) => {
                  return {
                    type: TableType,
                    args: keys.reduce((memo, key) => {
                      memo[
                        inflection.column(
                          key.name,
                          key.class.name,
                          key.class.namespace.name
                        )
                      ] = {
                        type: new GraphQLNonNull(
                          gqlInputTypeByTypeId[key.typeId]
                        ),
                      };
                      return memo;
                    }, {}),
                    async resolve(parent, args, { pgClient }, resolveInfo) {
                      const parsedResolveInfoFragment = parseResolveInfo(
                        resolveInfo
                      );
                      const resolveData = getDataFromParsedResolveInfoFragment(
                        parsedResolveInfoFragment
                      );
                      const query = queryFromResolveData(
                        sqlFullTableName,
                        Symbol(),
                        resolveData,
                        {},
                        builder => {
                          keys.forEach(key => {
                            builder.where(
                              sql.fragment`${sql.identifier(
                                builder.getTableAlias(),
                                key.name
                              )} = ${sql.value(
                                gql2pg(
                                  args[
                                    inflection.column(
                                      key.name,
                                      key.class.name,
                                      key.class.namespace.name
                                    )
                                  ],
                                  key.type
                                )
                              )}`
                            );
                          });
                        }
                      );
                      const { text, values } = sql.compile(query);
                      console.log(require("sql-formatter").format(text));
                      const { rows: [row] } = await pgClient.query(
                        text,
                        values
                      );
                      return row;
                    },
                  };
                }
              );
            });
          }
          return memo;
        }, {})
      );
    }
  );
};
