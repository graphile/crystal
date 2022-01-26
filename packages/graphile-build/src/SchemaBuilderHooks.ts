import "./global.js";

export function makeSchemaBuilderHooks<
  TBuild extends GraphileEngine.Build = GraphileEngine.Build,
>(): GraphileEngine.SchemaBuilderHooks<TBuild> {
  return {
    build: [],
    init: [],
    finalize: [],
    GraphQLSchema: [],
    GraphQLObjectType: [],
    GraphQLObjectType_interfaces: [],
    GraphQLObjectType_fields: [],
    GraphQLObjectType_fields_field: [],
    GraphQLObjectType_fields_field_args: [],
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
    GraphQLScalarType: [],
  };
}
