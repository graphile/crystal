"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
exports.handleErrors = handleErrors;
exports.processHeaders = processHeaders;
exports.getBodyFromRequest = getBodyFromRequest;
exports.getBodyFromFrameworkBody = getBodyFromFrameworkBody;
exports.memo = memo;
exports.normalizeRequest = normalizeRequest;
exports.httpError = httpError;
exports.normalizeConnectionParams = normalizeConnectionParams;
exports.makeGraphQLWSConfig = makeGraphQLWSConfig;
exports.parseGraphQLJSONBody = parseGraphQLJSONBody;
exports.concatBufferIterator = concatBufferIterator;
exports.noop = noop;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const graphql = tslib_1.__importStar(require("grafast/graphql"));
const interfaces_js_1 = require("./interfaces.js");
const graphql_js_1 = require("./middleware/graphql.js");
const { GraphQLError } = graphql;
const sleep = (ms) => {
    let _timeout;
    return {
        promise: new Promise((resolve) => void (_timeout = setTimeout(resolve, ms))),
        release() {
            clearTimeout(_timeout);
        },
    };
};
exports.sleep = sleep;
// TODO: remove this ANSI-removal hack!
function handleErrors(payload) {
    if (payload.errors !== undefined) {
        payload.errors = payload.errors.map((e) => {
            const obj = e instanceof GraphQLError
                ? e.toJSON()
                : { message: e.message, ...e };
            return {
                ...obj,
                message: (0, grafast_1.stripAnsi)(obj.message),
                ...(e instanceof GraphQLError
                    ? {
                        extensions: {
                            ...e.extensions,
                            ...(typeof e.extensions.stack === "string"
                                ? { stack: (0, grafast_1.stripAnsi)(e.extensions.stack) }
                                : null),
                            ...(typeof e.extensions.cause === "string"
                                ? { cause: (0, grafast_1.stripAnsi)(e.extensions.cause) }
                                : null),
                        },
                    }
                    : null),
            };
        });
    }
}
function processHeaders(headers) {
    const headerDigest = Object.create(null);
    for (const key in headers) {
        const val = headers[key];
        if (val == null) {
            continue;
        }
        if (typeof val === "string") {
            headerDigest[key] = val;
        }
        else {
            headerDigest[key] = val.join("\n");
        }
    }
    return headerDigest;
}
function getBodyFromRequest(req /* IncomingMessage */, maxLength) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let len = 0;
        const handleData = (chunk) => {
            chunks.push(chunk);
            len += chunk.length;
            if (len > maxLength) {
                req.off("end", done);
                req.off("error", reject);
                req.off("data", handleData);
                reject(httpError(413, "Too much data"));
            }
        };
        const done = () => {
            resolve({ type: "buffer", buffer: Buffer.concat(chunks) });
        };
        req.on("end", done);
        req.on("error", reject);
        req.on("data", handleData);
    });
}
/**
 * Using this is a hack, it sniffs the data and tries to determine the type.
 * Really you should ask your framework of choice what type of data it has given
 * you.
 */
