// @flow
import debugFactory from "debug";
import makeNewBuild from "./makeNewBuild";
import { bindAll } from "./utils";
import * as graphql from "graphql";
import type {
  GraphQLType,
  GraphQLNamedType,
  GraphQLInterfaceType,
  GraphQLObjectTypeConfig,
} from "graphql";
import EventEmitter from "events";
// TODO: when we move to TypeScript, change this to:
// import { EventEmitter } from "events";
import type {
  simplifyParsedResolveInfoFragmentWithType,
  parseResolveInfo,
} from "graphql-parse-resolve-info";
import type { GraphQLResolveInfo } from "graphql/type/definition";
import type resolveNode from "./resolveNode";

import type { FieldWithHooksFunction } from "./makeNewBuild";
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
  graphileBuildVersion: string,
  graphql: *,
  parseResolveInfo: parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType: simplifyParsedResolveInfoFragmentWithType,
  // DEPRECATED: getAliasFromResolveInfo: (resolveInfo: GraphQLResolveInfo) => string,
  getSafeAliasFromResolveInfo: (resolveInfo: GraphQLResolveInfo) => string,
  getSafeAliasFromAlias: (alias: string) => string,
  resolveAlias(
    data: {},
    _args: mixed,
    _context: mixed,
    resolveInfo: GraphQLResolveInfo
  ): string,
  addType(type: GraphQLNamedType, origin?: ?string): void,
  getTypeByName(typeName: string): ?GraphQLType,
  extend<Obj1: *, Obj2: *>(base: Obj1, extra: Obj2, hint?: string): Obj1 & Obj2,
  newWithHooks<T: GraphQLNamedType | GraphQLSchema, ConfigType: *>(
    Class<T>,
    spec: ConfigType,
    scope: Scope,
    performNonEmptyFieldsCheck?: boolean
  ): ?T,
  fieldDataGeneratorsByType: Map<*, *>, // @deprecated - use fieldDataGeneratorsByFieldNameByType instead
  fieldDataGeneratorsByFieldNameByType: Map<*, *>,
  fieldArgDataGeneratorsByFieldNameByType: Map<*, *>,
  inflection: {
    // eslint-disable-next-line flowtype/no-weak-types
    [string]: (...args: Array<any>) => string,
  },
  wrapDescription: (
    description: string,
    position: "root" | "type" | "field" | "arg"
  ) => string,
  swallowError: (e: Error) => void,
  // resolveNode: EXPERIMENTAL, API might change!
  resolveNode: resolveNode,
  status: {
    currentHookName: ?string,
    currentHookEvent: ?string,
  },
  scopeByType: Map<GraphQLType, Scope>,
|};

export type BuildExtensionQuery = {|
  $$isQuery: Symbol,
|};

export type Scope = {
  __origin: ?string,
  [string]: mixed,
};

export type Context = {|
  scope: Scope,
  type: string,
  [string]: mixed,
|};

type DataGeneratorFunction = () => {};

export type ContextGraphQLObjectTypeFields = {|
  addDataGeneratorForField: (
    fieldName: string,
    fn: DataGeneratorFunction
  ) => void,
  recurseDataGeneratorsForField: (fieldName: string) => void, // @deprecated - DO NOT USE!
  Self: GraphQLNamedType,
  GraphQLObjectType: GraphQLObjectTypeConfig<*, *>,
  fieldWithHooks: FieldWithHooksFunction,
|};

type SupportedHookTypes = {} | Build | Array<GraphQLInterfaceType>;

export type Hook<
  Type: SupportedHookTypes,
  BuildExtensions: *,
  ContextExtensions: *
> = {
  (
    input: Type,
    build: { ...Build, ...BuildExtensions },
    context: { ...Context, ...ContextExtensions }
  ): Type,
  displayName?: string,
  provides?: Array<string>,
  before?: Array<string>,
  after?: Array<string>,
};

export type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

export type SchemaListener = (newSchema: GraphQLSchema) => void;

