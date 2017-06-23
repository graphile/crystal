module.exports = function PgColumnsPlugin(listener) {
  listener.on(
    "objectType:fields",
    (
      fields,
      {
        inflection,
        extend,
        pg: {
          gqlTypeByTypeId,
          introspectionResultsByKind,
          sqlFragmentGeneratorsByClassIdAndFieldName,
          sql,
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
      return extend(
        fields,
        introspectionResultsByKind.attribute
          .filter(attr => attr.classId === table.id)
          .reduce((memo, attr) => {
            /*
            attr =
              { kind: 'attribute',
                classId: '6546809',
                num: 21,
                name: 'upstreamName',
                description: null,
                typeId: '6484393',
                isNotNull: false,
                hasDefault: false }
            */
            const fieldName = inflection.field(`${attr.name}`);
            sqlFragmentGeneratorsByClassIdAndFieldName[table.id][fieldName] = (
              resolveInfoFragment,
              { tableAlias }
            ) => [
              {
                alias: resolveInfoFragment.alias,
                sqlFragment: sql.identifier(tableAlias, attr.name),
              },
            ];
            memo[fieldName] = {
              type: nullableIf(
                !attr.isNotNull,
                gqlTypeByTypeId[attr.typeId] || GraphQLString
              ),
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
