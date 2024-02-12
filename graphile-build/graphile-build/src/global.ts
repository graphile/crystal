import type {
  BaseGraphQLArguments,
  ExecutableStep,
  GrafastArgumentConfig,
  GrafastFieldConfig,
  GrafastFieldConfigArgumentMap,
  GrafastInputFieldConfig,
  GrafastInputFieldConfigMap,
  OutputPlanForType,
} from "grafast";
import type {
  GraphQLArgumentConfig,
  GraphQLEnumType,
  GraphQLEnumTypeConfig,
  GraphQLEnumValueConfig,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInputObjectTypeConfig,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLInterfaceTypeConfig,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
  GraphQLSchema,
  GraphQLSchemaConfig,
  GraphQLType,
  GraphQLUnionType,
  GraphQLUnionTypeConfig,
} from "grafast/graphql";

import type { Behavior, BehaviorDynamicMethods } from "./behavior.js";
import type { InflectionBase } from "./inflection.js";
import type { stringTypeSpec, wrapDescription } from "./utils.js";

/*
 * To make it easier for plugins to extend our builtin types we put them all in
 * the global `GraphileBuild` namespace. Anywhere you need to extend these
 * types you can do so via:
 *
 * ```
 * declare global {
 *   namespace GraphileBuild {
 *     // Your extensions here
 *   }
 * }
 * ```
 */

interface RegisterObjectType {
  /**
   * Register a type by name with the system; names must be unique. It's
   * strongly advised that your names come from an inflector so that they
   * can be overridden. When you register a type, you should also supply a
   * scope so that other plugins may hook it; it can also be helpful to
   * indicate where a conflict has occurred.
   */
  <TStep extends ExecutableStep | null>(
    typeName: string,
    scope: GraphileBuild.ScopeObject,
    specGenerator: () => Omit<
      GraphileBuild.GrafastObjectTypeConfig<TStep, any>,
      "name"
    >,
    origin: string | null | undefined,
  ): void;
  // TODO: remove this backwards compatibility shim and move this definition back inline (get rid of RegisterObjectType)
  /**
   * @deprecated Please pass 'assertStep' as part of the object spec. This
   * compatibility signature will not be supported for long!
   */
  <TStep extends ExecutableStep | null>(
    typeName: string,
    scope: GraphileBuild.ScopeObject,
    assertStep: TStep extends ExecutableStep
      ?
          | ((step: ExecutableStep) => asserts step is TStep)
          | { new (...args: any[]): TStep }
      : null,
    specGenerator: () => Omit<
      GraphileBuild.GrafastObjectTypeConfig<TStep, any>,
      "name"
    >,
    origin: string | null | undefined,
  ): void;
}

