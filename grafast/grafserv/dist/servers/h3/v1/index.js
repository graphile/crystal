"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.H3Grafserv = void 0;
exports.grafserv = grafserv;
const node_stream_1 = require("node:stream");
const graphql_ws_1 = require("graphql-ws");
const h3_1 = require("h3");
const index_js_1 = require("../../../index.js");
function getDigest(event) {
    const req = event.node.req;
    const res = event.node.res;
    return {
        httpVersionMajor: req.httpVersionMajor,
        httpVersionMinor: req.httpVersionMinor,
        isSecure: (0, h3_1.getRequestProtocol)(event) === "https",
        method: event.method,
        path: event.path,
        headers: (0, index_js_1.processHeaders)((0, h3_1.getRequestHeaders)(event)),
        getQueryParams() {
            return (0, h3_1.getQuery)(event);
        },
        async getBody() {
            const buffer = await (0, h3_1.readRawBody)(event, false);
            if (!buffer) {
                throw new Error("Failed to retrieve body from h3");
            }
            return {
                type: "buffer",
                buffer,
            };
        },
        requestContext: {
            h3v1: {
                event,
            },
            node: {
                req,
                res,
            },
        },
    };
}
class H3Grafserv extends index_js_1.GrafservBase {
    constructor(config) {
        super(config);
    }
    /**
     * @deprecated use handleGraphQLEvent instead
     */
    async handleEvent(event) {
        return this.handleGraphQLEvent(event);
    }
    async handleGraphQLEvent(event) {
        const digest = getDigest(event);
        const handlerResult = await this.graphqlHandler((0, index_js_1.normalizeRequest)(digest), this.graphiqlHandler);
        const result = await (0, index_js_1.convertHandlerResultToResult)(handlerResult);
        return this.send(event, result);
    }
    async handleGraphiqlEvent(event) {
        const digest = getDigest(event);
        const handlerResult = await this.graphiqlHandler((0, index_js_1.normalizeRequest)(digest));
        const result = await (0, index_js_1.convertHandlerResultToResult)(handlerResult);
        return this.send(event, result);
    }
    async handleEventStreamEvent(event) {
        const digest = getDigest(event);
        const handlerResult = {
            type: "event-stream",
            request: (0, index_js_1.normalizeRequest)(digest),
            dynamicOptions: this.dynamicOptions,
            payload: this.makeStream(),
            statusCode: 200,
        };
        const result = await (0, index_js_1.convertHandlerResultToResult)(handlerResult);
        return this.send(event, result);
    }
    async send(event, result) {
        if (result === null) {
            // 404
            (0, h3_1.setResponseStatus)(event, 404);
            return "¯\\_(ツ)_/¯";
        }
        switch (result.type) {
            case "error": {
                const { statusCode, headers } = result;
                (0, h3_1.setResponseHeaders)(event, headers);
                (0, h3_1.setResponseStatus)(event, statusCode);
                // DEBT: mutating the error is probably bad form...
                const errorWithStatus = Object.assign(result.error, {
                    status: statusCode,
                });
                throw errorWithStatus;
            }
            case "buffer": {
                const { statusCode, headers, buffer } = result;
                (0, h3_1.setResponseHeaders)(event, headers);
                (0, h3_1.setResponseStatus)(event, statusCode);
                return buffer;
            }
            case "json": {
                const { statusCode, headers, json } = result;
                (0, h3_1.setResponseHeaders)(event, headers);
                (0, h3_1.setResponseStatus)(event, statusCode);
                return json;
            }
            case "noContent": {
                const { statusCode, headers } = result;
                (0, h3_1.setResponseHeaders)(event, headers);
                (0, h3_1.setResponseStatus)(event, statusCode);
                return null;
            }
            case "bufferStream": {
                const { statusCode, headers, lowLatency, bufferIterator } = result;
                let bufferIteratorHandled = false;
                try {
                    if (lowLatency) {
                        event.node.req.socket.setTimeout(0);
                        event.node.req.socket.setNoDelay(true);
                        event.node.req.socket.setKeepAlive(true);
                    }
                    (0, h3_1.setResponseHeaders)(event, headers);
                    (0, h3_1.setResponseStatus)(event, statusCode);
                    const stream = new node_stream_1.PassThrough();
                    (0, h3_1.sendStream)(event, stream).catch((e) => {
                        console.error("An error occured when streaming to h3:");
                        console.error(e);
                    });
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
                return;
            }
            default: {
                const never = result;
                console.log("Unhandled:");
                console.dir(never);
                (0, h3_1.setResponseHeader)(event, "Content-Type", "text/plain");
                (0, h3_1.setResponseStatus)(event, 501);
                return "Server hasn't implemented this yet";
            }
        }
    }
    async addTo(app) {
        const dynamicOptions = this.dynamicOptions;
        const router = (0, h3_1.createRouter)();
        app.use(router);
        router.use(this.dynamicOptions.graphqlPath, (0, h3_1.eventHandler)((event) => this.handleGraphQLEvent(event)), this.dynamicOptions.graphqlOverGET ||
            this.dynamicOptions.graphiqlOnGraphQLGET
            ? ["get", "post"]
            : ["post"]);
        if (this.resolvedPreset.grafserv?.websockets) {
            app.use(this.dynamicOptions.graphqlPath, (0, h3_1.defineWebSocketHandler)(this.makeWsHandler()));
        }
        if (dynamicOptions.graphiql) {
            router.get(this.dynamicOptions.graphiqlPath, (0, h3_1.eventHandler)((event) => this.handleGraphiqlEvent(event)));
        }
        if (dynamicOptions.watch) {
            router.get(this.dynamicOptions.eventStreamPath, (0, h3_1.eventHandler)((event) => this.handleEventStreamEvent(event)));
        }
    }
    makeWsHandler() {
        const graphqlWsServer = (0, graphql_ws_1.makeServer)((0, index_js_1.makeGraphQLWSConfig)(this));
        const clients = new Map();
        return {
            open(peer) {
                const client = {};
                clients.set(peer, client);
                const onClose = graphqlWsServer.opened({
                    protocol: peer.websocket.protocol ?? graphql_ws_1.GRAPHQL_TRANSPORT_WS_PROTOCOL, // will be validated
                    send(data) {
                        peer.send(data);
                    },
                    close(code, reason) {
                        peer.close(code, reason); // there are protocol standard closures
                    },
                    onMessage(cb) {
                        client.handleMessage = cb;
                    },
                }, { socket: peer.websocket, request: peer.request });
                client.closed = async (code, reason) => {
                    onClose(code, reason);
                };
            },
            message(peer, message) {
                clients.get(peer)?.handleMessage?.(message.text());
            },
            close(peer, details) {
                clients.get(peer)?.closed?.(details.code, details.reason);
                clients.delete(peer);
            },
            error(peer, _error) {
                clients.delete(peer);
            },
        };
    }
}
exports.H3Grafserv = H3Grafserv;
function grafserv(config) {
    return new H3Grafserv(config);
}
//# sourceMappingURL=index.js.map