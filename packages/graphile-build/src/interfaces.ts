import type {
  GraphileFieldConfig,
  GraphileFieldConfigArgumentMap,
} from "graphile-crystal";
import type { AsyncHooks, PluginHook } from "graphile-plugin";
import type {
  GraphQLEnumTypeConfig,
  GraphQLEnumValueConfig,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarTypeConfig,
  GraphQLSchema,
  GraphQLSchemaConfig,
} from "graphql";

declare module "graphile-plugin" {
  interface Preset {
    schema?: GraphileEngine.GraphileBuildSchemaOptions;
    gather?: GraphileEngine.GraphileBuildGatherOptions;
  }

  interface GatherHelpers {
    // Extend this with declaration merging
  }

  interface GatherHooks {
    // Extend this with declaration merging
  }

  interface PluginGatherConfig<
    TNamespace extends keyof GatherHelpers = keyof GatherHelpers,
    TState extends { [key: string]: any } = { [key: string]: any },
    TCache extends { [key: string]: any } = { [key: string]: any },
  > {
    /**
     * A unique namespace for this plugin to use.
     */
    namespace: TNamespace;

    /**
     * If this plugin supports a persistant internal state (aka a cache, this
     * is an optimisation for watch mode), this returns the value to initialise
     * this cache to.
     */
    initialCache?: () => TCache;

    /**
     * The initial value to use for this plugin when a new gather run
     * executes.
     */
    initialState?: () => TState;

    /**
     * The plugin must register helpers to allow other plugins to access its
     * internal state. (Just use an empty object if you don't need any.)
     */
    helpers: {
      [key in keyof GatherHelpers[TNamespace]]: GatherHelpers[TNamespace][key] extends (
        ...args: any[]
      ) => any
        ? (
            info: {
              options: GraphileEngine.GraphileBuildGatherOptions;
              state: TState;
              cache: TCache;
              process: AsyncHooks<GatherHooks>["process"];
            },
            ...args: Parameters<GatherHelpers[TNamespace][key]>
          ) => ReturnType<GatherHelpers[TNamespace][key]>
        : never;
    };

    hooks?: {
      [key in keyof GatherHooks]?: GatherHooks[key] extends PluginHook<infer U>
        ? (
            context: {
              options: GraphileEngine.GraphileBuildGatherOptions;
              state: TState;
              cache: TCache;
              process: AsyncHooks<GatherHooks>["process"];
            },
            ...args: Parameters<U>
          ) => ReturnType<U>
        : never;
    };

    /**
     * Responsible for kicking off the data collection - ask for data from
     * other plugins (or your own helpers), write data needed by the 'schema'
     * phase to the 'output' object.
     */
    main?: (
      output: Partial<GraphileEngine.BuildInput>,
      context: {
        options: GraphileEngine.GraphileBuildGatherOptions;
        state: TState;
        cache: TCache;
      },
      helpers: GatherHelpers,
    ) => Promise<void>;
  }

  interface Plugin {
    gather?: PluginGatherConfig;

