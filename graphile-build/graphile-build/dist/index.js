"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.defaultPreset = exports.TrimEmptyDescriptionsPlugin = exports.SwallowErrorsPlugin = exports.SubscriptionPlugin = exports.StreamDeferPlugin = exports.RegisterQueryNodePlugin = exports.QueryQueryPlugin = exports.QueryPlugin = exports.PageInfoStartEndCursorPlugin = exports.NodePlugin = exports.NodeIdCodecPipeStringPlugin = exports.NodeIdCodecBase64JSONPlugin = exports.NodeAccessorPlugin = exports.MutationPlugin = exports.MutationPayloadQueryPlugin = exports.CursorTypePlugin = exports.CommonTypesPlugin = exports.CommonBehaviorsPlugin = exports.ClientMutationIdDescriptionPlugin = exports.BuiltinScalarConnectionsPlugin = exports.AddNodeInterfaceToSuitableTypesPlugin = exports.buildSchema = exports.getBuilder = exports.watchGather = exports.gather = exports.buildInflection = exports.SchemaBuilder = exports.upperFirst = exports.upperCamelCase = exports.singularize = exports.pluralize = exports.gatherConfig = exports.formatInsideUnderscores = exports.EXPORTABLE_OBJECT_CLONE = exports.EXPORTABLE = exports.constantCaseAll = exports.constantCase = exports.camelCase = exports.isValidBehaviorString = void 0;
exports.makeSchema = makeSchema;
exports.watchSchema = watchSchema;
const tslib_1 = require("tslib");
require("./global.js");
require("./interfaces.js");
const grafast = tslib_1.__importStar(require("grafast"));
const graphql_1 = require("grafast/graphql");
const graphile_config_1 = require("graphile-config");
var behavior_js_1 = require("./behavior.js");
Object.defineProperty(exports, "isValidBehaviorString", { enumerable: true, get: function () { return behavior_js_1.isValidBehaviorString; } });
const extend_js_1 = tslib_1.__importDefault(require("./extend.js"));
const inflection_js_1 = require("./inflection.js");
const index_js_1 = require("./plugins/index.js");
Object.defineProperty(exports, "AddNodeInterfaceToSuitableTypesPlugin", { enumerable: true, get: function () { return index_js_1.AddNodeInterfaceToSuitableTypesPlugin; } });
Object.defineProperty(exports, "BuiltinScalarConnectionsPlugin", { enumerable: true, get: function () { return index_js_1.BuiltinScalarConnectionsPlugin; } });
Object.defineProperty(exports, "ClientMutationIdDescriptionPlugin", { enumerable: true, get: function () { return index_js_1.ClientMutationIdDescriptionPlugin; } });
Object.defineProperty(exports, "CommonBehaviorsPlugin", { enumerable: true, get: function () { return index_js_1.CommonBehaviorsPlugin; } });
Object.defineProperty(exports, "CommonTypesPlugin", { enumerable: true, get: function () { return index_js_1.CommonTypesPlugin; } });
Object.defineProperty(exports, "CursorTypePlugin", { enumerable: true, get: function () { return index_js_1.CursorTypePlugin; } });
Object.defineProperty(exports, "MutationPayloadQueryPlugin", { enumerable: true, get: function () { return index_js_1.MutationPayloadQueryPlugin; } });
Object.defineProperty(exports, "MutationPlugin", { enumerable: true, get: function () { return index_js_1.MutationPlugin; } });
Object.defineProperty(exports, "NodeAccessorPlugin", { enumerable: true, get: function () { return index_js_1.NodeAccessorPlugin; } });
Object.defineProperty(exports, "NodeIdCodecBase64JSONPlugin", { enumerable: true, get: function () { return index_js_1.NodeIdCodecBase64JSONPlugin; } });
Object.defineProperty(exports, "NodeIdCodecPipeStringPlugin", { enumerable: true, get: function () { return index_js_1.NodeIdCodecPipeStringPlugin; } });
Object.defineProperty(exports, "NodePlugin", { enumerable: true, get: function () { return index_js_1.NodePlugin; } });
Object.defineProperty(exports, "PageInfoStartEndCursorPlugin", { enumerable: true, get: function () { return index_js_1.PageInfoStartEndCursorPlugin; } });
Object.defineProperty(exports, "QueryPlugin", { enumerable: true, get: function () { return index_js_1.QueryPlugin; } });
Object.defineProperty(exports, "QueryQueryPlugin", { enumerable: true, get: function () { return index_js_1.QueryQueryPlugin; } });
Object.defineProperty(exports, "RegisterQueryNodePlugin", { enumerable: true, get: function () { return index_js_1.RegisterQueryNodePlugin; } });
Object.defineProperty(exports, "StreamDeferPlugin", { enumerable: true, get: function () { return index_js_1.StreamDeferPlugin; } });
Object.defineProperty(exports, "SubscriptionPlugin", { enumerable: true, get: function () { return index_js_1.SubscriptionPlugin; } });
Object.defineProperty(exports, "SwallowErrorsPlugin", { enumerable: true, get: function () { return index_js_1.SwallowErrorsPlugin; } });
Object.defineProperty(exports, "TrimEmptyDescriptionsPlugin", { enumerable: true, get: function () { return index_js_1.TrimEmptyDescriptionsPlugin; } });
const SchemaBuilder_js_1 = tslib_1.__importDefault(require("./SchemaBuilder.js"));
exports.SchemaBuilder = SchemaBuilder_js_1.default;
var utils_js_1 = require("./utils.js");
Object.defineProperty(exports, "camelCase", { enumerable: true, get: function () { return utils_js_1.camelCase; } });
Object.defineProperty(exports, "constantCase", { enumerable: true, get: function () { return utils_js_1.constantCase; } });
Object.defineProperty(exports, "constantCaseAll", { enumerable: true, get: function () { return utils_js_1.constantCaseAll; } });
Object.defineProperty(exports, "EXPORTABLE", { enumerable: true, get: function () { return utils_js_1.EXPORTABLE; } });
Object.defineProperty(exports, "EXPORTABLE_OBJECT_CLONE", { enumerable: true, get: function () { return utils_js_1.EXPORTABLE_OBJECT_CLONE; } });
Object.defineProperty(exports, "formatInsideUnderscores", { enumerable: true, get: function () { return utils_js_1.formatInsideUnderscores; } });
Object.defineProperty(exports, "gatherConfig", { enumerable: true, get: function () { return utils_js_1.gatherConfig; } });
Object.defineProperty(exports, "pluralize", { enumerable: true, get: function () { return utils_js_1.pluralize; } });
Object.defineProperty(exports, "singularize", { enumerable: true, get: function () { return utils_js_1.singularize; } });
Object.defineProperty(exports, "upperCamelCase", { enumerable: true, get: function () { return utils_js_1.upperCamelCase; } });
Object.defineProperty(exports, "upperFirst", { enumerable: true, get: function () { return utils_js_1.upperFirst; } });
const grafast_1 = require("grafast");
const preset_js_1 = require("./preset.js");
const utils_js_2 = require("./utils.js");
const EMPTY_OBJECT = Object.freeze(Object.create(null));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * Generate 'build.inflection' from the given preset.
 */
