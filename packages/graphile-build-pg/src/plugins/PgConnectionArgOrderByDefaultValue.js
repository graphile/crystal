// @flow
import type { Plugin } from "graphile-build";

export default (function PgConnectionArgOrderByDefaultValue(builder) {
  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (args, build, context) => {
      const {
        extend,
        getTypeByName,
        pgGetGqlTypeByTypeIdAndModifier,
        inflection,
      } = build;
      const {
        scope: { fieldName, isPgFieldConnection, pgFieldIntrospection: table },
        Self,
      } = context;

      if (
        !isPgFieldConnection ||
        !table ||
        table.kind !== "class" ||
        !table.namespace ||
        !table.isSelectable ||
        !args.orderBy
      ) {
        return args;
      }
      const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
      const tableTypeName = TableType.name;
      const TableOrderByType = getTypeByName(
        inflection.orderByType(tableTypeName)
      );
      if (!TableOrderByType) {
        return args;
      }

      const defaultValueEnum =
        TableOrderByType.getValues().find(v => v.name === "PRIMARY_KEY_ASC") ||
        TableOrderByType.getValues()[0];

      return extend(args, {
        orderBy: extend(
          args.orderBy,
          {
            defaultValue: defaultValueEnum && [defaultValueEnum.value],
          },
          `Adding defaultValue to orderBy for field '${fieldName}' of '${
            Self.name
          }'`
        ),
      });
    },
    ["PgConnectionArgOrderByDefaultValue"]
  );
}: Plugin);
