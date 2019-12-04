import debugFactory from "debug";
import makeNewBuild, {
  InflectionBase,
  FieldWithHooksFunction,
  InputFieldWithHooksFunction,
  GetDataFromParsedResolveInfoFragmentFunction,
} from "./makeNewBuild";
import { bindAll } from "./utils";
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
  GraphQLFieldConfigArgumentMap,
  GraphQLInputFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLEnumValueConfigMap,
  GraphQLEnumValueConfig,
  GraphQLOutputType,
} from "graphql";
import EventEmitter = require("events");
// TODO: when we move to TypeScript, change this to:
// import { EventEmitter } from "events";

import { LiveCoordinator } from "./Live";
import { ResolveTree } from "graphql-parse-resolve-info";

export { FieldWithHooksFunction, InputFieldWithHooksFunction };

export interface GraphileResolverContext {}

const debug = debugFactory("graphile-builder");

const INDENT = "  ";

export interface DirectiveMap {
  [directiveName: string]: {
    [directiveArgument: string]: any;
  };
}

export interface GraphileBuildOptions {
  subscriptions?: boolean;
  live?: boolean;
  nodeIdFieldName?: string;
}

// Deprecated 'Options' in favour of 'GraphileBuildOptions':
export type Options = GraphileBuildOptions;

export interface Plugin {
  (builder: SchemaBuilder, options: GraphileBuildOptions): Promise<void> | void;
  displayName?: string;
}

export type InitObject = never;

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
export interface LookAheadData {}

/**
 * This contains all the possibilities for lookahead data, once "baked". It's
 * an object that maps from key (string) to an array of entries for that type.
 *
 * We made this generic so that TypeScript has to look it up _after_ the
 * declaration merging has taken place, rather than computing it as an empty
 * object ahead of time.
 */
export type ResolvedLookAhead<T extends LookAheadData = LookAheadData> = {
  [P in keyof T]?: Array<T[P]>;
};

export interface Inflection extends InflectionBase {}

export interface GraphileObjectTypeConfig<
  TSource,
  TContext,
  TArgs = { [key: string]: any }
> extends Omit<GraphQLObjectTypeConfig<TSource, TContext, TArgs>, "fields"> {
  fields?:
    | GraphQLFieldConfigMap<TSource, TContext, TArgs>
    | ((
        context: ContextGraphQLObjectTypeFields
      ) => GraphQLFieldConfigMap<TSource, TContext, TArgs>);
}

export interface GraphileInputObjectTypeConfig
  extends Omit<GraphQLInputObjectTypeConfig, "fields"> {
  fields?:
    | GraphQLInputFieldConfigMap
    | ((
        context: ContextGraphQLInputObjectTypeFields
      ) => GraphQLInputFieldConfigMap);
}

export interface GraphileUnionTypeConfig<TSource, TContext>
  extends Omit<GraphQLUnionTypeConfig<TSource, TContext>, "types"> {
  types?:
    | GraphQLObjectType[]
    | ((context: ContextGraphQLUnionTypeTypes) => GraphQLObjectType[]);
}

export interface BuildBase {
  options: GraphileBuildOptions;
  graphileBuildVersion: string;
  versions: {
    [packageName: string]: string;
  };
  hasVersion(
    packageName: string,
    range: string,
    options?: { includePrerelease?: boolean }
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
    resolveInfo: GraphQLResolveInfo
  ) => string;

  addType: (type: GraphQLNamedType, origin: string | null | undefined) => void;
  getTypeByName: (typeName: string) => GraphQLType | null | undefined;

  extend: <Obj1 extends object, Obj2 extends object>(
    base: Obj1,
    extra: Obj2,
    hint: string
  ) => Obj1 & Obj2;

  newWithHooks(
    constructor: typeof GraphQLSchema,
    spec: Partial<GraphQLSchemaConfig>,
    scope: ScopeGraphQLSchema
  ): GraphQLSchema;
  newWithHooks(
    constructor: typeof GraphQLSchema,
    spec: Partial<GraphQLSchemaConfig>,
    scope: ScopeGraphQLSchema,
    performNonEmptyFieldsCheck?: boolean
  ): GraphQLSchema | null;

  newWithHooks(
    constructor: typeof GraphQLScalarType,
    spec: GraphQLScalarTypeConfig<any, any>,
    scope: ScopeGraphQLScalarType
  ): GraphQLScalarType;
  newWithHooks(
    constructor: typeof GraphQLScalarType,
    spec: GraphQLScalarTypeConfig<any, any>,
    scope: ScopeGraphQLScalarType,
    performNonEmptyFieldsCheck?: boolean
  ): GraphQLScalarType | null;

