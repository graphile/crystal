// @flow
import type { Plugin } from "graphile-build";
import isString from "lodash/isString";

export default (function PgMutationPayloadEdgePlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      { extend, getTypeByName, pgSql: sql },
      {
        scope: { isMutationPayload, pgIntrospection, pgIntrospectionTable },
        fieldWithHooks,
        recurseDataGeneratorsForField,
      }
    ) => {
      const table = pgIntrospectionTable || pgIntrospection;
      if (
        !isMutationPayload ||
        !table ||
        table.kind !== "class" ||
        !table.namespace ||
        !table.isSelectable
      ) {
        return fields;
      }
      const tableTypeName = inflection.tableType(
        table.name,
        table.namespace.name
      );
      const TableOrderByType = getTypeByName(
        inflection.orderByType(tableTypeName)
      );
      const TableEdgeType = getTypeByName(inflection.edge(tableTypeName));
      if (!TableEdgeType) {
        return fields;
      }

      const fieldName = inflection.edgeField(table.name, table.namespace.name);
      recurseDataGeneratorsForField(fieldName);
      return extend(fields, {
        [fieldName]: fieldWithHooks(fieldName, ({ addArgDataGenerator }) => {
          addArgDataGenerator(function connectionOrderBy({ orderBy }) {
            return {
              pgCursorPrefix:
                orderBy &&
                orderBy.alias &&
                sql.literal(orderBy && orderBy.alias),
              pgQuery: queryBuilder => {
                if (orderBy != null) {
                  const { specs, unique } = orderBy;
                  const orders = Array.isArray(specs[0]) ? specs : [specs];
                  orders.forEach(([col, ascending]) => {
                    const expr = isString(col)
                      ? sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                          col
                        )}`
                      : col;
                    queryBuilder.orderBy(expr, ascending);
                  });
                  if (unique) {
                    queryBuilder.setOrderIsUnique();
                  }
                }
              },
            };
          });

          const defaultValueEnum =
            TableOrderByType.getValues().find(
              v => v.name === "PRIMARY_KEY_ASC"
            ) || TableOrderByType.getValues()[0];
          return {
            description: "An edge for the type. May be used by Relay 1.",
            type: TableEdgeType,
            args: {
              orderBy: {
                description: `The method to use when ordering \`${tableTypeName}\`.`,
                type: TableOrderByType,
                defaultValue: defaultValueEnum && defaultValueEnum.value,
              },
            },
            resolve(data) {
              return data.data;
            },
          };
        }),
      });
    }
  );
}: Plugin);
