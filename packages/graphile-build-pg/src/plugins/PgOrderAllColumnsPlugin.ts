import { Plugin } from "graphile-build";
import { OrderByValue } from "./PgConnectionArgOrderBy";

export default (function PgOrderAllColumnsPlugin(builder) {
  builder.hook(
    "GraphQLEnumType:values",
    (values, build, context) => {
      const {
        extend,
        pgColumnFilter,
        inflection,
        pgOmit: omit,
        describePgEntity,
        sqlCommentByAddingTags,
      } = build;
      const {
        scope: { isPgRowSortEnum, pgIntrospection: table },
      } = context;
      if (
        !pgColumnFilter ||
        !isPgRowSortEnum ||
        !table ||
        table.kind !== "class"
      ) {
        return values;
      }
      return extend(
        values,
        table.attributes.reduce((memo, attr) => {
          // PERFORMANCE: These used to be .filter(...) calls
          if (!pgColumnFilter(attr, build, context)) return memo;
          if (omit(attr, "order")) return memo;
          const unique = !!attr.isUnique;

          const ascFieldName = inflection.orderByColumnEnum(attr, true);
          const descFieldName = inflection.orderByColumnEnum(attr, false);
          const orderAsc: OrderByValue = {
            alias: ascFieldName.toLowerCase(),
            specs: [[attr.name, true]],
            unique,
          };
          const orderDesc: OrderByValue = {
            alias: descFieldName.toLowerCase(),
            specs: [[attr.name, false]],
            unique,
          };
          memo = extend(
            memo,
            {
              [ascFieldName]: {
                value: orderAsc,
              },
            },

            `Adding ascending orderBy enum value for ${describePgEntity(
              attr
            )}. You can rename this field with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              attr,
              {
                name: "newNameHere",
              }
            )}`
          );

          memo = extend(
            memo,
            {
              [descFieldName]: {
                value: orderDesc,
              },
            },

            `Adding descending orderBy enum value for ${describePgEntity(
              attr
            )}. You can rename this field with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              attr,
              {
                name: "newNameHere",
              }
            )}`
          );

          return memo;
        }, {}),
        `Adding order values from table '${table.name}'`
      );
    },
    ["PgOrderAllColumns"]
  );
} as Plugin);
