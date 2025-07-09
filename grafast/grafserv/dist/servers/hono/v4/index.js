"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grafserv = exports.HonoGrafserv = void 0;
const graphql_ws_1 = require("graphql-ws");
const index_js_1 = require("../../../index.js");
function getDigest(ctx) {
    const req = ctx.req;
    return {
        httpVersionMajor: 1, // Hono uses Fetch API, which doesn't expose HTTP version
        httpVersionMinor: 1,
        isSecure: req.url.startsWith("https:"),
        method: req.method,
        path: req.path,
        headers: (0, index_js_1.processHeaders)(req.header()),
        getQueryParams() {
            return req.query();
        },
        async getBody() {
            const json = await req.json();
            if (!json) {
                throw new Error("Failed to retrieve body from hono");
            }
            return {
                type: "json",
                json,
            };
        },
        requestContext: {
            honov4: {
                ctx: ctx,
            },
        },
    };
}
class HonoGrafserv extends index_js_1.GrafservBase {
    constructor(config, upgradeWebSocket) {
        super(config);
        this.upgradeWebSocket = upgradeWebSocket;
    }
    makeWsHandler(upgradeWebSocket) {
        const graphqlWsServer = (0, graphql_ws_1.makeServer)((0, index_js_1.makeGraphQLWSConfig)(this));
        return upgradeWebSocket((c) => {
            let onMessage;
            let onClose;
            let isOpened = false;
            const initGraphqlServer = (ws) => {
                onClose = graphqlWsServer.opened({
                    protocol: ws.protocol ?? graphql_ws_1.GRAPHQL_TRANSPORT_WS_PROTOCOL,
                    send(data) {
                        ws.send(data);
                    },
                    close(code, reason) {
                        console.log("close", code, reason);
                        ws.close(code, reason);
                        isOpened = false;
                    },
                    onMessage(cb) {
                        onMessage = cb;
                    },
                }, { socket: ws, request: c.req });
                isOpened = true;
            };
            return {
                onOpen(evt, ws) {
                    initGraphqlServer(ws);
                },
                onMessage(evt, ws) {
                    // cloudflare workers don't support the open event
                    // so we initialize the server on the first message
                    if (!isOpened) {
                        initGraphqlServer(ws);
                    }
                    onMessage?.(evt.data);
                },
                onClose(evt) {
                    onClose?.(evt.code, evt.reason);
                },
                onError(evt) {
                    console.error("An error occured in the websocket:", evt);
                },
            };
        });
    }
    async handleGraphQLEvent(ctx) {
        const digest = getDigest(ctx);
        const handlerResult = await this.graphqlHandler((0, index_js_1.normalizeRequest)(digest), this.graphiqlHandler);
        const result = await (0, index_js_1.convertHandlerResultToResult)(handlerResult);
        return this.send(ctx, result);
    }
    async handleGraphiqlEvent(ctx) {
        const digest = getDigest(ctx);
        const handlerResult = await this.graphiqlHandler((0, index_js_1.normalizeRequest)(digest));
        const result = await (0, index_js_1.convertHandlerResultToResult)(handlerResult);
        return this.send(ctx, result);
    }
    async handleEventStreamEvent(ctx) {
        const digest = getDigest(ctx);
        const handlerResult = {
            type: "event-stream",
            request: (0, index_js_1.normalizeRequest)(digest),
            dynamicOptions: this.dynamicOptions,
            payload: this.makeStream(),
            statusCode: 200,
        };
        const result = await (0, index_js_1.convertHandlerResultToResult)(handlerResult);
        return this.send(ctx, result);
    }
    async send(ctx, result) {
        if (result === null) {
            // 404
            ctx.status(404);
            return ctx.text("¯\\_(ツ)_/¯");
        }
        switch (result.type) {
            case "error": {
                const { statusCode, headers } = result;
                this.setResponseHeaders(ctx, headers);
                ctx.status(statusCode);
                const errorWithStatus = Object.assign(result.error, {
                    status: statusCode,
                });
                throw errorWithStatus;
            }
            case "buffer": {
                const { statusCode, headers, buffer } = result;
                this.setResponseHeaders(ctx, headers);
                ctx.status(statusCode);
                return ctx.body(buffer);
            }
            case "json": {
                const { statusCode, headers, json } = result;
                this.setResponseHeaders(ctx, headers);
                ctx.status(statusCode);
                // @ts-expect-error Some issue with types causing "excessively deep and possibly infinite"
                return ctx.json(json);
            }
            case "noContent": {
                const { statusCode, headers } = result;
                this.setResponseHeaders(ctx, headers);
                ctx.status(statusCode);
                return ctx.body(null);
            }
            case "bufferStream": {
                // TODO : handle bufferStream?
                console.log("bufferStream is not handled yet");
                // Force the iterator to close
                const { bufferIterator } = result;
                if (bufferIterator.return) {
                    bufferIterator.return();
                }
                else if (bufferIterator.throw) {
                    bufferIterator.throw(new Error("Unimplemented"));
                }
                this.setResponseHeaders(ctx, { "Content-Type": "text/plain" });
                ctx.status(501);
                return ctx.text("Server hasn't implemented this yet");
            }
            default: {
                const never = result;
                console.log("Unhandled:");
                console.dir(never);
                this.setResponseHeaders(ctx, { "Content-Type": "text/plain" });
                ctx.status(501);
                return ctx.text("Server hasn't implemented this yet");
            }
        }
    }
    async addTo(app) {
        const dynamicOptions = this.dynamicOptions;
        if (this.resolvedPreset.grafserv?.websockets && !this.upgradeWebSocket) {
            throw new Error("grafserv.websockets is enabled but no upgradeWebSocket was provided");
        }
        if (!this.resolvedPreset.grafserv?.websockets && this.upgradeWebSocket) {
            console.warn("UpgradeWebSocket was provided but grafserv.websockets is disabled - websockets will not be activated");
        }
        app.post(this.dynamicOptions.graphqlPath, (c) => this.handleGraphQLEvent(c));
        const websocketHandler = this.resolvedPreset.grafserv?.websockets && this.upgradeWebSocket
            ? this.makeWsHandler(this.upgradeWebSocket)
            : undefined;
        const shouldServeGetHandler = this.dynamicOptions.graphqlOverGET ||
            this.dynamicOptions.graphiqlOnGraphQLGET ||
            websocketHandler;
        if (shouldServeGetHandler) {
            app.get(this.dynamicOptions.graphqlPath, (c, next) => {
                if (c.req.header("Upgrade") === "websocket" && websocketHandler) {
                    return websocketHandler(c, next);
                }
                return this.handleGraphQLEvent(c);
            });
        }
        if (dynamicOptions.graphiql) {
            app.get(this.dynamicOptions.graphiqlPath, (c) => this.handleGraphiqlEvent(c));
        }
        if (dynamicOptions.watch) {
            app.get(this.dynamicOptions.eventStreamPath, (c) => this.handleEventStreamEvent(c));
        }
    }
    setResponseHeaders(ctx, headers) {
        for (const key in headers) {
            ctx.header(key, headers[key]);
        }
    }
}
exports.HonoGrafserv = HonoGrafserv;
/**
 * Creates a new instance of HonoGrafserv.
 *
 * @param config - The configuration object for Grafserv.
 * @param upgradeWebSocket - Optional parameter required when using websockets.
 *        Hono uses the upgradeWebsocket helper depending on the environment.
 *        Refer to https://hono.dev/docs/helpers/websocket for more details.
 * @returns An instance of HonoGrafserv.
 */
const grafserv = (config, upgradeWebSocket) => {
    return new HonoGrafserv(config, upgradeWebSocket);
};
exports.grafserv = grafserv;
//# sourceMappingURL=index.js.map