const debug = require("debug")("graphql-build-pg");
const queryFromResolveData = require("../queryFromResolveData");
const { GraphQLNonNull } = require("graphql");
const nullableIf = (condition, Type) =>
  condition ? Type : new GraphQLNonNull(Type);

module.exports = function PgForwardRelationPlugin(
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
        parseResolveInfo,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
      },
      { scope: { isPgRowType, pgIntrospection: table }, buildFieldWithHooks }
    ) => {
      if (!isPgRowType || !table || table.kind !== "class") {
        return fields;
      }
      // This is a relation in which we (table) are local, and there's a foreign table

      const foreignKeyConstraints = introspectionResultsByKind.constraint
        .filter(con => ["f"].includes(con.type))
        .filter(con => con.classId === table.id);
      const attributes = introspectionResultsByKind.attribute
        .filter(attr => attr.classId === table.id)
        .sort((a, b) => a.num - b.num);

      return extend(
        fields,
        foreignKeyConstraints.reduce((memo, constraint) => {
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
          if (!foreignTable) {
            throw new Error(
              `Could not find the foreign table (constraint: ${constraint.name})`
            );
          }
          const foreignSchema = introspectionResultsByKind.namespace.filter(
            n => n.id === foreignTable.namespaceId
          )[0];
          const foreignAttributes = introspectionResultsByKind.attribute
            .filter(attr => attr.classId === constraint.foreignClassId)
            .sort((a, b) => a.num - b.num);

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
          const fieldName = inflection.singleRelationByKeys(
            simpleKeys,
            foreignTable.name,
            foreignTable.namespace.name
          );

          memo[
            fieldName
          ] = buildFieldWithHooks(
            fieldName,
            ({ getDataFromParsedResolveInfoFragment, addDataGenerator }) => {
              addDataGenerator(parsedResolveInfoFragment => {
                return {
                  pgQuery: queryBuilder => {
                    queryBuilder.select(() => {
                      const resolveData = getDataFromParsedResolveInfoFragment(
                        parsedResolveInfoFragment,
                        gqlForeignTableType
                      );
                      const foreignTableAlias = sql.identifier(Symbol());
                      const query = queryFromResolveData(
                        sql.identifier(foreignSchema.name, foreignTable.name),
                        foreignTableAlias,
                        resolveData,
                        { asJson: true },
                        innerQueryBuilder => {
                          keys.forEach((key, i) => {
                            innerQueryBuilder.where(
                              sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
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
              return {
                type: nullableIf(
                  !keys.every(key => key.isNotNull),
                  gqlForeignTableType
                ),
                resolve: (data, _args, _context, resolveInfo) => {
                  const { alias } = parseResolveInfo(resolveInfo, {
                    deep: false,
                  });
                  return data[alias];
                },
              };
            }
          );
          return memo;
        }, {})
      );
    }
  );
};