  newWithHooks(
    constructor: typeof GraphQLObjectType,
    spec: GraphileObjectTypeConfig<any, any>,
    scope: ScopeGraphQLObjectType
  ): GraphQLObjectType;
  newWithHooks(
    constructor: typeof GraphQLObjectType,
    spec: GraphileObjectTypeConfig<any, any>,
    scope: ScopeGraphQLObjectType,
    performNonEmptyFieldsCheck?: boolean
  ): GraphQLObjectType | null;

  newWithHooks(
    constructor: typeof GraphQLInterfaceType,
    spec: GraphQLInterfaceTypeConfig<any, any, any>,
    scope: ScopeGraphQLInterfaceType
  ): GraphQLInterfaceType;
  newWithHooks(
    constructor: typeof GraphQLInterfaceType,
    spec: GraphQLInterfaceTypeConfig<any, any, any>,
    scope: ScopeGraphQLInterfaceType,
    performNonEmptyFieldsCheck?: boolean
  ): GraphQLInterfaceType | null;

  newWithHooks(
    constructor: typeof GraphQLUnionType,
    spec: GraphileUnionTypeConfig<any, any>,
    scope: ScopeGraphQLUnionType
  ): GraphQLUnionType;
  newWithHooks(
    constructor: typeof GraphQLUnionType,
    spec: GraphileUnionTypeConfig<any, any>,
    scope: ScopeGraphQLUnionType,
    performNonEmptyFieldsCheck?: boolean
  ): GraphQLUnionType | null;

  newWithHooks(
    constructor: typeof GraphQLEnumType,
    spec: GraphQLEnumTypeConfig,
    scope: ScopeGraphQLEnumType
  ): GraphQLEnumType;
  newWithHooks(
    constructor: typeof GraphQLEnumType,
    spec: GraphQLEnumTypeConfig,
    scope: ScopeGraphQLEnumType,
    performNonEmptyFieldsCheck?: boolean
  ): GraphQLEnumType | null;

