import type {
  GraphileFieldConfig,
  GraphileFieldConfigArgumentMap,
} from "dataplanner";
import type {
  AsyncHooks,
  GatherHelpers,
  GatherHooks,
  PluginHook,
} from "graphile-plugin";
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

/**
 * The details in the 'info' object passed as the first argument to all gather
 * hooks and helpers.
 */
export interface GatherPluginContext<
  TState extends { [key: string]: any },
  TCache extends { [key: string]: any },
> {
  /**
   * The (completed) inflection object, to help you name things your data
   * gathering produces.
   */
  inflection: GraphileEngine.Inflection;

  /**
   * The 'gather' phase options from the resolved preset.
   */
  options: GraphileEngine.GraphileBuildGatherOptions;

  /**
   * The `helpers` that all the gather plugins make available to you.
   */
  helpers: GatherHelpers;

  /**
   * The state for this plugin specifically. State exists only for a single
   * 'gather' phase and is then discarded.
   */
  state: TState;

  /**
   * The cache for this plugin specifically. The cache persists between
   * multiple 'gather' phases and can be a useful place to cache expensive
   * computation so later builds are faster. NOTE: cache is _not_ persisted, it
   * only exists whilst the code is in memory.
   */
  cache: TCache;

  /**
   * Triggers the given hook with the given event (used to broadcast to other
   * gather plugins so they can make their own changes/additions).
   */
  process: AsyncHooks<GatherHooks>["process"];
}

declare module "graphile-plugin" {
  /** @notExported */
  interface Preset {
    inflection?: GraphileEngine.GraphileBuildInflectionOptions;
    gather?: GraphileEngine.GraphileBuildGatherOptions;
    schema?: GraphileEngine.GraphileBuildSchemaOptions;
  }

  /** @notExported */
  interface PluginInflectionConfig {
    /**
     * Define new inflectors here
     */
    add?: {
      [key in keyof GraphileEngine.Inflection]?: (
        this: GraphileEngine.Inflection,
        // TODO: should we wrap this in an object to allow future expansion?
        options: Preset,
        ...args: Parameters<GraphileEngine.Inflection[key]>
      ) => ReturnType<GraphileEngine.Inflection[key]>;
    };

    /**
     * Overwrite existing inflectors here.
     */
    replace?: {
      [key in keyof GraphileEngine.Inflection]?: (
        this: GraphileEngine.Inflection,
        previous: GraphileEngine.Inflection[key] | undefined,
        options: Preset,
        ...args: Parameters<GraphileEngine.Inflection[key]>
      ) => ReturnType<GraphileEngine.Inflection[key]>;
    };
  }

  /** @notExported */
  interface GatherHelpers {
    // Extend this with declaration merging
  }

  /** @notExported */
  interface GatherHooks {
    // Extend this with declaration merging
  }

