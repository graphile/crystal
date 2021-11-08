import "./global";

export function makeSchemaBuilderHooks<
  TBuild extends GraphileEngine.Build = GraphileEngine.Build,
>(): GraphileEngine.SchemaBuilderHooks<TBuild> {
  return {
    inflection: [],
    build: [],
    init: [],
    finalize: [],
    GraphQLSchema: [],
    GraphQLObjectType: [],
    "GraphQLObjectType:interfaces": [],
    "GraphQLObjectType:fields": [],
    "GraphQLObjectType:fields:field": [],
    "GraphQLObjectType:fields:field:args": [],
    GraphQLInputObjectType: [],
    "GraphQLInputObjectType:fields": [],
    "GraphQLInputObjectType:fields:field": [],
    GraphQLEnumType: [],
    "GraphQLEnumType:values": [],
    "GraphQLEnumType:values:value": [],
    GraphQLUnionType: [],
    "GraphQLUnionType:types": [],
    GraphQLInterfaceType: [],
    "GraphQLInterfaceType:fields": [],
    "GraphQLInterfaceType:fields:field": [],
    "GraphQLInterfaceType:fields:field:args": [],
    GraphQLScalarType: [],
  };
}
