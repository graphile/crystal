// @flow
import type { Plugin } from "graphile-build";

export default (function PgOrderByPrimaryKeyPlugin(builder) {
  builder.hook("GraphQLEnumType:values", (values, build, context) => {
    const {
      extend,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
    } = build;
    const {
      scope: { isPgRowSortEnum, pgIntrospection: table },
    } = context;
    if (!isPgRowSortEnum || !table || table.kind !== "class") {
      return values;
    }
    const attributes = introspectionResultsByKind.attribute.filter(
      attr => attr.classId === table.id
    );
    const primaryKeyConstraint = introspectionResultsByKind.constraint
      .filter(con => con.classId === table.id)
      .filter(con => con.type === "p")[0];
    if (!primaryKeyConstraint) {
      return values;
    }
    const primaryKeys =
      primaryKeyConstraint &&
      primaryKeyConstraint.keyAttributeNums.map(
        num => attributes.filter(attr => attr.num === num)[0]
      );
    return extend(
      values,
      {
        PRIMARY_KEY_ASC: {
          value: {
            alias: "primary_key_asc",
            specs: primaryKeys.map(key => [key.name, true]),
            unique: true,
          },
        },
        PRIMARY_KEY_DESC: {
          value: {
            alias: "primary_key_desc",
            specs: primaryKeys.map(key => [key.name, false]),
            unique: true,
          },
        },
      },
      `Adding primary key asc/desc sort to table '${table.name}'`
    );
  });
}: Plugin);
