// @flow
import debugFactory from "debug";
import makeNewBuild from "./makeNewBuild";
import { bindAll } from "./utils";
import * as graphql from "graphql";
import type {
  GraphQLType,
  GraphQLNamedType,
  GraphQLInterfaceType,
} from "graphql";
import EventEmitter from "events";
import type {
  simplifyParsedResolveInfoFragmentWithType,
  getAliasFromResolveInfo,
  ResolveTree,
  parseResolveInfo,
} from "graphql-parse-resolve-info";
import type { GraphQLResolveInfo } from "graphql/type/definition";

const { GraphQLSchema } = graphql;

const debug = debugFactory("graphile-builder");

const INDENT = "  ";

export type Options = {
  [string]: mixed,
};

export type Plugin = (
  builder: SchemaBuilder,
  options: Options
) => Promise<void> | void;

type TriggerChangeType = () => void;

export type DataForType = {
  [string]: Array<mixed>,
};

export type Build = {|
  graphql: {
    GraphQLSchema: typeof graphql.GraphQLSchema,
    GraphQLScalarType: typeof graphql.GraphQLScalarType,
    GraphQLObjectType: typeof graphql.GraphQLObjectType,
    GraphQLInterfaceType: typeof graphql.GraphQLInterfaceType,
    GraphQLUnionType: typeof graphql.GraphQLUnionType,
    GraphQLEnumType: typeof graphql.GraphQLEnumType,
    GraphQLInputObjectType: typeof graphql.GraphQLInputObjectType,
    GraphQLList: typeof graphql.GraphQLList,
    GraphQLNonNull: typeof graphql.GraphQLNonNull,
    GraphQLDirective: typeof graphql.GraphQLDirective,
    TypeKind: typeof graphql.TypeKind,
    DirectiveLocation: typeof graphql.DirectiveLocation,
    GraphQLInt: typeof graphql.GraphQLInt,
    GraphQLFloat: typeof graphql.GraphQLFloat,
    GraphQLString: typeof graphql.GraphQLString,
    GraphQLBoolean: typeof graphql.GraphQLBoolean,
    GraphQLID: typeof graphql.GraphQLID,
    specifiedDirectives: typeof graphql.specifiedDirectives,
    GraphQLIncludeDirective: typeof graphql.GraphQLIncludeDirective,
    GraphQLSkipDirective: typeof graphql.GraphQLSkipDirective,
    GraphQLDeprecatedDirective: typeof graphql.GraphQLDeprecatedDirective,
    DEFAULT_DEPRECATION_REASON: typeof graphql.DEFAULT_DEPRECATION_REASON,
    SchemaMetaFieldDef: typeof graphql.SchemaMetaFieldDef,
    TypeMetaFieldDef: typeof graphql.TypeMetaFieldDef,
    TypeNameMetaFieldDef: typeof graphql.TypeNameMetaFieldDef,
    __Schema: typeof graphql.__Schema,
    __Directive: typeof graphql.__Directive,
    __DirectiveLocation: typeof graphql.__DirectiveLocation,
    __Type: typeof graphql.__Type,
    __Field: typeof graphql.__Field,
    __InputValue: typeof graphql.__InputValue,
    __EnumValue: typeof graphql.__EnumValue,
    __TypeKind: typeof graphql.__TypeKind,
    isType: (type: mixed) => boolean,
    isInputType: (type: GraphQLType) => boolean,
    isOutputType: (type: GraphQLType) => boolean,
    isLeafType: (type: GraphQLType) => boolean,
    isCompositeType: (type: GraphQLType) => boolean,
    isAbstractType: (type: GraphQLType) => boolean,
    isNamedType: (type: GraphQLType) => boolean,
    assertType: typeof graphql.assertType,
    assertInputType: typeof graphql.assertInputType,
    assertOutputType: typeof graphql.assertOutputType,
    assertLeafType: typeof graphql.assertLeafType,
    assertCompositeType: typeof graphql.assertCompositeType,
    assertAbstractType: typeof graphql.assertAbstractType,
    assertNamedType: typeof graphql.assertNamedType,
    //getNullableType<T: GraphQLType>(type: ?T): ?(T & GraphQLNullableType),
    getNullableType<T: GraphQLType>(type: ?T): mixed,
    getNamedType: (type: GraphQLType) => GraphQLNamedType,
  },
  parseResolveInfo: parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType: simplifyParsedResolveInfoFragmentWithType,
  getAliasFromResolveInfo: getAliasFromResolveInfo,
  generateDataForType(
    Type: GraphQLType,
    parsedResolveInfoFragment: ResolveTree
  ): DataForType,
  resolveAlias(
    data: {},
    _args: mixed,
    _context: mixed,
    resolveInfo: GraphQLResolveInfo
  ): string,
  addType(type: GraphQLNamedType): void,
  getTypeByName(typeName: string): ?GraphQLType,
  extend<Obj1: *, Obj2: *>(base: Obj1, extra: Obj2): Obj1 & Obj2,
  newWithHooks<T: GraphQLNamedType | GraphQLSchema>(
    Class<T>,
    spec: {},
    scope: {},
    returnNullOnInvalid?: boolean
  ): ?T,
|};

