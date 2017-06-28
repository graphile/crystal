const debug = require("debug")("graphql-build-pg");
const queryFromResolveData = require("../queryFromResolveData");
const nullableIf = (condition, Type) =>
  condition ? Type : new GraphQLNonNull(Type);
const { GraphQLNonNull } = require("graphql");

module.exports = function PgBackwardRelationPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        extend,
        getTypeByName,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        parseResolveInfo,
      },
      {
        scope: { isPgRowType, pgIntrospection: foreignTable },
        buildFieldWithHooks,
      }
    ) => {
      if (!isPgRowType || !foreignTable || foreignTable.kind !== "class") {
        return fields;
      }
      // This is a relation in which WE are foreign
      const foreignKeyConstraints = introspectionResultsByKind.constraint
        .filter(con => ["f"].includes(con.type))
        .filter(con => con.foreignClassId === foreignTable.id);
      const foreignAttributes = introspectionResultsByKind.attribute
        .filter(attr => attr.classId === foreignTable.id)
        .sort((a, b) => a.num - b.num);

      return extend(
        fields,
        foreignKeyConstraints.reduce((memo, constraint) => {
          const table =
            introspectionResultsByKind.classById[constraint.classId];
          const gqlTableType = getTypeByName(
            inflection.tableType(table.name, table.namespace.name)
          );
          if (!gqlTableType) {
            debug(
              `Could not determine type for table with id ${constraint.classId}`
            );
            return memo;
          }
          const foreignTable =
            introspectionResultsByKind.classById[constraint.foreignClassId];
          const gqlForeignTableType = getTypeByName(
            inflection.tableType(foreignTable.name, foreignTable.namespace.name)
          );
          if (!gqlForeignTableType) {
            debug(
              `Could not determine type for foreign table with id ${constraint.foreignClassId}`
            );
            return memo;
          }
          if (!table) {
            throw new Error(
              `Could not find the table that referenced us (constraint: ${constraint.name})`
            );
          }
          const schema = table.namespace;

          const attributes = introspectionResultsByKind.attribute.filter(
            attr => attr.classId === table.id
          );

          const keys = constraint.keyAttributeNums.map(
            num => attributes.filter(attr => attr.num === num)[0]
          );
          const foreignKeys = constraint.foreignKeyAttributeNums.map(
            num => foreignAttributes.filter(attr => attr.num === num)[0]
          );
          if (!keys.every(_ => _) || !foreignKeys.every(_ => _)) {
            throw new Error("Could not find key columns!");
          }

          const simpleKeys = keys.map(k => ({
            column: k.name,
            table: k.class.name,
            schema: k.class.namespace.name,
          }));
          const fieldName = inflection.manyRelationByKeys(
            simpleKeys,
            table.name,
            table.namespace.name
          );
          const primaryKeyConstraint = introspectionResultsByKind.constraint
            .filter(con => con.classId === table.id)
            .filter(con => ["p"].includes(con.type))[0];
          const primaryKeys =
            primaryKeyConstraint &&
            primaryKeyConstraint.keyAttributeNums.map(
              num => attributes.filter(attr => attr.num === num)[0]
            );

          memo[fieldName] = buildFieldWithHooks(
            fieldName,
            ({ getDataFromParsedResolveInfoFragment, addDataGenerator }) => {
              addDataGenerator(parsedResolveInfoFragment => {
                return {
                  pgQuery: queryBuilder => {
                    queryBuilder.select(() => {
                      const resolveData = getDataFromParsedResolveInfoFragment(
                        parsedResolveInfoFragment
                      );
                      const tableAlias = sql.identifier(Symbol());
                      const foreignTableAlias = queryBuilder.getTableAlias();
                      const query = queryFromResolveData(
                        sql.identifier(schema.name, table.name),
                        tableAlias,
                        resolveData,
                        { asJsonAggregate: true },
                        innerQueryBuilder => {
                          if (primaryKeys) {
                            innerQueryBuilder.beforeFinalize(() => {
                              // append order by primary key to the list of orders
                              primaryKeys.forEach(key => {
                                innerQueryBuilder.orderBy(
                                  sql.fragment`${innerQueryBuilder.getTableAlias()}.${sql.identifier(
                                    key.name
                                  )}`,
                                  true
                                );
                              });
                            });
                          }

                          keys.forEach((key, i) => {
                            innerQueryBuilder.where(
                              sql.fragment`${tableAlias}.${sql.identifier(
                                key.name
                              )} = ${foreignTableAlias}.${sql.identifier(
                                foreignKeys[i].name
                              )}`
                            );
                          });
                        }
                      );
                      return sql.fragment`(${query})`;
                    }, parsedResolveInfoFragment.alias);
                  },
                };
              });
              const ConnectionType = getTypeByName(
                inflection.connection(gqlTableType.name)
              );
              return {
                type: new GraphQLNonNull(ConnectionType),
                args: {},
                resolve: (data, _args, _context, resolveInfo) => {
                  const { alias } = parseResolveInfo(resolveInfo, {
                    deep: false,
                  });
                  return data[alias];
                },
              };
            },
            {
              isPgConnectionField: true,
              pgIntrospection: table,
            }
          );
          return memo;
        }, {})
      );
    }
  );
};
