// @flow
import type { Plugin } from "graphile-build";
export default (function PgConnectionArgCondition(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "init",
    (
      _,
      {
        newWithHooks,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgGqlInputTypeByTypeId: gqlTypeByTypeId,
        graphql: { GraphQLInputObjectType, GraphQLString },
      }
    ) => {
      introspectionResultsByKind.class
        .filter(table => table.isSelectable)
        .filter(table => !!table.namespace)
        .forEach(table => {
          const tableTypeName = inflection.tableType(
            table.name,
            table.namespace.name
          );
          /* const TableConditionType = */
          newWithHooks(
            GraphQLInputObjectType,
            {
              description: `A condition to be used against \`${tableTypeName}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
              name: inflection.conditionType(
                inflection.tableType(table.name, table.namespace.name)
              ),
              fields: ({ fieldWithHooks }) =>
                introspectionResultsByKind.attribute
                  .filter(attr => attr.classId === table.id)
                  .reduce((memo, attr) => {
                    const fieldName = inflection.column(
                      attr.name,
                      table.name,
                      table.namespace.name
                    );
                    memo[fieldName] = fieldWithHooks(
                      fieldName,
                      {
                        description: `Checks for equality with the object’s \`${fieldName}\` field.`,
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
              isPgCondition: true,
            }
          );
        });
      return _;
    }
  );
  builder.hook(
    "GraphQLObjectType:fields:field:args",
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
      if (
        !isPgConnectionField ||
        !table ||
        table.kind !== "class" ||
        !table.namespace
      ) {
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
          description:
            "A condition to be used in determining which values should be returned by the collection.",
          type: TableConditionType,
        },
      });
    }
  );
}: Plugin);
