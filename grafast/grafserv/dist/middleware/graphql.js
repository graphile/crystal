"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGraphQLHandler = exports.TEXT_HTML = exports.APPLICATION_GRAPHQL_RESPONSE_JSON = exports.APPLICATION_JSON = exports.DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES = void 0;
exports.makeParseAndValidateFunction = makeParseAndValidateFunction;
exports.validateGraphQLBody = validateGraphQLBody;
const tslib_1 = require("tslib");
const node_querystring_1 = require("node:querystring");
const lru_1 = require("@graphile/lru");
const crypto_1 = require("crypto");
const grafast_1 = require("grafast");
const graphql = tslib_1.__importStar(require("grafast/graphql"));
const accept_js_1 = require("../accept.js");
const interfaces_js_1 = require("../interfaces.js");
const utils_js_1 = require("../utils.js");
const { getOperationAST, GraphQLError, parse, Source, validate } = graphql;
let lastString;
let lastHash;
const calculateQueryHash = (queryString) => {
    if (queryString !== lastString) {
        lastString = queryString;
        lastHash = (0, crypto_1.createHash)("sha1").update(queryString).digest("base64");
    }
    return lastHash;
};
function makeParseAndValidateFunction(schema, resolvedPreset, dynamicOptions) {
    const maxLength = resolvedPreset.grafserv?.parseAndValidateCacheSize ?? 500;
    const parseAndValidationCache = maxLength >= 1
        ? new lru_1.LRU({
            maxLength,
        })
        : null;
    let lastParseAndValidateQuery;
    let lastParseAndValidateResult;
    function parseAndValidate(query) {
        if (lastParseAndValidateQuery === query) {
            return lastParseAndValidateResult;
        }
        const hash = query.length > 500 ? calculateQueryHash(query) : query;
        const cached = parseAndValidationCache?.get(hash);
        if (cached !== undefined) {
            lastParseAndValidateQuery = query;
            lastParseAndValidateResult = cached;
            return cached;
        }
        const source = new Source(query, "GraphQL HTTP Request");
        let document;
        try {
            document = parse(source);
        }
        catch (e) {
            const result = { errors: [e] };
            parseAndValidationCache?.set(hash, result);
            lastParseAndValidateQuery = query;
            lastParseAndValidateResult = result;
            return result;
        }
        const errors = validate(schema, document, dynamicOptions.validationRules);
        const result = errors.length
            ? { errors }
            : { document };
        parseAndValidationCache?.set(hash, result);
        lastParseAndValidateQuery = query;
        lastParseAndValidateResult = result;
        return result;
    }
    return parseAndValidate;
}
function parseGraphQLQueryParams(params) {
    const id = params.id;
    const documentId = params.documentId;
    const query = params.query;
    const operationName = params.operationName ?? undefined;
    const variablesString = params.variables ?? undefined;
    const variableValues = typeof variablesString === "string"
        ? JSON.parse(variablesString)
        : undefined;
    const extensionsString = params.extensions ?? undefined;
    const extensions = typeof extensionsString === "string"
        ? JSON.parse(extensionsString)
        : undefined;
    return {
        id,
        documentId,
        query,
        operationName,
        variableValues,
        extensions,
    };
}
/**
 * The default allowed request content types do not include
 * `application/x-www-form-urlencoded` because that is treated specially by
 * browsers (e.g. it can be submitted cross origins without CORS).
 *
 * If you're using CORS then no media type is CSRF safe - it's up to you to
 * manage your CSRF protection.
 */
