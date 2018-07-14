// @flow
import type { Plugin } from "graphile-build";

export default (function PgOrderAllColumnsPlugin(builder) {
  builder.hook("GraphQLEnumType:values", (values, build, context) => {
    const {
      extend,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgColumnFilter,
      inflection,
      pgOmit: omit,
    } = build;
    const {
      scope: { isPgRowSortEnum, pgIntrospection: table },
    } = context;
    if (!isPgRowSortEnum || !table || table.kind !== "class") {
      return values;
    }
    return extend(
      values,
      introspectionResultsByKind.attribute
        .filter(attr => attr.classId === table.id)
        .filter(attr => pgColumnFilter(attr, build, context))
        .reduce((memo, attr) => {
          if (omit(attr, "order")) {
            return memo;
          }
          const ascFieldName = inflection.orderByColumnEnum(attr, true);
          const descFieldName = inflection.orderByColumnEnum(attr, false);
          memo[ascFieldName] = {
            value: {
              alias: ascFieldName.toLowerCase(),
              specs: [[attr.name, true]],
            },
          };
          memo[descFieldName] = {
            value: {
              alias: descFieldName.toLowerCase(),
              specs: [[attr.name, false]],
            },
          };
          return memo;
        }, {}),
      `Adding order values from table '${table.name}'`
    );
  });
}: Plugin);
