import type { GrafastArgumentConfig } from "grafast";
import type {} from "graphile-config";
import type {
  GraphQLEnumTypeConfig,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
} from "graphql";

/**
 * Sets the 'description' attribute to null if it's the empty string; useful
 * for cleaning up the schema as printing a schema with a lot of empty string
 * descriptions is u.g.l.y.
 */
function rmEmptyTypeDescription<
  T extends
    | GraphileBuild.GrafastObjectTypeConfig<any, any>
    | GraphileBuild.GrafastInputObjectTypeConfig
    | GraphileBuild.GrafastUnionTypeConfig<any, any>
    | GraphileBuild.GrafastInterfaceTypeConfig<any, any>
    | GraphQLEnumTypeConfig,
>(type: T): T {
  if (type.description?.trim() === "") {
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
function rmEmptyArgDescriptions<
  T extends GrafastArgumentConfig<any, any, any, any, any, any>,
>(arg: T): T {
  if (arg.description === "") {
    arg.description = null;
  }
  return arg;
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
      GraphQLObjectType_fields_field_args_arg: rmEmptyArgDescriptions,
      GraphQLInputObjectType: rmEmptyTypeDescription,
      GraphQLInputObjectType_fields_field: rmEmptyFieldDescription,
      GraphQLUnionType: rmEmptyTypeDescription,
      GraphQLInterfaceType: rmEmptyTypeDescription,
      GraphQLInterfaceType_fields_field: rmEmptyFieldDescription,
      GraphQLInterfaceType_fields_field_args_arg: rmEmptyArgDescriptions,
      GraphQLEnumType: rmEmptyTypeDescription,
    },
  },
};
