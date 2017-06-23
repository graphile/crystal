module.exports = function PgComputedColumnsPlugin(listener) {
  listener.on(
    "objectType:fields",
    (
      fields,
      {
        inflection,
        extend,
        pg: {
          introspectionResultsByKind,
          sqlFragmentGeneratorsByClassIdAndFieldName,
          sql,
          gqlTypeByTypeId,
          generateFieldFragments,
        },
      },
      { scope }
    ) => {
      if (
        !scope.pg ||
        !scope.pg.isRowType ||
        !scope.pg.introspection ||
        scope.pg.introspection.kind !== "class"
      ) {
        return;
      }
      const table = scope.pg.introspection;
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
            if (proc.returnsSet) {
              // XXX: TODO!
              return memo;
            }
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

            const fieldName = inflection.field(
              proc.name.substr(table.name.length + 1)
            );
            const schema = introspectionResultsByKind.namespace.filter(
              n => n.id === proc.namespaceId
            )[0];
            if (
              sqlFragmentGeneratorsByClassIdAndFieldName[table.id][fieldName]
            ) {
              console.warn(
                `WARNING: did not add dynamic column '${fieldName}' from function '${proc.name}' because field already exists`
              );
              return memo;
            }

            const returnType = introspectionResultsByKind.type.filter(
              type => type.id === proc.returnTypeId
            )[0];
            const returnTypeTable = introspectionResultsByKind.class.filter(
              cls => cls.id === returnType.classId
            )[0];
            if (!returnType) {
              throw new Error(
                `Could not determine return type for function '${proc.name}'`
              );
            }

            sqlFragmentGeneratorsByClassIdAndFieldName[table.id][fieldName] = (
              parsedResolveInfoFragment,
              { tableAlias: foreignTableAlias }
            ) => {
              const sqlCall = sql.fragment`${sql.identifier(
                schema.name,
                proc.name
              )}(${sql.identifier(foreignTableAlias)})`;

              const isTable = returnType.type === "c" && returnTypeTable;

              const functionAlias = Symbol();
              const getFragments = () =>
                generateFieldFragments(
                  parsedResolveInfoFragment,
                  sqlFragmentGeneratorsByClassIdAndFieldName[
                    returnTypeTable.id
                  ],
                  { tableAlias: functionAlias }
                );
              const sqlFragment = isTable
                ? sql.query`(
                  select ${sqlJsonBuildObjectFromFragments(getFragments())}
                  from ${sqlCall} as ${sql.identifier(functionAlias)}
                )`
                : sqlCall;
              return [
                {
                  alias: parsedResolveInfoFragment.alias,
                  sqlFragment,
                },
              ];
            };
            memo[fieldName] = {
              type: gqlTypeByTypeId[proc.returnTypeId] || GraphQLString,
              resolve: (data, _args, _context, resolveInfo) => {
                const { alias } = parseResolveInfo(resolveInfo, {
                  deep: false,
                });
                return data[alias];
              },
            };
            return memo;
          }, {})
      );
    }
  );
};