exports.DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES = Object.freeze([
    "application/json",
    "application/graphql",
    // CSRF risk:
    // "application/x-www-form-urlencoded",
    // Not supported, AND CSRF risk:
    // 'multipart/form-data'
]);
function parseGraphQLBody(resolvedPreset, request, body) {
    const supportedContentTypes = resolvedPreset.grafserv?.allowedRequestContentTypes ??
        exports.DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES;
    const contentType = request[interfaces_js_1.$$normalizedHeaders]["content-type"];
    if (!contentType) {
        throw (0, utils_js_1.httpError)(400, "Could not determine the Content-Type of the request");
    }
    const semi = contentType.indexOf(";");
    const rawContentType = semi >= 0 ? contentType.slice(0, semi).trim() : contentType.trim();
    if (!supportedContentTypes.includes(rawContentType)) {
        throw (0, utils_js_1.httpError)(415, `Media type '${rawContentType}' is not allowed`);
    }
    const ct = rawContentType;
    // FIXME: we should probably at least look at the parameters... e.g. throw if encoding !== utf-8
    switch (ct) {
        case "application/json": {
            switch (body.type) {
                case "buffer": {
                    return (0, utils_js_1.parseGraphQLJSONBody)(JSON.parse(body.buffer.toString("utf8")));
                }
                case "text": {
                    return (0, utils_js_1.parseGraphQLJSONBody)(JSON.parse(body.text));
                }
                case "json": {
                    return (0, utils_js_1.parseGraphQLJSONBody)(body.json);
                }
                default: {
                    const never = body;
                    throw (0, utils_js_1.httpError)(400, `Do not understand type ${never.type}`);
                }
            }
        }
        case "application/x-www-form-urlencoded": {
            switch (body.type) {
                case "buffer": {
                    return parseGraphQLQueryParams((0, node_querystring_1.parse)(body.buffer.toString("utf8")));
                }
                case "text": {
                    return parseGraphQLQueryParams((0, node_querystring_1.parse)(body.text));
                }
                case "json": {
                    if (body.json == null ||
                        typeof body.json !== "object" ||
                        Array.isArray(body.json)) {
                        throw (0, utils_js_1.httpError)(400, `Invalid body`);
                    }
                    return parseGraphQLQueryParams(body.json);
                }
                default: {
                    const never = body;
                    throw (0, utils_js_1.httpError)(400, `Do not understand type ${never.type}`);
                }
            }
        }
        case "application/graphql": {
            // ENHANCE: I have a vague feeling that people that do this pass variables via the query string?
            switch (body.type) {
                case "text": {
                    return {
                        id: undefined,
                        documentId: undefined,
                        query: body.text,
                        operationName: undefined,
                        variableValues: undefined,
                        extensions: undefined,
                    };
                }
                case "buffer": {
                    return {
                        id: undefined,
                        documentId: undefined,
                        query: body.buffer.toString("utf8"),
                        operationName: undefined,
                        variableValues: undefined,
                        extensions: undefined,
                    };
                }
                case "json": {
                    // ERRORS: non-standard; perhaps raise a warning?
                    return (0, utils_js_1.parseGraphQLJSONBody)(body.json);
                }
                default: {
                    const never = body;
                    throw (0, utils_js_1.httpError)(400, `Do not understand type ${never.type}`);
                }
            }
        }
        default: {
            const never = ct;
            throw (0, utils_js_1.httpError)(415, `Media type '${never}' is not understood`);
        }
    }
}
exports.APPLICATION_JSON = "application/json;charset=utf-8";
exports.APPLICATION_GRAPHQL_RESPONSE_JSON = "application/graphql-response+json;charset=utf-8";
exports.TEXT_HTML = "text/html;charset=utf-8";
/** https://graphql.github.io/graphql-over-http/draft/#sec-Legacy-Watershed */
const isAfterWatershed = Date.now() >= +new Date(2025, 0, 1);
const GRAPHQL_TYPES = isAfterWatershed
    ? [exports.APPLICATION_GRAPHQL_RESPONSE_JSON, exports.APPLICATION_JSON]
    : [exports.APPLICATION_JSON, exports.APPLICATION_GRAPHQL_RESPONSE_JSON];