function getBodyFromFrameworkBody(body) {
    if (typeof body === "string") {
        return {
            type: "text",
            text: body,
        };
    }
    else if (Buffer.isBuffer(body)) {
        return {
            type: "buffer",
            buffer: body,
        };
    }
    else if (typeof body === "object" && body != null) {
        return {
            type: "json",
            json: body,
        };
    }
    else {
        throw new Error(`Grafserv adaptor doesn't know how to interpret this request body`);
    }
}
function memo(fn) {
    let cache;
    let called = false;
    return function memoized() {
        if (called) {
            return cache;
        }
        else {
            called = true;
            cache = fn.call(this);
            return cache;
        }
    };
}
function normalizeRequest(request) {
    if (!request[interfaces_js_1.$$normalizedHeaders]) {
        const r = request;
        const normalized = Object.create(null);
        for (const key in r.headers) {
            normalized[key.toLowerCase()] = r.headers[key];
        }
        r[interfaces_js_1.$$normalizedHeaders] = normalized;
        r.preferJSON = Boolean(r.preferJSON);
        r.getHeader = (key) => normalized[key.toLowerCase()];
        r.getBody = memo(r.getBody);
        r.getQueryParams = memo(r.getQueryParams);
        if (r.method === "HEAD") {
            // Pretend that 'HEAD' requests are actually 'GET' requests; Node will
            // take care of stripping the response body for us.
            r.method = "GET";
        }
    }
    return request;
}
function httpError(statusCode, message) {
    return new grafast_1.SafeError(message, { statusCode });
}
function coerceHeaderValue(rawValue) {
    if (rawValue == null)
        return undefined;
    if (typeof rawValue === "string")
        return rawValue;
    if (typeof rawValue === "number")
        return String(rawValue);
    if (typeof rawValue === "boolean")
        return String(rawValue);
    if (Array.isArray(rawValue) && rawValue.every((v) => typeof v === "string")) {
        return rawValue;
    }
    // Strip unsupported values
    return undefined;
}
function normalizeConnectionParams(connectionParams) {
    if (typeof connectionParams !== "object" ||
        connectionParams === null ||
        Array.isArray(connectionParams)) {
        return undefined;
    }
    const headers = Object.create(null);
    for (const [rawKey, rawValue] of Object.entries(connectionParams)) {
        if (typeof rawKey !== "string")
            continue;
        const key = rawKey.toLowerCase();
        const value = coerceHeaderValue(rawValue);
        if (value == null)
            continue;
        if (headers[key] != null) {
            const prev = headers[key];
            if (Array.isArray(prev)) {
                if (Array.isArray(value)) {
                    headers[key] = [...prev, ...value];
                }
                else {
                    headers[key] = [...prev, value];
                }
            }
            else {
                if (Array.isArray(value)) {
                    headers[key] = [prev, ...value];
                }
                else {
                    headers[key] = [prev, value];
                }
            }
        }
        else {
            headers[key] = value;
        }
    }
    return headers;
}
function makeGraphQLWSConfig(instance) {
    async function onSubscribeWithEvent({ ctx, message }) {
        try {
            const grafastCtx = {
                ws: {
                    request: ctx.extra.request,
                    socket: ctx.extra.socket,
                    connectionParams: ctx.connectionParams,
                    normalizedConnectionParams: normalizeConnectionParams(ctx.connectionParams),
                },
            };
            const { grafastMiddleware } = instance;
            const { schema, parseAndValidate, resolvedPreset, execute, subscribe, contextValue, } = await instance.getExecutionConfig(grafastCtx);
            const parsedBody = parseGraphQLJSONBody(message.payload);
            if (instance.middleware) {
                await instance.middleware.run("processGraphQLRequestBody", {
                    resolvedPreset,
                    body: parsedBody,
                    graphqlWsContext: ctx,
                }, noop);
            }
            const { query, operationName, variableValues } = (0, graphql_js_1.validateGraphQLBody)(parsedBody);
            const { errors, document } = parseAndValidate(query);
            if (errors !== undefined) {
                return errors;
            }
            const args = {
                execute,
                subscribe,
                schema,
                document,
                rootValue: null,
                contextValue,
                variableValues,
                operationName,
                resolvedPreset,
                requestContext: grafastCtx,
                middleware: grafastMiddleware,
            };
            await (0, grafast_1.hookArgs)(args);
            return args;
        }
        catch (e) {
            return [
                new GraphQLError(e.message, null, undefined, undefined, undefined, e, undefined),
            ];
        }
    }
    return {
        onSubscribe(ctx, message) {
            const event = {
                resolvedPreset: instance.resolvedPreset,
                ctx,
                message,
            };
            return instance.middleware != null
                ? instance.middleware.run("onSubscribe", event, onSubscribeWithEvent)
                : onSubscribeWithEvent(event);
        },
        // TODO: validate that this actually does mask every error
        // @ts-expect-error See: https://github.com/enisdenjo/graphql-ws/pull/599
        onError(_ctx, _message, errors) {
            return errors.map(instance.dynamicOptions.maskError);
        },
        async execute(args) {
            const eargs = args;
            return eargs.execute(eargs);
        },
        async subscribe(args) {
            const eargs = args;
            return eargs.subscribe(eargs);
        },
    };
}
function parseGraphQLJSONBody(params) {
    if (!params) {
        throw httpError(400, "No body");
    }
    if (typeof params !== "object" || Array.isArray(params)) {
        throw httpError(400, "Invalid body; expected object");
    }
    const id = params.id;
    const documentId = params.documentId;
    const query = params.query;
    const operationName = params.operationName ?? undefined;
    const variableValues = params.variables ?? undefined;
    const extensions = params.extensions ?? undefined;
    return {
        id,
        documentId,
        query,
        operationName,
        variableValues,
        extensions,
    };
}
async function concatBufferIterator(bufferIterator) {
    const buffers = [];
    for await (const buffer of bufferIterator) {
        buffers.push(buffer);
    }
    return Buffer.concat(buffers);
}
function noop() { }
//# sourceMappingURL=utils.js.map