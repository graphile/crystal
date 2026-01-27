import "./global.ts";

/**
 * Returns a new object with arrays for each supported schema hook, ready for
 * hook functions to be registered into it.
 */
export function makeSchemaBuilderHooks<
  TBuild extends GraphileBuild.Build = GraphileBuild.Build,
>(): GraphileBuild.SchemaBuilderHooks<TBuild> {
  return {
    build: [],
    init: [],
    finalize: [],
    GraphQLSchema: [],
    GraphQLSchema_types: [],
    GraphQLObjectType: [],
    GraphQLObjectType_interfaces: [],
    GraphQLObjectType_fields: [],
    GraphQLObjectType_fields_field: [],
    GraphQLObjectType_fields_field_args: [],
    GraphQLObjectType_fields_field_args_arg: [],
    GraphQLInputObjectType: [],
    GraphQLInputObjectType_fields: [],
    GraphQLInputObjectType_fields_field: [],
    GraphQLEnumType: [],
    GraphQLEnumType_values: [],
    GraphQLEnumType_values_value: [],
    GraphQLUnionType: [],
    GraphQLUnionType_types: [],
    GraphQLInterfaceType: [],
    GraphQLInterfaceType_fields: [],
    GraphQLInterfaceType_fields_field: [],
    GraphQLInterfaceType_fields_field_args: [],
    GraphQLInterfaceType_fields_field_args_arg: [],
    GraphQLInterfaceType_interfaces: [],
    GraphQLScalarType: [],
  };
}
