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
      describePgEntity,
      sqlCommentByAddingTags,
    } = build;
    introspectionResultsByKind.class.forEach(table => {
      // PERFORMANCE: These used to be .filter(...) calls
      if (!table.isSelectable || omit(table, "filter")) return;
      if (!table.namespace) return;

      const tableTypeName = inflection.tableType(table);
      /* const TableConditionType = */
      newWithHooks(
        GraphQLInputObjectType,
        {
          description: `A condition to be used against \`${tableTypeName}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
          name: inflection.conditionType(inflection.tableType(table)),
          fields: context => {
            const { fieldWithHooks } = context;
            return table.attributes.reduce((memo, attr) => {
              // PERFORMANCE: These used to be .filter(...) calls
              if (!pgColumnFilter(attr, build, context)) return memo;
              if (omit(attr, "filter")) return memo;

              const fieldName = inflection.column(attr);
              memo = build.extend(
                memo,
                {
                  [fieldName]: fieldWithHooks(
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
                  ),
                },
                `Adding condition argument for ${describePgEntity(attr)}`
              );
              return memo;
            }, {});
          },
        },
        {
          __origin: `Adding condition type for ${describePgEntity(
            table
          )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
            table,
            {
              name: "newNameHere",
            }
          )}`,
          pgIntrospection: table,
          isPgCondition: true,
        },
        true // Conditions might all be filtered
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
        pgColumnFilter,
        inflection,
        pgOmit: omit,
      } = build;
      const {
        scope: {
          isPgFieldConnection,
          isPgFieldSimpleCollection,
          pgFieldIntrospection,
          pgFieldIntrospectionTable,
        },
        addArgDataGenerator,
        Self,
        field,
      } = context;

      const shouldAddCondition =
        isPgFieldConnection || isPgFieldSimpleCollection;
      if (!shouldAddCondition) return args;

      const proc =
        pgFieldIntrospection.kind === "procedure" ? pgFieldIntrospection : null;
      const table =
        pgFieldIntrospection.kind === "class"
          ? pgFieldIntrospection
          : proc
            ? pgFieldIntrospectionTable
            : null;
      if (
        !table ||
        table.kind !== "class" ||
        !table.namespace ||
        omit(table, "filter")
      ) {
        return args;
      }
      if (proc) {
        if (!proc.tags.filterable) {
          return args;
        }
      }

      const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
      const TableConditionType = getTypeByName(
        inflection.conditionType(TableType.name)
      );
      if (!TableConditionType) {
        return args;
      }

      const relevantAttributes = table.attributes.filter(
        attr => pgColumnFilter(attr, build, context) && !omit(attr, "filter")
      );

      addArgDataGenerator(function connectionCondition({ condition }) {
        return {
          pgQuery: queryBuilder => {
            if (condition != null) {
              relevantAttributes.forEach(attr => {
                const fieldName = inflection.column(attr);
                const val = condition[fieldName];
                if (val != null) {
                  queryBuilder.addLiveCondition(() => record =>
                    record[attr.name] === val
                  );
                  queryBuilder.where(
                    sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                      attr.name
                    )} = ${gql2pg(val, attr.type, attr.typeModifier)}`
                  );
                } else if (val === null) {
                  queryBuilder.addLiveCondition(() => record =>
                    record[attr.name] == null
                  );
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
