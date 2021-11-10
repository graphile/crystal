import type {
  BaseGraphQLContext,
  ExecutablePlan,
  GraphileFieldConfig,
} from "graphile-crystal";
import type {
  GraphQLEnumType,
  GraphQLEnumTypeConfig,
  GraphQLEnumValueConfig,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInputObjectTypeConfig,
  GraphQLInterfaceType,
  GraphQLInterfaceTypeConfig,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
  GraphQLSchema,
  GraphQLSchemaConfig,
  GraphQLType,
  GraphQLUnionType,
  GraphQLUnionTypeConfig,
} from "graphql";

import type { InflectionBase } from "./inflection";
import type SchemaBuilder from "./SchemaBuilder";

declare global {
  namespace GraphileEngine {
    interface DirectiveMap {
      [directiveName: string]: {
        [directiveArgument: string]: any;
      };
    }

    interface GraphileBuildOptions {
      subscriptions?: boolean;
      nodeIdFieldName?: string;
      dontSwallowErrors?: boolean;
    }
    interface GraphileResolverContext {}

    /**
     * Do not change this object, your changes will be ignored.
     */
    type InitObject = Record<string, never>;

    interface Plugin {
      (
        builder: SchemaBuilder,
        options: GraphileBuildOptions,
      ): Promise<void> | void;
      displayName?: string;
    }

    type TriggerChangeType = () => void;

    /**
     * This contains all the possibilities for lookahead data when raw (submitted
     * directly from `addDataGenerator` functions, etc). It's up to the plugins
     * that define these entries to declare them using declaration merging.
     *
     * NOTE: the types of these entries are concrete (e.g. `usesCursor: boolean`)
     * because we need the concrete types to build ResolvedLookAhead. We then use
     * `Partial<LookAheadData>` in the relevant places if we need fields to be
     * optional.
     */
    interface LookAheadData {}

    /**
     * This contains all the possibilities for lookahead data, once "baked". It's
     * an object that maps from key (string) to an array of entries for that type.
     *
     * We made this generic so that TypeScript has to look it up _after_ the
     * declaration merging has taken place, rather than computing it as an empty
     * object ahead of time.
     */
    type ResolvedLookAhead<T extends LookAheadData = LookAheadData> = {
      [P in keyof T]?:
        | Array<
            T[P] extends undefined | null | infer DataType
              ? DataType extends Array<infer ElementType>
                ? ElementType
                : DataType
              : never
          >
        | null
        | undefined;
    };

    interface Inflection extends InflectionBase {}

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

    interface GraphileInputObjectTypeConfig
      extends Omit<GraphQLInputObjectTypeConfig, "fields"> {
      fields?:
        | GraphQLInputFieldConfigMap
        | ((
            context: ContextGraphQLInputObjectTypeFields,
          ) => GraphQLInputFieldConfigMap);
    }

    interface GraphileUnionTypeConfig<TSource, TContext>
      extends Omit<GraphQLUnionTypeConfig<TSource, TContext>, "types"> {
      types?:
        | GraphQLObjectType[]
        | ((context: ContextGraphQLUnionTypeTypes) => GraphQLObjectType[]);
    }

    interface GraphileInterfaceTypeConfig<TSource, TContext>
      extends Omit<GraphQLInterfaceTypeConfig<TSource, TContext>, "fields"> {
      fields?:
        | GraphQLFieldConfigMap<TSource, TContext>
        | ((
            context: ContextGraphQLInterfaceTypeFields,
          ) => GraphQLFieldConfigMap<TSource, TContext>);
    }

    interface BuildBase {
      /**
       * The options that graphile-build was called with.
       */
      options: GraphileBuildOptions;

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
       * Register a type by name with the system; names must be unique. It's
       * strongly advised that your names come from an inflector so that they
       * can be overridden. When you register a type, you should also supply a
       * scope so that other plugins may hook it; it can also be helpful to
       * indicate where a conflict has occurred.
       */
      registerObjectType: (
        typeName: string,
        scope: ScopeGraphQLObjectType,
        specGenerator: () => Omit<GraphileObjectTypeConfig<any, any>, "name">,
        origin: string | null | undefined,
      ) => void;
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
       * Returns the GraphQL type with the given name, constructing it if
       * necessary (assuming there's a registered type generator). If the
       * constructed type is invalid (e.g. an object type with no fields) then
       * null will be returned. If the type name is not registered then
       * undefined will be returned.
       */
      getTypeByName: (typeName: string) => GraphQLNamedType | null | undefined;

      /**
       * Writes the properties of `extra` into `base` being sure not to
       * overwrite any properties. The `hint` is provided so that in the case
       * of a conflict a helpful error message can be raised - use `hint` to
       * describe what you are doing and when a conflict occurs both hints will
       * be logged helping users to figure out what went wrong.
       */
      extend: <Obj1 extends object, Obj2 extends object>(
        base: Obj1,
        extra: Obj2,
        hint: string,
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
    }

    interface Build extends BuildBase {
      // QueryPlugin
      $$isQuery: symbol;
    }

    interface Scope {
      __origin?: string | null | undefined;
      directives?: DirectiveMap;
    }

    interface Context {
      scope: Scope;
      type:
        | "build"
        | "inflection"
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

    interface ScopeInflection extends Scope {}
    interface ContextInflection extends Context {
      scope: ScopeInflection;
      type: "inflection";
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
      fieldDirectives?: DirectiveMap;
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

    type SomeScope =
      | Scope
      | ScopeBuild
      | ScopeInflection
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

    interface Hook<
      Type,
      TContext extends Context,
      TBuild extends Partial<Build> = Build,
    > {
      (input: Type, build: TBuild, context: TContext): Type;
      displayName?: string;
      provides?: Array<string>;
      before?: Array<string>;
      after?: Array<string>;
    }

    type FieldWithHooksFunction = (
      fieldScope: ScopeGraphQLObjectTypeFieldsField,
      spec:
        | GraphQLFieldConfig<any, any>
        | ((
            context: ContextGraphQLObjectTypeFieldsField,
          ) => GraphQLFieldConfig<any, any>),
    ) => GraphQLFieldConfig<any, any>;

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
        | GraphQLInputFieldConfig
        | ((
            context: ContextGraphQLInputObjectTypeFieldsField,
          ) => GraphQLInputFieldConfig),
    ) => GraphQLInputFieldConfig;

    type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

    type SchemaListener = (newSchema: GraphQLSchema) => void;

    interface SchemaBuilderHooks<
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
        GraphileObjectTypeConfig<any, any>,
        GraphileEngine.ContextGraphQLObjectType,
        TBuild
      >[];
      "GraphQLObjectType:interfaces": GraphileEngine.Hook<
        GraphQLInterfaceType[],
        GraphileEngine.ContextGraphQLObjectTypeInterfaces,
        TBuild
      >[];
      "GraphQLObjectType:fields": GraphileEngine.Hook<
        GraphileFieldConfigMap<any, any>,
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
        GraphQLObjectType[],
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
        GraphQLFieldConfig<any, any>,
        GraphileEngine.ContextGraphQLInterfaceTypeFieldsField,
        TBuild
      >[];
      "GraphQLInterfaceType:fields:field:args": GraphileEngine.Hook<
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

export type ScopeForType<TType extends GraphQLNamedType | GraphQLSchema> =
  TType extends GraphQLSchema ? GraphileEngine.ScopeGraphQLSchema : never;
