"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grafast = grafast;
exports.grafastSync = grafastSync;
const tslib_1 = require("tslib");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
const graphql = tslib_1.__importStar(require("graphql"));
const error_js_1 = require("./error.js");
const execute_js_1 = require("./execute.js");
const index_js_1 = require("./index.js");
const interfaces_js_1 = require("./interfaces.js");
const middleware_js_1 = require("./middleware.js");
const utils_js_1 = require("./utils.js");
const { GraphQLError, parse, Source, validate, validateSchema } = graphql;
/** Rough average size per query */
const CACHE_MULTIPLIER = 100000;
const MEGABYTE = 1024 * 1024;
const queryCacheMaxSizeInBytes = 50 * MEGABYTE;
const defaultQueryCacheMaxSize = Math.max(2, Math.ceil(queryCacheMaxSizeInBytes / CACHE_MULTIPLIER));
// If we can use crypto to create a hash, great. Otherwise just use the string.
let calculateQueryHash;
try {
    let lastString;
    let lastHash;
    const createHash = require("crypto").createHash;
    if (typeof createHash !== "function") {
        throw new Error("Failed to load createHash");
    }
    calculateQueryHash = (queryString) => {
        if (queryString !== lastString) {
            lastString = queryString;
            lastHash = createHash("sha1").update(queryString).digest("base64");
        }
        return lastHash;
    };
}
catch {
    calculateQueryHash = (str) => str;
}
const parseAndValidate = (gqlSchema, stringOrSource) => {
    let queryCache = gqlSchema.extensions.grafast?.[interfaces_js_1.$$queryCache];
    if (!queryCache) {
        const cacheSize = gqlSchema.extensions.grafast?.queryCacheMaxLength ??
            defaultQueryCacheMaxSize;
        queryCache = new lru_1.default({ maxLength: cacheSize });
        if (!gqlSchema.extensions.grafast) {
            gqlSchema.extensions.grafast = Object.create(null);
        }
        gqlSchema.extensions.grafast[interfaces_js_1.$$queryCache] = queryCache;
    }
    // Only cache queries that are less than 100kB, we don't want DOS attacks
    // attempting to exhaust our memory.
    const hash = calculateQueryHash(typeof stringOrSource === "string" ? stringOrSource : stringOrSource.body);
    const result = queryCache.get(hash);
    if (result !== undefined) {
        return result;
    }
    else {
        const source = typeof stringOrSource === "string"
            ? new Source(stringOrSource, "GraphQL Http Request")
            : stringOrSource;
        let queryDocumentAst;
        // Catch an errors while parsing so that we can set the `statusCode` to
        // 400. Otherwise we don’t need to parse this way.
        try {
            queryDocumentAst = parse(source);
            // Validate our GraphQL query using given rules.
            const validationErrors = validate(gqlSchema, queryDocumentAst);
            const cacheResult = validationErrors.length > 0 ? validationErrors : queryDocumentAst;
            queryCache.set(hash, cacheResult);
            return cacheResult;
        }
        catch (error) {
            const cacheResult = [
                error instanceof GraphQLError
                    ? error
                    : new GraphQLError("Validation error occurred", undefined, undefined, undefined, undefined, error),
            ];
            queryCache.set(hash, cacheResult);
            return cacheResult;
        }
    }
};
function grafast(args, legacyResolvedPreset, legacyCtx) {
    // Convert legacy args to properties on `args`:
    if (legacyResolvedPreset !== undefined) {
        args.resolvedPreset = args.resolvedPreset ?? legacyResolvedPreset;
    }
    if (legacyCtx !== undefined) {
        args.requestContext = args.requestContext ?? legacyCtx;
    }
    const { schema, source, rootValue, contextValue, variableValues, operationName, fieldResolver, typeResolver, resolvedPreset, requestContext, middleware: rawMiddleware, } = args;
    const middleware = rawMiddleware !== undefined
        ? rawMiddleware
        : resolvedPreset != null
            ? (0, middleware_js_1.getGrafastMiddleware)(resolvedPreset)
            : null;
    // Validate Schema
    const schemaValidationErrors = middleware != null && resolvedPreset != null
        ? middleware.runSync("validateSchema", { schema, resolvedPreset }, validateSchemaWithEvent)
        : validateSchema(schema);
    if (schemaValidationErrors.length > 0) {
        return { errors: schemaValidationErrors };
    }
    // Cached parse and validate
    const documentOrErrors = middleware != null && resolvedPreset != null
        ? middleware.runSync("parseAndValidate", { resolvedPreset, schema, source }, parseAndValidateWithEvent)
        : parseAndValidate(schema, source);
    if (Array.isArray(documentOrErrors)) {
        return { errors: documentOrErrors };
    }
    const document = documentOrErrors;
    const executionArgs = {
        schema,
        document,
        rootValue,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
        typeResolver,
        middleware,
        resolvedPreset,
        requestContext,
    };
    if (resolvedPreset && requestContext) {
        const argsOrPromise = (0, index_js_1.hookArgs)(executionArgs);
        if ((0, utils_js_1.isPromiseLike)(argsOrPromise)) {
            return Promise.resolve(argsOrPromise).then(execute_js_1.execute);
        }
        else {
            return (0, execute_js_1.execute)(argsOrPromise);
        }
    }
    else {
        return (0, execute_js_1.execute)(executionArgs);
    }
}
function grafastSync(args, legacyResolvedPreset, legacyRequestContext) {
    const result = grafast(args, legacyResolvedPreset, legacyRequestContext);
    if ((0, utils_js_1.isPromiseLike)(result)) {
        throw new error_js_1.SafeError("Grafast execution failed to complete synchronously.");
    }
    return result;
}
function validateSchemaWithEvent(event) {
    return validateSchema(event.schema);
}
function parseAndValidateWithEvent(event) {
    return parseAndValidate(event.schema, event.source);
}
//# sourceMappingURL=grafastGraphql.js.map