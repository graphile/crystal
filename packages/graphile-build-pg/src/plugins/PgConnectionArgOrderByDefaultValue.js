// @flow
import type { Plugin } from "graphile-build";

export default (function PgConnectionArgOrderByDefaultValue(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (
      args,
      { extend, getTypeByName, pgGetGqlTypeByTypeId },
      { scope: { isPgFieldConnection, pgFieldIntrospection: table } }
    ) => {
      if (
        !isPgFieldConnection ||
        !table ||
        table.kind !== "class" ||
        !table.namespace ||
        !table.isSelectable
      ) {
        return args;
      }
      const TableType = pgGetGqlTypeByTypeId(table.type.id);
      const tableTypeName = TableType.name;
      const TableOrderByType = getTypeByName(
        inflection.orderByType(tableTypeName)
      );

      const defaultValueEnum =
        TableOrderByType.getValues().find(v => v.name === "PRIMARY_KEY_ASC") ||
        TableOrderByType.getValues()[0];

      return Object.assign({}, args, {
        orderBy: extend(args.orderBy, {
          defaultValue: defaultValueEnum && defaultValueEnum.value,
        }),
      });
    }
  );
}: Plugin);
