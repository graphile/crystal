import type {
  BaseGraphQLArguments,
  BaseGraphQLContext,
  ExecutablePlan,
  GraphileFieldConfig,
  GraphileFieldConfigArgumentMap,
  GraphileInputFieldConfig,
  GraphileInputFieldConfigMap,
  OutputPlanForType,
} from "dataplanner";
import type {
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
} from "graphql";

import type { InflectionBase } from "./inflection.js";
import type { stringTypeSpec, wrapDescription } from "./utils.js";

/*
 * To make it easier for plugins to extend our builtin types we put them all in
 * the global `GraphileEngine` namespace. Anywhere you need to extend these
 * types you can do so via:
 *
 * ```
 * declare global {
 *   namespace GraphileEngine {
 *     // Your extensions here
 *   }
 * }
 * ```
 */

declare global {
  /** @notExported */
  namespace GraphileEngine {
    /**
     * Input to the 'schema build' phase, this is typically the output of the
     * gather phase.
     */
    interface BuildInput {
      // Expand this interface with declaration merging
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

    interface GraphileBuildInflectionOptions {}
    interface GraphileBuildGatherOptions {}
    interface GraphileBuildSchemaOptions {
      subscriptions?: boolean;
      nodeIdFieldName?: string;
      dontSwallowErrors?: boolean;

      /**
       * If set to 'only' then connections will be avoided, preferring lists.
       * If set to 'omit' then lists will be avoided, preferring connections.
       * If set to 'both' then both lists and connections will be generated.
       */
      simpleCollections?: "only" | "both" | "omit";
    }

    // TODO: context should probably be passed as a generic instead?
    /**
     * The GraphQL context our schemas expect.
     */
    interface GraphileResolverContext {}

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
    type GraphileFieldConfigMap<
      TParentPlan extends ExecutablePlan<any> | null,
      TContext extends BaseGraphQLContext,
    > = {
      [fieldName: string]: GraphileFieldConfig<
        any,
        TContext,
        TParentPlan,
        any,
        any
      >;
    };

    /** Our take on GraphQLObjectTypeConfig that allows for plans */
    interface GraphileObjectTypeConfig<
      TParentPlan extends ExecutablePlan<any> | null,
      TContext extends BaseGraphQLContext,
    > extends Omit<
        GraphQLObjectTypeConfig<unknown, TContext>,
        "fields" | "interfaces"
      > {
      fields?:
        | GraphileFieldConfigMap<TParentPlan, TContext>
        | ((
            context: ContextGraphQLObjectTypeFields,
          ) => GraphileFieldConfigMap<TParentPlan, TContext>);
      interfaces?:
        | GraphQLInterfaceType[]
        | ((
            context: ContextGraphQLObjectTypeInterfaces,
          ) => GraphQLInterfaceType[]);
    }

    /** Our take on GraphQLInputObjectTypeConfig that allows for plans */
    interface GraphileInputObjectTypeConfig
      extends Omit<GraphQLInputObjectTypeConfig, "fields"> {
      fields?:
        | GraphileInputFieldConfigMap<any, any>
        | ((
            context: ContextGraphQLInputObjectTypeFields,
          ) => GraphileInputFieldConfigMap<any, any>);
    }

    /** Our take on GraphQLUnionTypeConfig that allows for plans */
    interface GraphileUnionTypeConfig<TSource, TContext>
      extends Omit<GraphQLUnionTypeConfig<TSource, TContext>, "types"> {
      types?:
        | GraphQLObjectType[]
        | ((context: ContextGraphQLUnionTypeTypes) => GraphQLObjectType[]);
    }

    /** Our take on GraphQLInterfaceTypeConfig that allows for plans */
    interface GraphileInterfaceTypeConfig<TSource, TContext>
      extends Omit<GraphQLInterfaceTypeConfig<TSource, TContext>, "fields"> {
      fields?:
        | GraphQLFieldConfigMap<TSource, TContext>
        | ((
            context: ContextGraphQLInterfaceTypeFields,
          ) => GraphQLFieldConfigMap<TSource, TContext>);
    }

    /**
     * The absolute bare bones `Build` object that graphile-build makes before
     * calling any hooks.
     */
    interface BuildBase {
      /**
       * The options that graphile-build was called with.
       */
      options: GraphileBuildSchemaOptions;

      /**
       * Version numbers of the various packages used in this build; plugins
       * can register versions in here, and other plugins can indicate that
       * they need certain versions via the `hasVersion` function.
       */
      versions: {
        graphql: string;
        "graphile-build": string;
        [packageName: string]: string;
      };

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

      /**
       * Use `build.graphql` rather than importing `graphql` directly to try
       * and avoid "duplicate" graphql module woes.
       */
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      graphql: typeof import("graphql");

      /**
       * Inflection controls the naming of your fields, types, arguments, etc -
       * use it widely!
       */
      inflection: Inflection;

      /**
       * Tracks the status of the SchemaBuilder; useful for making error
       * messages more helpful.
       */
      status: {
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
      registerObjectType<TPlan extends ExecutablePlan<any> | null>(
        typeName: string,
        scope: ScopeGraphQLObjectType,
        Plan: TPlan extends ExecutablePlan<any>
          ? { new (...args: any[]): TPlan }
          : null,
        specGenerator: () => Omit<GraphileObjectTypeConfig<TPlan, any>, "name">,
        origin: string | null | undefined,
      ): void;

      /** As registerObjectType, but for interfaces */
      registerInterfaceType: (
        typeName: string,
        scope: ScopeGraphQLInterfaceType,
        specGenerator: () => Omit<
          GraphileInterfaceTypeConfig<any, any>,
          "name"
        >,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for unions */
      registerUnionType: (
        typeName: string,
        scope: ScopeGraphQLUnionType,
        specGenerator: () => Omit<GraphileUnionTypeConfig<any, any>, "name">,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for scalars */
      registerScalarType: (
        typeName: string,
        scope: ScopeGraphQLScalarType,
        specGenerator: () => Omit<GraphQLScalarTypeConfig<any, any>, "name">,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for enums */
      registerEnumType: (
        typeName: string,
        scope: ScopeGraphQLEnumType,
        specGenerator: () => Omit<GraphQLEnumTypeConfig, "name">,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for input objects */
      registerInputObjectType: (
        typeName: string,
        scope: ScopeGraphQLInputObjectType,
        specGenerator: () => Omit<GraphileInputObjectTypeConfig, "name">,
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
        scope: GraphileEngine.SomeScope;
        origin: string | null | undefined;
        Plan?: { new (...args: any[]): ExecutablePlan<any> } | null;
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

      /**
       * Useful for looking up the scope that a type was created with, e.g. for
       * debugging.
       */
      scopeByType: Map<GraphQLType, SomeScope>;

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

    interface ScopeGraphQLSchema extends Scope {}
    interface ContextGraphQLSchema extends Context {
      scope: ScopeGraphQLSchema;
      type: "GraphQLSchema";
    }

    interface ScopeGraphQLScalarType extends Scope {}
    interface ContextGraphQLScalarType extends Context {
      scope: ScopeGraphQLScalarType;
      type: "GraphQLScalarType";
    }

    interface ScopeGraphQLObjectType extends Scope {
      isRootQuery?: boolean;
      isRootMutation?: boolean;
      isRootSubscription?: boolean;
      isMutationPayload?: boolean;
      isPageInfo?: boolean;
    }
    interface ContextGraphQLObjectType extends Context {
      scope: ScopeGraphQLObjectType;
      type: "GraphQLObjectType";
    }

    interface ScopeGraphQLObjectTypeInterfaces extends ScopeGraphQLObjectType {}
    interface ContextGraphQLObjectTypeInterfaces
      extends ContextGraphQLObjectType {
      scope: ScopeGraphQLObjectTypeInterfaces;
      Self: GraphQLObjectType;
    }

    interface ScopeGraphQLObjectTypeFields extends ScopeGraphQLObjectType {}
    interface ContextGraphQLObjectTypeFields extends ContextGraphQLObjectType {
      scope: ScopeGraphQLObjectTypeFields;
      Self: GraphQLObjectType;
      fieldWithHooks: FieldWithHooksFunction;
    }

    interface ScopeGraphQLObjectTypeFieldsField
      extends ScopeGraphQLObjectTypeFields {
      fieldName: string;
      fieldDirectives?: DirectiveDetails[];
      isCursorField?: boolean;
    }
    interface ContextGraphQLObjectTypeFieldsField
      extends ContextGraphQLObjectTypeFields {
      scope: ScopeGraphQLObjectTypeFieldsField;
    }

    interface ScopeGraphQLObjectTypeFieldsFieldArgs
      extends ScopeGraphQLObjectTypeFieldsField {}
    interface ContextGraphQLObjectTypeFieldsFieldArgs
      extends ContextGraphQLObjectTypeFieldsField {
      scope: ScopeGraphQLObjectTypeFieldsFieldArgs;
    }

    interface ScopeGraphQLInterfaceType extends Scope {}
    interface ContextGraphQLInterfaceType extends Context {
      scope: ScopeGraphQLInterfaceType;
      type: "GraphQLInterfaceType";
    }

    interface ScopeGraphQLInterfaceTypeFields
      extends ScopeGraphQLInterfaceType {}
    interface ContextGraphQLInterfaceTypeFields
      extends ContextGraphQLInterfaceType {
      scope: ScopeGraphQLInterfaceTypeFields;
      Self: GraphQLInterfaceType;
      fieldWithHooks: InterfaceFieldWithHooksFunction;
    }

    interface ScopeGraphQLInterfaceTypeFieldsField
      extends ScopeGraphQLInterfaceTypeFields {
      fieldName: string;
    }
    interface ContextGraphQLInterfaceTypeFieldsField
      extends ContextGraphQLInterfaceTypeFields {
      scope: ScopeGraphQLInterfaceTypeFieldsField;
    }

    interface ScopeGraphQLInterfaceTypeFieldsFieldArgs
      extends ScopeGraphQLInterfaceTypeFieldsField {}
    interface ContextGraphQLInterfaceTypeFieldsFieldArgs
      extends ContextGraphQLInterfaceTypeFieldsField {
      scope: ScopeGraphQLInterfaceTypeFieldsFieldArgs;
    }

    interface ScopeGraphQLUnionType extends Scope {}
    interface ContextGraphQLUnionType extends Context {
      scope: ScopeGraphQLUnionType;
      type: "GraphQLUnionType";
    }

    interface ScopeGraphQLUnionTypeTypes extends ScopeGraphQLUnionType {}
    interface ContextGraphQLUnionTypeTypes extends ContextGraphQLUnionType {
      scope: ScopeGraphQLUnionTypeTypes;
      Self: GraphQLUnionType;
    }

    interface ScopeGraphQLInputObjectType extends Scope {
      isMutationInput?: boolean;
    }
    interface ContextGraphQLInputObjectType extends Context {
      scope: ScopeGraphQLInputObjectType;
      type: "GraphQLInputObjectType";
    }

    interface ScopeGraphQLInputObjectTypeFields
      extends ScopeGraphQLInputObjectType {}
    interface ContextGraphQLInputObjectTypeFields
      extends ContextGraphQLInputObjectType {
      scope: ScopeGraphQLInputObjectTypeFields;
      Self: GraphQLInputObjectType;
      fieldWithHooks: InputFieldWithHooksFunction;
    }

    interface ScopeGraphQLInputObjectTypeFieldsField
      extends ScopeGraphQLInputObjectType {
      fieldName: string;
    }
    interface ContextGraphQLInputObjectTypeFieldsField
      extends ContextGraphQLInputObjectType {
      scope: ScopeGraphQLInputObjectTypeFieldsField;
      Self: GraphQLInputObjectType;
    }

    interface ScopeGraphQLEnumType extends Scope {}
    interface ContextGraphQLEnumType extends Context {
      scope: ScopeGraphQLEnumType;
      type: "GraphQLEnumType";
    }

    interface ScopeGraphQLEnumTypeValues extends ScopeGraphQLEnumType {}
    interface ContextGraphQLEnumTypeValues extends ContextGraphQLEnumType {
      scope: ScopeGraphQLEnumTypeValues;
    }

    interface ScopeGraphQLEnumTypeValuesValue
      extends ScopeGraphQLEnumTypeValues {}
    interface ContextGraphQLEnumTypeValuesValue
      extends ContextGraphQLEnumTypeValues {
      scope: ScopeGraphQLEnumTypeValuesValue;
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
      | ScopeGraphQLSchema
      | ScopeGraphQLScalarType
      | ScopeGraphQLObjectType
      | ScopeGraphQLObjectTypeInterfaces
      | ScopeGraphQLObjectTypeFields
      | ScopeGraphQLObjectTypeFieldsField
      | ScopeGraphQLObjectTypeFieldsFieldArgs
      | ScopeGraphQLInterfaceType
      | ScopeGraphQLUnionType
      | ScopeGraphQLUnionTypeTypes
      | ScopeGraphQLInputObjectType
      | ScopeGraphQLInputObjectTypeFields
      | ScopeGraphQLInputObjectTypeFieldsField
      | ScopeGraphQLEnumType
      | ScopeGraphQLEnumTypeValues
      | ScopeGraphQLEnumTypeValuesValue
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
      TContext extends BaseGraphQLContext,
      TParentPlan extends ExecutablePlan<any>,
      TFieldPlan extends OutputPlanForType<TType>,
      TArgs extends BaseGraphQLArguments,
    >(
      fieldScope: ScopeGraphQLObjectTypeFieldsField,
      spec:
        | GraphileFieldConfig<TType, TContext, TParentPlan, TFieldPlan, TArgs>
        | ((
            context: ContextGraphQLObjectTypeFieldsField,
          ) => GraphileFieldConfig<
            TType,
            TContext,
            TParentPlan,
            TFieldPlan,
            TArgs
          >),
    ) => GraphileFieldConfig<TType, TContext, TParentPlan, TFieldPlan, TArgs>;

    type InterfaceFieldWithHooksFunction = (
      fieldScope: ScopeGraphQLInterfaceTypeFieldsField,
      spec:
        | GraphQLFieldConfig<any, any>
        | ((
            context: ContextGraphQLInterfaceTypeFieldsField,
          ) => GraphQLFieldConfig<any, any>),
    ) => GraphQLFieldConfig<any, any>;

    type InputFieldWithHooksFunction = (
      fieldScope: ScopeGraphQLInputObjectTypeFieldsField,
      spec:
        | GraphileInputFieldConfig<any, any, any, any, any>
        | ((
            context: ContextGraphQLInputObjectTypeFieldsField,
          ) => GraphileInputFieldConfig<any, any, any, any, any>),
    ) => GraphileInputFieldConfig<any, any, any, any, any>;

    // type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

    // type SchemaListener = (newSchema: GraphQLSchema) => void;

    /**
     * These are all of the hooks that graphile-build supports and the types of
     * the various parameters to the hook function.
     */
    interface SchemaBuilderHooks<
      TBuild extends GraphileEngine.Build = GraphileEngine.Build,
    > {
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
       * The `init` phase runs after `build` is complete but before any types
       * or the schema are actually built. It is the only phase in which you
       * can register GraphQL types; do so using `build.registerType`.
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
       * - 'GraphQLObjectType_interfaces' to add additional interfaces to this object type
       * - 'GraphQLObjectType_fields' to add additional fields to this object type (is
       *   ran asynchronously and gets a reference to the final GraphQL Object as
       *   `Self` in the context)
       * - 'GraphQLObjectType_fields_field' to customize an individual field from above
       * - 'GraphQLObjectType_fields_field_args' to customize the arguments to a field
       */
      GraphQLObjectType: GraphileEngine.Hook<
        GraphileObjectTypeConfig<any, any>,
        GraphileEngine.ContextGraphQLObjectType,
        TBuild
      >[];
      GraphQLObjectType_interfaces: GraphileEngine.Hook<
        GraphQLInterfaceType[],
        GraphileEngine.ContextGraphQLObjectTypeInterfaces,
        TBuild
      >[];
      GraphQLObjectType_fields: GraphileEngine.Hook<
        GraphileFieldConfigMap<any, any>,
        GraphileEngine.ContextGraphQLObjectTypeFields,
        TBuild
      >[];
      GraphQLObjectType_fields_field: GraphileEngine.Hook<
        GraphileFieldConfig<any, any, any, any, any>,
        GraphileEngine.ContextGraphQLObjectTypeFieldsField,
        TBuild
      >[];
      GraphQLObjectType_fields_field_args: GraphileEngine.Hook<
        GraphileFieldConfigArgumentMap<any, any, any, any>,
        GraphileEngine.ContextGraphQLObjectTypeFieldsFieldArgs,
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
      GraphQLInputObjectType: GraphileEngine.Hook<
        GraphileEngine.GraphileInputObjectTypeConfig,
        GraphileEngine.ContextGraphQLInputObjectType,
        TBuild
      >[];
      GraphQLInputObjectType_fields: GraphileEngine.Hook<
        GraphQLInputFieldConfigMap,
        GraphileEngine.ContextGraphQLInputObjectTypeFields,
        TBuild
      >[];
      GraphQLInputObjectType_fields_field: GraphileEngine.Hook<
        GraphileInputFieldConfig<any, any, any, any, any>,
        GraphileEngine.ContextGraphQLInputObjectTypeFieldsField,
        TBuild
      >[];

      /**
       * When creating a GraphQLEnumType via `newWithHooks`, we'll
       * execute, the following hooks:
       * - 'GraphQLEnumType' to add any root-level attributes, e.g. add a description
       * - 'GraphQLEnumType_values' to add additional values
       * - 'GraphQLEnumType_values_value' to change an individual value
       */
      GraphQLEnumType: GraphileEngine.Hook<
        GraphQLEnumTypeConfig,
        GraphileEngine.ContextGraphQLEnumType,
        TBuild
      >[];
      GraphQLEnumType_values: GraphileEngine.Hook<
        GraphQLEnumValueConfigMap,
        GraphileEngine.ContextGraphQLEnumTypeValues,
        TBuild
      >[];
      GraphQLEnumType_values_value: GraphileEngine.Hook<
        GraphQLEnumValueConfig,
        GraphileEngine.ContextGraphQLEnumTypeValuesValue,
        TBuild
      >[];

      /**
       * When creating a GraphQLUnionType via `newWithHooks`, we'll
       * execute, the following hooks:
       * - 'GraphQLUnionType' to add any root-level attributes, e.g. add a description
       * - 'GraphQLUnionType_types' to add additional types to this union
       */
      GraphQLUnionType: GraphileEngine.Hook<
        GraphileEngine.GraphileUnionTypeConfig<any, any>,
        GraphileEngine.ContextGraphQLUnionType,
        TBuild
      >[];
      GraphQLUnionType_types: GraphileEngine.Hook<
        GraphQLObjectType[],
        GraphileEngine.ContextGraphQLUnionTypeTypes,
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
      GraphQLInterfaceType: GraphileEngine.Hook<
        GraphileEngine.GraphileInterfaceTypeConfig<any, any>,
        GraphileEngine.ContextGraphQLInterfaceType,
        TBuild
      >[];
      GraphQLInterfaceType_fields: GraphileEngine.Hook<
        GraphQLFieldConfigMap<any, any>,
        GraphileEngine.ContextGraphQLInterfaceTypeFields,
        TBuild
      >[];
      GraphQLInterfaceType_fields_field: GraphileEngine.Hook<
        GraphQLFieldConfig<any, any>,
        GraphileEngine.ContextGraphQLInterfaceTypeFieldsField,
        TBuild
      >[];
      GraphQLInterfaceType_fields_field_args: GraphileEngine.Hook<
        GraphQLFieldConfigArgumentMap,
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
    ? Partial<GraphileEngine.GraphileObjectTypeConfig<any, any>> & {
        name: string;
      }
    : TType extends GraphQLInterfaceType
    ? Partial<GraphileEngine.GraphileInterfaceTypeConfig<any, any>> & {
        name: string;
      }
    : TType extends GraphQLUnionType
    ? Partial<GraphileEngine.GraphileUnionTypeConfig<any, any>> & {
        name: string;
      }
    : TType extends GraphQLScalarType
    ? Partial<GraphQLScalarTypeConfig<any, any>> & { name: string }
    : TType extends GraphQLEnumType
    ? Partial<GraphQLEnumTypeConfig> & { name: string }
    : TType extends GraphQLInputObjectType
    ? Partial<GraphileEngine.GraphileInputObjectTypeConfig> & { name: string }
    : never;

// TODO: this returning `never` for non-GraphQLSchema seems wrong... why is it
// not causing issues?
export type ScopeForType<TType extends GraphQLNamedType | GraphQLSchema> =
  TType extends GraphQLSchema ? GraphileEngine.ScopeGraphQLSchema : never;
