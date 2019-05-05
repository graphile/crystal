// @flow
import isString from "lodash/isString";
import type { Plugin } from "graphile-build";

export default (function PgConnectionArgOrderBy(builder, { orderByNullsLast }) {
  builder.hook(
    "init",
    (_, build) => {
      const {
        newWithHooks,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        graphql: { GraphQLEnumType },
        inflection,
        pgOmit: omit,
        sqlCommentByAddingTags,
        describePgEntity,
      } = build;
      introspectionResultsByKind.class.forEach(table => {
        // PERFORMANCE: These used to be .filter(...) calls
        if (!table.isSelectable || omit(table, "order")) return;
        if (!table.namespace) return;

        const tableTypeName = inflection.tableType(table);
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
            __origin: `Adding connection "orderBy" argument for ${describePgEntity(
              table
            )}. You can rename the table's GraphQL type via:\n\n  ${sqlCommentByAddingTags(
              table,
              {
                name: "newNameHere",
              }
            )}`,
            pgIntrospection: table,
            isPgRowSortEnum: true,
          }
        );
      });
      return _;
    },
    ["PgConnectionArgOrderBy"]
  );

  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (args, build, context) => {
      const {
        extend,
        getTypeByName,
        pgGetGqlTypeByTypeIdAndModifier,
        pgSql: sql,
        graphql: { GraphQLList, GraphQLNonNull },
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

      if (!isPgFieldConnection && !isPgFieldSimpleCollection) {
        return args;
      }

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
        !table.namespace ||
        !table.isSelectable ||
        omit(table, "order")
      ) {
        return args;
      }
      if (proc) {
        if (!proc.tags.sortable) {
          return args;
        }
      }
      const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
      const tableTypeName = TableType.name;
      const TableOrderByType = getTypeByName(
        inflection.orderByType(tableTypeName)
      );
      const cursorPrefixFromOrderBy = orderBy => {
        if (orderBy) {
          let cursorPrefixes = [];
          for (const item of orderBy) {
            if (item.alias) {
              cursorPrefixes.push(sql.literal(item.alias));
            }
          }
          if (cursorPrefixes.length > 0) {
            return cursorPrefixes;
          }
        }
        return null;
      };

      addArgDataGenerator(function connectionOrderBy({ orderBy: rawOrderBy }) {
        const orderBy = rawOrderBy
          ? Array.isArray(rawOrderBy)
            ? rawOrderBy
            : [rawOrderBy]
          : null;
        return {
          pgCursorPrefix: cursorPrefixFromOrderBy(orderBy),
          pgQuery: queryBuilder => {
            if (orderBy != null) {
              orderBy.forEach(item => {
                const { specs, unique } = item;
                const orders =
                  Array.isArray(specs[0]) || specs.length === 0
                    ? specs
                    : [specs];
                orders.forEach(([col, ascending, specNullsFirst]) => {
                  const expr = isString(col)
                    ? sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                        col
                      )}`
                    : col;
                  // If the enum specifies null ordering, use that
                  // Otherwise, use the orderByNullsLast option if present
                  const nullsFirst =
                    specNullsFirst != null
                      ? specNullsFirst
                      : orderByNullsLast != null
                      ? !orderByNullsLast
                      : undefined;
                  queryBuilder.orderBy(expr, ascending, nullsFirst);
                });
                if (unique) {
                  queryBuilder.setOrderIsUnique();
                }
              });
            }
          },
        };
      });

      return extend(
        args,
        {
          orderBy: {
            description: `The method to use when ordering \`${tableTypeName}\`.`,
            type: new GraphQLList(new GraphQLNonNull(TableOrderByType)),
          },
        },
        `Adding 'orderBy' argument to field '${field.name}' of '${Self.name}'`
      );
    },
    ["PgConnectionArgOrderBy"]
  );
}: Plugin);
