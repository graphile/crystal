"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertErrorToErrorResult = exports.GrafservBase = void 0;
exports.convertHandlerResultToResult = convertHandlerResultToResult;
const tslib_1 = require("tslib");
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const grafast_1 = require("grafast");
const graphql = tslib_1.__importStar(require("grafast/graphql"));
const graphile_config_1 = require("graphile-config");
const hooks_js_1 = require("../hooks.js");
const mapIterator_js_1 = require("../mapIterator.js");
const graphiql_js_1 = require("../middleware/graphiql.js");
const graphql_js_1 = require("../middleware/graphql.js");
const options_js_1 = require("../options.js");
const utils_js_1 = require("../utils.js");
const failedToBuildHandlersError = new graphql.GraphQLError("Unknown error occurred.");
const { isSchema, validateSchema } = graphql;
class GrafservBase {
    getExecutionConfig(_ctx) {
        throw new Error("Overwritten in constructor");
    }
    constructor(config) {
        this.releaseHandlers = [];
        this.releasing = false;
        this.initialized = false;
        this._settingPreset = false;
        this.waitForGraphqlHandler = function (...args) {
            const [request] = args;
            const deferred = (0, grafast_1.defer)();
            const { dynamicOptions } = this;
            const onReady = () => {
                this.eventEmitter.off("dynamicOptions:ready", onReady);
                this.eventEmitter.off("dynamicOptions:error", onError);
                Promise.resolve()
                    .then(() => this.graphqlHandler(...args))
                    .then(deferred.resolve, deferred.reject);
            };
            const onError = (e) => {
                this.eventEmitter.off("dynamicOptions:ready", onReady);
                this.eventEmitter.off("dynamicOptions:error", onError);
                const graphqlError = new graphql.GraphQLError("Unknown error occurred", null, null, null, null, e);
                deferred.resolve({
                    type: "graphql",
                    request,
                    dynamicOptions,
                    payload: { errors: [graphqlError] },
                    statusCode: graphqlError.extensions?.statusCode ?? 503,
                    // Fall back to application/json; this is when an unexpected error happens
                    // so it shouldn't be hit.
                    contentType: graphql_js_1.APPLICATION_JSON,
                });
            };
            this.eventEmitter.on("dynamicOptions:ready", onReady);
            this.eventEmitter.on("dynamicOptions:error", onError);
            setTimeout(onError, 5000, new Error("Server initialization timed out"));
            return Promise.resolve(deferred);
        };
        this.waitForGraphiqlHandler = function (...args) {
            const [request] = args;
            const { dynamicOptions } = this;
            const deferred = (0, grafast_1.defer)();
            const onReady = () => {
                this.eventEmitter.off("dynamicOptions:ready", onReady);
                this.eventEmitter.off("dynamicOptions:error", onError);
                Promise.resolve()
                    .then(() => this.graphiqlHandler(...args))
                    .then(deferred.resolve, deferred.reject);
            };
            const onError = (e) => {
                this.eventEmitter.off("dynamicOptions:ready", onReady);
                this.eventEmitter.off("dynamicOptions:error", onError);
                const graphqlError = new graphql.GraphQLError("Unknown error occurred", null, null, null, null, e);
                // TODO: this should be an HTML response
                deferred.resolve({
                    type: "graphql",
                    request,
                    dynamicOptions,
                    payload: { errors: [graphqlError] },
                    statusCode: graphqlError.extensions?.statusCode ?? 503,
                    // Fall back to application/json; this is when an unexpected error happens
                    // so it shouldn't be hit.
                    contentType: graphql_js_1.APPLICATION_JSON,
                });
            };
            this.eventEmitter.on("dynamicOptions:ready", onReady);
            this.eventEmitter.on("dynamicOptions:error", onError);
            setTimeout(onError, 5000, new Error("Server initialization timed out"));
            return Promise.resolve(deferred);
        };
        this.failedGraphqlHandler = function (...args) {
            const [request] = args;
            const { dynamicOptions } = this;
            return {
                type: "graphql",
                request,
                dynamicOptions,
                payload: { errors: [failedToBuildHandlersError] },
                statusCode: 503,
                // Fall back to application/json; this is when an unexpected error happens
                // so it shouldn't be hit.
                contentType: graphql_js_1.APPLICATION_JSON,
            };
        };
        this.failedGraphiqlHandler = function (...args) {
            const [request] = args;
            const { dynamicOptions } = this;
            return {
                type: "graphql",
                request,
                dynamicOptions,
                payload: { errors: [failedToBuildHandlersError] },
                statusCode: 503,
                // Fall back to application/json; this is when an unexpected error happens
                // so it shouldn't be hit.
                contentType: graphql_js_1.APPLICATION_JSON,
            };
        };
        this.eventEmitter = new eventemitter3_1.default();
        this.resolvedPreset = (0, graphile_config_1.resolvePreset)(config.preset ? config.preset : {});
        this.dynamicOptions = {
            validationRules: [...graphql.specifiedRules],
            getExecutionConfig: defaultMakeGetExecutionConfig(),
            ...(0, options_js_1.optionsFromConfig)(this.resolvedPreset),
        };
        this.getExecutionConfig = this.dynamicOptions.getExecutionConfig;
        this.middleware = (0, hooks_js_1.getGrafservMiddleware)(this.resolvedPreset);
        this.grafastMiddleware = (0, grafast_1.getGrafastMiddleware)(this.resolvedPreset);
        this.schemaError = null;
        this.schema = config.schema;
        if ((0, grafast_1.isPromiseLike)(config.schema)) {
            const promise = config.schema;
            promise.then((schema) => {
                this.setSchema(schema);
            }, (error) => {
                this.schemaError = promise;
                this.schema = null;
                this.eventEmitter.emit("schema:error", error);
            });
        }
        else {
            this.eventEmitter.emit("schema:ready", config.schema);
        }
        this.graphqlHandler = this.waitForGraphqlHandler;
        this.graphiqlHandler = this.waitForGraphiqlHandler;
        this.setPreset(this.resolvedPreset);
    }
    /** @internal */
    _processRequest(inRequest) {
        const request = (0, utils_js_1.normalizeRequest)(inRequest);
        if (!this.dynamicOptions) {
            throw new Error(`GrafservInternalError<1377f225-31b7-4a81-a56e-a28e18a19899>: Attempted to process request prematurely`);
        }
        const dynamicOptions = this.dynamicOptions;
        const forceCORS = !!this.resolvedPreset.grafserv?.dangerouslyAllowAllCORSRequests &&
            request.method === "OPTIONS";
        try {
            if (request.path === dynamicOptions.graphqlPath) {
                if (forceCORS)
                    return optionsResponse(request, this.dynamicOptions);
                return this.graphqlHandler(request, this.graphiqlHandler);
            }
            if (dynamicOptions.graphiql &&
                request.method === "GET" &&
                request.path === dynamicOptions.graphiqlPath) {
                if (forceCORS)
                    return optionsResponse(request, dynamicOptions);
                return this.graphiqlHandler(request);
            }
            if (dynamicOptions.watch &&
                request.method === "GET" &&
                request.path === dynamicOptions.eventStreamPath) {
                if (forceCORS)
                    return optionsResponse(request, dynamicOptions);
                const stream = this.makeStream();
                return {
                    type: "event-stream",
                    request,
                    dynamicOptions,
                    payload: stream,
                    statusCode: 200,
                };
            }
            // Unhandled
            return null;
        }
        catch (e) {
            console.error("Unexpected error occurred in _processRequest", e);
            return {
                type: "html",
                request,
                dynamicOptions,
                status: 500,
                payload: Buffer.from("ERROR", "utf8"),
            };
        }
    }
    processRequest(requestDigest) {
        const { resolvedPreset } = this;
        const event = {
            resolvedPreset,
            requestDigest,
            instance: this,
        };
        return this.middleware != null
            ? this.middleware.run("processRequest", event, processRequestWithEvent)
            : processRequestWithEvent(event);
    }
    getPreset() {
        return this.resolvedPreset;
    }
    getSchema() {
        return this.schema ?? this.schemaError;
    }
    async release() {
        if (this.releasing) {
            throw new Error("Release has already been called");
        }
        this.releasing = true;
        for (let i = this.releaseHandlers.length - 1; i >= 0; i--) {
            const handler = this.releaseHandlers[i];
            try {
                await handler();
            }
            catch (e) {
                /* nom nom nom */
            }
        }
    }
    onRelease(cb) {
        if (this.releasing) {
            throw new Error("Release has already been called; cannot add more onRelease callbacks");
        }
        this.releaseHandlers.push(cb);
    }
    setPreset(newPreset) {
        if (this._settingPreset) {
            throw new Error(`Setting a preset is currently in progress; please wait for it to complete.`);
        }
        this._settingPreset = true;
        const resolvedPreset = (0, graphile_config_1.resolvePreset)(newPreset);
        const middleware = (0, hooks_js_1.getGrafservMiddleware)(this.resolvedPreset);
        const grafastMiddleware = (0, grafast_1.getGrafastMiddleware)(this.resolvedPreset);
        // Note: this gets directly mutated
        const dynamicOptions = {
            validationRules: [...graphql.specifiedRules],
            getExecutionConfig: defaultMakeGetExecutionConfig(),
            ...(0, options_js_1.optionsFromConfig)(resolvedPreset),
        };
        const storeDynamicOptions = (dynamicOptions) => {
            const { resolvedPreset } = dynamicOptions;
            // Overwrite all the `this.*` properties at once
            this.resolvedPreset = resolvedPreset;
            this.middleware = middleware;
            this.grafastMiddleware = grafastMiddleware;
            this.dynamicOptions = dynamicOptions;
            this.initialized = true;
            // ENHANCE: this.graphqlHandler?.release()?
            this.refreshHandlers();
            this.getExecutionConfig = dynamicOptions.getExecutionConfig;
            // MUST come after the handlers have been refreshed, otherwise we'll
            // get infinite loops
            this.eventEmitter.emit("dynamicOptions:ready", {});
        };
        return (new Promise((resolve) => resolve(middleware != null
            ? middleware.run("setPreset", dynamicOptions, storeDynamicOptions)
            : storeDynamicOptions(dynamicOptions)))
            .then(null, (e) => {
            this.graphqlHandler = this.failedGraphqlHandler;
            this.graphiqlHandler = this.failedGraphiqlHandler;
            this.eventEmitter.emit("dynamicOptions:error", e);
        })
            // Finally:
            .then(() => {
            this._settingPreset = false;
        }));
    }
    setSchema(newSchema) {
        if (!newSchema) {
            throw new Error(`setSchema must be called with a GraphQL schema`);
        }
        if (!isSchema(newSchema)) {
            throw new Error(`setParams called with invalid schema (is there more than one 'graphql' module loaded?)`);
        }
        const errors = validateSchema(newSchema);
        if (errors.length > 0) {
            throw new Error(`setParams called with invalid schema; first error: ${errors[0]}`);
        }
        if (this.schema !== newSchema) {
            this.schemaError = null;
            this.schema = newSchema;
            this.eventEmitter.emit("schema:ready", newSchema);
            this.refreshHandlers();
        }
    }
    refreshHandlers() {
        if (!this.initialized) {
            // This will be handled once `setPreset` completes
            return;
        }
        this.graphqlHandler = (0, graphql_js_1.makeGraphQLHandler)(this);
        this.graphiqlHandler = (0, graphiql_js_1.makeGraphiQLHandler)(this.resolvedPreset, this.middleware, this.dynamicOptions);
    }
    // TODO: Rename this, or make it a middleware, or something
    makeStream() {
        const queue = [];
        let finished = false;
        const bump = () => {
            const next = queue.shift();
            if (next !== undefined) {
                next.resolve({
                    done: false,
                    value: { event: "change", data: "schema" },
                });
            }
        };
        const flushQueue = (e) => {
            const entries = queue.splice(0, queue.length);
            for (const entry of entries) {
                if (e != null) {
                    entry.reject(e);
                }
                else {
                    entry.resolve({ done: true });
                }
            }
        };
        this.eventEmitter.on("schema:ready", bump);
        return {
            [Symbol.asyncIterator]() {
                return this;
            },
            next() {
                if (finished) {
                    return Promise.resolve({
                        done: true,
                    });
                }
                return new Promise((resolve, reject) => {
                    queue.push({ resolve, reject });
                });
            },
            return() {
                finished = true;
                if (queue.length !== 0) {
                    flushQueue();
                }
                return Promise.resolve({
                    done: true,
                });
            },
            throw(e) {
                if (queue.length !== 0) {
                    flushQueue(e);
                }
                return Promise.reject(e);
            },
        };
    }
}
exports.GrafservBase = GrafservBase;
function defaultMakeGetExecutionConfig() {
    let latestSchema;
    let latestSchemaOrPromise;
    let latestParseAndValidate;
    let schemaPrepare = null;
    return function getExecutionConfig() {
        // Get up to date schema, in case we're in watch mode
        const schemaOrPromise = this.getSchema();
        const { resolvedPreset, dynamicOptions } = this;
        if (schemaOrPromise !== latestSchemaOrPromise) {
            latestSchemaOrPromise = schemaOrPromise;
            if ("then" in schemaOrPromise) {
                schemaPrepare = (async () => {
                    latestSchema = await schemaOrPromise;
                    latestSchemaOrPromise = schemaOrPromise;
                    latestParseAndValidate = (0, graphql_js_1.makeParseAndValidateFunction)(latestSchema, resolvedPreset, dynamicOptions);
                    schemaPrepare = null;
                    return true;
                })();
            }
            else {
                if (latestSchema === schemaOrPromise) {
                    // No action necessary
                }
                else {
                    latestSchema = schemaOrPromise;
                    latestParseAndValidate = (0, graphql_js_1.makeParseAndValidateFunction)(latestSchema, resolvedPreset, dynamicOptions);
                }
            }
        }
        if (schemaPrepare !== null) {
            const sleeper = (0, utils_js_1.sleep)(dynamicOptions.schemaWaitTime);
            const schemaReadyPromise = Promise.race([schemaPrepare, sleeper.promise]);
            return schemaReadyPromise.then((schemaReady) => {
                sleeper.release();
                if (schemaReady !== true) {
                    // Handle missing schema
                    throw new Error(`Schema isn't ready`);
                }
                return {
                    schema: latestSchema,
                    parseAndValidate: latestParseAndValidate,
                    resolvedPreset,
                    execute: grafast_1.execute,
                    subscribe: grafast_1.subscribe,
                    contextValue: Object.create(null),
                };
            });
        }
        /*
      if (schemaOrPromise == null) {
        const err = Promise.reject(
          new GraphQLError(
            "The schema is currently unavailable",
            null,
            null,
            null,
            null,
            null,
            {
              statusCode: 503,
            },
          ),
        );
        return () => err;
      }
        */
        return {
            schema: latestSchema,
            parseAndValidate: latestParseAndValidate,
            resolvedPreset,
            execute: grafast_1.execute,
            subscribe: grafast_1.subscribe,
            contextValue: Object.create(null),
        };
    };
}
const END = Buffer.from("\r\n-----\r\n", "utf8");
const DIVIDE = Buffer.from(`\r\n---\r\nContent-Type: application/json\r\n\r\n`, "utf8");
function convertHandlerResultToResult(handlerResult) {
    if (handlerResult === null) {
        return null;
    }
    switch (handlerResult.type) {
        case "graphql": {
            const { payload, statusCode = 200, contentType, outputDataAsString, dynamicOptions, request: { preferJSON }, } = handlerResult;
            (0, utils_js_1.handleErrors)(payload);
            const headers = Object.create(null);
            headers["Content-Type"] = contentType;
            if (dynamicOptions.watch) {
                headers["X-GraphQL-Event-Stream"] = dynamicOptions.eventStreamPath;
            }
            if (preferJSON && !outputDataAsString) {
                return {
                    type: "json",
                    statusCode,
                    headers,
                    json: payload,
                };
            }
            else {
                const buffer = Buffer.from((0, grafast_1.stringifyPayload)(payload, outputDataAsString), "utf8");
                headers["Content-Length"] = buffer.length;
                return {
                    type: "buffer",
                    statusCode,
                    headers,
                    buffer,
                };
            }
        }
        case "graphqlIncremental": {
            const { iterator, statusCode = 200, outputDataAsString, dynamicOptions, } = handlerResult;
            const headers = Object.create(null);
            (headers["Content-Type"] = 'multipart/mixed; boundary="-"'),
                (headers["Transfer-Encoding"] = "chunked");
            if (dynamicOptions.watch) {
                headers["X-GraphQL-Event-Stream"] = dynamicOptions.eventStreamPath;
            }
            const bufferIterator = (0, mapIterator_js_1.mapIterator)(iterator, (payload) => {
                (0, utils_js_1.handleErrors)(payload);
                const payloadBuffer = Buffer.from((0, grafast_1.stringifyPayload)(payload, outputDataAsString), "utf8");
                return Buffer.concat([DIVIDE, payloadBuffer]);
            }, () => {
                return END;
            });
            return {
                type: "bufferStream",
                headers,
                statusCode,
                lowLatency: true,
                bufferIterator,
            };
        }
        case "text":
        case "html": {
            const { payload, statusCode = 200 } = handlerResult;
            const headers = Object.create(null);
            if (handlerResult.type === "html") {
                headers["Content-Type"] = "text/html; charset=utf-8";
            }
            else {
                headers["Content-Type"] = "text/plain; charset=utf-8";
            }
            headers["Content-Length"] = payload.length;
            return {
                type: "buffer",
                statusCode,
                headers,
                buffer: payload,
            };
        }
        case "noContent": {
            const { statusCode = 204 } = handlerResult;
            const headers = Object.create(null);
            return {
                type: "noContent",
                statusCode,
                headers,
            };
        }
        case "event-stream": {
            const { payload: stream, statusCode = 200, request: { httpVersionMajor }, } = handlerResult;
            // Making sure these options are set.
            // Set headers for Server-Sent Events.
            const headers = Object.create(null);
            // Don't buffer EventStream in nginx
            headers["X-Accel-Buffering"] = "no";
            headers["Content-Type"] = "text/event-stream";
            headers["Cache-Control"] = "no-cache, no-transform";
            if (httpVersionMajor >= 2) {
                // NOOP
            }
            else {
                headers["Connection"] = "keep-alive";
            }
            // Creates a stream for the response
            const event2buffer = (event) => {
                let payload = "";
                if (event.event !== undefined) {
                    payload += `event: ${event.event}\n`;
                }
                if (event.id !== undefined) {
                    payload += `id: ${event.id}\n`;
                }
                if (event.retry !== undefined) {
                    payload += `retry: ${event.retry}\n`;
                }
                if (event.data != null) {
                    payload += `data: ${event.data.replace(/\n/g, "\ndata: ")}\n`;
                }
                payload += "\n";
                return Buffer.from(payload, "utf8");
            };
            const bufferIterator = (0, mapIterator_js_1.mapIterator)(stream, event2buffer, undefined, () => event2buffer({ event: "open" }));
            return {
                type: "bufferStream",
                statusCode,
                headers,
                lowLatency: true,
                bufferIterator,
            };
        }
        default: {
            const never = handlerResult;
            console.error(`Did not understand '${never}' passed to convertHandlerResultToResult`);
            const payload = Buffer.from("Unexpected input to convertHandlerResultToResult", "utf8");
            const headers = Object.create(null);
            headers["Content-Type"] = "text/plain; charset=utf-8";
            headers["Content-Length"] = payload.length;
            return {
                type: "buffer",
                statusCode: 500,
                headers,
                buffer: payload,
            };
        }
    }
}
const convertErrorToErrorResult = (error) => {
    // TODO: need to assert `error` is not a GraphQLError, that should be handled elsewhere.
    const statusCode = error.statusCode ?? 500;
    return {
        type: "error",
        statusCode,
        headers: Object.create(null),
        error,
    };
};
exports.convertErrorToErrorResult = convertErrorToErrorResult;
function dangerousCorsWrap(result) {
    if (result === null) {
        return result;
    }
    result.headers["Access-Control-Allow-Origin"] = "*";
    result.headers["Access-Control-Allow-Headers"] = "*";
    return result;
}
function optionsResponse(request, dynamicOptions) {
    return {
        type: "noContent",
        request,
        dynamicOptions: dynamicOptions,
        statusCode: 204,
    };
}
function processRequestWithEvent(event) {
    const { requestDigest: request, instance } = event;
    let returnValue;
    try {
        const result = instance._processRequest(request);
        if ((0, grafast_1.isPromiseLike)(result)) {
            returnValue = result.then(convertHandlerResultToResult, exports.convertErrorToErrorResult);
        }
        else {
            returnValue = convertHandlerResultToResult(result);
        }
    }
    catch (e) {
        returnValue = (0, exports.convertErrorToErrorResult)(e);
    }
    if (instance.resolvedPreset.grafserv?.dangerouslyAllowAllCORSRequests) {
        if ((0, grafast_1.isPromiseLike)(returnValue)) {
            return returnValue.then(dangerousCorsWrap);
        }
        else {
            return dangerousCorsWrap(returnValue);
        }
    }
    else {
        return returnValue;
    }
}
//# sourceMappingURL=base.js.map