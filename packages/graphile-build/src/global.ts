import type {
  GraphQLEnumType,
  GraphQLEnumTypeConfig,
  GraphQLFieldConfigMap,
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
  /* ONLY IMPORT TYPES HERE! */
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

    interface GraphileObjectTypeConfig<TSource, TContext>
      extends Omit<GraphQLObjectTypeConfig<TSource, TContext>, "fields"> {
      fields?:
        | GraphQLFieldConfigMap<TSource, TContext>
        | ((
            context: ContextGraphQLObjectTypeFields,
          ) => GraphQLFieldConfigMap<TSource, TContext>);
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
        specGenerator: () => GraphileObjectTypeConfig<any, any>,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for interfaces */
      registerInterfaceType: (
        typeName: string,
        scope: ScopeGraphQLInterfaceType,
        specGenerator: () => GraphileInterfaceTypeConfig<any, any>,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for unions */
      registerUnionType: (
        typeName: string,
        scope: ScopeGraphQLUnionType,
        specGenerator: () => GraphileUnionTypeConfig<any, any>,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for scalars */
      registerScalarType: (
        typeName: string,
        scope: ScopeGraphQLScalarType,
        specGenerator: () => GraphQLScalarTypeConfig<any, any>,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for enums */
      registerEnumType: (
        typeName: string,
        scope: ScopeGraphQLEnumType,
        specGenerator: () => GraphQLEnumTypeConfig,
        origin: string | null | undefined,
      ) => void;
      /** As registerObjectType, but for input objects */
      registerInputObjectType: (
        typeName: string,
        scope: ScopeGraphQLInputObjectType,
        specGenerator: () => GraphileInputObjectTypeConfig,
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
    }

    interface ScopeGraphQLInterfaceTypeFieldsField
      extends ScopeGraphQLInterfaceTypeFields {}
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
      Self: GraphQLEnumType;
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

    type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

    type SchemaListener = (newSchema: GraphQLSchema) => void;
  }
}

export type ConstructorForType<TType extends GraphQLNamedType | GraphQLSchema> =
  { new (): TType };
export type SpecForType<TType extends GraphQLNamedType | GraphQLSchema> =
  Partial<
    TType extends GraphQLSchema
      ? GraphQLSchemaConfig
      : TType extends GraphQLObjectType
      ? GraphileEngine.GraphileObjectTypeConfig<any, any>
      : TType extends GraphQLInterfaceType
      ? GraphileEngine.GraphileInterfaceTypeConfig<any, any>
      : TType extends GraphQLUnionType
      ? GraphileEngine.GraphileUnionTypeConfig<any, any>
      : TType extends GraphQLScalarType
      ? GraphQLScalarTypeConfig<any, any>
      : TType extends GraphQLEnumType
      ? GraphQLEnumTypeConfig
      : TType extends GraphQLInputObjectType
      ? GraphileEngine.GraphileInputObjectTypeConfig
      : never
  >;
export type ScopeForType<TType extends GraphQLNamedType | GraphQLSchema> =
  TType extends GraphQLSchema ? GraphileEngine.ScopeGraphQLSchema : never;