  /** @notExported */
  interface PluginGatherConfig<
    TNamespace extends keyof GatherHelpers,
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
        ...args: infer UArgs
      ) => infer UReturnType
        ? (
            info: GatherPluginContext<TState, TCache>,
            ...args: UArgs
          ) => UReturnType
        : never;
    };

    hooks?: {
      [key in keyof GatherHooks]?: GatherHooks[key] extends PluginHook<infer U>
        ? (
            info: GatherPluginContext<TState, TCache>,
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
      info: GatherPluginContext<TState, TCache>,
    ) => Promise<void>;
  }

  /** @notExported */
  interface Plugin {
    inflection?: PluginInflectionConfig;

    gather?: PluginGatherConfig<keyof GatherHelpers, any, any>;

    schema?: {
      hooks?: {
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
         * The `init` phase runs after `build` is complete but before any types
         * or the schema are actually built. It is the only phase in which you
         * can register GraphQL types; do so using `build.registerType`.
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
         * - 'GraphQLObjectType_interfaces' to add additional interfaces to this object type
         * - 'GraphQLObjectType_fields' to add additional fields to this object type (is
         *   ran asynchronously and gets a reference to the final GraphQL Object as
         *   `Self` in the context)
         * - 'GraphQLObjectType_fields_field' to customize an individual field from above
         * - 'GraphQLObjectType_fields_field_args' to customize the arguments to a field
         */
        GraphQLObjectType?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileObjectTypeConfig<any, any>,
            GraphileEngine.ContextGraphQLObjectType,
            GraphileEngine.Build
          >
        >;
        GraphQLObjectType_interfaces?: PluginHook<
          GraphileEngine.Hook<
            GraphQLInterfaceType[],
            GraphileEngine.ContextGraphQLObjectTypeInterfaces,
            GraphileEngine.Build
          >
        >;
        GraphQLObjectType_fields?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileFieldConfigMap<any, any>,
            GraphileEngine.ContextGraphQLObjectTypeFields,
            GraphileEngine.Build
          >
        >;
        GraphQLObjectType_fields_field?: PluginHook<
          GraphileEngine.Hook<
            GraphileFieldConfig<any, any, any, any, any>,
            GraphileEngine.ContextGraphQLObjectTypeFieldsField,
            GraphileEngine.Build
          >
        >;
        GraphQLObjectType_fields_field_args?: PluginHook<
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
         * - 'GraphQLInputObjectType_fields' to add additional fields to this object type (is
         *   ran asynchronously and gets a reference to the final GraphQL Object as
         *   `Self` in the context)
         * - 'GraphQLInputObjectType_fields_field' to customize an individual field from above
         */
        GraphQLInputObjectType?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileInputObjectTypeConfig,
            GraphileEngine.ContextGraphQLInputObjectType,
            GraphileEngine.Build
          >
        >;
        GraphQLInputObjectType_fields?: PluginHook<
          GraphileEngine.Hook<
            GraphQLInputFieldConfigMap,
            GraphileEngine.ContextGraphQLInputObjectTypeFields,
            GraphileEngine.Build
          >
        >;
        GraphQLInputObjectType_fields_field?: PluginHook<
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
         * - 'GraphQLEnumType_values' to add additional values
         * - 'GraphQLEnumType_values_value' to change an individual value
         */
        GraphQLEnumType?: PluginHook<
          GraphileEngine.Hook<
            GraphQLEnumTypeConfig,
            GraphileEngine.ContextGraphQLEnumType,
            GraphileEngine.Build
          >
        >;
        GraphQLEnumType_values?: PluginHook<
          GraphileEngine.Hook<
            GraphQLEnumValueConfigMap,
            GraphileEngine.ContextGraphQLEnumTypeValues,
            GraphileEngine.Build
          >
        >;
        GraphQLEnumType_values_value?: PluginHook<
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
         * - 'GraphQLUnionType_types' to add additional types to this union
         */
        GraphQLUnionType?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileUnionTypeConfig<any, any>,
            GraphileEngine.ContextGraphQLUnionType,
            GraphileEngine.Build
          >
        >;
        GraphQLUnionType_types?: PluginHook<
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
         *  - 'GraphQLInterfaceType_fields' to add additional fields to this interface type (is
         *    ran asynchronously and gets a reference to the final GraphQL Interface as
         *    `Self` in the context)
         *  - 'GraphQLInterfaceType_fields_field' to customise an individual field from above
         *  - 'GraphQLInterfaceType_fields_field_args' to customize the arguments to a field
         */
        GraphQLInterfaceType?: PluginHook<
          GraphileEngine.Hook<
            GraphileEngine.GraphileInterfaceTypeConfig<any, any>,
            GraphileEngine.ContextGraphQLInterfaceType,
            GraphileEngine.Build
          >
        >;
        GraphQLInterfaceType_fields?: PluginHook<
          GraphileEngine.Hook<
            GraphQLFieldConfigMap<any, any>,
            GraphileEngine.ContextGraphQLInterfaceTypeFields,
            GraphileEngine.Build
          >
        >;
        GraphQLInterfaceType_fields_field?: PluginHook<
          GraphileEngine.Hook<
            GraphQLFieldConfig<any, any>,
            GraphileEngine.ContextGraphQLInterfaceTypeFieldsField,
            GraphileEngine.Build
          >
        >;
        GraphQLInterfaceType_fields_field_args?: PluginHook<
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
