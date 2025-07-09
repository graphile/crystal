"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaGrafserv = void 0;
exports.grafserv = grafserv;
const node_stream_1 = require("node:stream");
const base_js_1 = require("../../../core/base.js");
const utils_js_1 = require("../../../utils.js");
const index_js_1 = require("../../node/index.js");
function getDigest(dynamicOptions, ctx) {
    return {
        httpVersionMajor: ctx.req.httpVersionMajor,
        httpVersionMinor: ctx.req.httpVersionMinor,
        // Koa respects X-Forwarded-Proto when configured to trust the proxy
        isSecure: ctx.secure,
        method: ctx.request.method,
        path: ctx.request.url,
        headers: (0, utils_js_1.processHeaders)(ctx.request.headers),
        getQueryParams() {
            return ctx.request.query;
        },
        getBody() {
            if ("body" in ctx.request) {
                return (0, utils_js_1.getBodyFromFrameworkBody)(ctx.request.body);
            }
            else {
                // No koa-bodyparser, let's just read the body ourself
                return (0, utils_js_1.getBodyFromRequest)(ctx.req, dynamicOptions.maxRequestLength);
            }
        },
        requestContext: {
            node: {
                req: ctx.req,
                res: ctx.res,
            },
            koav2: {
                ctx,
            },
        },
        preferJSON: true,
    };
}
class KoaGrafserv extends base_js_1.GrafservBase {
    constructor(config) {
        super(config);
    }
    _createHandler() {
        const dynamicOptions = this.dynamicOptions;
        return async (ctx, next) => {
            const request = getDigest(dynamicOptions, ctx);
            const result = await this.processRequest(request);
            if (result === null) {
                return next();
            }
            switch (result.type) {
                case "error": {
                    const { statusCode, headers } = result;
                    ctx.response.set(headers);
                    ctx.response.status = statusCode;
                    // DEBT: mutating the error is probably bad form...
                    const errorWithStatus = Object.assign(result.error, {
                        status: statusCode,
                    });
                    throw errorWithStatus;
                }
                case "buffer": {
                    const { statusCode, headers, buffer } = result;
                    ctx.response.set(headers);
                    ctx.response.status = statusCode;
                    ctx.response.body = buffer;
                    return;
                }
                case "json": {
                    const { statusCode, headers, json } = result;
                    ctx.response.set(headers);
                    ctx.response.status = statusCode;
                    ctx.response.body = json;
                    return;
                }
                case "noContent": {
                    const { statusCode, headers } = result;
                    ctx.response.set(headers);
                    ctx.response.status = statusCode;
                    ctx.response.body = null;
                    return;
                }
                case "bufferStream": {
                    const { statusCode, headers, lowLatency, bufferIterator } = result;
                    if (lowLatency) {
                        ctx.req.socket.setTimeout(0);
                        ctx.req.socket.setNoDelay(true);
                        ctx.req.socket.setKeepAlive(true);
                    }
                    ctx.response.set(headers);
                    ctx.response.status = statusCode;
                    const stream = new node_stream_1.PassThrough();
                    ctx.response.body = stream;
                    for await (const buffer of bufferIterator) {
                        stream.write(buffer);
                    }
                    return;
                }
                default: {
                    const never = result;
                    console.log("Unhandled:");
                    console.dir(never);
                    ctx.response.type = "text/plain";
                    ctx.response.status = 501;
                    ctx.response.body = "Server hasn't implemented this yet";
                    return;
                }
            }
        };
    }
    async getUpgradeHandler() {
        if (this.resolvedPreset.grafserv?.websockets) {
            return (0, index_js_1.makeNodeUpgradeHandler)(this);
        }
        else {
            return null;
        }
    }
    shouldHandleUpgrade(req, _socket, _head) {
        const fullUrl = req.url;
        if (!fullUrl) {
            return false;
        }
        const q = fullUrl.indexOf("?");
        const url = q >= 0 ? fullUrl.substring(0, q) : fullUrl;
        const graphqlPath = this.dynamicOptions.graphqlPath;
        return url === graphqlPath;
    }
    async addTo(app, server, addExclusiveWebsocketHandler = true) {
        app.use(this._createHandler());
        // Alias this just to make it easier for users to copy/paste the code below
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const serv = this;
        if (addExclusiveWebsocketHandler) {
            const grafservUpgradeHandler = await serv.getUpgradeHandler();
            if (grafservUpgradeHandler) {
                const upgrade = (req, socket, head) => {
                    if (serv.shouldHandleUpgrade(req, socket, head)) {
                        grafservUpgradeHandler(req, socket, head);
                    }
                    else {
                        socket.destroy();
                    }
                };
                const attachWebsocketsToServer = (server) => {
                    server.on("upgrade", upgrade);
                    serv.onRelease(() => {
                        server.off("upgrade", upgrade);
                    });
                };
                if (server) {
                    // If user explicitly passes server, bind to it:
                    attachWebsocketsToServer(server);
                }
                else {
                    // If not, hope they're calling `app.listen()` and intercept that call.
                    const oldListen = app.listen;
                    app.listen = function (...args) {
                        const server = oldListen.apply(this, args);
                        attachWebsocketsToServer(server);
                        return server;
                    };
                }
            }
        }
    }
}
exports.KoaGrafserv = KoaGrafserv;
function grafserv(config) {
    return new KoaGrafserv(config);
}
//# sourceMappingURL=index.js.map