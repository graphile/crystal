const { GraphQLNonNull, GraphQLList, GraphQLString } = require("graphql");
module.exports = function PgComputedColumnsPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        getTypeByName,
        extend,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        pgGqlTypeByTypeId: gqlTypeByTypeId,
      },
      { scope: { isPgRowType, pgIntrospection: table }, buildFieldWithHooks }
    ) => {
      if (!isPgRowType || !table || table.kind !== "class") {
        return fields;
      }
      const tableType = introspectionResultsByKind.type.filter(
        type =>
          type.type === "c" &&
          type.category === "C" &&
          type.namespaceId === table.namespaceId &&
          type.classId === table.id
      )[0];
      if (!tableType) {
        throw new Error("Could not determine the type for this table");
      }
      return extend(
        fields,
        introspectionResultsByKind.procedure
          .filter(proc => proc.isStable)
          .filter(proc => proc.namespaceId === table.namespaceId)
          .filter(proc => proc.name.startsWith(`${table.name}_`))
          .filter(proc => proc.argTypeIds.length > 0)
          .filter(proc => proc.argTypeIds[0] === tableType.id)
          .reduce((memo, proc) => {
            /*
            proc =
              { kind: 'procedure',
                name: 'integration_webhook_secret',
                description: null,
                namespaceId: '6484381',
                isStrict: false,
                returnsSet: false,
                isStable: true,
                returnTypeId: '2950',
                argTypeIds: [ '6484569' ],
                argNames: [ 'integration' ],
                argDefaultsNum: 0 }
            */

            // XXX: add args!

            const pseudoColumnName = proc.name.substr(table.name.length + 1);
            const fieldName = inflection.column(
              pseudoColumnName,
              table.name,
              table.namespace.name
            );
            const schema = table.namespace;

            const returnType =
              introspectionResultsByKind.typeById[proc.returnTypeId];
            const returnTypeTable =
              introspectionResultsByKind.classById[returnType.classId];
            if (!returnType) {
              throw new Error(
                `Could not determine return type for function '${proc.name}'`
              );
            }

            memo[
              fieldName
            ] = buildFieldWithHooks(
              fieldName,
              ({ addDataGenerator, getDataFromParsedResolveInfoFragment }) => {
                addDataGenerator(() => {
                  return {
                    pgQuery: queryBuilder => {
                      queryBuilder.select(() => {
                        const resolveData = getDataFromParsedResolveInfoFragment(
                          parsedResolveInfoFragment
                        );
                        const functionAlias = Symbol();
                        const parentTableAlias = queryBuilder.getTableAlias();
                        // XXX: add args
                        const query = queryFromResolveData(
                          sql.fragment`${sql.identifier(
                            proc.namespace.name,
                            proc.name
                          )}(${sql.identifier(parentTableAlias)})`,
                          functionAlias,
                          resolveData,
                          { asJsonAggregate: true },
                          innerQueryBuilder => {
                            if (primaryKeys) {
                              innerQueryBuilder.beforeFinalize(() => {
                                // append order by primary key to the list of orders
                                primaryKeys.forEach(key => {
                                  innerQueryBuilder.orderBy(
                                    sql.fragment`${sql.identifier(
                                      functionAlias,
                                      key.name
                                    )}`,
                                    true
                                  );
                                });
                              });
                            }
                          }
                        );
                        return sql.fragment`(${query})`;
                      }, parsedResolveInfoFragment.alias);
                    },
                  };
                });
                let type;
                if (returnTypeTable) {
                  const TableType = getTypeByName(
                    inflection.tableType(
                      returnTypeTable.name,
                      returnTypeTable.namespace.name
                    )
                  );
                  if (proc.returnsSet) {
                    const ConnectionType = getTypeByName(
                      inflection.connection(TableType.name)
                    );
                    type = new GraphQLNonNull(ConnectionType);
                  } else {
                    type = TableType;
                  }
                } else {
                  const Type = gqlTypeByTypeId[returnType.id] || GraphQLString;
                  if (proc.returnsSet) {
                    type = new GraphQLList(new GraphQLNonNull(Type));
                  } else {
                    type = Type;
                  }
                }
                return {
                  type: type,
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
