import "./PgTablesPlugin.js";
import "graphile-config";

import type { GraphQLEnumType } from "graphql";

import { version } from "../version.js";

export const PgConnectionArgOrderByDefaultValuePlugin: GraphileConfig.Plugin = {
  name: "PgConnectionArgOrderByDefaultValuePlugin",
  description: "Sets the default 'orderBy' for a table",
  version: version,

  schema: {
    hooks: {
      GraphQLObjectType_fields_field_args_arg(arg, build, context) {
        const { extend, getTypeByName, inflection } = build;
        const {
          scope: { fieldName, isPgFieldConnection, pgResource, argName },
          Self,
        } = context;

        if (argName !== "orderBy") {
          return arg;
        }

        if (
          !isPgFieldConnection ||
          !pgResource ||
          !pgResource.codec.columns ||
          pgResource.parameters
        ) {
          return arg;
        }

        const tableTypeName = inflection.tableType(pgResource.codec);
        const TableOrderByType = getTypeByName(
          inflection.orderByType(tableTypeName),
        ) as GraphQLEnumType;
        if (!TableOrderByType) {
          return arg;
        }

        const primaryKeyAsc = inflection.builtin("PRIMARY_KEY_ASC");
        const defaultValueEnum =
          TableOrderByType.getValues().find((v) => v.name === primaryKeyAsc) ||
          TableOrderByType.getValues()[0];
        if (!defaultValueEnum) {
          return arg;
        }

        return extend(
          arg,
          {
            defaultValue: defaultValueEnum && [defaultValueEnum.value],
          },
          `Adding defaultValue to orderBy for field '${fieldName}' of '${Self.name}'`,
        );
      },
    },
  },
};