export type BuildExtensionQuery = {|
  $$isQuery: Symbol,
|};

export type Scope = {
  [string]: mixed,
};

export type Context = {
  scope: Scope,
};

type SupportedHookTypes = {} | Build | Array<GraphQLInterfaceType>;

export type Hook<Type: SupportedHookTypes, BuildExtensions: {}> = (
  input: Type,
  build: {| ...Build, ...BuildExtensions |},
  context: Context
) => Type;

export type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

export type SchemaListener = (newSchema: GraphQLSchema) => void;

class SchemaBuilder extends EventEmitter {
  watchers: Array<WatchUnwatch>;
  unwatchers: Array<WatchUnwatch>;
  triggerChange: ?TriggerChangeType;
  depth: number;
  hooks: {
    [string]: Array<Hook<*, *>>,
  };

  _currentPluginName: ?string;
  _generatedSchema: ?GraphQLSchema;
  _explicitSchemaListener: ?SchemaListener;
  _busy: boolean;
  _watching: boolean;

  constructor() {
    super();

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

      // 'build' phase should not generate any GraphQL objects (because the
      // build object isn't finalised yet so it risks weirdness occurring); so
      // if you need to set up any global types you can do so here.
      init: [],

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
    };
  }

  _setPluginName(name: ?string) {
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
  hook<T: *>(hookName: string, fn: Hook<T, *>) {
    if (!this.hooks[hookName]) {
      throw new Error(`Sorry, '${hookName}' is not a supported hook`);
    }
    if (this._currentPluginName && !fn.displayName) {
      fn.displayName = `${this
        ._currentPluginName}/${hookName}/${fn.displayName ||
        fn.name ||
        "anonymous"}`;
    }
    this.hooks[hookName].push(fn);
  }

  applyHooks<T: *>(
    build: Build,
    hookName: string,
    input: T,
    context: Context,
    debugStr: string = ""
  ): T {
    if (!input) {
      throw new Error("applyHooks was called with falsy input");
    }
    this.depth++;
    try {
      debug(`${INDENT.repeat(this.depth)}[${hookName}${debugStr}]: Running...`);

      const hooks: Array<Hook<T, *>> = this.hooks[hookName];
      if (!hooks) {
        throw new Error(`Sorry, '${hookName}' is not a registered hook`);
      }

      let newObj = input;
      for (const hook: Hook<T, *> of hooks) {
        this.depth++;
        try {
          const hookDisplayName = hook.displayName || hook.name || "anonymous";
          debug(
            `${INDENT.repeat(
              this.depth
            )}[${hookName}${debugStr}]:   Executing '${hookDisplayName}'`
          );
          newObj = hook(newObj, build, context);
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

  registerWatcher(listen: WatchUnwatch, unlisten: WatchUnwatch) {
    if (!listen || !unlisten) {
      throw new Error("You must provide both a listener and an unlistener");
    }
    this.watchers.push(listen);
    this.unwatchers.push(unlisten);
  }

  createBuild(): Build {
    const initialBuild: Build = makeNewBuild(this);
    const build: Build = this.applyHooks(initialBuild, "build", initialBuild, {
      scope: {},
    });
    // Bind all functions so they can be dereferenced
    bindAll(
      build,
      Object.keys(build).filter(key => typeof build[key] === "function")
    );
    Object.freeze(build);
    this.applyHooks(build, "init", {}, { scope: {} });
    return build;
  }

  buildSchema(): GraphQLSchema {
    if (!this._generatedSchema) {
      const build = this.createBuild();
      this._generatedSchema = build.newWithHooks(
        GraphQLSchema,
        {},
        { isSchema: true }
      );
    }
    if (!this._generatedSchema) {
      throw new Error("Schema generation failed");
    }
    return this._generatedSchema;
  }

  async watchSchema(listener: SchemaListener) {
    if (this._watching || this._busy) {
      throw new Error("We're already watching this schema!");
    }
    try {
      this._busy = true;
      this._watching = true;
      this._explicitSchemaListener = listener;
      this.triggerChange = () => {
        this._generatedSchema = null;
        // XXX: optionally debounce
        this.emit("schema", this.buildSchema());
      };
      if (listener) {
        this.on("schema", listener);
      }
      for (const fn of this.watchers) {
        await fn(this.triggerChange);
      }
      this.emit("schema", this.buildSchema());
    } finally {
      this._busy = false;
    }
  }

  async unwatchSchema() {
    if (!this._watching || this._busy) {
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
