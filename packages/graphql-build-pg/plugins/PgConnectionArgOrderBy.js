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
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        getTypeByName,
        pgGqlTypeByTypeId,
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
                value: null,
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
      { extend, getTypeByName, buildObjectWithHooks },
      {
        scope: { isPgConnectionField, pgIntrospection: table },
        addArgDataGenerator,
      }
    ) => {
      if (!isPgConnectionField || !table || !table.kind === "class") {
        return args;
      }
      const TableOrderByType = getTypeByName(
        inflection.orderByType(
          inflection.tableType(table.name, table.namespace.name)
        )
      );

      addArgDataGenerator(function connectionOrderBy({ orderBy }) {
        return {
          pgQuery: queryBuilder => {
            if (orderBy != null) {
              const orders = Array.isArray(orderBy[0]) ? orderBy : [orderBy];
              orders.forEach(([col, ascending]) => {
                const expr = isString(col)
                  ? sql.identifier(queryBuilder.getTableAlias(), col)
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
