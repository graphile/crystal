import type { Plugin } from "graphile-plugin";
import type {
  GraphQLEnumTypeConfig,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLInputFieldConfig,
} from "graphql";

function rmEmptyTypeDescription<
  T extends
    | GraphileEngine.GraphileObjectTypeConfig<any, any>
    | GraphileEngine.GraphileInputObjectTypeConfig
    | GraphileEngine.GraphileUnionTypeConfig<any, any>
    | GraphileEngine.GraphileInterfaceTypeConfig<any, any>
    | GraphQLEnumTypeConfig,
>(type: T): T {
  if (type.description === "") {
    type.description = null;
  }
  return type;
}

function rmEmptyFieldDescription<
  T extends GraphQLFieldConfig<any, any> | GraphQLInputFieldConfig,
>(field: T): T {
  if (field.description === "") {
    field.description = null;
  }
  return field;
}

function rmEmptyArgDescriptions<T extends GraphQLFieldConfigArgumentMap>(
  args: T,
): T {
  if (!args) {
    return args;
  }
  for (const argName in args) {
    const arg = args[argName];
    if (arg.description === "") {
      arg.description = null;
    }
  }
  return args;
}

export const TrimEmptyDescriptionsPlugin: Plugin = {
  name: "TrimEmptyDescriptionsPlugin",
  description:
    "Trims the 'description' property from types, field and args that have an empty description",
  version: "1.0.0",

  schema: {
    hooks: {
      GraphQLObjectType: rmEmptyTypeDescription,
      GraphQLObjectType_fields_field: rmEmptyFieldDescription,
      GraphQLObjectType_fields_field_args: rmEmptyArgDescriptions,
      GraphQLInputObjectType: rmEmptyTypeDescription,
      GraphQLInputObjectType_fields_field: rmEmptyFieldDescription,
      GraphQLUnionType: rmEmptyTypeDescription,
      GraphQLInterfaceType: rmEmptyTypeDescription,
      GraphQLEnumType: rmEmptyTypeDescription,
    },
  },
};