const buildInflection = (preset) => {
    const resolvedPreset = (0, graphile_config_1.resolvePreset)(preset);
    const { plugins, inflection: _options = {} } = resolvedPreset;
    const inflectors = (0, inflection_js_1.makeInitialInflection)();
    // Add the base inflectors
    if (plugins) {
        for (const plugin of plugins) {
            if (plugin.inflection?.add) {
                const inflectorsToAdd = plugin.inflection.add;
                for (const inflectorName of Object.keys(inflectorsToAdd)) {
                    const fn = inflectorsToAdd[inflectorName];
                    if (fn) {
                        const inflector = fn.bind(inflectors, preset);
                        (0, extend_js_1.default)(inflectors, { [inflectorName]: inflector }, `Adding inflectors from ${plugin.name}`);
                    }
                }
            }
        }
        // Overwrite the inflectors
        (0, graphile_config_1.orderedApply)(plugins, (plugin) => plugin.inflection?.replace, (inflectorName, replacementFunction, plugin) => {
            const previous = inflectors[inflectorName];
            const ignore = plugin.inflection?.ignoreReplaceIfNotExists ?? [];
            if (!previous && ignore?.includes(inflectorName)) {
                // Do nothing
            }
            else {
                if (!previous) {
                    console.warn(`Plugin '${plugin.name}' attempted to overwrite inflector '${inflectorName}', but no such inflector exists.`);
                }
                const inflector = replacementFunction.bind(inflectors, previous, preset);
                inflectors[inflectorName] =
                    inflector;
            }
        });
    }
    return inflectors;
};
exports.buildInflection = buildInflection;
function pluginNamespace(plugin) {
    return plugin.gather?.namespace ?? plugin.name;
}
/**
 * @internal
 */
