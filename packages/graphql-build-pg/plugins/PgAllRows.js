const { GraphQLInt, GraphQLEnumType } = require("graphql");
const queryFromResolveData = require("../queryFromResolveData");

module.exports = async function PgAllRows(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        buildObjectWithHooks,
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
        introspectionResultsByKind.class.reduce((memo, table) => {
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
          if (!ConnectionType) {
            throw new Error(
              `Could not find GraphQL connection type for table '${table.name}'`
            );
          }
          const schema = table.namespace;
          const sqlFullTableName = sql.identifier(schema.name, table.name);
          if (TableType && ConnectionType) {
            const clauses = {};
            const fieldName = inflection.allRows(table.name, schema.name);
            memo[fieldName] = buildFieldWithHooks(
              fieldName,
              ({
                addArgDataGenerator,
                getDataFromParsedResolveInfoFragment,
                parseResolveInfo,
              }) => {
                return {
                  type: ConnectionType,
                  args: {},
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
                      resolveData
                    );
                    const { text, values } = sql.compile(query);
                    console.log(text);
                    const { rows } = await pgClient.query(text, values);
                    return rows;
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
