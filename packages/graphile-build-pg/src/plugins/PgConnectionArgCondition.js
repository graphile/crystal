// @flow
import type { Plugin } from "graphile-build";

export default (function PgConnectionArgCondition(builder) {
  builder.hook("init", (_, build) => {
    const {
      newWithHooks,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgGetGqlInputTypeByTypeIdAndModifier,
      graphql: { GraphQLInputObjectType, GraphQLString },
      pgColumnFilter,
      inflection,
      pgOmit: omit,
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
                        pgGetGqlInputTypeByTypeIdAndModifier(
                          attr.typeId,
                          attr.typeModifier
                        ) || GraphQLString,
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
        pgGetGqlTypeByTypeIdAndModifier,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgColumnFilter,
        inflection,
        pgOmit: omit,
      } = build;
      const {
        scope: {
          isPgFieldConnection,
          isPgFieldSimpleCollection,
          pgFieldIntrospection: table,
        },
        addArgDataGenerator,
        Self,
        field,
      } = context;
      const shouldAddCondition =
        isPgFieldConnection || isPgFieldSimpleCollection;
      if (
        !shouldAddCondition ||
        !table ||
        table.kind !== "class" ||
        !table.namespace ||
        omit(table, "filter")
      ) {
        return args;
      }
      const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
      const TableConditionType = getTypeByName(
        inflection.conditionType(TableType.name)
      );

      const relevantAttributes = introspectionResultsByKind.attribute
        .filter(attr => attr.classId === table.id)
        .filter(attr => pgColumnFilter(attr, build, context))
        .filter(attr => !omit(attr, "filter"));

      addArgDataGenerator(function connectionCondition({ condition }) {
        return {
          pgQuery: queryBuilder => {
            if (condition != null) {
              relevantAttributes.forEach(attr => {
                const fieldName = inflection.column(attr);
                const val = condition[fieldName];
                if (val != null) {
                  queryBuilder.where(
                    sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                      attr.name
                    )} = ${gql2pg(val, attr.type, attr.typeModifier)}`
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
