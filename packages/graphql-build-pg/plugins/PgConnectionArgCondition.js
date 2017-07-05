const { GraphQLInputObjectType, GraphQLString } = require("graphql");
module.exports = function PgConnectionArgCondition(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "init",
    (
      _,
      {
        buildObjectWithHooks,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgGqlInputTypeByTypeId: gqlTypeByTypeId,
      }
    ) => {
      introspectionResultsByKind.class.map(table => {
        /* const TableConditionType = */
        buildObjectWithHooks(
          GraphQLInputObjectType,
          {
            name: inflection.conditionType(
              inflection.tableType(
                table.name,
                table.namespace && table.namespace.name
              )
            ),
            fields: ({ buildFieldWithHooks }) =>
              introspectionResultsByKind.attribute
                .filter(attr => attr.classId === table.id)
                .reduce((memo, attr) => {
                  const fieldName = inflection.column(
                    attr.name,
                    table.name,
                    table.namespace && table.namespace.name
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
      return _;
    }
  );
  builder.hook(
    "field:args",
    (
      args,
      {
        pgSql: sql,
        gql2pg,
        extend,
        getTypeByName,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      },
      {
        scope: { isPgConnectionField, pgIntrospection: table },
        addArgDataGenerator,
      }
    ) => {
      if (!isPgConnectionField || !table || table.kind !== "class") {
        return args;
      }
      const TableConditionType = getTypeByName(
        inflection.conditionType(
          inflection.tableType(
            table.name,
            table.namespace && table.namespace.name
          )
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
                      sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                        attr.name
                      )} = ${gql2pg(val, attr.type)}`
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