class SchemaBuilder extends EventEmitter {
  options: Options;
  watchers: Array<WatchUnwatch>;
  unwatchers: Array<WatchUnwatch>;
  triggerChange: ?TriggerChangeType;
  depth: number;
  hooks: {
    [string]: Array<Hook<*, *, *>>,
  };

  _currentPluginName: ?string;
  _generatedSchema: ?GraphQLSchema;
  _explicitSchemaListener: ?SchemaListener;
  _busy: boolean;
  _watching: boolean;

  constructor(options: Options) {
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

      // When creating a GraphQLInterfaceType via `newWithHooks`, we'll
      // execute, the following hooks:
      // - 'GraphQLInterfaceType' to add any root-level attributes, e.g. add a description
      // - 'GraphQLInterfaceType:fields' to add additional fields to this interface type (is
      //   ran asynchronously and gets a reference to the final GraphQL Interface as
      //   `Self` in the context)
      // - 'GraphQLInterfaceType:fields:field' to customise an individual field from above
      // - 'GraphQLInterfaceType:fields:field:args' to customize the arguments to a field
      GraphQLInterfaceType: [],
      "GraphQLInterfaceType:fields": [],
      "GraphQLInterfaceType:fields:field": [],
      "GraphQLInterfaceType:fields:field:args": [],
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
  hook<T: *>(
    hookName: string,
    fn: Hook<T, *, *>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>
  ) {
    if (!this.hooks[hookName]) {
      throw new Error(`Sorry, '${hookName}' is not a supported hook`);
    }
    if (this._currentPluginName) {
      fn.displayName = `${this._currentPluginName}/${hookName}/${
        (provides && provides.length && provides.join("+")) ||
        fn.displayName ||
        fn.name ||
        "unnamed"
      }`;
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
      const describe = (hook, index) => {
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

  applyHooks<T: *, Context>(
    build: { ...Build },
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

      const hooks: Array<Hook<T, *, *>> = this.hooks[hookName];
      if (!hooks) {
        throw new Error(`Sorry, '${hookName}' is not a registered hook`);
      }

      let newObj = input;
      for (const hook: Hook<T, *, *> of hooks) {
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
              `Hook '${
                hook.displayName || hook.name || "anonymous"
              }' for '${hookName}' returned falsy value '${newObj}'`
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

  createBuild(): { ...Build } {
    const initialBuild = makeNewBuild(this);
    // Inflection needs to come first, in case 'build' hooks depend on it
    initialBuild.inflection = this.applyHooks(
      initialBuild,
      "inflection",
      initialBuild.inflection,
      {
        scope: {},
      }
    );
    const build = this.applyHooks(initialBuild, "build", initialBuild, {
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
      const schema = build.newWithHooks(
        GraphQLSchema,
        {
          directives: [...build.graphql.specifiedDirectives],
        },
        {
          __origin: `GraphQL built-in`,
          isSchema: true,
        }
      );
      const hookedSchema = this.applyHooks(
        build,
        "finalize",
        schema,
        {},
        "Finalising GraphQL schema"
      );
      const errors = build.graphql.validateSchema(hookedSchema);
      if (errors && errors.length) {
        throw new Error(
          "GraphQL schema is invalid:\n" +
            errors.map(e => `- ` + e.message.replace(/\n/g, "\n  ")).join("\n")
        );
      }
      this._generatedSchema = hookedSchema;
    }
    if (!this._generatedSchema) {
      throw new Error("Schema generation failed");
    }
    return this._generatedSchema;
  }

  async watchSchema(listener?: SchemaListener) {
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
      try {
        this._watching = true;
        for (const fn of this.watchers) {
          await fn(this.triggerChange);
        }

        // Now we're about to build the first schema, any further
        // `triggerChange` calls should be honoured.
        ignoreChangeTriggers = false;

        if (listener) {
          this.on("schema", listener);
        }
        this.emit("schema", this.buildSchema());
      } catch (e) {
        try {
          this._busy = false;
          // Abort abort!
          await this.unwatchSchema();
        } catch (e2) {
          console.error(
            `Error when unwatching schema after error during schema build: ${e}`
          );
        }
        throw e;
      }
    } finally {
      this._busy = false;
    }
  }

  async unwatchSchema() {
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
