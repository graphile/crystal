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
            attr => attr.classId === constraint.classId
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
                      const tableAlias = Symbol();
                      const foreignTableAlias = queryBuilder.getTableAlias();
                      const query = queryFromResolveData(
                        sql.identifier(schema.name, table.name),
                        tableAlias,
                        resolveData,
                        { asJsonAggregate: true },
                        innerQueryBuilder => {
                          keys.forEach((key, i) => {
                            innerQueryBuilder.where(
                              sql.fragment`${sql.identifier(
                                tableAlias,
                                key.name
                              )} = ${sql.identifier(
                                foreignTableAlias,
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
                type: nullableIf(
                  !keys.every(key => key.isNotNull),
                  ConnectionType
                ),
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
              pgIntrospection: foreignTable,
            }
          );
          return memo;
        }, {})
      );
    }
  );
};
