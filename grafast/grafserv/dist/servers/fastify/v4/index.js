"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastifyGrafserv = void 0;
exports.grafserv = grafserv;
const node_stream_1 = require("node:stream");
const websocket_1 = require("graphql-ws/lib/use/@fastify/websocket");
const base_js_1 = require("../../../core/base.js");
const utils_js_1 = require("../../../utils.js");
function getDigest(request, reply) {
    return {
        httpVersionMajor: request.raw.httpVersionMajor,
        httpVersionMinor: request.raw.httpVersionMinor,
        // Fastify respects X-Forwarded-Proto when configured to trust the proxy, see:
        // https://github.com/fastify/fastify/blob/59c5b273dad30821d03c952bbe073a976f92a325/docs/Reference/Server.md#trustproxy
        isSecure: request.protocol === "https",
        method: request.method,
        path: request.url,
        headers: (0, utils_js_1.processHeaders)(request.headers),
        getQueryParams() {
            return request.query;
        },
        getBody() {
            return (0, utils_js_1.getBodyFromFrameworkBody)(request.body);
        },
        requestContext: {
            node: {
                req: request.raw,
                res: reply.raw,
            },
            fastifyv4: {
                request,
                reply,
            },
        },
        preferJSON: true,
    };
}
class FastifyGrafserv extends base_js_1.GrafservBase {
    constructor(config) {
        super(config);
    }
    async send(request, reply, result) {
        if (result === null) {
            // 404
            reply.statusCode = 404;
            return "¯\\_(ツ)_/¯";
        }
        switch (result.type) {
            case "error": {
                const { statusCode, headers } = result;
                reply.headers(headers);
                reply.statusCode = statusCode;
                // DEBT: mutating the error is probably bad form...
                const errorWithStatus = Object.assign(result.error, {
                    status: statusCode,
                });
                throw errorWithStatus;
            }
            case "buffer": {
                const { statusCode, headers, buffer } = result;
                reply.headers(headers);
                reply.statusCode = statusCode;
                return buffer;
            }
            case "json": {
                const { statusCode, headers, json } = result;
                reply.headers(headers);
                reply.statusCode = statusCode;
                return json;
            }
            case "noContent": {
                const { statusCode, headers } = result;
                reply.headers(headers);
                reply.statusCode = statusCode;
                return null;
            }
            case "bufferStream": {
                const { statusCode, headers, lowLatency, bufferIterator } = result;
                let bufferIteratorHandled = false;
                try {
                    if (lowLatency) {
                        request.raw.socket.setTimeout(0);
                        request.raw.socket.setNoDelay(true);
                        request.raw.socket.setKeepAlive(true);
                    }
                    reply.headers(headers);
                    reply.statusCode = statusCode;
                    const stream = new node_stream_1.PassThrough();
                    reply.send(stream);
                    // Fork off and convert bufferIterator to
                    try {
                        bufferIteratorHandled = true;
                        for await (const buffer of bufferIterator) {
                            stream.write(buffer);
                        }
                    }
                    finally {
                        stream.end();
                    }
                }
                catch (e) {
                    if (!bufferIteratorHandled) {
                        try {
                            if (bufferIterator.return) {
                                bufferIterator.return();
                            }
                            else if (bufferIterator.throw) {
                                bufferIterator.throw(e);
                            }
                        }
                        catch (e2) {
                            /* nom nom nom */
                        }
                    }
                    throw e;
                }
                return reply;
            }
            default: {
                const never = result;
                console.log("Unhandled:");
                console.dir(never);
                reply.type("text/plain");
                reply.statusCode = 501;
                return "Server hasn't implemented this yet";
            }
        }
    }
    async addTo(app) {
        // application/graphql-request+json isn't currently an official serialization format:
        // https://graphql.github.io/graphql-over-http/draft/#sec-Media-Types
        /*
        app.addContentTypeParser(
          "application/graphql-request+json",
          { parseAs: "string" },
          app.getDefaultJsonParser("ignore", "ignore"),
        );
        */
        const { graphiql, graphiqlOnGraphQLGET, graphqlPath, graphiqlPath, graphqlOverGET, maxRequestLength: bodyLimit, watch, } = this.dynamicOptions;
        const websockets = this.resolvedPreset.grafserv?.websockets ?? false;
        const exposeGetRoute = graphqlOverGET || graphiqlOnGraphQLGET || websockets;
        const exposeHeadRoute = true;
        // Build HTTP handler.
        const handler = async (request, reply) => {
            const digest = getDigest(request, reply);
            const handlerResult = await this.graphqlHandler((0, utils_js_1.normalizeRequest)(digest), this.graphiqlHandler);
            const result = await (0, base_js_1.convertHandlerResultToResult)(handlerResult);
            return this.send(request, reply, result);
        };
        // Build websocket handler.
        const wsHandler = websockets
            ? (0, websocket_1.makeHandler)((0, utils_js_1.makeGraphQLWSConfig)(this))
            : undefined;
        // Attach HTTP handler for POST requests.
        app.route({ method: "POST", url: graphqlPath, handler, bodyLimit });
        // Attach websocket and HTTP handler for GET requests, if desired.
        if (exposeGetRoute) {
            app.route({
                method: "GET",
                url: graphqlPath,
                exposeHeadRoute,
                handler,
                wsHandler,
            });
        }
        if (graphiql) {
            app.route({
                method: "GET",
                url: graphiqlPath,
                exposeHeadRoute,
                bodyLimit,
                handler: async (request, reply) => {
                    const digest = getDigest(request, reply);
                    const handlerResult = await this.graphiqlHandler((0, utils_js_1.normalizeRequest)(digest));
                    const result = await (0, base_js_1.convertHandlerResultToResult)(handlerResult);
                    return this.send(request, reply, result);
                },
            });
        }
        if (watch) {
            app.route({
                method: "GET",
                url: this.dynamicOptions.eventStreamPath,
                exposeHeadRoute: true,
                bodyLimit: this.dynamicOptions.maxRequestLength,
                handler: async (request, reply) => {
                    const digest = getDigest(request, reply);
                    // TODO: refactor this to use the eventStreamHandler once we write that...
                    const handlerResult = {
                        type: "event-stream",
                        request: (0, utils_js_1.normalizeRequest)(digest),
                        dynamicOptions: this.dynamicOptions,
                        payload: this.makeStream(),
                        statusCode: 200,
                    };
                    const result = await (0, base_js_1.convertHandlerResultToResult)(handlerResult);
                    return this.send(request, reply, result);
                },
            });
        }
    }
}
exports.FastifyGrafserv = FastifyGrafserv;
function grafserv(config) {
    return new FastifyGrafserv(config);
}
//# sourceMappingURL=index.js.map