const gatherBase = (preset, { inflection, } = { inflection: (0, exports.buildInflection)(preset) }) => {
    const resolvedPreset = (0, graphile_config_1.resolvePreset)(preset);
    const options = resolvedPreset.gather || {};
    const plugins = resolvedPreset.plugins;
    const globalState = Object.create(null);
    const gatherState = Object.create(null);
    const helpers = Object.create(null); // GatherHelpers
    const hooks = new graphile_config_1.AsyncHooks();
    const contextBase = Object.freeze({
        // Global libraries/helpers
        lib: resolvedPreset.lib,
        // DEPRECATED: use `lib` instead:
        grafast,
        EXPORTABLE: utils_js_2.EXPORTABLE,
        // Established by the start of the gather phase
        resolvedPreset,
        options,
        inflection,
        process: hooks.process.bind(hooks),
        helpers: helpers,
    });
    const pluginContext = new Map();
    const gatherPlugins = plugins?.filter((p) => p.gather);
    if (gatherPlugins) {
        // Prepare the plugins to run by preparing their initial states, and registering the helpers (hooks area already done).
        for (const plugin of gatherPlugins) {
            const spec = plugin.gather;
            const specNamespace = pluginNamespace(plugin);
            if (specNamespace in globalState) {
                // ERRORS: track who registers which namespace, output more helpful error.
                throw new Error(`Namespace '${specNamespace}' was already registered, it cannot be registered by two plugins - namespaces must be unique. Latest plugin was '${plugin.name}'.`);
            }
            const cache = (globalState[specNamespace] =
                spec.initialCache?.(contextBase) ?? Object.create(null));
            if (typeof cache.then === "function") {
                // ENHANCE: can we just make `initialCache` allow promises?
                throw new Error(`\`initialCache\` may not return a promise directly; instead set one of the keys on the object it returns to a promise and await that in \`initialState\` (which is allowed to be async)`);
            }
            const context = Object.seal({
                ...contextBase,
                cache,
                state: EMPTY_OBJECT /* This will be overwritten before it's used */,
            });
            pluginContext.set(plugin, context);
            helpers[specNamespace] = Object.create(null);
            if (spec.helpers != null) {
                if (!spec.namespace) {
                    throw new Error(`Plugin '${plugin.name}' tries to add helpers but is using an implicit namespace. Please use an explicit \`plugin.gather.namespace\`.`);
                }
                const specHelpers = spec.helpers;
                for (const helperName of Object.keys(specHelpers)) {
                    helpers[specNamespace][helperName] = (...args) => {
                        return specHelpers[helperName](context, ...args);
                    };
                }
            }
        }
        // Register the hooks
        (0, graphile_config_1.orderedApply)(gatherPlugins, (p) => p.gather.hooks, (name, fn, plugin) => {
            const context = pluginContext.get(plugin);
            // hooks.hook(name, (...args) => fn(context, ...args));
            hooks.hook(name, ((...args) => fn(context, ...args)));
        });
    }
    async function run() {
        const output = Object.create(null);
        if (gatherPlugins) {
            // Reset state
            for (const plugin of gatherPlugins) {
                const spec = plugin.gather;
                const specNamespace = pluginNamespace(plugin);
                const context = pluginContext.get(plugin);
                const val = typeof spec.initialState === "function"
                    ? await spec.initialState(context.cache, context)
                    : Object.create(null);
                context.state = gatherState[specNamespace] = val;
            }
            // Now call the main functions
            for (const plugin of gatherPlugins) {
                const spec = plugin.gather;
                if (spec.main) {
                    const context = pluginContext.get(plugin);
                    await spec.main(output, context);
                }
            }
        }
        return output;
    }
    async function watch(callback) {
        let stopped = false;
        const unlisten = [];
        let runAgain = false;
        let runInProgress = true;
        let counter = 0;
        const handleChange = () => {
            if (stopped) {
                return;
            }
            if (runInProgress) {
                runAgain = true;
                return;
            }
            ++counter;
            runAgain = false;
            runInProgress = true;
            run().then((v) => {
                runInProgress = false;
                if (stopped)
                    return;
                try {
                    callback(v, undefined, makeRetry(counter));
                }
                catch {
                    // ERRORS: this indicates a bug in user code; how to handle?
                    /*nom nom nom*/
                }
                if (runAgain)
                    handleChange();
            }, (e) => {
                runInProgress = false;
                if (stopped)
                    return;
                try {
                    callback(null, e, makeRetry(counter));
                }
                catch {
                    // ERRORS: this indicates a bug in user code; how to handle?
                    /*nom nom nom*/
                }
                if (runAgain)
                    handleChange();
            });
        };
        const makeRetry = (currentCounter) => {
            return () => {
                if (currentCounter === counter) {
                    handleChange();
                }
                else {
                    // Another change was already registered; ignore
                }
            };
        };
        if (gatherPlugins) {
            // Put all the plugins into watch mode.
            for (const plugin of gatherPlugins) {
                const spec = plugin.gather;
                if (spec.watch) {
                    const context = pluginContext.get(plugin);
                    unlisten.push(await spec.watch(context, handleChange));
                }
            }
        }
        // Trigger the first build, being sure it completes before resolving
        try {
            // Clear 'runAgain' since we're starting now
            runAgain = false;
            const firstResult = await run();
            callback(firstResult, undefined, makeRetry(counter));
        }
        catch (e) {
            callback(null, e, makeRetry(counter));
        }
        runInProgress = false;
        if (runAgain) {
            handleChange();
        }
        // Return the unlistener.
        return () => {
            stopped = true;
            unlisten.forEach((cb) => cb());
        };
    }
    return {
        run,
        watch,
    };
};
/**
 * One-time gather. See `watchGather` for watch mode.
 */
