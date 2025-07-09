import "./global.js";
import "./interfaces.js";
export { isValidBehaviorString } from "./behavior.js";
import { AddNodeInterfaceToSuitableTypesPlugin, BuiltinScalarConnectionsPlugin, ClientMutationIdDescriptionPlugin, CommonBehaviorsPlugin, CommonTypesPlugin, CursorTypePlugin, MutationPayloadQueryPlugin, MutationPlugin, NodeAccessorPlugin, NodeIdCodecBase64JSONPlugin, NodeIdCodecPipeStringPlugin, NodePlugin, PageInfoStartEndCursorPlugin, QueryPlugin, QueryQueryPlugin, RegisterQueryNodePlugin, StreamDeferPlugin, SubscriptionPlugin, SwallowErrorsPlugin, TrimEmptyDescriptionsPlugin } from "./plugins/index.js";
import SchemaBuilder from "./SchemaBuilder.js";
export { camelCase, constantCase, constantCaseAll, EXPORTABLE, EXPORTABLE_OBJECT_CLONE, formatInsideUnderscores, gatherConfig, pluralize, singularize, upperCamelCase, upperFirst, } from "./utils.js";
import type { GrafastArgumentConfig, GrafastFieldConfig, GrafastFieldConfigArgumentMap, PromiseOrDirect } from "grafast";
import type { GraphQLArgumentConfig, GraphQLEnumTypeConfig, GraphQLEnumValueConfig, GraphQLEnumValueConfigMap, GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLFieldConfigMap, GraphQLInputFieldConfig, GraphQLInputFieldConfigMap, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType, GraphQLScalarTypeConfig, GraphQLSchema, GraphQLSchemaConfig } from "grafast/graphql";
import type { PluginHook } from "graphile-config";
import type { GatherPluginContext, GatherPluginContextBase } from "./interfaces.js";
import type { NewWithHooksFunction } from "./newWithHooks/index.js";
export { GraphileBuild, GraphileConfig };
export { NewWithHooksFunction, SchemaBuilder };
/**
 * Generate 'build.inflection' from the given preset.
 */
export declare const buildInflection: (preset: GraphileConfig.Preset) => GraphileBuild.Inflection;
/**
 * One-time gather. See `watchGather` for watch mode.
 */
export declare const gather: (preset: GraphileConfig.Preset, helpers?: {
    inflection: GraphileBuild.Inflection;
}) => Promise<GraphileBuild.BuildInput>;
/**
 * Tells your gather plugins to monitor their sources, and passes the resulting
 * BuildInput to the callback each time a new one is generated. It is
 * guaranteed that the `callback` will be called at least once before the
 * promise resolves.
 *
 * @returns A callback to call to stop watching.
 */
export declare const watchGather: (preset: GraphileConfig.Preset, helpers: {
    inflection: GraphileBuild.Inflection;
} | undefined, callback: (gather: GraphileBuild.BuildInput | null, error: Error | undefined, retry: () => void) => void) => Promise<() => void>;
/**
 * Gets a SchemaBuilder object for the given preset and inflection.  It's rare
 * you would need this, typically you'll want `buildSchema` instead.
 */
export declare const getBuilder: (preset: GraphileConfig.Preset, inflection?: GraphileBuild.Inflection) => SchemaBuilder;
/**
 * Builds a GraphQL schema according to the given preset and input data.
 */
export declare const buildSchema: (rawPreset: GraphileConfig.Preset, input: GraphileBuild.BuildInput, shared?: {
    inflection?: GraphileBuild.Inflection;
}) => GraphQLSchema;
export { AddNodeInterfaceToSuitableTypesPlugin, BuiltinScalarConnectionsPlugin, ClientMutationIdDescriptionPlugin, CommonBehaviorsPlugin, CommonTypesPlugin, CursorTypePlugin, MutationPayloadQueryPlugin, MutationPlugin, NodeAccessorPlugin, NodeIdCodecBase64JSONPlugin, NodeIdCodecPipeStringPlugin, NodePlugin, PageInfoStartEndCursorPlugin, QueryPlugin, QueryQueryPlugin, RegisterQueryNodePlugin, StreamDeferPlugin, SubscriptionPlugin, SwallowErrorsPlugin, TrimEmptyDescriptionsPlugin, };
export { GatherPluginContext } from "./interfaces.js";
export { defaultPreset } from "./preset.js";
export interface SchemaResult {
    schema: GraphQLSchema;
    resolvedPreset: GraphileConfig.ResolvedPreset;
}
/**
 * Builds the GraphQL schema by resolving the preset, running inflection then
 * gather and building the schema. Returns the results.
 *
 * @experimental
 */
