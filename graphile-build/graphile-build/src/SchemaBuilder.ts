import "./global.js";

import debugFactory from "debug";
import { EventEmitter } from "events";
import { applyHooks } from "graphile-config";
import type { GraphQLSchemaConfig } from "graphql";
import { GraphQLSchema, validateSchema } from "graphql";

import { Behavior } from "./behavior.js";
import makeNewBuild from "./makeNewBuild.js";
import type { NewWithHooksFunction } from "./newWithHooks/index.js";
import { makeNewWithHooks } from "./newWithHooks/index.js";
import { makeSchemaBuilderHooks } from "./SchemaBuilderHooks.js";
import { bindAll } from "./utils.js";

const debug = debugFactory("graphile-build:SchemaBuilder");

const INIT_OBJECT: GraphileBuild.InitObject = Object.freeze(
  Object.create(null),
);

const INDENT = "  ";

const getSchemaHooks = (plugin: GraphileConfig.Plugin) => plugin.schema?.hooks;

/**
 * The class responsible for building a GraphQL schema from graphile-build
 * plugins by orchestrating the various callback functions.
 */
class SchemaBuilder<
  TBuild extends GraphileBuild.Build = GraphileBuild.Build,
> extends EventEmitter {
  options: GraphileBuild.SchemaOptions;
  depth: number;
  hooks: GraphileBuild.SchemaBuilderHooks<TBuild>;

  _currentPluginName: string | null | undefined;

  /**
   * Given a Build object, a GraphQL type constructor and a spec, applies the
   * hooks to the spec and then constructs the type, returning the result.
   */
  newWithHooks: NewWithHooksFunction;

  constructor(
    private resolvedPreset: GraphileConfig.ResolvedPreset,
    private inflection: GraphileBuild.Inflection,
  ) {
    super();

    this.options = resolvedPreset.schema ?? {};

    // Because hooks can nest, this keeps track of how deep we are.
    this.depth = -1;

    this.hooks = makeSchemaBuilderHooks();

    this.newWithHooks = makeNewWithHooks({ builder: this }).newWithHooks;

    applyHooks(
      resolvedPreset.plugins,
      getSchemaHooks,
      (hookName, hookFn, plugin) => {
        this._setPluginName(plugin.name);
        this.hook(hookName, hookFn);
        this._setPluginName(null);
      },
    );
  }

  /**
   * @internal
   */
  _setPluginName(name: string | null | undefined) {
    this._currentPluginName = name;
  }

  /**
   * Registers 'fn' as a hook for the given 'hookName'. Every hook `fn` takes
   * three arguments:
   *
   * - obj - the object currently being inspected
   * - build - the current build object (which contains a number of utilities
   *   and the context of the build)
   * - context - information specific to the current invocation of the hook
   *
   * The function must return a replacement object for `obj` or `obj` itself.
   * Generally we advice that you return the object itself, modifying it as
   * necessary. In JavaScript, modifying an object object tends to be
   * significantly faster than returning a modified clone.
   */
  hook<THookName extends keyof GraphileBuild.SchemaBuilderHooks<TBuild>>(
    hookName: THookName,
    fn: GraphileBuild.SchemaBuilderHooks[THookName][number],
  ): void {
    if (!this.hooks[hookName]) {
      // TODO: fuzzy-find a similar hook
      throw new Error(`Sorry, '${hookName}' is not a supported hook`);
    }
    if (this._currentPluginName) {
      fn.displayName = `${this._currentPluginName}/schema.hooks.${hookName}`;
    }
    this.hooks[hookName].push(fn as any);
  }

  /**
   * Applies the given 'hookName' hooks to the given 'input' and returns the
   * result, which is typically a derivative of 'input'.
   */
  applyHooks<THookName extends keyof GraphileBuild.SchemaBuilderHooks<TBuild>>(
    hookName: THookName,
    input: Parameters<
      GraphileBuild.SchemaBuilderHooks<TBuild>[THookName][number]
    >[0],
    build: Parameters<
      GraphileBuild.SchemaBuilderHooks<TBuild>[THookName][number]
    >[1],
    context: Parameters<
      GraphileBuild.SchemaBuilderHooks<TBuild>[THookName][number]
    >[2],
    debugStr = "",
  ): Parameters<
    GraphileBuild.SchemaBuilderHooks<TBuild>[THookName][number]
  >[0] {
    if (!input) {
      throw new Error("applyHooks was called with falsy input");
    }
    this.depth++;
    const indent = INDENT.repeat(this.depth);
    try {
      debug(`%s[%s%s]: Running...`, indent, hookName, debugStr);

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
            `%s[%s%s]:   Executing '%s'`,
            indent,
            hookName,
            debugStr,
            hookDisplayName,
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
              `GraphileBuild.Hook '${
                hook.displayName || hook.name || "anonymous"
              }' for '${hookName}' returned falsy value '${newObj}'`,
            );
          }
          debug(
            `%s[%s%s]:   '%s' complete`,
            indent,
            hookName,
            debugStr,
            hookDisplayName,
          );
        } finally {
          this.depth--;
        }
      }

      debug(`%s[%s%s]: Complete`, indent, hookName, debugStr);

      return newObj;
    } finally {
      this.depth--;
    }
  }

  /**
   * Create the 'Build' object.
   */
  createBuild(input: GraphileBuild.BuildInput): TBuild {
    const behavior = new Behavior(this.resolvedPreset);
    const initialBuild = makeNewBuild(
      this,
      input,
      this.inflection,
      behavior,
    ) as Partial<TBuild> & GraphileBuild.BuildBase;

    const build = this.applyHooks("build", initialBuild, initialBuild, {
      scope: Object.create(null),
      type: "build",
    });

    // Bind all functions so they can be dereferenced
    bindAll(
      build,
      (Object.keys(build) as Array<keyof GraphileBuild.Build & string>).filter(
        (key) => typeof build[key] === "function",
      ),
    );

    const finalBuild = Object.freeze(build) as TBuild;
    finalBuild.status.isBuildPhaseComplete = true;
    const initContext: GraphileBuild.ContextInit = {
      scope: Object.create(null),
      type: "init",
    };
    this.applyHooks("init", INIT_OBJECT, finalBuild, initContext);
    finalBuild.status.isInitPhaseComplete = true;
    return finalBuild;
  }

  /**
   * Given the `input` (result of the "gather" phase), builds the GraphQL
   * schema synchronously.
   */
  buildSchema(input: GraphileBuild.BuildInput): GraphQLSchema {
    const build = this.createBuild(input);
    const schemaSpec: Partial<GraphQLSchemaConfig> = {
      directives: [...build.graphql.specifiedDirectives],
    };
    const schemaScope: GraphileBuild.ScopeSchema = {
      __origin: `Graphile built-in`,
    };
    const tempSchema = this.newWithHooks(
      build,
      GraphQLSchema,
      schemaSpec,
      schemaScope,
    );

    const finalizeContext: GraphileBuild.ContextFinalize = {
      scope: Object.create(null),
      type: "finalize",
    };

    const schema = tempSchema
      ? this.applyHooks(
          "finalize",
          tempSchema,
          build,
          finalizeContext,
          "Finalizing GraphQL schema",
        )
      : tempSchema;

    if (!schema) {
      throw new Error("Schema generation failed");
    }

    const validationErrors = validateSchema(schema);
    if (validationErrors.length) {
      throw new AggregateError(
        validationErrors,
        `Schema construction failed due to ${
          validationErrors.length
        } validation failure(s). First failure was: ${String(
          validationErrors[0],
        )}`,
      );
    }

    return schema;
  }
}

export default SchemaBuilder;
