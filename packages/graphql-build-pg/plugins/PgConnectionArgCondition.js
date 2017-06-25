const { GraphQLInputObjectType } = require("graphql");
module.exports = function PgConnectionArgCondition(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "schema",
    (
      schema,
      {
        buildObjectWithHooks,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        getTypeByName,
        pgGqlInputTypeByTypeId: gqlTypeByTypeId,
      }
    ) => {
      introspectionResultsByKind.class.map(table => {
        /* const TableConditionType = */
        buildObjectWithHooks(
          GraphQLInputObjectType,
          {
            name: inflection.conditionType(
              inflection.tableType(table.name, table.namespace.name)
            ),
            fields: ({ buildFieldWithHooks }) =>
              introspectionResultsByKind.attribute
                .filter(attr => attr.classId === table.id)
                .reduce((memo, attr) => {
                  const fieldName = inflection.column(
                    attr.name,
                    table.name,
                    table.namespace.name
                  );
                  memo[fieldName] = buildFieldWithHooks(
                    fieldName,
                    {
                      type: gqlTypeByTypeId[attr.typeId] || GraphQLString,
                    },
                    {
                      isPgConnectionConditionInputField: true,
                    }
                  );
                  return memo;
                }, {}),
          },
          {
            pgIntrospection: table,
            isPgRowSortEnum: true,
          }
        );
      });
      return schema;
    }
  );
  builder.hook(
    "field:args",
    (
      args,
      {
        pgSql: sql,
        extend,
        getTypeByName,
        buildObjectWithHooks,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      },
      {
        scope: { isPgConnectionField, pgIntrospection: table },
        addArgDataGenerator,
      }
    ) => {
      if (!isPgConnectionField || !table || !table.kind === "class") {
        return args;
      }
      const TableConditionType = getTypeByName(
        inflection.conditionType(
          inflection.tableType(table.name, table.namespace.name)
        )
      );

      addArgDataGenerator(function connectionCondition({ condition }) {
        return {
          pgQuery: queryBuilder => {
            if (condition != null) {
              introspectionResultsByKind.attribute
                .filter(attr => attr.classId === table.id)
                .forEach(attr => {
                  const fieldName = inflection.column(
                    attr.name,
                    table.name,
                    table.namespace.name
                  );
                  const val = condition[fieldName];
                  if (val != null) {
                    queryBuilder.where(
                      sql.fragment`${sql.identifier(
                        queryBuilder.getTableAlias(),
                        attr.name
                      )} = ${sql.value(val)}`
                    );
                  }
                });
            }
          },
        };
      });

      return extend(args, {
        condition: {
          type: TableConditionType,
        },
      });
    }
  );
};
