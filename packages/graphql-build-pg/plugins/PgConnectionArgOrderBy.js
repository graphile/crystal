const { GraphQLEnumType } = require("graphql");
const isString = require("lodash/isString");

module.exports = function PgConnectionArgOrderBy(
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
      }
    ) => {
      introspectionResultsByKind.class.map(table => {
        /* const TableOrderByType = */
        buildObjectWithHooks(
          GraphQLEnumType,
          {
            name: inflection.orderByType(
              inflection.tableType(table.name, table.namespace.name)
            ),
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
    "field:args",
    (
      args,
      { extend, getTypeByName, pgSql: sql },
      {
        scope: { isPgConnectionField, pgIntrospection: table },
        addArgDataGenerator,
      }
    ) => {
      if (!isPgConnectionField || !table || table.kind !== "class") {
        return args;
      }
      const TableOrderByType = getTypeByName(
        inflection.orderByType(
          inflection.tableType(table.name, table.namespace.name)
        )
      );

      addArgDataGenerator(function connectionOrderBy({ orderBy }) {
        return {
          pgCursorPrefix:
            orderBy && orderBy.alias && sql.literal(orderBy && orderBy.alias),
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

      return extend(args, {
        orderBy: {
          type: TableOrderByType,
        },
      });
    }
  );
};
