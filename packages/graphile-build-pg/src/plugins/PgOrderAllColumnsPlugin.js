// @flow
import type { Plugin } from "graphile-build";

export default (function PgOrderAllColumnsPlugin(
  builder,
  {
    pgInflection: inflection,
    pgColumnFilter = (_attr, _build, _context) => true,
  }
) {
  builder.hook("GraphQLEnumType:values", (values, build, context) => {
    const {
      extend,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
    } = build;
    const { scope: { isPgRowSortEnum, pgIntrospection: table } } = context;
    if (!isPgRowSortEnum || !table || table.kind !== "class") {
      return values;
    }
    return extend(
      values,
      introspectionResultsByKind.attribute
        .filter(attr => attr.classId === table.id)
        .filter(attr => pgColumnFilter(attr, build, context))
        .reduce((memo, attr) => {
          const ascFieldName = inflection.orderByEnum(
            attr.name,
            true,
            table.name,
            table.namespaceName
          );
          const descFieldName = inflection.orderByEnum(
            attr.name,
            false,
            table.name,
            table.namespaceName
          );
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
        }, {})
    );
  });
}: Plugin);
