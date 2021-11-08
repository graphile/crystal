import "./global";

import debugFactory from "debug";
import { EventEmitter } from "events";
import type { GraphQLSchemaConfig } from "graphql";
import { GraphQLSchema } from "graphql";

import makeNewBuild from "./makeNewBuild";
import type { NewWithHooksFunction } from "./newWithHooks";
import { makeNewWithHooks } from "./newWithHooks";
import { makeSchemaBuilderHooks } from "./SchemaBuilderHooks";
import { bindAll } from "./utils";

const debug = debugFactory("graphile-builder");

const INIT_OBJECT: GraphileEngine.InitObject = Object.freeze(
  Object.create(null),
);

const INDENT = "  ";

class SchemaBuilder<
  TBuild extends GraphileEngine.Build = GraphileEngine.Build,
> extends EventEmitter {
  options: GraphileEngine.GraphileBuildOptions;
  watchers: Array<GraphileEngine.WatchUnwatch>;
  unwatchers: Array<GraphileEngine.WatchUnwatch>;
  triggerChange: GraphileEngine.TriggerChangeType | null | undefined;
  depth: number;
  hooks: GraphileEngine.SchemaBuilderHooks<TBuild>;

  _currentPluginName: string | null | undefined;
  _generatedSchema: GraphQLSchema | null | undefined;
  _explicitSchemaListener: GraphileEngine.SchemaListener | null | undefined;
  _busy: boolean;
  _watching: boolean;

  newWithHooks: NewWithHooksFunction;

  constructor(options: GraphileEngine.GraphileBuildOptions) {
    super();

    if (!options) {
      throw new Error("Please pass options to SchemaBuilder");
    }
    this.options = options;

    this._busy = false;
    this._watching = false;

    this.watchers = [];
    this.unwatchers = [];

    // Because hooks can nest, this keeps track of how deep we are.
    this.depth = -1;

    this.hooks = makeSchemaBuilderHooks();

    this.newWithHooks = makeNewWithHooks({ builder: this }).newWithHooks;
  }

  _setPluginName(name: string | null | undefined) {
    this._currentPluginName = name;
  }

  /**
   * Every hook `fn` takes three arguments:
   *
   * - obj - the object currently being inspected
   * - build - the current build object (which contains a number of utilities
   *   and the context of the build)
   * - context - information specific to the current invocation of the hook
   *
   * The function must return a replacement object for `obj` or `obj` itself.
   * Generally we advice that you return the object itself, modifying it as
   * necessary. Modifying the object is significantly faster than returning a
   * clone.
   */
  hook<THookName extends keyof GraphileEngine.SchemaBuilderHooks<TBuild>>(
    hookName: THookName,
    fn: GraphileEngine.SchemaBuilderHooks[THookName][number],
    provides?: Array<string>,
    before?: Array<string>,
    after?: Array<string>,
  ): void {
    if (!this.hooks[hookName]) {
      // TODO: fuzzy-find a similar hook
      throw new Error(`Sorry, '${hookName}' is not a supported hook`);
    }
    if (this._currentPluginName) {
      fn.displayName = `${this._currentPluginName}/${hookName}/${
        (provides && provides.length > 0 && provides.join("+")) ||
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
      this.hooks[hookName].push(fn as any);
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
        reason: GraphileEngine.Hook<any, any, any>,
      ) => {
        if (newMin > minIndex) {
          minIndex = newMin;
          minReason = reason;
          check();
        }
      };
      const setMax = (
        newMax: number,
        reason: GraphileEngine.Hook<any, any, any>,
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
      this.hooks[hookName].splice(maxIndex, 0, fn as any);
    }
  }

  applyHooks<THookName extends keyof GraphileEngine.SchemaBuilderHooks<TBuild>>(
    hookName: THookName,
    input: Parameters<
      GraphileEngine.SchemaBuilderHooks<TBuild>[THookName][number]
    >[0],
    build: Parameters<
      GraphileEngine.SchemaBuilderHooks<TBuild>[THookName][number]
    >[1],
    context: Parameters<
      GraphileEngine.SchemaBuilderHooks<TBuild>[THookName][number]
    >[2],
    debugStr?: string,
  ): Parameters<
    GraphileEngine.SchemaBuilderHooks<TBuild>[THookName][number]
  >[0] {
    if (!input) {
      throw new Error("applyHooks was called with falsy input");
    }
    this.depth++;
    try {
      debug(`${INDENT.repeat(this.depth)}[${hookName}${debugStr}]: Running...`);

      const hooks = this.hooks[hookName];
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
          newObj = hook(newObj as any, build as any, context as any);
          if (hookName === "build") {
            /*
             * Unlike all the other hooks, the `build` hook must always use the
             * same `build` object - never returning a new object for fear of
             * causing issues to other build hooks that reference the old
             * object and don't get the new additions.
             */
            if (newObj !== oldObj) {
              throw new Error(
                `Build hook '${hookDisplayName}' returned a new object; 'build' hooks must always return the same Build object - please use 'return build.extend(build, {...})' instead.`,
              );
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

  createBuild(): TBuild {
    const initialBuild = makeNewBuild(this) as Partial<TBuild> &
      GraphileEngine.BuildBase;
    // Inflection needs to come first, in case 'build' hooks depend on it
    const scopeContext: GraphileEngine.ContextInflection = {
      scope: {},
      type: "inflection",
    };
    initialBuild.inflection = this.applyHooks(
      "inflection",
      initialBuild.inflection,
      initialBuild,
      scopeContext,
    ) as GraphileEngine.Inflection;

    const build = this.applyHooks("build", initialBuild, initialBuild, {
      scope: {},
      type: "build",
    });

    // Bind all functions so they can be dereferenced
    bindAll(
      build,
      Object.keys(build).filter((key) => typeof build[key] === "function"),
    );

    const finalBuild = Object.freeze(build) as TBuild;
    const initContext: GraphileEngine.ContextInit = { scope: {}, type: "init" };
    this.applyHooks("init", INIT_OBJECT, finalBuild, initContext);
    return finalBuild;
  }

  buildSchema(): GraphQLSchema {
    if (!this._generatedSchema) {
      const build = this.createBuild();
      const schemaSpec: Partial<GraphQLSchemaConfig> = {
        directives: [...build.graphql.specifiedDirectives],
      };
      const schemaScope: GraphileEngine.ScopeGraphQLSchema = {
        __origin: `GraphQL built-in`,
      };
      const schema = this.newWithHooks(
        build,
        GraphQLSchema,
        schemaSpec,
        schemaScope,
      );

      const finalizeContext: GraphileEngine.ContextFinalize = {
        scope: {},
        type: "finalize",
      };
      this._generatedSchema = schema
        ? this.applyHooks(
            "finalize",
            schema,
            build,
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
        // TODO: should this await or not?
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
          // TODO: should this await or not?
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