export declare function makeSchema(preset: GraphileConfig.Preset): Promise<SchemaResult>;
/**
 * Runs the "gather" phase in watch mode and calls 'callback' with the
 * generated SchemaResult each time a new schema is generated.
 *
 * It is guaranteed that `callback` will be called at least once before the
 * promise resolves.
 *
 * Returns a function that can be called to stop watching.
 *
 * @experimental
 */
export declare function watchSchema(preset: GraphileConfig.Preset, callback: (fatalError: Error | null, params?: SchemaResult) => void): Promise<() => void>;
export { version } from "./version.js";
declare global {
    namespace GraphileBuild {
        type EntityBehaviorHook<entityType extends keyof GraphileBuild.BehaviorEntities> = PluginHook<(behavior: GraphileBuild.BehaviorString, entity: GraphileBuild.BehaviorEntities[entityType], build: GraphileBuild.Build) => GraphileBuild.BehaviorString | GraphileBuild.BehaviorString[]>;
    }
    namespace GraphileConfig {
        interface Provides {
            default: true;
            inferred: true;
            override: true;
        }
        interface Preset {
            /**
             * The inflection phase is the first phase that occurs when building a
             * schema with Graphile Build. It is responsible for naming things - both
             * things that are generated in the `gather` phase, and the ultimate
             * types, fields, arguments, directives and so on in the GraphQL schema.
             */
            inflection?: GraphileBuild.InflectionOptions;
            /**
             * The `gather` phase is the second phase that occurs when building a
             * schema with Graphile Build. It is responsible for looking at
             * everything that can influence the shape of your schema, and turning
             * that into an "input" for the `schema` phase.
             */
            gather?: GraphileBuild.GatherOptions;
            /**
             * The `schema` phase is the final phase that occurs when building a
             * schema with Graphile Build. It is responsible for taking the inputs
             * from the `gather` phase (and using the inflectors from the
             * `inflection` phase) and generating a final GraphQL schema.
             */
            schema?: GraphileBuild.SchemaOptions;
        }
        interface PluginInflectionConfig {
            /**
             * Define new inflectors here
             */
            add?: {
                [key in keyof GraphileBuild.Inflection]?: (this: GraphileBuild.Inflection, options: ResolvedPreset, ...args: Parameters<GraphileBuild.Inflection[key]>) => ReturnType<GraphileBuild.Inflection[key]>;
            };
            /**
             * Overwrite existing inflectors here.
             */
            replace?: {
                [key in keyof GraphileBuild.Inflection]?: (this: GraphileBuild.Inflection, previous: // This is specifically so the `this` argument is removed
                ((...args: Parameters<GraphileBuild.Inflection[key]>) => ReturnType<GraphileBuild.Inflection[key]>) | undefined, options: ResolvedPreset, ...args: Parameters<GraphileBuild.Inflection[key]>) => ReturnType<GraphileBuild.Inflection[key]>;
            };
            /**
             * If set and you attempt to replace a non-existent inflector of one of
             * the given names, we won't warn you.
             */
            ignoreReplaceIfNotExists?: Array<keyof GraphileBuild.Inflection>;
        }
        interface GatherHelpers {
        }
        interface GatherHooks {
        }
        interface PluginGatherConfig<TNamespace extends keyof GatherHelpers, TState extends {
            [key: string]: any;
        } = {
            [key: string]: any;
        }, TCache extends {
            [key: string]: any;
        } = {
            [key: string]: any;
        }> {
            /**
             * A unique namespace for this plugin to use.
             */
            namespace?: TNamespace;
            /**
             * If this plugin supports a persistant internal state (aka a cache, this
             * is an optimisation for watch mode), this returns the value to initialise
             * this cache to.
             */
            initialCache?: (context: GatherPluginContextBase) => TCache;
            /**
             * The initial value to use for this plugin when a new gather run
             * executes.
             */
            initialState?: (cache: TCache, context: GatherPluginContextBase) => PromiseOrDirect<TState>;
            /**
             * The plugin must register helpers to allow other plugins to access its
             * internal state. (Just use an empty object if you don't need any.)
             */
            helpers?: {
                [key in keyof GatherHelpers[TNamespace]]: (info: GatherPluginContext<TState, TCache>, ...args: Parameters<GatherHelpers[TNamespace][key]>) => ReturnType<GatherHelpers[TNamespace][key]>;
            };
            hooks?: {
                [key in keyof GatherHooks]?: PluginHook<GatherHooks[key] extends (...args: infer UArgs) => infer UResult ? (info: GatherPluginContext<TState, TCache>, ...args: UArgs) => UResult : never>;
            };
            /**
             * Responsible for kicking off the data collection - ask for data from
             * other plugins (or your own helpers), write data needed by the 'schema'
             * phase to the 'output' object.
             */
            main?: (output: Partial<GraphileBuild.BuildInput>, info: GatherPluginContext<TState, TCache>) => Promise<void>;
            /**
             * Called when the plugin is put into watch mode; the plugin should call
             * the given callback whenever a change is detected, and should return a
             * function that prevents this behaviour.
             */
            watch?: (info: GatherPluginContext<TState, TCache>, callback: () => void) => PromiseOrDirect<() => void>;
        }
        interface Plugin {
            inflection?: PluginInflectionConfig;
            gather?: PluginGatherConfig<keyof GatherHelpers, any, any>;
            schema?: {
                globalBehavior?: GraphileBuild.BehaviorString | GraphileBuild.BehaviorString[] | ((behavior: GraphileBuild.BehaviorString, build: GraphileBuild.Build) => GraphileBuild.BehaviorString | GraphileBuild.BehaviorString[]);
                behaviorRegistry?: {
                    add?: Partial<Record<keyof GraphileBuild.BehaviorStrings, {
                        description: string;
                        entities: ReadonlyArray<keyof GraphileBuild.BehaviorEntities>;
                    }>>;
                };
                /**
                 * You should use `before`, `after` and `provides` to ensure that the entity
                 * behaviors apply in order. The order should be roughly:
                 *
                 * - `default` - default global behaviors like "update"
                 * - `inferred` - behaviors that are inferred based on the entity, e.g. a plugin might disable filtering _by default_ on a relation if it's unindexed
                 * - `override` - overrides set explicitly by the user
                 */
                entityBehavior?: {
                    [entityType in keyof GraphileBuild.BehaviorEntities]?: GraphileBuild.BehaviorString | GraphileBuild.BehaviorString[] | {
                        inferred?: GraphileBuild.EntityBehaviorHook<entityType>;
                        override?: GraphileBuild.EntityBehaviorHook<entityType>;
                    };
                };
                hooks?: {
                    /**
                     * The build object represents the current schema build and is passed to all
                     * hooks, hook the 'build' event to extend this object. Note: you MUST NOT
                     * generate GraphQL objects during this phase.
                     */
                    build?: PluginHook<GraphileBuild.Hook<Partial<GraphileBuild.Build> & GraphileBuild.BuildBase, GraphileBuild.ContextBuild, Partial<GraphileBuild.Build> & GraphileBuild.BuildBase>>;
                    /**
                     * The `init` phase runs after `build` is complete but before any types
                     * or the schema are actually built. It is the only phase in which you
                     * can register GraphQL types; do so using `build.registerType`.
                     */
                    init?: PluginHook<GraphileBuild.Hook<Record<string, never>, GraphileBuild.ContextInit, GraphileBuild.Build>>;
                    /**
                     * 'finalize' phase is called once the schema is built; typically you
                     * shouldn't use this, but it's useful for interfacing with external
                     * libraries that mutate an already constructed schema.
                     */
                    finalize?: PluginHook<GraphileBuild.Hook<GraphQLSchema, GraphileBuild.ContextFinalize, GraphileBuild.Build>>;
                    /**
                     * Add 'query', 'mutation' or 'subscription' types in this hook:
                     */
                    GraphQLSchema?: PluginHook<GraphileBuild.Hook<GraphQLSchemaConfig, GraphileBuild.ContextSchema, GraphileBuild.Build>>;
                    /**
                     * Add any types that need registering (typically polymorphic types) here
                     */
                    GraphQLSchema_types?: PluginHook<GraphileBuild.Hook<GraphQLNamedType[], GraphileBuild.ContextSchemaTypes, GraphileBuild.Build>>;
                    /**
                     * When creating a GraphQLObjectType via `newWithHooks`, we'll
                     * execute, the following hooks:
                     * - 'GraphQLObjectType' to add any root-level attributes, e.g. add a description
                     * - 'GraphQLObjectType_interfaces' to add additional interfaces to this object type
                     * - 'GraphQLObjectType_fields' to add additional fields to this object type (is
                     *   ran asynchronously and gets a reference to the final GraphQL Object as
                     *   `Self` in the context)
                     * - 'GraphQLObjectType_fields_field' to customize an individual field from above
                     * - 'GraphQLObjectType_fields_field_args' to add additional arguments to a field
                     * - 'GraphQLObjectType_fields_field_args_arg' to customize an individual argument from above
                     */
                    GraphQLObjectType?: PluginHook<GraphileBuild.Hook<GraphileBuild.GrafastObjectTypeConfig<any>, GraphileBuild.ContextObject, GraphileBuild.Build>>;
                    GraphQLObjectType_interfaces?: PluginHook<GraphileBuild.Hook<GraphQLInterfaceType[], GraphileBuild.ContextObjectInterfaces, GraphileBuild.Build>>;
                    GraphQLObjectType_fields?: PluginHook<GraphileBuild.Hook<GraphileBuild.GrafastFieldConfigMap<any>, GraphileBuild.ContextObjectFields, GraphileBuild.Build>>;
                    GraphQLObjectType_fields_field?: PluginHook<GraphileBuild.Hook<GrafastFieldConfig<any, any, any, any>, GraphileBuild.ContextObjectFieldsField, GraphileBuild.Build>>;
                    GraphQLObjectType_fields_field_args?: PluginHook<GraphileBuild.Hook<GrafastFieldConfigArgumentMap, GraphileBuild.ContextObjectFieldsFieldArgs, GraphileBuild.Build>>;
                    GraphQLObjectType_fields_field_args_arg?: PluginHook<GraphileBuild.Hook<GrafastArgumentConfig<any, any, any>, GraphileBuild.ContextObjectFieldsFieldArgsArg, GraphileBuild.Build>>;
                    /**
                     * When creating a GraphQLInputObjectType via `newWithHooks`, we'll
                     * execute, the following hooks:
                     * - 'GraphQLInputObjectType' to add any root-level attributes, e.g. add a description
                     * - 'GraphQLInputObjectType_fields' to add additional fields to this object type (is
                     *   ran asynchronously and gets a reference to the final GraphQL Object as
                     *   `Self` in the context)
                     * - 'GraphQLInputObjectType_fields_field' to customize an individual field from above
                     */
                    GraphQLInputObjectType?: PluginHook<GraphileBuild.Hook<GraphileBuild.GrafastInputObjectTypeConfig, GraphileBuild.ContextInputObject, GraphileBuild.Build>>;
                    GraphQLInputObjectType_fields?: PluginHook<GraphileBuild.Hook<GraphQLInputFieldConfigMap, GraphileBuild.ContextInputObjectFields, GraphileBuild.Build>>;
                    GraphQLInputObjectType_fields_field?: PluginHook<GraphileBuild.Hook<GraphQLInputFieldConfig, GraphileBuild.ContextInputObjectFieldsField, GraphileBuild.Build>>;
                    /**
                     * When creating a GraphQLEnumType via `newWithHooks`, we'll
                     * execute, the following hooks:
                     * - 'GraphQLEnumType' to add any root-level attributes, e.g. add a description
                     * - 'GraphQLEnumType_values' to add additional values
                     * - 'GraphQLEnumType_values_value' to change an individual value
                     */
                    GraphQLEnumType?: PluginHook<GraphileBuild.Hook<GraphQLEnumTypeConfig, GraphileBuild.ContextEnum, GraphileBuild.Build>>;
                    GraphQLEnumType_values?: PluginHook<GraphileBuild.Hook<GraphQLEnumValueConfigMap, GraphileBuild.ContextEnumValues, GraphileBuild.Build>>;
                    GraphQLEnumType_values_value?: PluginHook<GraphileBuild.Hook<GraphQLEnumValueConfig, GraphileBuild.ContextEnumValuesValue, GraphileBuild.Build>>;
                    /**
                     * When creating a GraphQLUnionType via `newWithHooks`, we'll
                     * execute, the following hooks:
                     * - 'GraphQLUnionType' to add any root-level attributes, e.g. add a description
                     * - 'GraphQLUnionType_types' to add additional types to this union
                     */
                    GraphQLUnionType?: PluginHook<GraphileBuild.Hook<GraphileBuild.GrafastUnionTypeConfig<any>, GraphileBuild.ContextUnion, GraphileBuild.Build>>;
                    GraphQLUnionType_types?: PluginHook<GraphileBuild.Hook<GraphQLObjectType[], GraphileBuild.ContextUnionTypes, GraphileBuild.Build>>;
                    /**
                     * When creating a GraphQLInterfaceType via `newWithHooks`, we'll
                     *  execute, the following hooks:
                     *  - 'GraphQLInterfaceType' to add any root-level attributes, e.g. add a description
                     *  - 'GraphQLInterfaceType_fields' to add additional fields to this interface type (is
                     *    ran asynchronously and gets a reference to the final GraphQL Interface as
                     *    `Self` in the context)
                     *  - 'GraphQLInterfaceType_fields_field' to customise an individual field from above
                     *  - 'GraphQLInterfaceType_fields_field_args' to add additional arguments to a field
                     *  - 'GraphQLInterfaceType_fields_field_args_arg' to customize an individual arguments from the above
                     */
                    GraphQLInterfaceType?: PluginHook<GraphileBuild.Hook<GraphileBuild.GrafastInterfaceTypeConfig<any>, GraphileBuild.ContextInterface, GraphileBuild.Build>>;
                    GraphQLInterfaceType_fields?: PluginHook<GraphileBuild.Hook<GraphQLFieldConfigMap<any, any>, GraphileBuild.ContextInterfaceFields, GraphileBuild.Build>>;
                    GraphQLInterfaceType_fields_field?: PluginHook<GraphileBuild.Hook<GraphQLFieldConfig<any, any>, GraphileBuild.ContextInterfaceFieldsField, GraphileBuild.Build>>;
                    GraphQLInterfaceType_fields_field_args?: PluginHook<GraphileBuild.Hook<GraphQLFieldConfigArgumentMap, GraphileBuild.ContextInterfaceFieldsFieldArgs, GraphileBuild.Build>>;
                    GraphQLInterfaceType_fields_field_args_arg?: PluginHook<GraphileBuild.Hook<GraphQLArgumentConfig, GraphileBuild.ContextInterfaceFieldsFieldArgsArg, GraphileBuild.Build>>;
                    GraphQLInterfaceType_interfaces?: PluginHook<GraphileBuild.Hook<GraphQLInterfaceType[], GraphileBuild.ContextInterfaceInterfaces, GraphileBuild.Build>>;
                    /**
                     * For scalars
                     */
                    GraphQLScalarType?: PluginHook<GraphileBuild.Hook<GraphQLScalarTypeConfig<any, any>, GraphileBuild.ContextScalar, GraphileBuild.Build>>;
                };
            };
        }
    }
}
//# sourceMappingURL=index.d.ts.map