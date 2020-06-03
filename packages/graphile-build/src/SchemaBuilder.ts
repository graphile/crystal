import debugFactory from "debug";
import makeNewBuild, { InflectionBase } from "./makeNewBuild";
import { bindAll } from "./utils";
import {
  /* ONLY IMPORT TYPES HERE! */
  GraphQLObjectTypeConfig,
  GraphQLSchema,
  GraphQLSchemaConfig,
  GraphQLObjectType,
  GraphQLInputObjectTypeConfig,
  GraphQLScalarTypeConfig,
  GraphQLInterfaceTypeConfig,
  GraphQLUnionTypeConfig,
  GraphQLEnumTypeConfig,
  GraphQLFieldConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLInputFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLEnumValueConfigMap,
  GraphQLEnumValueConfig,
} from "graphql";
import { EventEmitter } from "events";

const debug = debugFactory("graphile-builder");

const INDENT = "  ";

class SchemaBuilder extends EventEmitter {
  options: GraphileEngine.GraphileBuildOptions;
  watchers: Array<GraphileEngine.WatchUnwatch>;
  unwatchers: Array<GraphileEngine.WatchUnwatch>;
  triggerChange: GraphileEngine.TriggerChangeType | null | undefined;
  depth: number;
  hooks: {
    [a: string]: Array<GraphileEngine.Hook<any, any>>;
  };

  _currentPluginName: string | null | undefined;
  _generatedSchema: GraphQLSchema | null | undefined;
  _explicitSchemaListener: GraphileEngine.SchemaListener | null | undefined;
  _busy: boolean;
  _watching: boolean;