  newWithHooks(
    constructor: typeof GraphQLInputObjectType,
    spec: GraphileInputObjectTypeConfig,
    scope: ScopeGraphQLInputObjectType
  ): GraphQLInputObjectType;
  newWithHooks(
    constructor: typeof GraphQLInputObjectType,
    spec: GraphileInputObjectTypeConfig,
    scope: ScopeGraphQLInputObjectType,
    performNonEmptyFieldsCheck?: boolean
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
   * @deprecated use fieldDataGeneratorsByFieldNameByType instead
   */
  fieldDataGeneratorsByType: Map<any, any>;

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

export interface Build extends BuildBase {}

export interface Scope {
  __origin?: string | null | undefined;
  directives?: DirectiveMap;
}

export type DataGeneratorFunction = {
  (
    parsedResolveInfoFragment: ResolveTree,
    ReturnType: GraphQLOutputType,
    data: ResolvedLookAhead
  ): Partial<LookAheadData>;
  displayName?: string;
};

export type ArgDataGeneratorFunction = {
  (
    args: { [key: string]: unknown },
    ReturnType: GraphQLOutputType,
    data: ResolvedLookAhead
  ): Partial<LookAheadData>;
  displayName?: string;
};

export interface Context {
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

export interface ScopeBuild extends Scope {}
export interface ContextBuild extends Context {
  scope: ScopeBuild;
  type: "Build";
}

export interface ScopeInflection extends Scope {}
export interface ContextInflection extends Context {
  scope: ScopeInflection;
  type: "Inflection";
}

export interface ScopeInit extends Scope {}
export interface ContextInit extends Context {
  scope: ScopeInit;
  type: "Init";
}

export interface ScopeGraphQLSchema extends Scope {
  isSchema: true;
}
export interface ContextGraphQLSchema extends Context {
  scope: ScopeGraphQLSchema;
  type: "GraphQLSchema";
}

export interface ScopeGraphQLScalarType extends Scope {}
export interface ContextGraphQLScalarType extends Context {
  scope: ScopeGraphQLScalarType;
  type: "GraphQLScalarType";
}

export interface ScopeGraphQLObjectType extends Scope {
  isMutationPayload?: true;
}
export interface ContextGraphQLObjectTypeBase extends Context {
  scope: ScopeGraphQLObjectType;
  type: "GraphQLObjectType";
}
export interface ContextGraphQLObjectType extends ContextGraphQLObjectTypeBase {
  addDataGeneratorForField: (
    fieldName: string,
    fn: DataGeneratorFunction
  ) => void;
  /** YOU PROBABLY DON'T WANT THIS! */
  recurseDataGeneratorsForField(
    fieldName: string,
    iKnowWhatIAmDoing?: boolean
  ): void;
}

export interface ScopeGraphQLObjectTypeInterfaces
  extends ScopeGraphQLObjectType {}
export interface ContextGraphQLObjectTypeInterfaces
  extends ContextGraphQLObjectTypeBase {
  scope: ScopeGraphQLObjectTypeInterfaces;
  Self: GraphQLObjectType;
  GraphQLObjectType: GraphileObjectTypeConfig<any, any>;
}

export interface ScopeGraphQLObjectTypeFields extends ScopeGraphQLObjectType {}
export interface ContextGraphQLObjectTypeFields
  extends ContextGraphQLObjectType {
  scope: ScopeGraphQLObjectTypeFields;
  addDataGeneratorForField: (
    fieldName: string,
    fn: DataGeneratorFunction
  ) => void;
  recurseDataGeneratorsForField: (
    fieldName: string,
    iKnowWhatIAmDoing: boolean
  ) => void; // @deprecated - DO NOT USE!
  Self: GraphQLObjectType;
  GraphQLObjectType: GraphQLObjectTypeConfig<any, any>;
  fieldWithHooks: FieldWithHooksFunction;
}

export interface ScopeGraphQLObjectTypeFieldsField
  extends ScopeGraphQLObjectType {
  fieldName: string;
  autoField?: true;
  fieldDirectives?: DirectiveMap;

  // TODO: Relocate these to the relevant places
  isRootNodeField?: true;
  isPageInfoHasNextPageField?: true;
  isPageInfoHasPreviousPageField?: true;
}
export interface ContextGraphQLObjectTypeFieldsField
  extends ContextGraphQLObjectTypeBase {
  scope: ScopeGraphQLObjectTypeFieldsField;
  Self: GraphQLObjectType;
  addDataGenerator: (fn: DataGeneratorFunction) => void;
  addArgDataGenerator: (fn: ArgDataGeneratorFunction) => void;
  getDataFromParsedResolveInfoFragment: GetDataFromParsedResolveInfoFragmentFunction;
}

export interface ScopeGraphQLObjectTypeFieldsFieldArgs
  extends ScopeGraphQLObjectTypeFieldsField {
  fieldName: string;
}
export interface ContextGraphQLObjectTypeFieldsFieldArgs
  extends ContextGraphQLObjectTypeFieldsField {
  scope: ScopeGraphQLObjectTypeFieldsFieldArgs;
  Self: GraphQLObjectType;
  field: GraphQLFieldConfig<any, any>;
  returnType: GraphQLOutputType;
}

export interface ScopeGraphQLInterfaceType extends Scope {}
export interface ContextGraphQLInterfaceType extends Context {
  scope: ScopeGraphQLInterfaceType;
  type: "GraphQLInterfaceType";
}

export interface ScopeGraphQLUnionType extends Scope {}
export interface ContextGraphQLUnionType extends Context {
  scope: ScopeGraphQLUnionType;
  type: "GraphQLUnionType";
}

export interface ScopeGraphQLUnionTypeTypes extends ScopeGraphQLUnionType {}
export interface ContextGraphQLUnionTypeTypes extends ContextGraphQLUnionType {
  scope: ScopeGraphQLUnionTypeTypes;
  Self: GraphQLUnionType;
  GraphQLUnionType: GraphileUnionTypeConfig<any, any>;
}

export interface ScopeGraphQLInputObjectType extends Scope {
  isMutationInput?: true;
}
export interface ContextGraphQLInputObjectType extends Context {
  scope: ScopeGraphQLInputObjectType;
  type: "GraphQLInputObjectType";
}

export interface ScopeGraphQLInputObjectTypeFields
  extends ScopeGraphQLInputObjectType {}
export interface ContextGraphQLInputObjectTypeFields
  extends ContextGraphQLInputObjectType {
  scope: ScopeGraphQLInputObjectTypeFields;
  Self: GraphQLInputObjectType;
  GraphQLInputObjectType: GraphileInputObjectTypeConfig;
  fieldWithHooks: InputFieldWithHooksFunction;
}

export interface ScopeGraphQLInputObjectTypeFieldsField
  extends ScopeGraphQLInputObjectType {
  fieldName: string;
  autoField?: true;
}
export interface ContextGraphQLInputObjectTypeFieldsField
  extends ContextGraphQLInputObjectType {
  scope: ScopeGraphQLInputObjectTypeFieldsField;
  Self: GraphQLInputObjectType;
}

export interface ScopeGraphQLEnumType extends Scope {}
export interface ContextGraphQLEnumType extends Context {
  scope: ScopeGraphQLEnumType;
  type: "GraphQLEnumType";
}

export interface ScopeGraphQLEnumTypeValues extends ScopeGraphQLEnumType {}
export interface ContextGraphQLEnumTypeValues extends ContextGraphQLEnumType {
  scope: ScopeGraphQLEnumTypeValues;
}

export interface ScopeGraphQLEnumTypeValuesValue extends ScopeGraphQLEnumType {}
export interface ContextGraphQLEnumTypeValuesValue
  extends ContextGraphQLEnumType {
  scope: ScopeGraphQLEnumTypeValuesValue;
}

export interface ScopeFinalize extends Scope {}
export interface ContextFinalize extends Context {
  scope: ScopeFinalize;
  type: "Finalize";
}

export type SomeScope =
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

export interface Hook<Type, TContext extends Context, TBuild = Build> {
  (input: Type, build: TBuild, context: TContext): Type;
  displayName?: string;
  provides?: Array<string>;
  before?: Array<string>;
  after?: Array<string>;
}

export type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

export type SchemaListener = (newSchema: GraphQLSchema) => void;

class SchemaBuilder extends EventEmitter {
  options: GraphileBuildOptions;
  watchers: Array<WatchUnwatch>;
  unwatchers: Array<WatchUnwatch>;
  triggerChange: TriggerChangeType | null | undefined;
  depth: number;
  hooks: {
    [a: string]: Array<Hook<any, any>>;
  };

  _currentPluginName: string | null | undefined;
  _generatedSchema: GraphQLSchema | null | undefined;
  _explicitSchemaListener: SchemaListener | null | undefined;
  _busy: boolean;
  _watching: boolean;

  constructor(options: GraphileBuildOptions) {
    super();

    this.options = options;
    if (!options) {
      throw new Error("Please pass options to SchemaBuilder");
    }

    this._busy = false;
    this._watching = false;

    this.watchers = [];
    this.unwatchers = [];

    // Because hooks can nest, this keeps track of how deep we are.
    this.depth = -1;

    this.hooks = {
      // The build object represents the current schema build and is passed to
      // all hooks, hook the 'build' event to extend this object:
      build: [],

      // Inflection is used for naming resulting types/fields/args/etc - it's
      // hookable so that other plugins may extend it or override it
      inflection: [],

      // 'build' phase should not generate any GraphQL objects (because the
      // build object isn't finalised yet so it risks weirdness occurring); so
      // if you need to set up any global types you can do so here.
      init: [],

      // 'finalize' phase is called once the schema is built; typically you
      // shouldn't use this, but it's useful for interfacing with external
      // libraries that mutate an already constructed schema.
      finalize: [],

      // Add 'query', 'mutation' or 'subscription' types in this hook:
      GraphQLSchema: [],

      // When creating a GraphQLObjectType via `newWithHooks`, we'll
      // execute, the following hooks:
      // - 'GraphQLObjectType' to add any root-level attributes, e.g. add a description
      // - 'GraphQLObjectType:interfaces' to add additional interfaces to this object type
      // - 'GraphQLObjectType:fields' to add additional fields to this object type (is
      //   ran asynchronously and gets a reference to the final GraphQL Object as
      //   `Self` in the context)
      // - 'GraphQLObjectType:fields:field' to customise an individual field from above
      // - 'GraphQLObjectType:fields:field:args' to customize the arguments to a field
      GraphQLObjectType: [],
      "GraphQLObjectType:interfaces": [],
      "GraphQLObjectType:fields": [],
      "GraphQLObjectType:fields:field": [],
      "GraphQLObjectType:fields:field:args": [],

      // When creating a GraphQLInputObjectType via `newWithHooks`, we'll
      // execute, the following hooks:
      // - 'GraphQLInputObjectType' to add any root-level attributes, e.g. add a description
      // - 'GraphQLInputObjectType:fields' to add additional fields to this object type (is
      //   ran asynchronously and gets a reference to the final GraphQL Object as
      //   `Self` in the context)
      // - 'GraphQLInputObjectType:fields:field' to customise an individual field from above
      GraphQLInputObjectType: [],
      "GraphQLInputObjectType:fields": [],
      "GraphQLInputObjectType:fields:field": [],

      // When creating a GraphQLEnumType via `newWithHooks`, we'll
      // execute, the following hooks:
      // - 'GraphQLEnumType' to add any root-level attributes, e.g. add a description
      // - 'GraphQLEnumType:values' to add additional values
      // - 'GraphQLEnumType:values:value' to change an individual value
      GraphQLEnumType: [],
      "GraphQLEnumType:values": [],
      "GraphQLEnumType:values:value": [],

      // When creating a GraphQLUnionType via `newWithHooks`, we'll
      // execute, the following hooks:
      // - 'GraphQLUnionType' to add any root-level attributes, e.g. add a description
      // - 'GraphQLUnionType:types' to add additional types to this union
      GraphQLUnionType: [],
      "GraphQLUnionType:types": [],
    };
  }

  _setPluginName(name: string | null | undefined) {
    this._currentPluginName = name;
  }

  /*
   * Every hook `fn` takes three arguments:
   * - obj - the object currently being inspected
   * - build - the current build object (which contains a number of utilities and the context of the build)
   * - context - information specific to the current invocation of the hook
   *
   * The function must either return a replacement object for `obj` or `obj` itself
   */
  hook(
    hookName: "build",
    fn: Hook<Partial<Build> & BuildBase, ContextBuild, BuildBase>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "inflection",
    fn: Hook<
      Partial<Inflection> & InflectionBase,
      ContextInflection,
      BuildBase
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "init",
    fn: Hook<InitObject, ContextInit>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLSchema",
    fn: Hook<GraphQLSchemaConfig, ContextGraphQLSchema>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLObjectType",
    fn: Hook<
      GraphQLObjectTypeConfig<TSource, TContext>,
      ContextGraphQLObjectType
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLObjectType:interfaces",
    fn: Hook<
      Array<GraphQLInterfaceTypeConfig<any, any>>,
      ContextGraphQLObjectTypeInterfaces
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLObjectType:fields",
    fn: Hook<
      GraphQLFieldConfigMap<TSource, TContext>,
      ContextGraphQLObjectTypeFields
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLObjectType:fields:field",
    fn: Hook<
      GraphQLFieldConfig<TSource, TContext>,
      ContextGraphQLObjectTypeFieldsField
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLObjectType:fields:field:args",
    fn: Hook<
      GraphQLFieldConfigArgumentMap,
      ContextGraphQLObjectTypeFieldsFieldArgs
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLInputObjectType",
    fn: Hook<GraphileInputObjectTypeConfig, ContextGraphQLInputObjectType>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLInputObjectType:fields",
    fn: Hook<GraphQLInputFieldConfigMap, ContextGraphQLInputObjectTypeFields>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLInputObjectType:fields:field",
    fn: Hook<GraphQLInputFieldConfig, ContextGraphQLInputObjectTypeFieldsField>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLEnumType",
    fn: Hook<GraphQLEnumTypeConfig, ContextGraphQLEnumType>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLEnumType:values",
    fn: Hook<GraphQLEnumValueConfigMap, ContextGraphQLEnumTypeValues>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLEnumType:values:value",
    fn: Hook<GraphQLEnumValueConfig, ContextGraphQLEnumTypeValuesValue>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLUnionType",
    fn: Hook<
      GraphQLUnionTypeConfig<TSource, TContext>,
      ContextGraphQLUnionType
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "GraphQLUnionType:types",
    fn: Hook<
      Array<GraphileObjectTypeConfig<any, any>>,
      ContextGraphQLUnionTypeTypes
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook(
    hookName: "finalize",
    fn: Hook<GraphQLSchema, ContextFinalize>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ): void;
  hook<TType, TContext extends Context>(
    hookName: string,
    fn: Hook<TType, TContext>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ) {
    if (!this.hooks[hookName]) {
      throw new Error(`Sorry, '${hookName}' is not a supported hook`);
    }
    if (this._currentPluginName) {
      fn.displayName = `${this._currentPluginName}/${hookName}/${(provides &&
        provides.length &&
        provides.join("+")) ||
        fn.displayName ||
        fn.name ||
        "unnamed"}`;
    }
    if (provides) {
      if (!fn.displayName && provides.length) {
        fn.displayName = `unknown/${hookName}/${provides[0]}`;
      }
      fn.provides = provides;
    }
    if (before) {
      fn.before = before;
    }
    if (after) {
      fn.after = after;
    }
    if (!fn.provides && !fn.before && !fn.after) {
      // No explicit dependencies - add to the end
      this.hooks[hookName].push(fn);
    } else {
      // We need to figure out where it can go, respecting all the dependencies.
      // TODO: I think there are situations in which this algorithm may result in unnecessary conflict errors; we should take a more iterative approach or find a better algorithm
      const relevantHooks = this.hooks[hookName];
      let minIndex = 0;
      let minReason = null;
      let maxIndex = relevantHooks.length;
      let maxReason = null;
      const { provides: newProvides, before: newBefore, after: newAfter } = fn;
      const describe = (hook: any, index?: number) => {
        if (!hook) {
          return "-";
        }
        return `${hook.displayName || hook.name || "anonymous"} (${
          index ? `index: ${index}, ` : ""
        }provides: ${hook.provides ? hook.provides.join(",") : "-"}, before: ${
          hook.before ? hook.before.join(",") : "-"
        }, after: ${hook.after ? hook.after.join(",") : "-"})`;
      };
      const check = () => {
        if (minIndex > maxIndex) {
          throw new Error(
            `Cannot resolve plugin order - ${describe(
              fn
            )} cannot be before ${describe(
              maxReason,
              maxIndex
            )} and after ${describe(
              minReason,
              minIndex
            )} - please report this issue`
          );
        }
      };
      const setMin = (newMin, reason) => {
        if (newMin > minIndex) {
          minIndex = newMin;
          minReason = reason;
          check();
        }
      };
      const setMax = (newMax, reason) => {
        if (newMax < maxIndex) {
          maxIndex = newMax;
          maxReason = reason;
          check();
        }
      };
      relevantHooks.forEach((oldHook, idx) => {
        const {
          provides: oldProvides,
          before: oldBefore,
          after: oldAfter,
        } = oldHook;
        if (newProvides) {
          if (oldBefore && oldBefore.some(dep => newProvides.includes(dep))) {
            // Old says it has to come before new
            setMin(idx + 1, oldHook);
          }
          if (oldAfter && oldAfter.some(dep => newProvides.includes(dep))) {
            // Old says it has to be after new
            setMax(idx, oldHook);
          }
        }
        if (oldProvides) {
          if (newBefore && newBefore.some(dep => oldProvides.includes(dep))) {
            // New says it has to come before old
            setMax(idx, oldHook);
          }
          if (newAfter && newAfter.some(dep => oldProvides.includes(dep))) {
            // New says it has to be after old
            setMin(idx + 1, oldHook);
          }
        }
      });

      // We've already validated everything, so we can now insert the record.
      this.hooks[hookName].splice(maxIndex, 0, fn);
    }
  }

  applyHooks(
    build: BuildBase,
    hookName: "build",
    input: Partial<Build> & BuildBase,
    context: ContextBuild,
    debugStr?: string
  ): Build;
  applyHooks(
    build: BuildBase,
    hookName: "inflection",
    input: Partial<Inflection> & InflectionBase,
    context: ContextInflection,
    debugStr?: string
  ): Inflection;
  applyHooks(
    build: Build,
    hookName: "init",
    input: InitObject,
    context: ContextInit,
    debugStr?: string
  ): InitObject;
  applyHooks(
    build: Build,
    hookName: "GraphQLSchema",
    input: GraphQLSchemaConfig,
    context: ContextGraphQLSchema,
    debugStr?: string
  ): GraphQLSchemaConfig;
  applyHooks(
    build: Build,
    hookName: "GraphQLScalarType",
    input: GraphQLScalarTypeConfig<any, any>,
    context: ContextGraphQLScalarType,
    debugStr?: string
  ): GraphQLScalarTypeConfig<any, any>;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType",
    input: GraphileObjectTypeConfig<any, any>,
    context: ContextGraphQLObjectType,
    debugStr?: string
  ): GraphQLObjectTypeConfig<any, any>;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType:interfaces",
    input: Array<GraphQLInterfaceTypeConfig<any, any, any>>,
    context: ContextGraphQLObjectTypeInterfaces,
    debugStr?: string
  ): Array<GraphQLInterfaceTypeConfig<any, any, any>>;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType:fields",
    input: GraphQLFieldConfigMap<any, any, any>,
    context: ContextGraphQLObjectTypeFields,
    debugStr?: string
  ): GraphQLFieldConfigMap<any, any, any>;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType:fields:field",
    input: GraphQLFieldConfig<any, any, any>,
    context: ContextGraphQLObjectTypeFieldsField,
    debugStr?: string
  ): GraphQLFieldConfig<any, any, any>;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType:fields:field:args",
    input: GraphQLFieldConfigArgumentMap,
    context: ContextGraphQLObjectTypeFieldsFieldArgs,
    debugStr?: string
  ): GraphQLFieldConfigArgumentMap;
  applyHooks(
    build: Build,
    hookName: "GraphQLInterfaceType",
    input: GraphQLInterfaceTypeConfig<any, any, any>,
    context: ContextGraphQLInterfaceType,
    debugStr?: string
  ): GraphQLInterfaceTypeConfig<any, any, any>;
  applyHooks(
    build: Build,
    hookName: "GraphQLUnionType",
    input: GraphileUnionTypeConfig<any, any>,
    context: ContextGraphQLUnionType,
    debugStr?: string
  ): GraphileUnionTypeConfig<any, any>;
  applyHooks(
    build: Build,
    hookName: "GraphQLUnionType:types",
    input: Array<GraphQLObjectType<any, any>>,
    context: ContextGraphQLUnionTypeTypes,
    debugStr?: string
  ): Array<GraphQLObjectType<any, any>>;
  applyHooks(
    build: Build,
    hookName: "GraphQLEnumType",
    input: GraphQLEnumTypeConfig,
    context: ContextGraphQLEnumType,
    debugStr?: string
  ): GraphQLEnumTypeConfig;
  applyHooks(
    build: Build,
    hookName: "GraphQLEnumType:values",
    input: GraphQLEnumValueConfigMap,
    context: ContextGraphQLEnumTypeValues,
    debugStr?: string
  ): GraphQLEnumValueConfigMap;
  applyHooks(
    build: Build,
    hookName: "GraphQLEnumType:values:value",
    input: GraphQLEnumValueConfig,
    context: ContextGraphQLEnumTypeValuesValue,
    debugStr?: string
  ): GraphQLEnumValueConfig;
  applyHooks(
    build: Build,
    hookName: "GraphQLInputObjectType",
    input: GraphileInputObjectTypeConfig,
    context: ContextGraphQLInputObjectType,
    debugStr?: string
  ): GraphQLInputObjectTypeConfig;
  applyHooks(
    build: Build,
    hookName: "GraphQLInputObjectType:fields",
    input: GraphQLInputFieldConfigMap,
    context: ContextGraphQLInputObjectTypeFields,
    debugStr?: string
  ): GraphQLInputFieldConfigMap;
  applyHooks(
    build: Build,
    hookName: "GraphQLInputObjectType:fields:field",
    input: GraphQLInputFieldConfig,
    context: ContextGraphQLInputObjectTypeFieldsField,
    debugStr?: string
  ): GraphQLInputFieldConfig;
  applyHooks(
    build: Build,
    hookName: "finalize",
    input: GraphQLSchema,
    context: ContextFinalize,
    debugStr?: string
  ): GraphQLSchema;
  applyHooks<TConfig extends any, TContext extends Context>(
    build: Build,
    hookName: string,
    input: TConfig,
    context: TContext,
    debugStr: string = ""
  ): TConfig {
    if (!input) {
      throw new Error("applyHooks was called with falsy input");
    }
    this.depth++;
    try {
      debug(`${INDENT.repeat(this.depth)}[${hookName}${debugStr}]: Running...`);

      const hooks: Array<Hook<TConfig, TContext>> = this.hooks[hookName];
      if (!hooks) {
        throw new Error(`Sorry, '${hookName}' is not a registered hook`);
      }

      let newObj = input;
      for (const hook of hooks) {
        this.depth++;
        try {
          const hookDisplayName = hook.displayName || hook.name || "anonymous";
          debug(
            `${INDENT.repeat(
              this.depth
            )}[${hookName}${debugStr}]:   Executing '${hookDisplayName}'`
          );

          const previousHookName = build.status.currentHookName;
          const previousHookEvent = build.status.currentHookEvent;
          build.status.currentHookName = hookDisplayName;
          build.status.currentHookEvent = hookName;
          const oldObj = newObj;
          newObj = hook(newObj, build, context);
          if (hookName === "build") {
            /*
             * Unlike all the other hooks, the `build` hook must always use the
             * same `build` object - never returning a new object for fear of
             * causing issues to other build hooks that reference the old
             * object and don't get the new additions.
             */
            if (newObj !== oldObj) {
              // TODO:v5: forbid this
              // eslint-disable-next-line no-console
              console.warn(
                `Build hook '${hookDisplayName}' returned a new object; please use 'return build.extend(build, {...})' instead.`
              );

              // Copy everything from newObj back to oldObj
              Object.assign(oldObj, newObj);
              // Go back to the old objectect
              newObj = oldObj;
            }
          }
          build.status.currentHookName = previousHookName;
          build.status.currentHookEvent = previousHookEvent;

          if (!newObj) {
            throw new Error(
              `Hook '${hook.displayName ||
                hook.name ||
                "anonymous"}' for '${hookName}' returned falsy value '${newObj}'`
            );
          }
          debug(
            `${INDENT.repeat(
              this.depth
            )}[${hookName}${debugStr}]:   '${hookDisplayName}' complete`
          );
        } finally {
          this.depth--;
        }
      }

      debug(`${INDENT.repeat(this.depth)}[${hookName}${debugStr}]: Complete`);

      return newObj;
    } finally {
      this.depth--;
    }
  }

  registerWatcher(listen: WatchUnwatch, unlisten: WatchUnwatch): void {
    if (!listen || !unlisten) {
      throw new Error("You must provide both a listener and an unlistener");
    }
    this.watchers.push(listen);
    this.unwatchers.push(unlisten);
  }

  createBuild(): Build {
    const initialBuild = makeNewBuild(this);
    // Inflection needs to come first, in case 'build' hooks depend on it
    const scopeContext: ContextInflection = {
      scope: {},
      type: "Inflection",
    };
    initialBuild.inflection = this.applyHooks(
      initialBuild,
      "inflection",
      initialBuild.inflection,
      scopeContext
    );

    const build = this.applyHooks(initialBuild, "build", initialBuild, {
      scope: {},
      type: "Build",
    });

    // Bind all functions so they can be dereferenced
    bindAll(
      build,
      Object.keys(build).filter(key => typeof build[key] === "function")
    );

    Object.freeze(build);
    const initContext: ContextInit = { scope: {}, type: "Init" };
    const initObject: InitObject = {} as never;
    this.applyHooks(build, "init", initObject, initContext);
    return build;
  }

  buildSchema(): GraphQLSchema {
    if (!this._generatedSchema) {
      const build = this.createBuild();
      const schemaSpec: Partial<GraphQLSchemaConfig> = {
        directives: [...build.graphql.specifiedDirectives],
      };
      const schemaScope: ScopeGraphQLSchema = {
        __origin: `GraphQL built-in`,
        isSchema: true,
      };
      const schema = build.newWithHooks(GraphQLSchema, schemaSpec, schemaScope);

      const finalizeContext: ContextFinalize = {
        scope: {},
        type: "Finalize",
      };
      this._generatedSchema = schema
        ? this.applyHooks(
            build,
            "finalize",
            schema,
            finalizeContext,
            "Finalising GraphQL schema"
          )
        : schema;
    }
    if (!this._generatedSchema) {
      throw new Error("Schema generation failed");
    }
    return this._generatedSchema;
  }

  async watchSchema(listener?: SchemaListener): Promise<void> {
    if (this._busy) {
      throw new Error("An operation is in progress");
    }
    if (this._watching) {
      throw new Error(
        "We're already watching this schema! Use `builder.on('schema', callback)` instead."
      );
    }
    try {
      this._busy = true;
      this._explicitSchemaListener = listener;

      // We want to ignore `triggerChange` calls that occur whilst we're setting
      // up the listeners to prevent an unnecessary double schema build.
      let ignoreChangeTriggers = true;

      this.triggerChange = () => {
        if (ignoreChangeTriggers) {
          return;
        }
        this._generatedSchema = null;
        // XXX: optionally debounce
        try {
          const schema = this.buildSchema();
          this.emit("schema", schema);
        } catch (e) {
          // Build errors introduced while watching are ignored because it's
          // primarily used in development.
          // eslint-disable-next-line no-console
          console.error(
            "⚠️⚠️⚠️ An error occured when building the schema on watch:"
          );

          // eslint-disable-next-line no-console
          console.error(e);
        }
      };
      for (const fn of this.watchers) {
        await fn(this.triggerChange);
      }

      // Now we're about to build the first schema, any further `triggerChange`
      // calls should be honoured.
      ignoreChangeTriggers = false;

      if (listener) {
        this.on("schema", listener);
      }
      this.emit("schema", this.buildSchema());

      this._watching = true;
    } finally {
      this._busy = false;
    }
  }

  async unwatchSchema(): Promise<void> {
    if (this._busy) {
      throw new Error("An operation is in progress");
    }
    if (!this._watching) {
      throw new Error("We're not watching this schema!");
    }
    this._busy = true;
    try {
      const listener = this._explicitSchemaListener;
      this._explicitSchemaListener = null;
      if (listener) {
        this.removeListener("schema", listener);
      }
      if (this.triggerChange) {
        for (const fn of this.unwatchers) {
          await fn(this.triggerChange);
        }
      }
      this.triggerChange = null;
      this._watching = false;
    } finally {
      this._busy = false;
    }
  }
}

export default SchemaBuilder;