const graphqlAcceptMatcher = (0, accept_js_1.makeAcceptMatcher)([...GRAPHQL_TYPES]);
const graphqlOrHTMLAcceptMatcher = (0, accept_js_1.makeAcceptMatcher)([
    ...GRAPHQL_TYPES,
    // Must be lowest priority, otherwise GraphiQL may override GraphQL in some
    // situations
    exports.TEXT_HTML,
]);
function validateGraphQLBody(parsed) {
    const { query, operationName, variableValues, extensions } = parsed;
    if (typeof query !== "string") {
        throw (0, utils_js_1.httpError)(400, "query must be a string");
    }
    if (operationName != null && typeof operationName !== "string") {
        throw (0, utils_js_1.httpError)(400, "operationName, if given, must be a string");
    }
    if (variableValues != null &&
        (typeof variableValues !== "object" || Array.isArray(variableValues))) {
        throw (0, utils_js_1.httpError)(400, "Invalid variables; expected JSON-encoded object");
    }
    if (extensions != null &&
        (typeof extensions !== "object" || Array.isArray(extensions))) {
        throw (0, utils_js_1.httpError)(400, "Invalid extensions; expected JSON-encoded object");
    }
    return parsed;
}
const _makeGraphQLHandlerInternal = (instance) => {
    const { dynamicOptions, resolvedPreset, middleware, grafastMiddleware } = instance;
    return async (request, graphiqlHandler) => {
        const accept = request[interfaces_js_1.$$normalizedHeaders].accept;
        // Do they want HTML, or do they want GraphQL?
        const chosenContentType = request.method === "GET" &&
            dynamicOptions.graphiqlOnGraphQLGET &&
            graphiqlHandler
            ? graphqlOrHTMLAcceptMatcher(accept)
            : graphqlAcceptMatcher(accept);
        if (chosenContentType === exports.TEXT_HTML) {
            // They want HTML -> Ruru
            return graphiqlHandler(request);
        }
        else if (chosenContentType === exports.APPLICATION_JSON ||
            chosenContentType === exports.APPLICATION_GRAPHQL_RESPONSE_JSON) {
            // They want GraphQL
            if (request.method === "POST" ||
                (dynamicOptions.graphqlOverGET && request.method === "GET")) {
                /* continue */
            }
            else {
                return {
                    type: "graphql",
                    request,
                    dynamicOptions,
                    statusCode: 405,
                    contentType: "application/json",
                    payload: {
                        errors: [new GraphQLError("Method not supported, please use POST")],
                    },
                };
            }
        }
        else {
            // > Respond with a 406 Not Acceptable status code and stop processing the request.
            // https://graphql.github.io/graphql-over-http/draft/#sel-DANHELDAACNA4rR
            return {
                type: "graphql",
                request,
                dynamicOptions,
                statusCode: 406,
                contentType: "application/json",
                payload: {
                    errors: [
                        new GraphQLError("Could not find a supported media type; consider adding 'application/json' or 'application/graphql-response+json' to your Accept header."),
                    ],
                },
            };
        }
        // If we get here, we're handling a GraphQL request
        const isLegacy = chosenContentType === exports.APPLICATION_JSON;
        let body;
        try {
            // Read the body
            const parsedBody = request.method === "POST"
                ? parseGraphQLBody(resolvedPreset, request, await request.getBody())
                : parseGraphQLQueryParams(await request.getQueryParams());
            // Apply our middleware (if any) to the body (they will mutate the body in place)
            if (middleware != null &&
                middleware.middleware.processGraphQLRequestBody != null) {
                const hookResult = middleware.run("processGraphQLRequestBody", {
                    resolvedPreset,
                    body: parsedBody,
                    request,
                }, utils_js_1.noop);
                if (hookResult != null) {
                    await hookResult;
                }
            }
            // Validate that the body is of the right shape
            body = validateGraphQLBody(parsedBody);
        }
        catch (e) {
            if (e instanceof grafast_1.SafeError) {
                throw e;
            }
            else if (typeof e.statusCode === "number" &&
                e.statusCode >= 400 &&
                e.statusCode < 600) {
                throw e;
            }
            else {
                // ENHANCE: should maybe handle more specific issues here. See examples:
                // https://graphql.github.io/graphql-over-http/draft/#sec-application-json.Examples
                throw (0, utils_js_1.httpError)(400, `Parsing failed, please check that the data you're sending to the server is correct`);
            }
        }
        const grafastCtx = {
            ...request.requestContext,
            http: request,
        };
        const { schema, parseAndValidate, execute, 
        // subscribe,
        contextValue,
        // dynamicOptions?
         } = await instance.getExecutionConfig(grafastCtx);
        const outputDataAsString = dynamicOptions.outputDataAsString;
        const { maskIterator, maskPayload, maskError } = dynamicOptions;
        const { query, operationName, variableValues } = body;
        const { errors, document } = parseAndValidate(query);
        if (errors !== undefined) {
            return {
                type: "graphql",
                request,
                dynamicOptions,
                statusCode: isLegacy ? 200 : 400,
                contentType: chosenContentType,
                payload: { errors },
            };
        }
        if (request.method !== "POST") {
            // Forbid mutation
            const operation = getOperationAST(document, operationName);
            if (!operation || operation.operation !== "query") {
                const error = new GraphQLError("Only queries may take place over non-POST requests.", operation);
                return {
                    type: "graphql",
                    request,
                    dynamicOptions,
                    // Note: the GraphQL-over-HTTP spec currently mandates 405, even for legacy clients:
                    // https://graphql.github.io/graphql-over-http/draft/#sel-FALJRPCE2BCGoBitR
                    statusCode: 405,
                    contentType: chosenContentType,
                    payload: {
                        errors: [error],
                    },
                };
            }
        }
        const args = {
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
        try {
            await (0, grafast_1.hookArgs)(args);
            const result = await execute(args);
            if ((0, grafast_1.isAsyncIterable)(result)) {
                return {
                    type: "graphqlIncremental",
                    request,
                    dynamicOptions,
                    statusCode: 200,
                    iterator: maskIterator(result),
                    outputDataAsString,
                };
            }
            return {
                type: "graphql",
                request,
                dynamicOptions,
                statusCode: isLegacy || !result.errors
                    ? 200
                    : result.data === undefined
                        ? 400
                        : 200,
                contentType: chosenContentType,
                payload: maskPayload(result),
                outputDataAsString,
            };
        }
        catch (e) {
            console.error(e);
            return {
                type: "graphql",
                request,
                dynamicOptions,
                // e.g. We should always return 400 on no Content-Type header:
                // https://graphql.github.io/graphql-over-http/draft/#sel-DALLDJAADLCA8tb
                statusCode: e.statusCode ?? (isLegacy ? 200 : 500),
                contentType: chosenContentType,
                payload: {
                    errors: [maskError(new GraphQLError(e.message))],
                    extensions: args.rootValue?.[grafast_1.$$extensions],
                },
            };
        }
    };
};
const makeGraphQLHandler = (instance) => {
    const handler = _makeGraphQLHandlerInternal(instance);
    const { dynamicOptions } = instance;
    return (request, graphiqlHandler) => handler(request, graphiqlHandler).catch((e) => handleGraphQLHandlerError(request, dynamicOptions, e));
};
exports.makeGraphQLHandler = makeGraphQLHandler;
function handleGraphQLHandlerError(request, dynamicOptions, e) {
    if (e instanceof grafast_1.SafeError) {
        return {
            type: "graphql",
            request,
            dynamicOptions,
            payload: {
                errors: [
                    new GraphQLError(e.message, null, null, null, null, e, e.extensions),
                ],
            },
            statusCode: e.extensions?.statusCode ?? 500,
            // FIXME: we should respect the `accept` header here if we can.
            contentType: exports.APPLICATION_JSON,
        };
    }
    // TODO: if a GraphQLError is thrown... WTF?
    const graphqlError = e instanceof GraphQLError
        ? e
        : new GraphQLError("Unknown error occurred", null, null, null, null, e);
    // Special error handling for GraphQL route
    console.error("An error occurred whilst attempting to handle the GraphQL request:");
    console.dir(e);
    return {
        type: "graphql",
        request,
        dynamicOptions,
        payload: { errors: [graphqlError] },
        statusCode: graphqlError.extensions?.statusCode ?? 500,
        // Fall back to application/json; this is when an unexpected error happens
        // so it shouldn't be hit.
        contentType: exports.APPLICATION_JSON,
    };
}
//# sourceMappingURL=graphql.js.map