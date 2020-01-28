import isString = require("lodash/isString");
import { Plugin } from "graphile-build";
import { SQL } from "../QueryBuilder";
import { PgEntityKind } from "./PgIntrospectionPlugin";

declare module "graphile-build" {
  interface GraphileBuildOptions {
    orderByNullsLast?: boolean | null;
  }
}

export interface OrderByValue {
  specs: OrderBySpec | OrderBySpec[];
  unique?: boolean;
  alias?: string;
}

export type OrderBySpec =
  | [string | SQL, boolean]
  | [
      /** column (or SQL expression) to order by */
      string | SQL,

      /** ascending (true) or descending (false) */
      boolean,

      /**
       * specNullsFirst:
       *
       * - true: `NULLS FIRST`
       * - false: `NULLS LAST`
       * - null: ` `
       */
      boolean | null | undefined
    ];

function isOrderBySpec(spec: unknown): spec is OrderBySpec {
  // We're not validating spec[1] and spec[2] since we just use them as (nullable) booleans
  return (
    Array.isArray(spec) &&
    spec.length >= 2 &&
    spec.length <= 3 &&
    (typeof spec[0] === "string" ||
      (typeof spec[0] === "object" && spec[0] && !Array.isArray(spec[0])))
  );
}

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
            )}. You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
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
        graphql: { GraphQLList, GraphQLNonNull, getNamedType },
        inflection,
        pgOmit: omit,
      } = build;
      const {
        scope: {
          fieldName,
          isPgFieldConnection,
          isPgFieldSimpleCollection,
          pgFieldIntrospection,
          pgFieldIntrospectionTable,
        },

        addArgDataGenerator,
        Self,
      } = context;

      if (
        (!isPgFieldConnection && !isPgFieldSimpleCollection) ||
        !pgFieldIntrospection
      ) {
        return args;
      }

      const proc =
        pgFieldIntrospection.kind === PgEntityKind.PROCEDURE
          ? pgFieldIntrospection
          : null;
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
      if (!TableType) {
        return args;
      }
      const tableTypeName = getNamedType(TableType).name;
      const TableOrderByType = getTypeByName(
        inflection.orderByType(tableTypeName)
      );
      if (!TableOrderByType) {
        return args;
      }

      const cursorPrefixFromOrderBy = (
        orderBy: OrderByValue[] | null
      ): SQL[] | null => {
        if (orderBy) {
          const cursorPrefixes: SQL[] = [];
          for (
            let itemIndex = 0, itemCount = orderBy.length;
            itemIndex < itemCount;
            itemIndex++
          ) {
            const item = orderBy[itemIndex];
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
        const orderBy: OrderByValue[] | null = rawOrderBy
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
                const orders: OrderBySpec[] = isOrderBySpec(specs)
                  ? [specs]
                  : specs;
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

        `Adding 'orderBy' argument to field '${fieldName}' of '${Self.name}'`
      );
    },
    ["PgConnectionArgOrderBy"]
  );
} as Plugin);