declare global {
  namespace GraphileBuild {
    /**
     * Input to the 'schema build' phase, this is typically the output of the
     * gather phase.
     */
    interface BuildInput {
      // Expand this interface with declaration merging
    }

    interface BehaviorEntities {
      string: string;
      // Expand me through declaration merging
    }

    interface PluginBehaviorEntitySpec<
      TEntityType extends keyof GraphileBuild.BehaviorEntities,
    > {
      defaultBehavior?: string;
      getEntityDefaultBehavior?: (
        entity: GraphileBuild.BehaviorEntities[TEntityType],
      ) => string;
      getEntityConfiguredBehavior?: (
        entity: GraphileBuild.BehaviorEntities[TEntityType],
      ) => string;
    }

    /**
     * Details of a single directive application. We typically store a list of
     * these into an array. Note that we don't use a map for this because:
     *
     * 1. the same directive may be used more than once, and
     * 2. the order of directives may be significant.
     */
    interface DirectiveDetails {
      directiveName: string;
      args: {
        [directiveArgument: string]: any;
      };
    }

    // Options in the config

    interface InflectionOptions {}
    interface GatherOptions {}
    interface SchemaOptions {
      /**
       * A behavior string to prepend to all behavior checks, can be overriden
       * but is a great way to disable things by default and then re-enable
       * them in specific locations.
       */
      defaultBehavior?: string;

      /**
       * If your schema includes compatibility with the GraphQL Global Object
       * Identification Specification, typically this will be called 'id'.
       * However the term 'id' often conflicts with databases which commonly
       * use 'id' as their primary key name, so we give you the option to
       * rename it.
       */
      nodeIdFieldName?: string;

      /**
       * `SwallowErrorsPlugin` by default will "swallow" errors, allowing you
       * to continue building your GraphQL schema even if errors (such as
       * naming conflicts) occur. It is recommended that you set this option to
       * `true` in your production configuration to disable this behavior.
       */
      dontSwallowErrors?: boolean;

      /**
       * When false (default), Grafserv will exit if it fails to build the
       * initial schema (for example if it cannot connect to the database, or if
       * there are fatal naming conflicts in the schema). When true, PostGraphile
       * will keep trying to rebuild the schema indefinitely, using an exponential
       * backoff between attempts, starting at 100ms and increasing up to 30s delay
       * between retries. When a function, the function will be called passing the
       * error and the number of attempts, and it should return true to retry,
       * false to permanently abort trying.
       */
      retryOnInitFail?:
        | boolean
        | ((
            error: Error,
            attempts: number,
            delay: number,
          ) => boolean | Promise<boolean>);

      exportSchemaSDLPath?: string;
      exportSchemaIntrospectionResultPath?: string;
      sortExport?: boolean;
    }

    /**
     * Do not change this object, your changes will be ignored.
     */
    type InitObject = Record<string, never>;

    // type TriggerChangeType = () => void;

    /**
     * All of the inflectors live in this object. Inflectors take a range of
     * inputs and return a string that can be used as the name for the relevant
     * type, field, argument, enum value, etc.
     */
    interface Inflection extends InflectionBase {}

    /** Our take on GraphQLFieldConfigMap that allows for plans */
    type GrafastFieldConfigMap<
      TParentStep extends ExecutableStep | null,
      TContext extends Grafast.Context,
    > = {
      [fieldName: string]: GrafastFieldConfig<
        any,
        TContext,
        TParentStep,
        any,
        any
      >;
    };

    /** Our take on GraphQLObjectTypeConfig that allows for plans */
    interface GrafastObjectTypeConfig<
      TParentStep extends ExecutableStep | null,
      TContext extends Grafast.Context,
    > extends Omit<
        GraphQLObjectTypeConfig<unknown, TContext>,
        "fields" | "interfaces"
      > {
      fields?:
        | GrafastFieldConfigMap<TParentStep, TContext>
        | ((
            context: ContextObjectFields,
          ) => GrafastFieldConfigMap<TParentStep, TContext>);
      interfaces?:
        | GraphQLInterfaceType[]
        | ((context: ContextObjectInterfaces) => GraphQLInterfaceType[]);
      assertStep?: TParentStep extends ExecutableStep
        ?
            | ((step: ExecutableStep) => asserts step is TParentStep)
            | { new (...args: any[]): TParentStep }
        : null;
    }

    /** Our take on GraphQLInputObjectTypeConfig that allows for plans */
    interface GrafastInputObjectTypeConfig
      extends Omit<GraphQLInputObjectTypeConfig, "fields"> {
      fields?:
        | GrafastInputFieldConfigMap<any, any>
        | ((
            context: ContextInputObjectFields,
          ) => GrafastInputFieldConfigMap<any, any>);
    }

    /** Our take on GraphQLUnionTypeConfig that allows for plans */
    interface GrafastUnionTypeConfig<TSource, TContext>
      extends Omit<GraphQLUnionTypeConfig<TSource, TContext>, "types"> {
      types?:
        | GraphQLObjectType[]
        | ((context: ContextUnionTypes) => GraphQLObjectType[]);
    }

    /** Our take on GraphQLInterfaceTypeConfig that allows for plans */
    interface GrafastInterfaceTypeConfig<TSource, TContext>
      extends Omit<
        GraphQLInterfaceTypeConfig<TSource, TContext>,
        "fields" | "interfaces"
      > {
      fields?:
        | GraphQLFieldConfigMap<TSource, TContext>
        | ((
            context: ContextInterfaceFields,
          ) => GraphQLFieldConfigMap<TSource, TContext>);
      interfaces?:
        | GraphQLInterfaceType[]
        | ((context: ContextInterfaceInterfaces) => GraphQLInterfaceType[]);
    }

    interface BuildVersions {
      grafast: string;
      graphql: string;
      "graphile-build": string;
    }

    /**
     * The absolute bare bones `Build` object that graphile-build makes before
     * calling any hooks.
     */
    interface BuildBase {
      /**
       * The options that graphile-build was called with.
       */
      options: SchemaOptions;

      /**
       * Version numbers of the various packages used in this build; plugins
       * can register versions in here, and other plugins can indicate that
       * they need certain versions via the `hasVersion` function.
       */
      versions: BuildVersions;

      /**
       * Input from the "data gathering" phase that plugins can use to
       * influence what types/fields/etc are added to the GraphQL schema.
       */
      input: BuildInput;

      /**
       * Returns true if `Build.versions` contains an entry for `packageName`
       * compatible with the version range `range`, false otherwise.
       */
      hasVersion(
        packageName: string,
        range: string,
        options?: { includePrerelease?: boolean },
      ): boolean;

      EXPORTABLE<T, TScope extends any[]>(
        factory: (...args: TScope) => T,
        args: [...TScope],
        nameHint?: string,
      ): T;
      exportNameHint(obj: any, nameHint: string): void;

      /**
       * Use `build.grafast` rather than importing `grafast` directly to try
       * and avoid "duplicate" grafast module woes.
       */
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      grafast: typeof import("grafast");

      /**
       * Use `build.graphql` rather than importing `graphql` directly to try
       * and avoid "duplicate" graphql module woes.
       */
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      graphql: typeof import("graphql");

      /**
       * Inflection controls the naming of your fields, types, arguments, etc -
       * widely used for any situation where you need to name things. Use it often!
       */
      inflection: Inflection;

      /**
       * Tracks the status of the SchemaBuilder; useful for making error
       * messages more helpful.
       */
      status: {
        /** True after 'build', false before and during. */
        isBuildPhaseComplete: boolean;
        /** True after 'init', false before and during. */
        isInitPhaseComplete: boolean;
        currentHookName: string | null | undefined;
        currentHookEvent: string | null | undefined;
      };

      /**
       * Only use this on descriptions that are plain text, or that we create
       * manually in code; since descriptions are markdown, it's not safe to
       * use on descriptions that contain code blocks or long inline code
       * strings.
       */
      wrapDescription: typeof wrapDescription;

      /**
       * Generates the spec for a GraphQLScalar (except the name) with the
       * given description/coercion.
       */
      stringTypeSpec: typeof stringTypeSpec;

      /**
       * Register a type by name with the system; names must be unique. It's
       * strongly advised that your names come from an inflector so that they
       * can be overridden. When you register a type, you should also supply a
       * scope so that other plugins may hook it; it can also be helpful to
       * indicate where a conflict has occurred.
       */
      registerObjectType: RegisterObjectType;

      /** As registerObjectType, but for interfaces */
      registerInterfaceType: (
        typeName: string,
        scope: ScopeInterface,
        specGenerator: () => Omit<GrafastInterfaceTypeConfig<any, any>, "name">,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for unions */
      registerUnionType: (
        typeName: string,
        scope: ScopeUnion,
        specGenerator: () => Omit<GrafastUnionTypeConfig<any, any>, "name">,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for scalars */
      registerScalarType: (
        typeName: string,
        scope: ScopeScalar,
        specGenerator: () => Omit<GraphQLScalarTypeConfig<any, any>, "name">,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for enums */
      registerEnumType: (
        typeName: string,
        scope: ScopeEnum,
        specGenerator: () => Omit<GraphQLEnumTypeConfig, "name">,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for input objects */
      registerInputObjectType: (
        typeName: string,
        scope: ScopeInputObject,
        specGenerator: () => Omit<GrafastInputObjectTypeConfig, "name">,
        origin: string | null | undefined,
      ) => void;

      /**
       * Asserts that the given typeName is registered; throws if this isn't
       * the case.
       */
      assertTypeName(typeName: string): void;

      /**
       * Returns details of the type name's registration (if it has been
       * registered) - useful when types are built based on other types.
       */
      getTypeMetaByName: (typeName: string) => {
        Constructor: { new (spec: any): GraphQLNamedType };
        scope: GraphileBuild.SomeScope;
        origin: string | null | undefined;
        Step?: { new (...args: any[]): ExecutableStep } | null;
        specGenerator:
          | (() => Omit<
              GraphileBuild.GrafastObjectTypeConfig<any, any>,
              "name"
            >)
          | (() => Omit<GrafastInterfaceTypeConfig<any, any>, "name">)
          | (() => Omit<GrafastUnionTypeConfig<any, any>, "name">)
          | (() => Omit<GraphQLScalarTypeConfig<any, any>, "name">)
          | (() => Omit<GraphQLEnumTypeConfig, "name">)
          | (() => Omit<GrafastInputObjectTypeConfig, "name">);
      } | null;

      /**
       * Returns the GraphQL type with the given name, constructing it if
       * necessary (assuming there's a registered type generator). If the
       * constructed type is invalid (e.g. an object type with no fields) then
       * null will be returned. If the type name is not registered then
       * undefined will be returned.
       */
      getTypeByName: (typeName: string) => GraphQLNamedType | null | undefined;
      /**
       * As `getTypeByName`, except it throws if the returned type was not an
       * input type.
       */
      getInputTypeByName: (typeName: string) => GraphQLInputType;
      /**
       * As `getTypeByName`, except it throws if the returned type was not an
       * output type.
       */
      getOutputTypeByName: (typeName: string) => GraphQLOutputType;

      /**
       * Writes the properties of `extra` into `base` being sure not to
       * overwrite any properties. The `hint` is provided so that in the case
       * of a conflict a helpful error message can be raised - use `hint` to
       * describe what you are doing and when a conflict occurs both hints will
       * be logged helping users to figure out what went wrong.
       */
      extend: <Obj1 extends object, Obj2 extends Partial<Obj1> & object>(
        base: Obj1,
        extra: Obj2,
        hint: string,
        behaviourOnConflict?: "throw" | "recoverable",
      ) => Obj1 & Obj2;

      getAllTypes(): {
        [typeName: string]: GraphQLNamedType | null | undefined;
      };

      /**
       * Useful for looking up the scope that a type was created with, e.g. for
       * debugging.
       */
      scopeByType: Map<GraphQLNamedType, SomeScope>;

      /**
       * When a recoverable error occurs, it will be handed to this method
       * which can decide what to do - e.g. throw the error or log it.
       *
       * Note that all recoverable errors indicate there is something wrong
       * with your schema that should be addressed, the "recoverable" means it
       * doesn't entirely prevent us from creating _a_ schema, but the schema
       * created might not be as full as the one you desired. This is primarily
       * useful for trying out new plugins/etc so that you can resolve naming
       * conflicts at a later stage once you're happy.
       *
       * In V4 this was called `swallowError`, but that was confusing when
       * users chose to throw instead.
       */
      handleRecoverableError: (e: Error) => void;

      /**
       * Calls callback, but if an error is thrown then it processes it withe
       * `handleRecoverableError` and then returns the fallback.
       */
      recoverable<T>(fallback: T, callback: () => T): T;

      /**
       * If condition is true, returns `type`, otherwise `new GraphQLNonNull(type)`
       */
      nullableIf<T extends GraphQLType>(
        condition: boolean,
        type: T,
      ): T | GraphQLNonNull<T>;

      _pluginMeta: {
        [pluginName: string]: Record<string, any> | undefined;
      };
    }

    /**
     * The `Build` object is passed to every schema hook (as the second
     * argument); it contains useful helpers and utilities and can also store
     * metadata. It is populated by the 'plugin' hook in various plugins, so
     * there's no concrete list of all the things in the build object other
     * than actually inspecting it.
     */
    interface Build extends BuildBase {
      // QueryPlugin
      $$isQuery: symbol;

      /**
       * Behavior logic that helps decide whether or not a certain thing
       * (typically a field, argument, enum value, input field, or similar)
       * goes into the schema.
       */
      behavior: Behavior & BehaviorDynamicMethods;
    }

    /**
     * When we register a type, field or argument, we associate a 'scope' with
     * it so that other plugins can easily recognise it. All specialised scopes
     * inherit this Scope interface.
     */
    interface Scope {
      __origin?: string | null | undefined;
      directives?: DirectiveDetails[];
    }

    /**
     * A specialised `Context` object is passed to every schema hook (as the
     * third argument) based on the hook being called. The context contains
     * details about _why_ the hook was called. All specialised contexts
     * inherit this basic Context interface.
     */
    interface Context {
      scope: Scope;
      type:
        | "build"
        | "init"
        | "finalize"
        | "GraphQLSchema"
        | "GraphQLScalarType"
        | "GraphQLObjectType"
        | "GraphQLInterfaceType"
        | "GraphQLUnionType"
        | "GraphQLEnumType"
        | "GraphQLInputObjectType";
    }

    interface ScopeBuild extends Scope {}
    interface ContextBuild extends Context {
      scope: ScopeBuild;
      type: "build";
    }

    interface ScopeInit extends Scope {}
    interface ContextInit extends Context {
      scope: ScopeInit;
      type: "init";
    }

    interface ScopeSchema extends Scope {}
    interface ContextSchema extends Context {
      scope: ScopeSchema;
      type: "GraphQLSchema";
    }
    interface ScopeSchemaTypes extends ScopeSchema {}
    interface ContextSchemaTypes extends ContextSchema {
      scope: ScopeSchemaTypes;
    }

    interface ScopeScalar extends Scope {}
    interface ContextScalar extends Context {
      scope: ScopeScalar;
      type: "GraphQLScalarType";
    }

    interface ScopeObject extends Scope {
      isRootQuery?: boolean;
      isRootMutation?: boolean;
      isRootSubscription?: boolean;
      isMutationPayload?: boolean;
      isPageInfo?: boolean;
    }
    interface ContextObject extends Context {
      scope: ScopeObject;
      type: "GraphQLObjectType";
    }

    interface ScopeObjectInterfaces extends ScopeObject {}
    interface ContextObjectInterfaces extends ContextObject {
      scope: ScopeObjectInterfaces;
      Self: GraphQLObjectType;
    }

    interface ScopeObjectFields extends ScopeObject {}
    interface ContextObjectFields extends ContextObject {
      scope: ScopeObjectFields;
      Self: GraphQLObjectType;
      fieldWithHooks: FieldWithHooksFunction;
    }

    interface ScopeObjectFieldsField extends ScopeObjectFields {
      fieldName: string;
      fieldBehaviorScope?: string;
      fieldDirectives?: DirectiveDetails[];
      isCursorField?: boolean;
    }
    interface ContextObjectFieldsField extends ContextObjectFields {
      scope: ScopeObjectFieldsField;
    }

    interface ScopeObjectFieldsFieldArgs extends ScopeObjectFieldsField {}
    interface ContextObjectFieldsFieldArgs extends ContextObjectFieldsField {
      scope: ScopeObjectFieldsFieldArgs;
    }

    interface ScopeObjectFieldsFieldArgsArg extends ScopeObjectFieldsFieldArgs {
      argName: string;
    }
    interface ContextObjectFieldsFieldArgsArg
      extends ContextObjectFieldsFieldArgs {
      scope: ScopeObjectFieldsFieldArgsArg;
    }

    interface ScopeInterface extends Scope {
      /**
       * If true, 'AddNoteInterfaceToSuitableTypesPlugin' will add the `Node`
       * interface and `id` field automatically to this interface
       */
      supportsNodeInterface?: boolean;
    }
    interface ContextInterface extends Context {
      scope: ScopeInterface;
      type: "GraphQLInterfaceType";
    }

    interface ScopeInterfaceFields extends ScopeInterface {}
    interface ContextInterfaceFields extends ContextInterface {
      scope: ScopeInterfaceFields;
      Self: GraphQLInterfaceType;
      fieldWithHooks: InterfaceFieldWithHooksFunction;
    }

    interface ScopeInterfaceFieldsField extends ScopeInterfaceFields {
      fieldName: string;
    }
    interface ContextInterfaceFieldsField extends ContextInterfaceFields {
      scope: ScopeInterfaceFieldsField;
    }

    interface ScopeInterfaceFieldsFieldArgs extends ScopeInterfaceFieldsField {}
    interface ContextInterfaceFieldsFieldArgs
      extends ContextInterfaceFieldsField {
      scope: ScopeInterfaceFieldsFieldArgs;
    }

    interface ScopeInterfaceFieldsFieldArgsArg
      extends ScopeInterfaceFieldsFieldArgs {
      argName: string;
    }
    interface ContextInterfaceFieldsFieldArgsArg
      extends ContextInterfaceFieldsFieldArgs {
      scope: ScopeInterfaceFieldsFieldArgsArg;
    }

    interface ScopeInterfaceInterfaces extends ScopeInterface {}
    interface ContextInterfaceInterfaces extends ContextInterface {
      scope: ScopeInterfaceInterfaces;
      Self: GraphQLInterfaceType;
    }

    interface ScopeUnion extends Scope {}
    interface ContextUnion extends Context {
      scope: ScopeUnion;
      type: "GraphQLUnionType";
    }

    interface ScopeUnionTypes extends ScopeUnion {}
    interface ContextUnionTypes extends ContextUnion {
      scope: ScopeUnionTypes;
      Self: GraphQLUnionType;
    }

    interface ScopeInputObject extends Scope {
      isMutationInput?: boolean;
    }
    interface ContextInputObject extends Context {
      scope: ScopeInputObject;
      type: "GraphQLInputObjectType";
    }

    interface ScopeInputObjectFields extends ScopeInputObject {}
    interface ContextInputObjectFields extends ContextInputObject {
      scope: ScopeInputObjectFields;
      Self: GraphQLInputObjectType;
      fieldWithHooks: InputFieldWithHooksFunction;
    }

    interface ScopeInputObjectFieldsField extends ScopeInputObject {
      fieldName: string;
      fieldBehaviorScope?: string;
    }
    interface ContextInputObjectFieldsField extends ContextInputObject {
      scope: ScopeInputObjectFieldsField;
      Self: GraphQLInputObjectType;
    }

    interface ScopeEnum extends Scope {}
    interface ContextEnum extends Context {
      scope: ScopeEnum;
      type: "GraphQLEnumType";
    }

    interface ScopeEnumValues extends ScopeEnum {}
    interface ContextEnumValues extends ContextEnum {
      scope: ScopeEnumValues;
    }

    interface ScopeEnumValuesValue extends ScopeEnumValues {}
    interface ContextEnumValuesValue extends ContextEnumValues {
      scope: ScopeEnumValuesValue;
    }

    interface ScopeFinalize extends Scope {}
    interface ContextFinalize extends Context {
      scope: ScopeFinalize;
      type: "finalize";
    }

    /**
     * A type that represents all possible scopes.
     */
    type SomeScope =
      | Scope
      | ScopeBuild
      | ScopeInit
      | ScopeSchema
      | ScopeSchemaTypes
      | ScopeScalar
      | ScopeObject
      | ScopeObjectInterfaces
      | ScopeObjectFields
      | ScopeObjectFieldsField
      | ScopeObjectFieldsFieldArgs
      | ScopeInterface
      | ScopeUnion
      | ScopeUnionTypes
      | ScopeInputObject
      | ScopeInputObjectFields
      | ScopeInputObjectFieldsField
      | ScopeEnum
      | ScopeEnumValues
      | ScopeEnumValuesValue
      | ScopeFinalize;

    /**
     * A Graphile-Build hook function.
     */
    type Hook<
      Type,
      TContext extends Context,
      TBuild extends Partial<Build> = Build,
    > = {
      (input: Type, build: TBuild, context: TContext): Type;
      displayName?: string;
    };

    /**
     * A function that instructs graphile-build to create a field with the
     * given name and apply all the hooks to it. All fields will have hooks
     * called against them whether they're created with this method or not, but
     * it gives a chance to get access to extra details (i.e. the field
     * context) and to set the specialised scope for the field so that other
     * plugins can hook it. It's highly recommended you use this for all
     * non-trivial fields.
     */
    type FieldWithHooksFunction = <
      TType extends GraphQLOutputType,
      TContext extends Grafast.Context,
      TParentStep extends ExecutableStep,
      TFieldStep extends OutputPlanForType<TType>,
      TArgs extends BaseGraphQLArguments,
    >(
      fieldScope: ScopeObjectFieldsField,
      spec:
        | GrafastFieldConfig<TType, TContext, TParentStep, TFieldStep, TArgs>
        | ((
            context: ContextObjectFieldsField,
          ) => GrafastFieldConfig<
            TType,
            TContext,
            TParentStep,
            TFieldStep,
            TArgs
          >),
    ) => GrafastFieldConfig<TType, TContext, TParentStep, TFieldStep, TArgs>;

    type InterfaceFieldWithHooksFunction = (
      fieldScope: ScopeInterfaceFieldsField,
      spec:
        | GraphQLFieldConfig<any, any>
        | ((
            context: ContextInterfaceFieldsField,
          ) => GraphQLFieldConfig<any, any>),
    ) => GraphQLFieldConfig<any, any>;

    type InputFieldWithHooksFunction = (
      fieldScope: ScopeInputObjectFieldsField,
      spec:
        | GrafastInputFieldConfig<any, any, any, any, any>
        | ((
            context: ContextInputObjectFieldsField,
          ) => GrafastInputFieldConfig<any, any, any, any, any>),
    ) => GrafastInputFieldConfig<any, any, any, any, any>;

    // type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

    // type SchemaListener = (newSchema: GraphQLSchema) => void;

    /**
     * These are all of the hooks that graphile-build supports and the types of
     * the various parameters to the hook function.
     */
    interface SchemaBuilderHooks<
      TBuild extends GraphileBuild.Build = GraphileBuild.Build,
    > {
      /**
       * The build object represents the current schema build and is passed to all
       * hooks, hook the 'build' event to extend this object. Note: you MUST NOT
       * generate GraphQL objects during this phase.
       */
      build: GraphileBuild.Hook<
        Partial<TBuild> & GraphileBuild.BuildBase,
        GraphileBuild.ContextBuild,
        Partial<TBuild> & GraphileBuild.BuildBase
      >[];

      /**
       * The `init` phase runs after `build` is complete but before any types
       * or the schema are actually built. It is the only phase in which you
       * can register GraphQL types; do so using `build.registerType`.
       */
      init: GraphileBuild.Hook<
        Record<string, never>,
        GraphileBuild.ContextInit,
        TBuild
      >[];

      /**
       * 'finalize' phase is called once the schema is built; typically you
       * shouldn't use this, but it's useful for interfacing with external
       * libraries that mutate an already constructed schema.
       */
      finalize: GraphileBuild.Hook<
        GraphQLSchema,
        GraphileBuild.ContextFinalize,
        TBuild
      >[];

      /**
       * Add 'query', 'mutation' or 'subscription' types in this hook:
       */
      GraphQLSchema: GraphileBuild.Hook<
        GraphQLSchemaConfig,
        GraphileBuild.ContextSchema,
        TBuild
      >[];

      /**
       * Add any types that need registering (typically polymorphic types) here
       */
      GraphQLSchema_types: GraphileBuild.Hook<
        GraphQLNamedType[],
        GraphileBuild.ContextSchemaTypes,
        TBuild
      >[];

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
      GraphQLObjectType: GraphileBuild.Hook<
        GrafastObjectTypeConfig<any, any>,
        GraphileBuild.ContextObject,
        TBuild
      >[];
      GraphQLObjectType_interfaces: GraphileBuild.Hook<
        GraphQLInterfaceType[],
        GraphileBuild.ContextObjectInterfaces,
        TBuild
      >[];
      GraphQLObjectType_fields: GraphileBuild.Hook<
        GrafastFieldConfigMap<any, any>,
        GraphileBuild.ContextObjectFields,
        TBuild
      >[];
      GraphQLObjectType_fields_field: GraphileBuild.Hook<
        GrafastFieldConfig<any, any, any, any, any>,
        GraphileBuild.ContextObjectFieldsField,
        TBuild
      >[];
      GraphQLObjectType_fields_field_args: GraphileBuild.Hook<
        GrafastFieldConfigArgumentMap<any, any, any, any>,
        GraphileBuild.ContextObjectFieldsFieldArgs,
        TBuild
      >[];
      GraphQLObjectType_fields_field_args_arg: GraphileBuild.Hook<
        GrafastArgumentConfig<any, any, any, any, any, any>,
        GraphileBuild.ContextObjectFieldsFieldArgsArg,
        TBuild
      >[];

      /**
       * When creating a GraphQLInputObjectType via `newWithHooks`, we'll
       * execute, the following hooks:
       * - 'GraphQLInputObjectType' to add any root-level attributes, e.g. add a description
       * - 'GraphQLInputObjectType_fields' to add additional fields to this object type (is
       *   ran asynchronously and gets a reference to the final GraphQL Object as
       *   `Self` in the context)
       * - 'GraphQLInputObjectType_fields_field' to customize an individual field from above
       */
      GraphQLInputObjectType: GraphileBuild.Hook<
        GraphileBuild.GrafastInputObjectTypeConfig,
        GraphileBuild.ContextInputObject,
        TBuild
      >[];
      GraphQLInputObjectType_fields: GraphileBuild.Hook<
        GraphQLInputFieldConfigMap,
        GraphileBuild.ContextInputObjectFields,
        TBuild
      >[];
      GraphQLInputObjectType_fields_field: GraphileBuild.Hook<
        GrafastInputFieldConfig<any, any, any, any, any>,
        GraphileBuild.ContextInputObjectFieldsField,
        TBuild
      >[];

      /**
       * When creating a GraphQLEnumType via `newWithHooks`, we'll
       * execute, the following hooks:
       * - 'GraphQLEnumType' to add any root-level attributes, e.g. add a description
       * - 'GraphQLEnumType_values' to add additional values
       * - 'GraphQLEnumType_values_value' to change an individual value
       */
      GraphQLEnumType: GraphileBuild.Hook<
        GraphQLEnumTypeConfig,
        GraphileBuild.ContextEnum,
        TBuild
      >[];
      GraphQLEnumType_values: GraphileBuild.Hook<
        GraphQLEnumValueConfigMap,
        GraphileBuild.ContextEnumValues,
        TBuild
      >[];
      GraphQLEnumType_values_value: GraphileBuild.Hook<
        GraphQLEnumValueConfig,
        GraphileBuild.ContextEnumValuesValue,
        TBuild
      >[];

      /**
       * When creating a GraphQLUnionType via `newWithHooks`, we'll
       * execute, the following hooks:
       * - 'GraphQLUnionType' to add any root-level attributes, e.g. add a description
       * - 'GraphQLUnionType_types' to add additional types to this union
       */
      GraphQLUnionType: GraphileBuild.Hook<
        GraphileBuild.GrafastUnionTypeConfig<any, any>,
        GraphileBuild.ContextUnion,
        TBuild
      >[];
      GraphQLUnionType_types: GraphileBuild.Hook<
        GraphQLObjectType[],
        GraphileBuild.ContextUnionTypes,
        TBuild
      >[];

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
      GraphQLInterfaceType: GraphileBuild.Hook<
        GraphileBuild.GrafastInterfaceTypeConfig<any, any>,
        GraphileBuild.ContextInterface,
        TBuild
      >[];
      GraphQLInterfaceType_fields: GraphileBuild.Hook<
        GraphQLFieldConfigMap<any, any>,
        GraphileBuild.ContextInterfaceFields,
        TBuild
      >[];
      GraphQLInterfaceType_fields_field: GraphileBuild.Hook<
        GraphQLFieldConfig<any, any>,
        GraphileBuild.ContextInterfaceFieldsField,
        TBuild
      >[];
      GraphQLInterfaceType_fields_field_args: GraphileBuild.Hook<
        GraphQLFieldConfigArgumentMap,
        GraphileBuild.ContextInterfaceFieldsFieldArgs,
        TBuild
      >[];
      GraphQLInterfaceType_fields_field_args_arg: GraphileBuild.Hook<
        GraphQLArgumentConfig,
        GraphileBuild.ContextInterfaceFieldsFieldArgsArg,
        TBuild
      >[];
      GraphQLInterfaceType_interfaces: GraphileBuild.Hook<
        GraphQLInterfaceType[],
        GraphileBuild.ContextInterfaceInterfaces,
        TBuild
      >[];

      /**
       * For scalars
       */
      GraphQLScalarType: GraphileBuild.Hook<
        GraphQLScalarTypeConfig<any, any>,
        GraphileBuild.ContextScalar,
        TBuild
      >[];
    }
  }
}

export type ConstructorForType<TType extends GraphQLNamedType | GraphQLSchema> =
  { new (): TType };

/**
 * The minimal spec required to be fed to `newWithHooks`; typically this is
 * just the `name` of the type and everything else is optional.
 */
export type SpecForType<TType extends GraphQLNamedType | GraphQLSchema> =
  TType extends GraphQLSchema
    ? Partial<GraphQLSchemaConfig>
    : TType extends GraphQLObjectType
    ? Partial<GraphileBuild.GrafastObjectTypeConfig<any, any>> & {
        name: string;
      }
    : TType extends GraphQLInterfaceType
    ? Partial<GraphileBuild.GrafastInterfaceTypeConfig<any, any>> & {
        name: string;
      }
    : TType extends GraphQLUnionType
    ? Partial<GraphileBuild.GrafastUnionTypeConfig<any, any>> & {
        name: string;
      }
    : TType extends GraphQLScalarType
    ? Partial<GraphQLScalarTypeConfig<any, any>> & { name: string }
    : TType extends GraphQLEnumType
    ? Partial<GraphQLEnumTypeConfig> & { name: string }
    : TType extends GraphQLInputObjectType
    ? Partial<GraphileBuild.GrafastInputObjectTypeConfig> & { name: string }
    : never;

// TYPES: this returning `never` for non-GraphQLSchema seems wrong... why is it
// not causing issues?
export type ScopeForType<TType extends GraphQLNamedType | GraphQLSchema> =
  TType extends GraphQLSchema ? GraphileBuild.ScopeSchema : never;
