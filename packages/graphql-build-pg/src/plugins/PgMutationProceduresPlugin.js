const makeProcField = require("./makeProcField");

module.exports = function PgMutationProceduresPlugin(
  builder,
  { pgInflection: inflection, pgStrictFunctions: strictFunctions = false }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      {
        $$isQuery,
        parseResolveInfo,
        getTypeByName,
        extend,
        gql2pg,
        pg2gql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        pgGqlTypeByTypeId: gqlTypeByTypeId,
        pgGqlInputTypeByTypeId: gqlInputTypeByTypeId,
        buildObjectWithHooks,
      },
      { scope: { isRootMutation }, buildFieldWithHooks }
    ) => {
      if (!isRootMutation) {
        return fields;
      }
      return extend(
        fields,
        introspectionResultsByKind.procedure
          .filter(proc => !proc.isStable)
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
            const argTypes = proc.argTypeIds.map(
              typeId => introspectionResultsByKind.typeById[typeId]
            );
            if (
              argTypes.some(
                type =>
                  type.type === "c" && type.class && type.class.isSelectable
              )
            ) {
              // It selects a table, don't add it at root level (see Computed Columns plugin)
              return memo;
            }

            const fieldName = inflection.functionName(
              proc.name,
              proc.namespace.name
            );
            memo[fieldName] = makeProcField(
              fieldName,
              proc,
              {
                buildFieldWithHooks,
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
                $$isQuery,
                buildObjectWithHooks,
              },
              true
            );
            return memo;
          }, {})
      );
    }
  );
};
