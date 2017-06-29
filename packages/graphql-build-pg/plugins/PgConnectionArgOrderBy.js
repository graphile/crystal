const { GraphQLEnumType } = require("graphql");
const isString = require("lodash/isString");

module.exports = function PgConnectionArgOrderBy(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "schema",
    (
      schema,
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
                  alias: "natural",
                  specs: [],
                },
              },
              // XXX: add the (indexed?) columns
            },
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
          pgCursorPrefix: sql.literal(
            (orderBy && orderBy[0] && orderBy[0].alias) || "natural"
          ),
          pgQuery: queryBuilder => {
            if (orderBy != null) {
              const { specs } = orderBy;
              const orders = Array.isArray(specs[0]) ? specs : [specs];
              orders.forEach(([col, ascending]) => {
                const expr = isString(col)
                  ? sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                      col
                    )}`
                  : col;
                queryBuilder.orderBy(expr, ascending);
              });
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