const gather = (preset, helpers) => {
    const { run } = gatherBase(preset, helpers);
    return run();
};
exports.gather = gather;
/**
 * Tells your gather plugins to monitor their sources, and passes the resulting
 * BuildInput to the callback each time a new one is generated. It is
 * guaranteed that the `callback` will be called at least once before the
 * promise resolves.
 *
 * @returns A callback to call to stop watching.
 */
const watchGather = (preset, helpers, callback) => {
    const { watch } = gatherBase(preset, helpers);
    return watch(callback);
};
exports.watchGather = watchGather;
/**
 * Gets a SchemaBuilder object for the given preset and inflection.  It's rare
 * you would need this, typically you'll want `buildSchema` instead.
 */
const getBuilder = (preset, inflection = (0, exports.buildInflection)(preset)) => {
    const resolvedPreset = (0, graphile_config_1.resolvePreset)(preset);
    if (!resolvedPreset.plugins || resolvedPreset.plugins.length === 0) {
        throw new Error(`You're attempting to build a GraphQL schema, but no plugins are specified in your preset. Please check the 'extends' key in your preset - you may have forgotten to add the relevant presets, or the presets may not have been imported correctly.`);
    }
    if (!resolvedPreset.plugins.includes(index_js_1.QueryPlugin)) {
        console.warn(`[WARNING] You're attempting to build a GraphQL schema, but the QueryPlugin is missing from your configuration. Unless you have done this very deliberately, this is probably a mistake - please check the 'extends' key in your preset - you may have forgotten to add the relevant presets, or the presets may not have been imported correctly.`);
    }
    const builder = new SchemaBuilder_js_1.default(resolvedPreset, inflection);
    return builder;
};
exports.getBuilder = getBuilder;
async function writeFileIfDiffers(path, contents) {
    // COMPAT: support other environments than Node
    const { readFile, writeFile } = await import("node:fs/promises");
    let oldContents = null;
    try {
        oldContents = await readFile(path, "utf8");
    }
    catch (e) {
        /* noop */
    }
    if (oldContents !== contents) {
        await writeFile(path, contents);
    }
}
/**
 * Builds a GraphQL schema according to the given preset and input data.
 */
