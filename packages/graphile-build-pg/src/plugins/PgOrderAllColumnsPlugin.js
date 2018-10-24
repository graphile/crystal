// @flow
import type { Plugin } from "graphile-build";

export default (function PgOrderAllColumnsPlugin(builder) {
  builder.hook("GraphQLEnumType:values", (values, build, context) => {
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
    if (!isPgRowSortEnum || !table || table.kind !== "class") {
      return values;
    }
    return extend(
      values,
      table.attributes
        .filter(attr => pgColumnFilter(attr, build, context))
        .filter(attr => !omit(attr, "order"))
        .reduce((memo, attr) => {
          const ascFieldName = inflection.orderByColumnEnum(attr, true);
          const descFieldName = inflection.orderByColumnEnum(attr, false);
          memo = extend(
            memo,
            {
              [ascFieldName]: {
                value: {
                  alias: ascFieldName.toLowerCase(),
                  specs: [[attr.name, true]],
                },
              },
            },
            `Adding ascending orderBy enum value for ${describePgEntity(
              attr
            )}. You can rename this field with:\n\n  ${sqlCommentByAddingTags(
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
                value: {
                  alias: descFieldName.toLowerCase(),
                  specs: [[attr.name, false]],
                },
              },
            },
            `Adding descending orderBy enum value for ${describePgEntity(
              attr
            )}. You can rename this field with:\n\n  ${sqlCommentByAddingTags(
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
  });
}: Plugin);
