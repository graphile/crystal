import "./PgTablesPlugin";

import "graphile-plugin";
import type { GraphQLEnumType } from "graphql";

import { version } from "../index";

export const PgConnectionArgOrderByDefaultValuePlugin: GraphilePlugin.Plugin = {
  name: "PgConnectionArgOrderByDefaultValuePlugin",
  description: "Sets the default 'orderBy' for a table",
  version: version,

  schema: {
    hooks: {
      GraphQLObjectType_fields_field_args(args, build, context) {
        const { extend, getTypeByName, inflection } = build;
        const {
          scope: { fieldName, isPgFieldConnection, pgSource },
          Self,
        } = context;

        if (!args.orderBy) {
          return args;
        }

        if (!isPgFieldConnection || !pgSource || !pgSource.codec.columns) {
          return args;
        }

        const tableTypeName = inflection.tableType(pgSource.codec);
        const TableOrderByType = getTypeByName(
          inflection.orderByType(tableTypeName),
        ) as GraphQLEnumType;
        if (!TableOrderByType) {
          return args;
        }

        const primaryKeyAsc = inflection.builtin("PRIMARY_KEY_ASC");
        const defaultValueEnum =
          TableOrderByType.getValues().find((v) => v.name === primaryKeyAsc) ||
          TableOrderByType.getValues()[0];
        if (!defaultValueEnum) {
          return args;
        }

        return extend(
          args,
          {
            orderBy: extend(
              args.orderBy,
              {
                defaultValue: defaultValueEnum && [defaultValueEnum.value],
              },
              `Adding defaultValue to orderBy for field '${fieldName}' of '${Self.name}'`,
            ),
          },
          `Adding defaultValue to '${Self.name}.${fieldName}.orderBy'`,
        );
      },
    },
  },
};
