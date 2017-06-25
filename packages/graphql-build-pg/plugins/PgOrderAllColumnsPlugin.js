module.exports = function PgOrderAllColumnsPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "enumType:values",
    (
      values,
      {
        extend,
        pgGqlTypeByTypeId: gqlTypeByTypeId,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        parseResolveInfo,
      },
      {
        scope: { isPgRowSortEnum, pgIntrospection: table },
        addDataGeneratorForField,
      }
    ) => {
      if (!isPgRowSortEnum || !table || table.kind !== "class") {
        return values;
      }
      return extend(
        values,
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
            const fieldName = inflection.column(
              attr.name,
              table.name,
              table.namespace.name
            );
            const ascFieldName = inflection.orderByEnum(
              attr.name,
              true,
              table.name,
              table.namespace.name
            );
            const descFieldName = inflection.orderByEnum(
              attr.name,
              false,
              table.name,
              table.namespace.name
            );
            memo[ascFieldName] = {
              value: [attr.name, true],
            };
            memo[descFieldName] = {
              value: [attr.name, false],
            };
            return memo;
          }, {})
      );
    }
  );
};