const buildSchema = (rawPreset, input, shared = {}) => {
    const preset = {
        extends: [preset_js_1.GraphileBuildLibPreset, rawPreset],
    };
    const builder = (0, exports.getBuilder)(preset, shared.inflection);
    const schema = builder.buildSchema(input);
    const { exportSchemaSDLPath, exportSchemaIntrospectionResultPath, sortExport = false, } = builder.options;
    const schemaToExport = (exportSchemaSDLPath || exportSchemaIntrospectionResultPath) && sortExport
        ? (0, graphql_1.lexicographicSortSchema)(schema)
        : schema;
    if (exportSchemaSDLPath) {
        const text = (0, graphql_1.printSchema)(schemaToExport) + "\n";
        writeFileIfDiffers(exportSchemaSDLPath, text).catch((e) => {
            console.error(`Failed to write schema in GraphQL format to '${exportSchemaSDLPath}': ${e}`);
        });
    }
    if (exportSchemaIntrospectionResultPath) {
        const introspectionQuery = (0, graphql_1.getIntrospectionQuery)();
        const introspectionResult = (0, graphql_1.graphqlSync)({
            source: introspectionQuery,
            schema: schemaToExport,
        });
        const text = JSON.stringify(introspectionResult, null, 2) + "\n";
        writeFileIfDiffers(exportSchemaIntrospectionResultPath, text).catch((e) => {
            console.error(`Failed to write schema introspection results in JSON format to '${exportSchemaIntrospectionResultPath}': ${e}`);
        });
    }
    return schema;
};
exports.buildSchema = buildSchema;
var preset_js_2 = require("./preset.js");
Object.defineProperty(exports, "defaultPreset", { enumerable: true, get: function () { return preset_js_2.defaultPreset; } });
/**
 * Builds the GraphQL schema by resolving the preset, running inflection then
 * gather and building the schema. Returns the results.
 *
 * @experimental
 */
