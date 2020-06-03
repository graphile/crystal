import SchemaBuilder from "./SchemaBuilder";
import {
  InflectionBase,
  GetDataFromParsedResolveInfoFragmentFunction,
} from "./makeNewBuild";
import {
  /* ONLY IMPORT TYPES HERE! */
  GraphQLType,
  GraphQLNamedType,
  GraphQLInterfaceType,
  GraphQLObjectTypeConfig,
  GraphQLSchema,
  GraphQLResolveInfo,
  GraphQLSchemaConfig,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInputObjectTypeConfig,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
  GraphQLInterfaceTypeConfig,
  GraphQLUnionType,
  GraphQLUnionTypeConfig,
  GraphQLEnumType,
  GraphQLEnumTypeConfig,
  GraphQLFieldConfigMap,
  GraphQLFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLOutputType,
} from "graphql";
import { LiveCoordinator } from "./Live";
import { ResolveTree } from "graphql-parse-resolve-info";
import { NodeFetcher } from "./plugins/NodePlugin";

declare global {
  namespace GraphileEngine {
    interface DirectiveMap {
      [directiveName: string]: {
        [directiveArgument: string]: any;
      };
    }

    interface GraphileBuildOptions {
      subscriptions?: boolean;
      live?: boolean;
      nodeIdFieldName?: string;
      dontSwallowErrors?: boolean;
    }
    interface GraphileResolverContext {}

    /**
     * Do not change this object, your changes will be ignored.
     */
    type InitObject = {};

    interface Plugin {
      (builder: SchemaBuilder, options: GraphileBuildOptions): Promise<
        void
      > | void;
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

    interface BuildBase {
      options: GraphileBuildOptions;
      graphileBuildVersion: string;
      versions: {
        [packageName: string]: string;
      };
      hasVersion(
        packageName: string,
        range: string,
        options?: { includePrerelease?: boolean },
      ): boolean;

      _pluginMeta: any /*{ [key: symbol]: any }*/;

      graphql: typeof import("graphql");
      parseResolveInfo: typeof import("graphql-parse-resolve-info").parseResolveInfo;
      simplifyParsedResolveInfoFragmentWithType: typeof import("graphql-parse-resolve-info").simplifyParsedResolveInfoFragmentWithType;

      // DEPRECATED: getAliasFromResolveInfo: (resolveInfo: GraphQLResolveInfo) => string,
      getSafeAliasFromResolveInfo: (resolveInfo: GraphQLResolveInfo) => string;
      getSafeAliasFromAlias: (alias: string) => string;
      resolveAlias: (
        data: {},
        _args: unknown,
        _context: unknown,
        resolveInfo: GraphQLResolveInfo,
      ) => string;

      addType: (
        type: GraphQLNamedType,
        origin: string | null | undefined,
      ) => void;
      getTypeByName: (typeName: string) => GraphQLType | null | undefined;

      extend: <Obj1 extends object, Obj2 extends object>(
        base: Obj1,
        extra: Obj2,
        hint: string,
      ) => Obj1 & Obj2;

      newWithHooks(
        constructor: typeof GraphQLSchema,
        spec: Partial<GraphQLSchemaConfig>,
        scope: ScopeGraphQLSchema,
      ): GraphQLSchema;
      newWithHooks(
        constructor: typeof GraphQLSchema,
        spec: Partial<GraphQLSchemaConfig>,
        scope: ScopeGraphQLSchema,
        performNonEmptyFieldsCheck?: boolean,
      ): GraphQLSchema | null;

      newWithHooks(
        constructor: typeof GraphQLScalarType,
        spec: GraphQLScalarTypeConfig<any, any>,
        scope: ScopeGraphQLScalarType,
      ): GraphQLScalarType;
      newWithHooks(
        constructor: typeof GraphQLScalarType,
        spec: GraphQLScalarTypeConfig<any, any>,
        scope: ScopeGraphQLScalarType,
        performNonEmptyFieldsCheck?: boolean,
      ): GraphQLScalarType | null;

      newWithHooks(
        constructor: typeof GraphQLObjectType,
        spec: GraphileObjectTypeConfig<any, any>,
        scope: ScopeGraphQLObjectType,
      ): GraphQLObjectType;
      newWithHooks(
        constructor: typeof GraphQLObjectType,
        spec: GraphileObjectTypeConfig<any, any>,
        scope: ScopeGraphQLObjectType,
        performNonEmptyFieldsCheck?: boolean,
      ): GraphQLObjectType | null;

      newWithHooks(
        constructor: typeof GraphQLInterfaceType,
        spec: GraphQLInterfaceTypeConfig<any, any>,
        scope: ScopeGraphQLInterfaceType,
      ): GraphQLInterfaceType;
      newWithHooks(
        constructor: typeof GraphQLInterfaceType,
        spec: GraphQLInterfaceTypeConfig<any, any>,
        scope: ScopeGraphQLInterfaceType,
        performNonEmptyFieldsCheck?: boolean,
      ): GraphQLInterfaceType | null;

      newWithHooks(
        constructor: typeof GraphQLUnionType,
        spec: GraphileUnionTypeConfig<any, any>,
        scope: ScopeGraphQLUnionType,
      ): GraphQLUnionType;
      newWithHooks(
        constructor: typeof GraphQLUnionType,
        spec: GraphileUnionTypeConfig<any, any>,
        scope: ScopeGraphQLUnionType,
        performNonEmptyFieldsCheck?: boolean,
      ): GraphQLUnionType | null;

      newWithHooks(
        constructor: typeof GraphQLEnumType,
        spec: GraphQLEnumTypeConfig,
        scope: ScopeGraphQLEnumType,
      ): GraphQLEnumType;
      newWithHooks(
        constructor: typeof GraphQLEnumType,
        spec: GraphQLEnumTypeConfig,
        scope: ScopeGraphQLEnumType,
        performNonEmptyFieldsCheck?: boolean,
      ): GraphQLEnumType | null;

      newWithHooks(
        constructor: typeof GraphQLInputObjectType,
        spec: GraphileInputObjectTypeConfig,
        scope: ScopeGraphQLInputObjectType,
      ): GraphQLInputObjectType;
      newWithHooks(
        constructor: typeof GraphQLInputObjectType,
        spec: GraphileInputObjectTypeConfig,
        scope: ScopeGraphQLInputObjectType,
        performNonEmptyFieldsCheck?: boolean,
      ): GraphQLInputObjectType | null;
      /*
  newWithHooks<
    T extends
      | typeof GraphQLScalarType
      | typeof GraphQLObjectType
      | typeof GraphQLInterfaceType
      | typeof GraphQLUnionType
      | typeof GraphQLEnumType
      | typeof GraphQLInputObjectType
      | typeof GraphQLSchema,
    ConfigType extends object,
    TScope extends Scope = Scope
  >(
    a: T,
    spec: ConfigType,
    scope: TScope,
    performNonEmptyFieldsCheck?: boolean
  ): InstanceType<T> | null | undefined;
  */

      /**
       * @deprecated use fieldDataGeneratorsByFieldNameByType instead (they're the same, but that one is named better)
       */
      fieldDataGeneratorsByType: Map<
        GraphQLNamedType,
        { [fieldName: string]: DataGeneratorFunction[] }
      >;

      fieldDataGeneratorsByFieldNameByType: Map<
        GraphQLNamedType,
        { [fieldName: string]: DataGeneratorFunction[] }
      >;
      fieldArgDataGeneratorsByFieldNameByType: Map<
        GraphQLNamedType,
        { [fieldName: string]: ArgDataGeneratorFunction[] }
      >;
      scopeByType: Map<GraphQLType, SomeScope>;

      inflection: Inflection;

      swallowError: (e: Error) => void;

      // resolveNode: EXPERIMENTAL, API might change!
      resolveNode: typeof import("./resolveNode").default;

      status: {
        currentHookName: string | null | undefined;
        currentHookEvent: string | null | undefined;
      };

      liveCoordinator: LiveCoordinator;
    }

    interface Build extends BuildBase {
      // QueryPlugin
      $$isQuery: symbol;

      // NodePlugin
      nodeIdFieldName: string;
      $$nodeType: symbol;
      nodeFetcherByTypeName: { [typeName: string]: NodeFetcher };
      getNodeIdForTypeAndIdentifiers: (
        Type: import("graphql").GraphQLType,
        ...identifiers: Array<unknown>
      ) => string;
      getTypeAndIdentifiersFromNodeId: (
        nodeId: string,
      ) => {
        Type: import("graphql").GraphQLType;
        identifiers: Array<unknown>;
      };

      addNodeFetcherForTypeName: (
        typeName: string,
        fetcher: NodeFetcher,
      ) => void;
      getNodeAlias: (typeName: string) => string;
      getNodeType: (alias: string) => import("graphql").GraphQLType;
      setNodeAlias: (typeName: string, alias: string) => void;
    }

    interface Scope {
      __origin?: string | null | undefined;
      directives?: DirectiveMap;
    }

    type DataGeneratorFunction = {
      (
        parsedResolveInfoFragment: ResolveTree,
        ReturnType: GraphQLOutputType,
        data: ResolvedLookAhead,
      ): Partial<LookAheadData>;
      displayName?: string;
    };

    type ArgDataGeneratorFunction = {
      (
        args: { [key: string]: unknown },
        ReturnType: GraphQLOutputType,
        data: ResolvedLookAhead,
      ): Partial<LookAheadData> | null | undefined;
      displayName?: string;
    };

    interface Context {
      scope: Scope;
      type:
        | "Build"
        | "Inflection"
        | "Init"
        | "GraphQLSchema"
        | "GraphQLScalarType"
        | "GraphQLObjectType"
        | "GraphQLInterfaceType"
        | "GraphQLUnionType"
        | "GraphQLEnumType"
        | "GraphQLInputObjectType"
        | "Finalize";
    }

    interface ScopeBuild extends Scope {}
    interface ContextBuild extends Context {
      scope: ScopeBuild;
      type: "Build";
    }

    interface ScopeInflection extends Scope {}
    interface ContextInflection extends Context {
      scope: ScopeInflection;
      type: "Inflection";
    }

    interface ScopeInit extends Scope {}
    interface ContextInit extends Context {
      scope: ScopeInit;
      type: "Init";
    }

    interface ScopeGraphQLSchema extends Scope {
      isSchema: true;
    }
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
    interface ContextGraphQLObjectTypeBase extends Context {
      scope: ScopeGraphQLObjectType;
      type: "GraphQLObjectType";
    }
    interface ContextGraphQLObjectType extends ContextGraphQLObjectTypeBase {
      addDataGeneratorForField: (
        fieldName: string,
        fn: DataGeneratorFunction,
      ) => void;
      /** YOU PROBABLY DON'T WANT THIS! */
      recurseDataGeneratorsForField(
        fieldName: string,
        iKnowWhatIAmDoing?: boolean,
      ): void;
    }

    interface ScopeGraphQLObjectTypeInterfaces extends ScopeGraphQLObjectType {}
    interface ContextGraphQLObjectTypeInterfaces
      extends ContextGraphQLObjectTypeBase {
      scope: ScopeGraphQLObjectTypeInterfaces;
      Self: GraphQLObjectType;
      GraphQLObjectType: GraphileObjectTypeConfig<any, any>;
    }

    interface ScopeGraphQLObjectTypeFields extends ScopeGraphQLObjectType {}
    interface ContextGraphQLObjectTypeFields extends ContextGraphQLObjectType {
      scope: ScopeGraphQLObjectTypeFields;
      addDataGeneratorForField: (
        fieldName: string,
        fn: DataGeneratorFunction,
      ) => void;
      recurseDataGeneratorsForField: (
        fieldName: string,
        iKnowWhatIAmDoing: boolean,
      ) => void; // @deprecated - DO NOT USE!
      Self: GraphQLObjectType;
      GraphQLObjectType: GraphQLObjectTypeConfig<any, any>;
      fieldWithHooks: FieldWithHooksFunction;
    }

    interface ScopeGraphQLObjectTypeFieldsField extends ScopeGraphQLObjectType {
      fieldName?: string;
      autoField?: boolean;
      fieldDirectives?: DirectiveMap;

      isLiveField?: boolean;
      originalField?: import("graphql").GraphQLField<any, any>;
      isRootNodeField?: boolean;
      isPageInfoHasNextPageField?: boolean;
      isPageInfoHasPreviousPageField?: boolean;
    }
    interface ScopeGraphQLObjectTypeFieldsFieldWithFieldName
      extends ScopeGraphQLObjectTypeFieldsField {
      fieldName: string;
    }
    interface ContextGraphQLObjectTypeFieldsField
      extends ContextGraphQLObjectTypeBase {
      scope: ScopeGraphQLObjectTypeFieldsFieldWithFieldName;
      Self: GraphQLObjectType;
      addDataGenerator: (fn: DataGeneratorFunction) => void;
      addArgDataGenerator: (fn: ArgDataGeneratorFunction) => void;
      getDataFromParsedResolveInfoFragment: GetDataFromParsedResolveInfoFragmentFunction;
    }

    interface ScopeGraphQLObjectTypeFieldsFieldArgs
      extends ScopeGraphQLObjectTypeFieldsField {
      fieldName: string;
    }
    interface ContextGraphQLObjectTypeFieldsFieldArgs
      extends ContextGraphQLObjectTypeFieldsField {
      scope: ScopeGraphQLObjectTypeFieldsFieldArgs;
      Self: GraphQLObjectType;
      field: GraphQLFieldConfig<any, any>;
      returnType: GraphQLOutputType;
    }

    interface ScopeGraphQLInterfaceType extends Scope {}
    interface ContextGraphQLInterfaceType extends Context {
      scope: ScopeGraphQLInterfaceType;
      type: "GraphQLInterfaceType";
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
      GraphQLUnionType: GraphileUnionTypeConfig<any, any>;
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
      GraphQLInputObjectType: GraphileInputObjectTypeConfig;
      fieldWithHooks: InputFieldWithHooksFunction;
    }

    interface ScopeGraphQLInputObjectTypeFieldsField
      extends ScopeGraphQLInputObjectType {
      fieldName?: string;
      autoField?: boolean;
    }
    interface ScopeGraphQLInputObjectTypeFieldsFieldWithFieldName
      extends ScopeGraphQLInputObjectTypeFieldsField {
      fieldName: string;
    }
    interface ContextGraphQLInputObjectTypeFieldsField
      extends ContextGraphQLInputObjectType {
      scope: ScopeGraphQLInputObjectTypeFieldsFieldWithFieldName;
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

    interface ScopeGraphQLEnumTypeValuesValue extends ScopeGraphQLEnumType {}
    interface ContextGraphQLEnumTypeValuesValue extends ContextGraphQLEnumType {
      scope: ScopeGraphQLEnumTypeValuesValue;
    }

    interface ScopeFinalize extends Scope {}
    interface ContextFinalize extends Context {
      scope: ScopeFinalize;
      type: "Finalize";
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
      | ScopeGraphQLObjectTypeFieldsFieldWithFieldName
      | ScopeGraphQLObjectTypeFieldsFieldArgs
      | ScopeGraphQLInterfaceType
      | ScopeGraphQLUnionType
      | ScopeGraphQLUnionTypeTypes
      | ScopeGraphQLInputObjectType
      | ScopeGraphQLInputObjectTypeFields
      | ScopeGraphQLInputObjectTypeFieldsField
      | ScopeGraphQLInputObjectTypeFieldsFieldWithFieldName
      | ScopeGraphQLEnumType
      | ScopeGraphQLEnumTypeValues
      | ScopeGraphQLEnumTypeValuesValue
      | ScopeFinalize;
    interface Hook<Type, TContext extends Context, TBuild = Build> {
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
