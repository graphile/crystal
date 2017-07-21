export default function PgOrderAllColumnsPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "GraphQLEnumType:values",
    (
      values,
      { extend, pgIntrospectionResultsByKind: introspectionResultsByKind },
      { scope: { isPgRowSortEnum, pgIntrospection: table } }
    ) => {
      if (!isPgRowSortEnum || !table || table.kind !== "class") {
        return values;
      }
      return extend(
        values,
        introspectionResultsByKind.attribute
          .filter(attr => attr.classId === table.id)
          .reduce((memo, attr) => {
            const ascFieldName = inflection.orderByEnum(
              attr.name,
              true,
              table.name,
              table.namespace && table.namespace.name
            );
            const descFieldName = inflection.orderByEnum(
              attr.name,
              false,
              table.name,
              table.namespace && table.namespace.name
            );
            memo[ascFieldName] = {
              value: {
                alias: ascFieldName.toLowerCase(),
                specs: [[attr.name, true]],
              },
            };
            memo[descFieldName] = {
              value: {
                alias: descFieldName.toLowerCase(),
                specs: [[attr.name, false]],
              },
            };
            return memo;
          }, {})
      );
    }
  );
}
