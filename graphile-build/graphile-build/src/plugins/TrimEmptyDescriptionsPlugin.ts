import "graphile-config";

import type {
  GraphQLEnumTypeConfig,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLInputFieldConfig,
} from "graphql";

/**
 * Sets the 'description' attribute to null if it's the empty string; useful
 * for cleaning up the schema as printing a schema with a lot of empty string
 * descriptions is u.g.l.y.
 */
function rmEmptyTypeDescription<
  T extends
    | GraphileBuild.GraphileObjectTypeConfig<any, any>
    | GraphileBuild.GraphileInputObjectTypeConfig
    | GraphileBuild.GraphileUnionTypeConfig<any, any>
    | GraphileBuild.GraphileInterfaceTypeConfig<any, any>
    | GraphQLEnumTypeConfig,
>(type: T): T {
  // TODO: should we trim before comparison?
  if (type.description === "") {
    type.description = null;
  }
  return type;
}

/**
 * Sets the 'description' attribute to null if it's the empty string; useful
 * for cleaning up the schema as printing a schema with a lot of empty string
 * descriptions is u.g.l.y.
 */
function rmEmptyFieldDescription<
  T extends GraphQLFieldConfig<any, any> | GraphQLInputFieldConfig,
>(field: T): T {
  if (field.description === "") {
    field.description = null;
  }
  return field;
}

/**
 * Sets the 'description' attribute to null if it's the empty string; useful
 * for cleaning up the schema as printing a schema with a lot of empty string
 * descriptions is u.g.l.y.
 */
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

export const TrimEmptyDescriptionsPlugin: GraphileConfig.Plugin = {
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
