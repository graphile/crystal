const makeProcField = require("./makeProcField");

module.exports = function PgComputedColumnsPlugin(
  builder,
  { pgInflection: inflection, pgStrictFunctions: strictFunctions = false }
) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        parseResolveInfo,
        getTypeByName,
        extend,
        gql2pg,
        pg2gql,
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

            const pseudoColumnName = proc.name.substr(table.name.length + 1);
            const fieldName = inflection.column(
              pseudoColumnName,
              table.name,
              table.namespace.name
            );
            memo[fieldName] = makeProcField(fieldName, proc, {
              buildFieldWithHooks,
              computed: true,
              introspectionResultsByKind,
              strictFunctions,
              gqlTypeByTypeId,
              gqlInputTypeByTypeId,
              getTypeByName,
              gql2pg,
              pg2gql,
              inflection,
              sql,
              parseResolveInfo,
            });
            return memo;
          }, {})
      );
    }
  );
};
