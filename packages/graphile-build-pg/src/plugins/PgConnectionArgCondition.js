// @flow
import type { Plugin } from "graphile-build";
import omit from "../omit";

export default (function PgConnectionArgCondition(builder) {
  builder.hook("init", (_, build) => {
    const {
      newWithHooks,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgGetGqlInputTypeByTypeId,
      graphql: { GraphQLInputObjectType, GraphQLString },
      pgColumnFilter,
      inflection,
    } = build;
    introspectionResultsByKind.class
      .filter(table => table.isSelectable && !omit(table, "filter"))
      .filter(table => !!table.namespace)
      .forEach(table => {
        const tableTypeName = inflection.tableType(table);
        /* const TableConditionType = */
        newWithHooks(
          GraphQLInputObjectType,
          {
            description: `A condition to be used against \`${tableTypeName}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
            name: inflection.conditionType(inflection.tableType(table)),
            fields: context => {
              const { fieldWithHooks } = context;
              return introspectionResultsByKind.attribute
                .filter(attr => attr.classId === table.id)
                .filter(attr => pgColumnFilter(attr, build, context))
                .filter(attr => !omit(attr, "filter"))
                .reduce((memo, attr) => {
                  const fieldName = inflection.column(attr);
                  memo[fieldName] = fieldWithHooks(
                    fieldName,
                    {
                      description: `Checks for equality with the object’s \`${fieldName}\` field.`,
                      type:
                        pgGetGqlInputTypeByTypeId(attr.typeId) || GraphQLString,
                    },
                    {
                      isPgConnectionConditionInputField: true,
                    }
                  );
                  return memo;
                }, {});
            },
          },
          {
            pgIntrospection: table,
            isPgCondition: true,
          }
        );
      });
    return _;
  });
  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (args, build, context) => {
      const {
        pgSql: sql,
        gql2pg,
        extend,
        getTypeByName,
        pgGetGqlTypeByTypeId,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgColumnFilter,
        inflection,
      } = build;
      const {
        scope: { isPgFieldConnection, pgFieldIntrospection: table },
        addArgDataGenerator,
        Self,
        field,
      } = context;
      if (
        !isPgFieldConnection ||
        !table ||
        table.kind !== "class" ||
        !table.namespace ||
        omit(table, "filter")
      ) {
        return args;
      }
      const TableType = pgGetGqlTypeByTypeId(table.type.id);
      const TableConditionType = getTypeByName(
        inflection.conditionType(TableType.name)
      );

      addArgDataGenerator(function connectionCondition({ condition }) {
        return {
          pgQuery: queryBuilder => {
            if (condition != null) {
              introspectionResultsByKind.attribute
                .filter(attr => attr.classId === table.id)
                .filter(attr => pgColumnFilter(attr, build, context))
                .filter(attr => !omit(attr, "filter"))
                .forEach(attr => {
                  const fieldName = inflection.column(attr);
                  const val = condition[fieldName];
                  if (val != null) {
                    queryBuilder.where(
                      sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                        attr.name
                      )} = ${gql2pg(val, attr.type)}`
                    );
                  } else if (val === null) {
                    queryBuilder.where(
                      sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                        attr.name
                      )} IS NULL`
                    );
                  }
                });
            }
          },
        };
      });

      return extend(
        args,
        {
          condition: {
            description:
              "A condition to be used in determining which values should be returned by the collection.",
            type: TableConditionType,
          },
        },
        `Adding condition to connection field '${field.name}' of '${Self.name}'`
      );
    }
  );
}: Plugin);
