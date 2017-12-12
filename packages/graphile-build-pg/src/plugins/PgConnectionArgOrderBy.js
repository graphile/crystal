// @flow
import isString from "lodash/isString";
import type { Plugin } from "graphile-build";

export default (function PgConnectionArgOrderBy(
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
        graphql: { GraphQLEnumType },
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
          /* const TableOrderByType = */
          newWithHooks(
            GraphQLEnumType,
            {
              name: inflection.orderByType(tableTypeName),
              description: `Methods to use when ordering \`${tableTypeName}\`.`,
              values: {
                NATURAL: {
                  value: {
                    alias: null,
                    specs: [],
                  },
                },
              },
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
    "GraphQLObjectType:fields:field:args",
    (
      args,
      { extend, getTypeByName, pgGetGqlTypeByTypeId, pgSql: sql },
      {
        scope: { isPgFieldConnection, pgFieldIntrospection: table },
        addArgDataGenerator,
      }
    ) => {
      if (
        !isPgFieldConnection ||
        !table ||
        table.kind !== "class" ||
        !table.namespace ||
        !table.isSelectable
      ) {
        return args;
      }
      const TableType = pgGetGqlTypeByTypeId(table.type.id);
      const tableTypeName = TableType.name;
      const TableOrderByType = getTypeByName(
        inflection.orderByType(tableTypeName)
      );

      addArgDataGenerator(function connectionOrderBy({ orderBy }) {
        return {
          pgCursorPrefix:
            orderBy && orderBy.alias && sql.literal(orderBy && orderBy.alias),
          pgQuery: queryBuilder => {
            if (orderBy != null) {
              const { specs, unique } = orderBy;
              const orders =
                Array.isArray(specs[0]) || specs.length === 0 ? specs : [specs];
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

      return extend(args, {
        orderBy: {
          description: `The method to use when ordering \`${tableTypeName}\`.`,
          type: TableOrderByType,
        },
      });
    }
  );
}: Plugin);
