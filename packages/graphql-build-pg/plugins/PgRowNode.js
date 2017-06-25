const queryFromResolveData = require("../queryFromResolveData");
const { GraphQLNonNull, GraphQLID } = require("graphql");
const base64Decode = str => Buffer.from(String(str), "base64").toString("utf8");

module.exports = async function PgRowByUniqueConstraint(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        nodeIdFieldName,
        extend,
        parseResolveInfo,
        getTypeByName,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        pgGqlInputTypeByTypeId: gqlInputTypeByTypeId,
      },
      { scope: { isRootQuery }, buildFieldWithHooks }
    ) => {
      if (!isRootQuery || !nodeIdFieldName) {
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
            const attributes = introspectionResultsByKind.attribute.filter(
              attr => attr.classId === table.id
            );
            const primaryKeyConstraint = introspectionResultsByKind.constraint
              .filter(con => con.classId === table.id)
              .filter(con => ["p"].includes(con.type))[0];
            if (!primaryKeyConstraint) {
              return memo;
            }
            const primaryKeys =
              primaryKeyConstraint &&
              primaryKeyConstraint.keyAttributeNums.map(
                num => attributes.filter(attr => attr.num === num)[0]
              );
            const fieldName = inflection.tableNode(
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
                  args: {
                    [nodeIdFieldName]: {
                      type: new GraphQLNonNull(GraphQLID),
                    },
                  },
                  async resolve(parent, args, { pgClient }, resolveInfo) {
                    const nodeId = args[nodeIdFieldName];
                    try {
                      const [typeName, ...identifiers] = JSON.parse(
                        base64Decode(nodeId)
                      );
                      if (typeName !== TableType.name) {
                        throw new Error("Mismatched type");
                      }
                      if (identifiers.length !== primaryKeys.length) {
                        throw new Error("Invalid ID");
                      }

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
                          primaryKeys.forEach((key, idx) => {
                            builder.where(
                              sql.fragment`${sql.identifier(
                                builder.getTableAlias(),
                                key.name
                              )} = ${sql.value(identifiers[idx])}`
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
                    } catch (e) {
                      return null;
                    }
                  },
                };
              }
            );
          }
          return memo;
        }, {})
      );
    }
  );
};