async function makeSchema(preset) {
    const resolvedPreset = (0, graphile_config_1.resolvePreset)(preset);
    // An error caused here cannot be solved by retrying, so don't catch it.
    const inflection = (0, exports.buildInflection)(resolvedPreset);
    const shared = { inflection };
    const retryOnInitFail = resolvedPreset.schema?.retryOnInitFail;
    let phase = "UNKNOWN";
    const make = async () => {
        phase = "GATHER";
        const input = await (0, exports.gather)(resolvedPreset, shared);
        phase = "SCHEMA";
        const schema = (0, exports.buildSchema)(resolvedPreset, input, shared);
        return { schema, resolvedPreset };
    };
    if (retryOnInitFail) {
        // eslint-disable-next-line no-constant-condition
        for (let attempts = 1; true; attempts++) {
            try {
                const result = await make();
                if (attempts > 1) {
                    console.warn(`Schema constructed successfully on attempt ${attempts}.`);
                }
                return result;
            }
            catch (error) {
                await sleepFromRetryOnInitFail(retryOnInitFail, phase, attempts, error);
            }
        }
    }
    else {
        return make();
    }
}
async function sleepFromRetryOnInitFail(retryOnInitFail, phase, attempts, error) {
    const delay = Math.min(100 * Math.pow(attempts, 2), 30000);
    const start = process.hrtime();
    const retryOrPromise = typeof retryOnInitFail === "function"
        ? retryOnInitFail(error, attempts, delay)
        : retryOnInitFail;
    if (retryOrPromise === false) {
        throw error;
    }
    console.warn(`Error occurred whilst building the schema (phase = ${phase}; attempt ${attempts}). We'll try again ${retryOrPromise === true ? `in ${delay}ms` : `shortly`}.\n  ${String(error.stack ?? error).replace(/\n/g, "\n  ")}`);
    if (retryOrPromise === true) {
        await sleep(delay);
    }
    else if (!(0, grafast_1.isPromiseLike)(retryOrPromise)) {
        throw new Error(`Invalid retryOnInitFail setting; must be true, false, or an optionally async function that resolves to true/false`);
    }
    else {
        const retry = await retryOrPromise;
        const diff = process.hrtime(start);
        const dur = diff[0] * 1e3 + diff[1] * 1e-6;
        if (!retry) {
            throw error;
        }
        else if (dur < 50) {
            // retryOnInitFail didn't wait long enough; use default wait.
            console.error(`Your retryOnInitFail function should include a delay of at least 50ms before resolving; falling back to a ${delay}ms wait (attempts = ${attempts}) to avoid overwhelming the database.`);
            await sleep(delay);
        }
        else {
            // The promise already waited long enough, continue
        }
    }
}
/**
 * Runs the "gather" phase in watch mode and calls 'callback' with the
 * generated SchemaResult each time a new schema is generated.
 *
 * It is guaranteed that `callback` will be called at least once before the
 * promise resolves.
 *
 * Returns a function that can be called to stop watching.
 *
 * @experimental
 */
async function watchSchema(preset, callback) {
    const resolvedPreset = (0, graphile_config_1.resolvePreset)(preset);
    const shared = { inflection: (0, exports.buildInflection)(resolvedPreset) };
    const retryOnInitFail = resolvedPreset.schema?.retryOnInitFail;
    let attempts = 0;
    let haveHadSuccess = false;
    const handleErrorWithRetry = (error, retry) => {
        if (retryOnInitFail) {
            sleepFromRetryOnInitFail(retryOnInitFail, "GATHER", attempts, error).then(retry, callback);
        }
        else {
            if (!haveHadSuccess) {
                // Inability to gather is fatal - database connection issue?
                callback(error);
            }
            else {
                console.error(`Error occurred during watch gather: ${error}`);
            }
        }
    };
    const stopWatching = await (0, exports.watchGather)(resolvedPreset, shared, (input, error, retry) => {
        ++attempts;
        if (error) {
            // An error here could be a database connectivity issue or similar
            // issue, if retryOnInitFail is set we should automatically retry.
            handleErrorWithRetry(error, retry);
        }
        else {
            if (attempts > 1) {
                console.warn(`Gather completed successfully on attempt ${attempts}.`);
            }
            attempts = 0;
            haveHadSuccess = true;
            try {
                const schema = (0, exports.buildSchema)(resolvedPreset, input, shared);
                callback(null, { schema, resolvedPreset });
            }
            catch (e) {
                // Retrying this on its own is pointless, we need the gather phase to
                // give us more data so we can just await regular watch for that.
                console.error(`Error occurred during watch schema generation:`, e);
            }
        }
    });
    return stopWatching;
}
var version_js_1 = require("./version.js");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_js_1.version; } });
//# sourceMappingURL=index.js.map