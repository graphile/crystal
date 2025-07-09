"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("./global.js");
const debug_1 = tslib_1.__importDefault(require("debug"));
const events_1 = require("events");
const graphql_1 = require("grafast/graphql");
const graphile_config_1 = require("graphile-config");
const util_1 = require("util");
const behavior_js_1 = require("./behavior.js");
const makeNewBuild_js_1 = tslib_1.__importDefault(require("./makeNewBuild.js"));
const index_js_1 = require("./newWithHooks/index.js");
const SchemaBuilderHooks_js_1 = require("./SchemaBuilderHooks.js");
const utils_js_1 = require("./utils.js");
const debug = (0, debug_1.default)("graphile-build:SchemaBuilder");
const INIT_OBJECT = Object.freeze(Object.create(null));
const INDENT = "  ";
const getSchemaHooks = (plugin) => plugin.schema?.hooks;
/**
 * The class responsible for building a GraphQL schema from graphile-build
 * plugins by orchestrating the various callback functions.
 */
class SchemaBuilder extends events_1.EventEmitter {
    constructor(resolvedPreset, inflection) {
        super();
        this.resolvedPreset = resolvedPreset;
        this.inflection = inflection;
        this.options = resolvedPreset.schema ?? {};
        // Because hooks can nest, this keeps track of how deep we are.
        this.depth = -1;
        this.hooks = (0, SchemaBuilderHooks_js_1.makeSchemaBuilderHooks)();
        this.newWithHooks = (0, index_js_1.makeNewWithHooks)({ builder: this }).newWithHooks;
        (0, graphile_config_1.orderedApply)(resolvedPreset.plugins, getSchemaHooks, (hookName, hookFn, plugin) => {
            this._setPluginName(plugin.name);
            this.hook(hookName, hookFn);
            this._setPluginName(null);
        });
    }
    _setPluginName(name) {
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
    hook(hookName, fn) {
        if (!this.hooks[hookName]) {
            // ERRORS: fuzzy-find a similar hook
            throw new Error(`Sorry, '${hookName}' is not a supported hook`);
        }
        if (this._currentPluginName) {
            fn.displayName = `${this._currentPluginName}/schema.hooks.${hookName}`;
        }
        this.hooks[hookName].push(fn);
    }
    /**
     * Applies the given 'hookName' hooks to the given 'input' and returns the
     * result, which is typically a derivative of 'input'.
     */
    applyHooks(hookName, input, build, context, debugStr = "") {
        if (!input) {
            throw new Error(`applyHooks(${JSON.stringify(hookName)}, ...) was called with falsy input ${(0, util_1.inspect)(input, {
                colors: true,
            })}`);
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
                    debug(`%s[%s%s]:   Executing '%s'`, indent, hookName, debugStr, hookDisplayName);
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
                            throw new Error(`Build hook '${hookDisplayName}' returned a new object; 'build' hooks must always return the same Build object - please use 'return build.extend(build, {...})' instead.`);
                        }
                    }
                    build.status.currentHookName = previousHookName;
                    build.status.currentHookEvent = previousHookEvent;
                    if (!newObj) {
                        throw new Error(`GraphileBuild.Hook '${hook.displayName || hook.name || "anonymous"}' for '${hookName}' returned falsy value '${newObj}'`);
                    }
                    debug(`%s[%s%s]:   '%s' complete`, indent, hookName, debugStr, hookDisplayName);
                }
                finally {
                    this.depth--;
                }
            }
            debug(`%s[%s%s]: Complete`, indent, hookName, debugStr);
            return newObj;
        }
        finally {
            this.depth--;
        }
    }
    /**
     * Create the 'Build' object.
     */
    createBuild(input) {
        const initialBuild = (0, makeNewBuild_js_1.default)(this, input, this.inflection);
        const build = this.applyHooks("build", initialBuild, initialBuild, {
            scope: Object.create(null),
            type: "build",
        });
        // Bind all functions so they can be dereferenced
        (0, utils_js_1.bindAll)(build, Object.keys(build).filter((key) => typeof build[key] === "function"));
        const finalBuild = build;
        finalBuild.behavior = new behavior_js_1.Behavior(this.resolvedPreset, finalBuild);
        Object.freeze(finalBuild);
        finalBuild.behavior.freeze();
        finalBuild.status.isBuildPhaseComplete = true;
        return finalBuild;
    }
    initBuild(build) {
        if (build.status.isInitPhaseComplete) {
            return build;
        }
        const initContext = {
            scope: Object.create(null),
            type: "init",
        };
        this.applyHooks("init", INIT_OBJECT, build, initContext);
        build.status.isInitPhaseComplete = true;
        return build;
    }
    /**
     * Given the `input` (result of the "gather" phase), builds the GraphQL
     * schema synchronously.
     */
    buildSchema(input) {
        const build = this.initBuild(this.createBuild(input));
        const schemaSpec = {
            directives: [...build.graphql.specifiedDirectives],
        };
        const schemaScope = {
            __origin: `Graphile built-in`,
        };
        const tempSchema = this.newWithHooks(build, graphql_1.GraphQLSchema, schemaSpec, schemaScope);
        const finalizeContext = {
            scope: Object.create(null),
            type: "finalize",
        };
        const schema = tempSchema
            ? this.applyHooks("finalize", tempSchema, build, finalizeContext, "Finalizing GraphQL schema")
            : tempSchema;
        if (!schema) {
            throw new Error("Schema generation failed");
        }
        const validationErrors = (0, graphql_1.validateSchema)(schema);
        if (validationErrors.length) {
            throw new AggregateError(validationErrors, `Schema construction failed due to ${validationErrors.length} validation failure(s). First failure was: ${String(validationErrors[0])}`);
        }
        return schema;
    }
}
exports.default = SchemaBuilder;
//# sourceMappingURL=SchemaBuilder.js.map