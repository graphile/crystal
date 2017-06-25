const { GraphQLNonNull, GraphQLList, GraphQLString } = require("graphql");
module.exports = function PgComputedColumnsPlugin(
  builder,
  { pgInflection: inflection, pgStrictFunctions: strictFunctions = false }
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
        pgGqlInputTypeByTypeId: gqlInputTypeByTypeId,
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

            const sliceAmount = 1;
            const argNames = proc.argNames
              .slice(sliceAmount)
              .map((name, index) => name || `arg${index}`);
            const argTypes = proc.argTypeIds
              .slice(sliceAmount)
              .map(typeId => introspectionResultsByKind.typeById[typeId]);
            const requiredArgs = Math.max(
              0,
              proc.isStrict
                ? proc.argNames.length - sliceAmount
                : strictFunctions
                  ? proc.argNames.length - sliceAmount - proc.argDefaultsNum
                  : 0
            );
            const argGqlTypes = argTypes.map((type, idx) => {
              const Type = gqlInputTypeByTypeId[type.id] || GraphQLString;
              if (idx >= requiredArgs) {
                return Type;
              } else {
                return new GraphQLNonNull(Type);
              }
            });

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
            const returnTypeTableAttributes =
              returnTypeTable &&
              introspectionResultsByKind.attribute.filter(
                attr => attr.classId === returnTypeTable.id
              );
            const returnTypeTablePrimaryKeyConstraint =
              returnTypeTable &&
              introspectionResultsByKind.constraint
                .filter(con => con.classId === returnTypeTable.id)
                .filter(con => ["p"].includes(con.type))[0];
            const returnTypeTablePrimaryKeys =
              returnTypeTablePrimaryKeyConstraint &&
              returnTypeTablePrimaryKeyConstraint.keyAttributeNums.map(
                num =>
                  returnTypeTableAttributes.filter(attr => attr.num === num)[0]
              );

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
                        const { args } = parsedResolveInfoFragment;
                        const functionAlias = Symbol();
                        const parentTableAlias = queryBuilder.getTableAlias();
                        const argValues = argNames.map((argName, argIndex) => {
                          const gqlArgName = inflection.argument(argName);
                          return args[gqlArgName];
                        });
                        while (
                          argValues.length > requiredArgs &&
                          argValues[argValues.length - 1] == null
                        ) {
                          argValues.pop();
                        }
                        const query = queryFromResolveData(
                          sql.fragment`${sql.identifier(
                            proc.namespace.name,
                            proc.name
                          )}(${sql.identifier(
                            parentTableAlias
                          )}${argValues.length
                            ? `, ${sql.join(argValues.map(sql.value), ", ")}`
                            : ""})`,
                          functionAlias,
                          resolveData,
                          { asJsonAggregate: true },
                          innerQueryBuilder => {
                            if (returnTypeTablePrimaryKeys) {
                              innerQueryBuilder.beforeFinalize(() => {
                                // append order by primary key to the list of orders
                                returnTypeTablePrimaryKeys.forEach(key => {
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
                  args: argNames.reduce((memo, argName, argIndex) => {
                    const gqlArgName = inflection.argument(argName);
                    memo[gqlArgName] = {
                      type: argGqlTypes[argIndex],
                    };
                    return memo;
                  }, {}),
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