  constructor(options: GraphileEngine.GraphileBuildOptions) {
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
      // hook-able so that other plugins may extend it or override it
      inflection: [],

      // 'build' phase should not generate any GraphQL objects (because the
      // build object isn't finalized yet so it risks weirdness occurring); so
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
      // - 'GraphQLObjectType:fields:field' to customize an individual field from above
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
      // - 'GraphQLInputObjectType:fields:field' to customize an individual field from above
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
    fn: GraphileEngine.Hook<
      Partial<GraphileEngine.Build> & GraphileEngine.BuildBase,
      GraphileEngine.ContextBuild,
      GraphileEngine.BuildBase
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "inflection",
    fn: GraphileEngine.Hook<
      Partial<GraphileEngine.Inflection> & InflectionBase,
      GraphileEngine.ContextInflection,
      GraphileEngine.BuildBase
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "init",
    fn: GraphileEngine.Hook<
      GraphileEngine.InitObject,
      GraphileEngine.ContextInit
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLSchema",
    fn: GraphileEngine.Hook<
      GraphQLSchemaConfig,
      GraphileEngine.ContextGraphQLSchema
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLObjectType",
    fn: GraphileEngine.Hook<
      GraphQLObjectTypeConfig<TSource, TContext>,
      GraphileEngine.ContextGraphQLObjectType
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLObjectType:interfaces",
    fn: GraphileEngine.Hook<
      Array<GraphQLInterfaceTypeConfig<any, any>>,
      GraphileEngine.ContextGraphQLObjectTypeInterfaces
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLObjectType:fields",
    fn: GraphileEngine.Hook<
      GraphQLFieldConfigMap<TSource, TContext>,
      GraphileEngine.ContextGraphQLObjectTypeFields
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLObjectType:fields:field",
    fn: GraphileEngine.Hook<
      GraphQLFieldConfig<TSource, TContext>,
      GraphileEngine.ContextGraphQLObjectTypeFieldsField
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLObjectType:fields:field:args",
    fn: GraphileEngine.Hook<
      GraphQLFieldConfigArgumentMap,
      GraphileEngine.ContextGraphQLObjectTypeFieldsFieldArgs
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLInputObjectType",
    fn: GraphileEngine.Hook<
      GraphileEngine.GraphileInputObjectTypeConfig,
      GraphileEngine.ContextGraphQLInputObjectType
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLInputObjectType:fields",
    fn: GraphileEngine.Hook<
      GraphQLInputFieldConfigMap,
      GraphileEngine.ContextGraphQLInputObjectTypeFields
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLInputObjectType:fields:field",
    fn: GraphileEngine.Hook<
      GraphQLInputFieldConfig,
      GraphileEngine.ContextGraphQLInputObjectTypeFieldsField
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLEnumType",
    fn: GraphileEngine.Hook<
      GraphQLEnumTypeConfig,
      GraphileEngine.ContextGraphQLEnumType
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLEnumType:values",
    fn: GraphileEngine.Hook<
      GraphQLEnumValueConfigMap,
      GraphileEngine.ContextGraphQLEnumTypeValues
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLEnumType:values:value",
    fn: GraphileEngine.Hook<
      GraphQLEnumValueConfig,
      GraphileEngine.ContextGraphQLEnumTypeValuesValue
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLUnionType",
    fn: GraphileEngine.Hook<
      GraphQLUnionTypeConfig<TSource, TContext>,
      GraphileEngine.ContextGraphQLUnionType
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "GraphQLUnionType:types",
    fn: GraphileEngine.Hook<
      Array<GraphileEngine.GraphileObjectTypeConfig<any, any>>,
      GraphileEngine.ContextGraphQLUnionTypeTypes
    >,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook(
    hookName: "finalize",
    fn: GraphileEngine.Hook<GraphQLSchema, GraphileEngine.ContextFinalize>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void;
  hook<TType, TContext extends GraphileEngine.Context>(
    hookName: string,
    fn: GraphileEngine.Hook<TType, TContext>,
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void {
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
      let minReason: GraphileEngine.Hook<any, any> | null = null;
      let maxIndex = relevantHooks.length;
      let maxReason: GraphileEngine.Hook<any, any> | null = null;
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
              fn,
            )} cannot be before ${describe(
              maxReason,
              maxIndex,
            )} and after ${describe(
              minReason,
              minIndex,
            )} - please report this issue`,
          );
        }
      };
      const setMin = (
        newMin: number,
        reason: GraphileEngine.Hook<any, any>,
      ) => {
        if (newMin > minIndex) {
          minIndex = newMin;
          minReason = reason;
          check();
        }
      };
      const setMax = (
        newMax: number,
        reason: GraphileEngine.Hook<any, any>,
      ) => {
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
          if (oldBefore && oldBefore.some((dep) => newProvides.includes(dep))) {
            // Old says it has to come before new
            setMin(idx + 1, oldHook);
          }
          if (oldAfter && oldAfter.some((dep) => newProvides.includes(dep))) {
            // Old says it has to be after new
            setMax(idx, oldHook);
          }
        }
        if (oldProvides) {
          if (newBefore && newBefore.some((dep) => oldProvides.includes(dep))) {
            // New says it has to come before old
            setMax(idx, oldHook);
          }
          if (newAfter && newAfter.some((dep) => oldProvides.includes(dep))) {
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
    build: GraphileEngine.BuildBase,
    hookName: "build",
    input: Partial<GraphileEngine.Build> & GraphileEngine.BuildBase,
    context: GraphileEngine.ContextBuild,
    debugStr?: string,
  ): GraphileEngine.Build;
  applyHooks(
    build: GraphileEngine.BuildBase,
    hookName: "inflection",
    input: Partial<GraphileEngine.Inflection> & InflectionBase,
    context: GraphileEngine.ContextInflection,
    debugStr?: string,
  ): GraphileEngine.Inflection;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "init",
    input: GraphileEngine.InitObject,
    context: GraphileEngine.ContextInit,
    debugStr?: string,
  ): GraphileEngine.InitObject;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLSchema",
    input: GraphQLSchemaConfig,
    context: GraphileEngine.ContextGraphQLSchema,
    debugStr?: string,
  ): GraphQLSchemaConfig;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLScalarType",
    input: GraphQLScalarTypeConfig<any, any>,
    context: GraphileEngine.ContextGraphQLScalarType,
    debugStr?: string,
  ): GraphQLScalarTypeConfig<any, any>;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLObjectType",
    input: GraphileEngine.GraphileObjectTypeConfig<any, any>,
    context: GraphileEngine.ContextGraphQLObjectType,
    debugStr?: string,
  ): GraphQLObjectTypeConfig<any, any>;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLObjectType:interfaces",
    input: Array<GraphQLInterfaceTypeConfig<any, any>>,
    context: GraphileEngine.ContextGraphQLObjectTypeInterfaces,
    debugStr?: string,
  ): Array<GraphQLInterfaceTypeConfig<any, any>>;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLObjectType:fields",
    input: GraphQLFieldConfigMap<any, any>,
    context: GraphileEngine.ContextGraphQLObjectTypeFields,
    debugStr?: string,
  ): GraphQLFieldConfigMap<any, any>;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLObjectType:fields:field",
    input: GraphQLFieldConfig<any, any, any>,
    context: GraphileEngine.ContextGraphQLObjectTypeFieldsField,
    debugStr?: string,
  ): GraphQLFieldConfig<any, any, any>;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLObjectType:fields:field:args",
    input: GraphQLFieldConfigArgumentMap,
    context: GraphileEngine.ContextGraphQLObjectTypeFieldsFieldArgs,
    debugStr?: string,
  ): GraphQLFieldConfigArgumentMap;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLInterfaceType",
    input: GraphQLInterfaceTypeConfig<any, any>,
    context: GraphileEngine.ContextGraphQLInterfaceType,
    debugStr?: string,
  ): GraphQLInterfaceTypeConfig<any, any>;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLUnionType",
    input: GraphileEngine.GraphileUnionTypeConfig<any, any>,
    context: GraphileEngine.ContextGraphQLUnionType,
    debugStr?: string,
  ): GraphileEngine.GraphileUnionTypeConfig<any, any>;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLUnionType:types",
    input: Array<GraphQLObjectType<any, any>>,
    context: GraphileEngine.ContextGraphQLUnionTypeTypes,
    debugStr?: string,
  ): Array<GraphQLObjectType<any, any>>;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLEnumType",
    input: GraphQLEnumTypeConfig,
    context: GraphileEngine.ContextGraphQLEnumType,
    debugStr?: string,
  ): GraphQLEnumTypeConfig;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLEnumType:values",
    input: GraphQLEnumValueConfigMap,
    context: GraphileEngine.ContextGraphQLEnumTypeValues,
    debugStr?: string,
  ): GraphQLEnumValueConfigMap;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLEnumType:values:value",
    input: GraphQLEnumValueConfig,
    context: GraphileEngine.ContextGraphQLEnumTypeValuesValue,
    debugStr?: string,
  ): GraphQLEnumValueConfig;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLInputObjectType",
    input: GraphileEngine.GraphileInputObjectTypeConfig,
    context: GraphileEngine.ContextGraphQLInputObjectType,
    debugStr?: string,
  ): GraphQLInputObjectTypeConfig;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLInputObjectType:fields",
    input: GraphQLInputFieldConfigMap,
    context: GraphileEngine.ContextGraphQLInputObjectTypeFields,
    debugStr?: string,
  ): GraphQLInputFieldConfigMap;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "GraphQLInputObjectType:fields:field",
    input: GraphQLInputFieldConfig,
    context: GraphileEngine.ContextGraphQLInputObjectTypeFieldsField,
    debugStr?: string,
  ): GraphQLInputFieldConfig;
  applyHooks(
    build: GraphileEngine.Build,
    hookName: "finalize",
    input: GraphQLSchema,
    context: GraphileEngine.ContextFinalize,
    debugStr?: string,
  ): GraphQLSchema;
  applyHooks<TConfig extends any, TContext extends GraphileEngine.Context>(
    build: GraphileEngine.Build,
    hookName: string,
    input: TConfig,
    context: TContext,
    debugStr = "",
  ): TConfig {
    if (!input) {
      throw new Error("applyHooks was called with falsy input");
    }
    this.depth++;
    try {
      debug(`${INDENT.repeat(this.depth)}[${hookName}${debugStr}]: Running...`);

      const hooks: Array<GraphileEngine.Hook<TConfig, TContext>> = this.hooks[
        hookName
      ];
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
              this.depth,
            )}[${hookName}${debugStr}]:   Executing '${hookDisplayName}'`,
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
                `Build hook '${hookDisplayName}' returned a new object; please use 'return build.extend(build, {...})' instead.`,
              );

              // Copy everything from newObj back to oldObj
              Object.assign(oldObj, newObj);
              // Go back to the old object
              newObj = oldObj;
            }
          }
          build.status.currentHookName = previousHookName;
          build.status.currentHookEvent = previousHookEvent;

          if (!newObj) {
            throw new Error(
              `GraphileEngine.Hook '${
                hook.displayName || hook.name || "anonymous"
              }' for '${hookName}' returned falsy value '${newObj}'`,
            );
          }
          debug(
            `${INDENT.repeat(
              this.depth,
            )}[${hookName}${debugStr}]:   '${hookDisplayName}' complete`,
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

  registerWatcher(
    listen: GraphileEngine.WatchUnwatch,
    unlisten: GraphileEngine.WatchUnwatch,
  ): void {
    if (!listen || !unlisten) {
      throw new Error("You must provide both a listener and an unlistener");
    }
    this.watchers.push(listen);
    this.unwatchers.push(unlisten);
  }

  createBuild(): GraphileEngine.Build {
    const initialBuild = makeNewBuild(this);
    // Inflection needs to come first, in case 'build' hooks depend on it
    const scopeContext: GraphileEngine.ContextInflection = {
      scope: {},
      type: "Inflection",
    };
    initialBuild.inflection = this.applyHooks(
      initialBuild,
      "inflection",
      initialBuild.inflection,
      scopeContext,
    );

    const build = this.applyHooks(initialBuild, "build", initialBuild, {
      scope: {},
      type: "Build",
    });

    // Bind all functions so they can be dereferenced
    bindAll(
      build,
      Object.keys(build).filter((key) => typeof build[key] === "function"),
    );

    Object.freeze(build);
    const initContext: GraphileEngine.ContextInit = { scope: {}, type: "Init" };
    const initObject: GraphileEngine.InitObject = {} as never;
    this.applyHooks(build, "init", initObject, initContext);
    return build;
  }

  buildSchema(): GraphQLSchema {
    if (!this._generatedSchema) {
      const build = this.createBuild();
      const schemaSpec: Partial<GraphQLSchemaConfig> = {
        directives: [...build.graphql.specifiedDirectives],
      };
      const schemaScope: GraphileEngine.ScopeGraphQLSchema = {
        __origin: `GraphQL built-in`,
        isSchema: true,
      };
      const schema = build.newWithHooks(GraphQLSchema, schemaSpec, schemaScope);

      const finalizeContext: GraphileEngine.ContextFinalize = {
        scope: {},
        type: "Finalize",
      };
      this._generatedSchema = schema
        ? this.applyHooks(
            build,
            "finalize",
            schema,
            finalizeContext,
            "Finalizing GraphQL schema",
          )
        : schema;
    }
    if (!this._generatedSchema) {
      throw new Error("Schema generation failed");
    }
    return this._generatedSchema;
  }

  async watchSchema(listener?: GraphileEngine.SchemaListener): Promise<void> {
    if (this._busy) {
      throw new Error("An operation is in progress");
    }
    if (this._watching) {
      throw new Error(
        "We're already watching this schema! Use `builder.on('schema', callback)` instead.",
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
            "⚠️⚠️⚠️ An error occurred when building the schema on watch:",
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
