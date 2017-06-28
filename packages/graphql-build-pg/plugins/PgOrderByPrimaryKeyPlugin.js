module.exports = function PgOrderByPrimaryKeyPlugin(
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
      const attributes = introspectionResultsByKind.attribute.filter(
        attr => attr.classId === table.id
      );
      const primaryKeyConstraint = introspectionResultsByKind.constraint
        .filter(con => con.classId === table.id)
        .filter(con => ["p"].includes(con.type))[0];
      if (!primaryKeyConstraint) {
        return values;
      }
      const primaryKeys =
        primaryKeyConstraint &&
        primaryKeyConstraint.keyAttributeNums.map(
          num => attributes.filter(attr => attr.num === num)[0]
        );
      return extend(values, {
        PRIMARY_KEY_ASC: {
          value: {
            alias: "primary_key_asc",
            specs: primaryKeys.map(key => [key.name, true]),
          },
        },
        PRIMARY_KEY_DESC: {
          value: {
            alias: "primary_key_desc",
            specs: primaryKeys.map(key => [key.name, false]),
          },
        },
      });
    }
  );
};
