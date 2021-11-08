import "./global";

import type {
  GraphQLEnumTypeConfig,
  GraphQLEnumValueConfig,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLFieldMap,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInterfaceTypeConfig,
  GraphQLScalarTypeConfig,
  GraphQLSchema,
  GraphQLSchemaConfig,
} from "graphql";

export interface SchemaBuilderHooks<
  TBuild extends GraphileEngine.Build = GraphileEngine.Build,
> {
  /**
   * Inflection is used for naming resulting types/fields/args/etc - it's
   * hook-able so that other plugins may extend it or override it. `Build` is
   * exceedingly barebones at this point since no plugins have been allowed to
   * extend it.
   */
  inflection: GraphileEngine.Hook<
    Partial<GraphileEngine.Inflection>,
    GraphileEngine.ContextInflection,
    GraphileEngine.BuildBase
  >[];

  /**
   * The build object represents the current schema build and is passed to all
   * hooks, hook the 'build' event to extend this object. Note: you MUST NOT
   * generate GraphQL objects during this phase.
   */
  build: GraphileEngine.Hook<
    Partial<TBuild> & GraphileEngine.BuildBase,
    GraphileEngine.ContextBuild,
    Partial<TBuild> & GraphileEngine.BuildBase
  >[];

  /**
   * The `init` phase runs after `inflection` and `build` are complete but
   * before any types or the schema are actually built. It is the only phase in
   * which you can register GraphQL types; do so using `build.registerType`.
   */
  init: GraphileEngine.Hook<
    Record<string, never>,
    GraphileEngine.ContextInit,
    TBuild
  >[];

  /**
   * 'finalize' phase is called once the schema is built; typically you
   * shouldn't use this, but it's useful for interfacing with external
   * libraries that mutate an already constructed schema.
   */
  finalize: GraphileEngine.Hook<
    GraphQLSchema,
    GraphileEngine.ContextFinalize,
    TBuild
  >[];

  /**
   * Add 'query', 'mutation' or 'subscription' types in this hook:
   */
  GraphQLSchema: GraphileEngine.Hook<
    GraphQLSchemaConfig,
    GraphileEngine.ContextGraphQLSchema,
    TBuild
  >[];

  /**
   * When creating a GraphQLObjectType via `newWithHooks`, we'll
   * execute, the following hooks:
   * - 'GraphQLObjectType' to add any root-level attributes, e.g. add a description
   * - 'GraphQLObjectType:interfaces' to add additional interfaces to this object type
   * - 'GraphQLObjectType:fields' to add additional fields to this object type (is
   *   ran asynchronously and gets a reference to the final GraphQL Object as
   *   `Self` in the context)
   * - 'GraphQLObjectType:fields:field' to customize an individual field from above
   * - 'GraphQLObjectType:fields:field:args' to customize the arguments to a field
   */
  GraphQLObjectType: GraphileEngine.Hook<
    GraphileEngine.GraphileObjectTypeConfig<any, any>,
    GraphileEngine.ContextGraphQLObjectType,
    TBuild
  >[];
  "GraphQLObjectType:interfaces": GraphileEngine.Hook<
    string[],
    GraphileEngine.ContextGraphQLObjectTypeInterfaces,
    TBuild
  >[];
  "GraphQLObjectType:fields": GraphileEngine.Hook<
    GraphQLFieldMap<any, any>,
    GraphileEngine.ContextGraphQLObjectTypeFields,
    TBuild
  >[];
  "GraphQLObjectType:fields:field": GraphileEngine.Hook<
    GraphQLFieldConfig<any, any>,
    GraphileEngine.ContextGraphQLObjectTypeFieldsField,
    TBuild
  >[];
  "GraphQLObjectType:fields:field:args": GraphileEngine.Hook<
    GraphQLFieldConfigArgumentMap,
    GraphileEngine.ContextGraphQLObjectTypeFieldsFieldArgs,
    TBuild
  >[];

  /**
   * When creating a GraphQLInputObjectType via `newWithHooks`, we'll
   * execute, the following hooks:
   * - 'GraphQLInputObjectType' to add any root-level attributes, e.g. add a description
   * - 'GraphQLInputObjectType:fields' to add additional fields to this object type (is
   *   ran asynchronously and gets a reference to the final GraphQL Object as
   *   `Self` in the context)
   * - 'GraphQLInputObjectType:fields:field' to customize an individual field from above
   */
  GraphQLInputObjectType: GraphileEngine.Hook<
    GraphileEngine.GraphileInputObjectTypeConfig,
    GraphileEngine.ContextGraphQLInputObjectType,
    TBuild
  >[];
  "GraphQLInputObjectType:fields": GraphileEngine.Hook<
    GraphQLInputFieldConfigMap,
    GraphileEngine.ContextGraphQLInputObjectTypeFields,
    TBuild
  >[];
  "GraphQLInputObjectType:fields:field": GraphileEngine.Hook<
    GraphQLInputFieldConfig,
    GraphileEngine.ContextGraphQLInputObjectTypeFieldsField,
    TBuild
  >[];

  /**
   * When creating a GraphQLEnumType via `newWithHooks`, we'll
   * execute, the following hooks:
   * - 'GraphQLEnumType' to add any root-level attributes, e.g. add a description
   * - 'GraphQLEnumType:values' to add additional values
   * - 'GraphQLEnumType:values:value' to change an individual value
   */
  GraphQLEnumType: GraphileEngine.Hook<
    GraphQLEnumTypeConfig,
    GraphileEngine.ContextGraphQLEnumType,
    TBuild
  >[];
  "GraphQLEnumType:values": GraphileEngine.Hook<
    GraphQLEnumValueConfigMap,
    GraphileEngine.ContextGraphQLEnumTypeValues,
    TBuild
  >[];
  "GraphQLEnumType:values:value": GraphileEngine.Hook<
    GraphQLEnumValueConfig,
    GraphileEngine.ContextGraphQLEnumTypeValuesValue,
    TBuild
  >[];

  /**
   * When creating a GraphQLUnionType via `newWithHooks`, we'll
   * execute, the following hooks:
   * - 'GraphQLUnionType' to add any root-level attributes, e.g. add a description
   * - 'GraphQLUnionType:types' to add additional types to this union
   */
  GraphQLUnionType: GraphileEngine.Hook<
    GraphileEngine.GraphileUnionTypeConfig<any, any>,
    GraphileEngine.ContextGraphQLUnionType,
    TBuild
  >[];
  "GraphQLUnionType:types": GraphileEngine.Hook<
    string[],
    GraphileEngine.ContextGraphQLUnionTypeTypes,
    TBuild
  >[];

  /**
   * When creating a GraphQLInterfaceType via `newWithHooks`, we'll
   *  execute, the following hooks:
   *  - 'GraphQLInterfaceType' to add any root-level attributes, e.g. add a description
   *  - 'GraphQLInterfaceType:fields' to add additional fields to this interface type (is
   *    ran asynchronously and gets a reference to the final GraphQL Interface as
   *    `Self` in the context)
   *  - 'GraphQLInterfaceType:fields:field' to customise an individual field from above
   *  - 'GraphQLInterfaceType:fields:field:args' to customize the arguments to a field
   */
  GraphQLInterfaceType: GraphileEngine.Hook<
    GraphileEngine.GraphileInterfaceTypeConfig<any, any>,
    GraphileEngine.ContextGraphQLInterfaceType,
    TBuild
  >[];
  "GraphQLInterfaceType:fields": GraphileEngine.Hook<
    GraphQLFieldConfigMap<any, any>,
    GraphileEngine.ContextGraphQLInterfaceTypeFields,
    TBuild
  >[];
  "GraphQLInterfaceType:fields:field": GraphileEngine.Hook<
    GraphQLInterfaceTypeConfig<any, any>,
    GraphileEngine.ContextGraphQLInterfaceTypeFieldsField,
    TBuild
  >[];
  "GraphQLInterfaceType:fields:field:args": GraphileEngine.Hook<
    GraphQLInterfaceTypeConfig<any, any>,
    GraphileEngine.ContextGraphQLInterfaceTypeFieldsFieldArgs,
    TBuild
  >[];

  /**
   * For scalars
   */
  GraphQLScalarType: GraphileEngine.Hook<
    GraphQLScalarTypeConfig<any, any>,
    GraphileEngine.ContextGraphQLScalarType,
    TBuild
  >[];
}