    schema?: {
      hooks?: {
        /**
         * Inflection is used for naming resulting types/fields/args/etc - it's
         * hook-able so that other plugins may extend it or override it. `Build` is
         * exceedingly barebones at this point since no plugins have been allowed to
         * extend it.
         */
        inflection?: PluginHook<
          GraphileEngine.Hook<
            Partial<GraphileEngine.Inflection>,
            GraphileEngine.ContextInflection,
            GraphileEngine.BuildBase
          >
        >;

        /**
         * The build object represents the current schema build and is passed to all
         * hooks, hook the 'build' event to extend this object. Note: you MUST NOT
         * generate GraphQL objects during this phase.
         */
        build?: PluginHook<
          GraphileEngine.Hook<
            Partial<GraphileEngine.Build> & GraphileEngine.BuildBase,
            GraphileEngine.ContextBuild,
            Partial<GraphileEngine.Build> & GraphileEngine.BuildBase
          >
        >;

        /**
         * The `init` phase runs after `inflection` and `build` are complete but
         * before any types or the schema are actually built. It is the only phase in
         * which you can register GraphQL types; do so using `build.registerType`.
         */
        init?: PluginHook<
          GraphileEngine.Hook<
            Record<string, never>,
            GraphileEngine.ContextInit,
            GraphileEngine.Build
          >
        >;

        /**
         * 'finalize' phase is called once the schema is built; typically you
         * shouldn't use this, but it's useful for interfacing with external
         * libraries that mutate an already constructed schema.
         */
        finalize?: PluginHook<
          GraphileEngine.Hook<
            GraphQLSchema,
            GraphileEngine.ContextFinalize,
            GraphileEngine.Build
          >
        >;

        /**
         * Add 'query', 'mutation' or 'subscription' types in this hook:
         */
        GraphQLSchema?: PluginHook<
          GraphileEngine.Hook<
            GraphQLSchemaConfig,
            GraphileEngine.ContextGraphQLSchema,
            GraphileEngine.Build
          >
        >;

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
        GraphQLObjectType?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileObjectTypeConfig<any, any>,
            GraphileEngine.ContextGraphQLObjectType,
            GraphileEngine.Build
          >
        >;
        "GraphQLObjectType:interfaces"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLInterfaceType[],
            GraphileEngine.ContextGraphQLObjectTypeInterfaces,
            GraphileEngine.Build
          >
        >;
        "GraphQLObjectType:fields"?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileFieldConfigMap<any, any>,
            GraphileEngine.ContextGraphQLObjectTypeFields,
            GraphileEngine.Build
          >
        >;
        "GraphQLObjectType:fields:field"?: PluginHook<
          GraphileEngine.Hook<
            GraphileFieldConfig<any, any, any, any, any>,
            GraphileEngine.ContextGraphQLObjectTypeFieldsField,
            GraphileEngine.Build
          >
        >;
        "GraphQLObjectType:fields:field:args"?: PluginHook<
          GraphileEngine.Hook<
            GraphileFieldConfigArgumentMap<any, any, any, any>,
            GraphileEngine.ContextGraphQLObjectTypeFieldsFieldArgs,
            GraphileEngine.Build
          >
        >;

        /**
         * When creating a GraphQLInputObjectType via `newWithHooks`, we'll
         * execute, the following hooks:
         * - 'GraphQLInputObjectType' to add any root-level attributes, e.g. add a description
         * - 'GraphQLInputObjectType:fields' to add additional fields to this object type (is
         *   ran asynchronously and gets a reference to the final GraphQL Object as
         *   `Self` in the context)
         * - 'GraphQLInputObjectType:fields:field' to customize an individual field from above
         */
        GraphQLInputObjectType?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileInputObjectTypeConfig,
            GraphileEngine.ContextGraphQLInputObjectType,
            GraphileEngine.Build
          >
        >;
        "GraphQLInputObjectType:fields"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLInputFieldConfigMap,
            GraphileEngine.ContextGraphQLInputObjectTypeFields,
            GraphileEngine.Build
          >
        >;
        "GraphQLInputObjectType:fields:field"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLInputFieldConfig,
            GraphileEngine.ContextGraphQLInputObjectTypeFieldsField,
            GraphileEngine.Build
          >
        >;

        /**
         * When creating a GraphQLEnumType via `newWithHooks`, we'll
         * execute, the following hooks:
         * - 'GraphQLEnumType' to add any root-level attributes, e.g. add a description
         * - 'GraphQLEnumType:values' to add additional values
         * - 'GraphQLEnumType:values:value' to change an individual value
         */
        GraphQLEnumType?: PluginHook<
          GraphileEngine.Hook<
            GraphQLEnumTypeConfig,
            GraphileEngine.ContextGraphQLEnumType,
            GraphileEngine.Build
          >
        >;
        "GraphQLEnumType:values"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLEnumValueConfigMap,
            GraphileEngine.ContextGraphQLEnumTypeValues,
            GraphileEngine.Build
          >
        >;
        "GraphQLEnumType:values:value"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLEnumValueConfig,
            GraphileEngine.ContextGraphQLEnumTypeValuesValue,
            GraphileEngine.Build
          >
        >;

        /**
         * When creating a GraphQLUnionType via `newWithHooks`, we'll
         * execute, the following hooks:
         * - 'GraphQLUnionType' to add any root-level attributes, e.g. add a description
         * - 'GraphQLUnionType:types' to add additional types to this union
         */
        GraphQLUnionType?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileUnionTypeConfig<any, any>,
            GraphileEngine.ContextGraphQLUnionType,
            GraphileEngine.Build
          >
        >;
        "GraphQLUnionType:types"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLObjectType[],
            GraphileEngine.ContextGraphQLUnionTypeTypes,
            GraphileEngine.Build
          >
        >;

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
        GraphQLInterfaceType?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileInterfaceTypeConfig<any, any>,
            GraphileEngine.ContextGraphQLInterfaceType,
            GraphileEngine.Build
          >
        >;
        "GraphQLInterfaceType:fields"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLFieldConfigMap<any, any>,
            GraphileEngine.ContextGraphQLInterfaceTypeFields,
            GraphileEngine.Build
          >
        >;
        "GraphQLInterfaceType:fields:field"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLFieldConfig<any, any>,
            GraphileEngine.ContextGraphQLInterfaceTypeFieldsField,
            GraphileEngine.Build
          >
        >;
        "GraphQLInterfaceType:fields:field:args"?: PluginHook<
          GraphileEngine.Hook<
            GraphQLFieldConfigArgumentMap,
            GraphileEngine.ContextGraphQLInterfaceTypeFieldsFieldArgs,
            GraphileEngine.Build
          >
        >;

        /**
         * For scalars
         */
        GraphQLScalarType?: PluginHook<
          GraphileEngine.Hook<
            GraphQLScalarTypeConfig<any, any>,
            GraphileEngine.ContextGraphQLScalarType,
            GraphileEngine.Build
          >
        >;
      };
    };
  }
}
