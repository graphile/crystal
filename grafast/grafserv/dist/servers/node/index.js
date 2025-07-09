"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeGrafserv = exports.NodeGrafservBase = void 0;
exports.grafserv = grafserv;
exports.makeNodeUpgradeHandler = makeNodeUpgradeHandler;
const node_querystring_1 = require("node:querystring");
const grafast_1 = require("grafast");
const graphql_ws_1 = require("graphql-ws");
const base_js_1 = require("../../core/base.js");
const utils_js_1 = require("../../utils.js");
class NodeGrafservBase extends base_js_1.GrafservBase {
    constructor(config) {
        super(config);
    }
    getDigest(dynamicOptions, req, res, isHTTPS) {
        const reqUrl = req.url;
        const qi = reqUrl.indexOf("?");
        const path = qi >= 0 ? reqUrl.substring(0, qi) : reqUrl;
        const search = qi >= 0 ? reqUrl.substring(qi + 1) : null;
        return {
            httpVersionMajor: req.httpVersionMajor,
            httpVersionMinor: req.httpVersionMinor,
            isSecure: isHTTPS,
            method: req.method,
            path,
            headers: (0, utils_js_1.processHeaders)(req.headers),
            getQueryParams() {
                const queryParams = search
                    ? (0, node_querystring_1.parse)(search)
                    : Object.create(null);
                return queryParams;
            },
            getBody() {
                return (0, utils_js_1.getBodyFromRequest)(req, dynamicOptions.maxRequestLength);
            },
            requestContext: {
                node: {
                    req,
                    res,
                },
            },
        };
    }
    /**
     * @deprecated Please user serv.addTo instead, so that websockets can be automatically supported
     */
    createHandler(isHTTPS = false) {
        return this._createHandler(isHTTPS);
    }
    _createHandler(isHTTPS = false) {
        const dynamicOptions = this.dynamicOptions;
        return async (req, res, next) => {
            try {
                const request = this.getDigest(dynamicOptions, req, res, isHTTPS);
                const result = await this.processRequest(request);
                if (result === null) {
                    if (typeof next === "function") {
                        return next();
                    }
                    else {
                        const payload = Buffer.from(`Could not process ${req.method} request to ${req.url} ─ please POST requests to ${dynamicOptions.graphqlPath}`, "utf8");
                        res.writeHead(404, {
                            "Content-Type": "text/plain; charset=utf-8",
                            "Content-Length": payload.length,
                        });
                        res.end(payload);
                        return;
                    }
                }
                switch (result.type) {
                    case "error": {
                        // TODO: return error in the format the browser would prefer (JSON, HTML, text)
                        // TODO: respect result.headers
                        if (result.error instanceof grafast_1.SafeError) {
                            const payload = Buffer.from(result.error.message, "utf8");
                            res.writeHead(result.statusCode, {
                                "Content-Type": "text/plain; charset=utf-8",
                                "Content-Length": payload.length,
                            });
                            res.end(payload);
                            return;
                        }
                        else if (typeof next === "function") {
                            return next(result.error);
                        }
                        else {
                            // TODO: catch all the code paths that lead here!
                            console.error(result.error);
                            const payload = Buffer.from("An error occurred", "utf8");
                            res.writeHead(result.statusCode, {
                                "Content-Type": "text/plain; charset=utf-8",
                                "Content-Length": payload.length,
                            });
                            res.end(payload);
                            return;
                        }
                    }
                    case "buffer": {
                        const { statusCode, headers, buffer } = result;
                        res.writeHead(statusCode, headers);
                        res.end(buffer);
                        return;
                    }
                    case "json": {
                        const { statusCode, headers, json } = result;
                        const buffer = Buffer.from(JSON.stringify(json), "utf8");
                        headers["Content-Length"] = String(buffer.length);
                        res.writeHead(statusCode, headers);
                        res.end(buffer);
                        return;
                    }
                    case "noContent": {
                        const { statusCode, headers } = result;
                        res.writeHead(statusCode, headers);
                        res.end();
                        return;
                    }
                    case "bufferStream": {
                        const { statusCode, headers, lowLatency, bufferIterator } = result;
                        if (lowLatency) {
                            req.socket.setTimeout(0);
                            req.socket.setNoDelay(true);
                            req.socket.setKeepAlive(true);
                        }
                        res.writeHead(statusCode, headers);
                        // Clean up when connection closes.
                        const cleanup = () => {
                            try {
                                bufferIterator.return?.();
                            }
                            catch {
                                /* nom nom nom */
                            }
                            req.removeListener("close", cleanup);
                            req.removeListener("finish", cleanup);
                            req.removeListener("error", cleanup);
                        };
                        req.on("close", cleanup);
                        req.on("finish", cleanup);
                        req.on("error", cleanup);
                        // https://github.com/expressjs/compression#server-sent-events
                        const flush = lowLatency
                            ? typeof res.flush === "function"
                                ? res.flush.bind(res)
                                : typeof res.flushHeaders === "function"
                                    ? res.flushHeaders.bind(res)
                                    : null
                            : null;
                        try {
                            for await (const buffer of bufferIterator) {
                                const bufferIsBelowWatermark = res.write(buffer);
                                if (flush) {
                                    flush();
                                }
                                if (!bufferIsBelowWatermark) {
                                    // Wait for drain before pumping more data through
                                    await new Promise((resolve) => res.once("drain", resolve));
                                }
                            }
                        }
                        catch (e) {
                            console.error(`Error occurred during stream; swallowing error.`, e);
                        }
                        finally {
                            res.end();
                        }
                        return;
                    }
                    default: {
                        const never = result;
                        console.log("Unhandled:");
                        console.dir(never);
                        const payload = Buffer.from("Server hasn't implemented this yet", "utf8");
                        res.writeHead(501, { "Content-Length": payload.length });
                        res.end(payload);
                        return;
                    }
                }
            }
            catch (e) {
                console.error("Unexpected error occurred:");
                console.error(e);
                if (typeof next === "function") {
                    next(e);
                }
                else {
                    const text = "Unknown error occurred";
                    res.writeHead(500, {
                        "Content-Type": "text/plain",
                        "Content-Length": text.length,
                    });
                    res.end(text);
                }
            }
        };
    }
    async getUpgradeHandler() {
        if (this.resolvedPreset.grafserv?.websockets) {
            return makeNodeUpgradeHandler(this);
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
        /*
          const protocol = req.headers["sec-websocket-protocol"];
          const protocols = Array.isArray(protocol)
            ? protocol
            : protocol?.split(",").map((p) => p.trim()) ?? [];
          if (protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL)) ...
          */
    }
}
exports.NodeGrafservBase = NodeGrafservBase;
class NodeGrafserv extends NodeGrafservBase {
    async addTo(server, addExclusiveWebsocketHandler = true) {
        const handler = this._createHandler();
        server.on("request", handler);
        this.onRelease(() => {
            server.off("request", handler);
        });
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
                server.on("upgrade", upgrade);
                serv.onRelease(() => {
                    server.off("upgrade", upgrade);
                });
            }
        }
    }
}
exports.NodeGrafserv = NodeGrafserv;
function grafserv(config) {
    return new NodeGrafserv(config);
}
async function makeNodeUpgradeHandler(instance) {
    const ws = await import("ws");
    const { WebSocketServer } = ws;
    const graphqlWsServer = (0, graphql_ws_1.makeServer)((0, utils_js_1.makeGraphQLWSConfig)(instance));
    const wsServer = new WebSocketServer({ noServer: true });
    const onUpgrade = (req, socket, head) => {
        wsServer.handleUpgrade(req, socket, head, function done(ws) {
            wsServer.emit("connection", ws, req);
        });
    };
    const onConnection = (socket, request) => {
        // a new socket opened, let graphql-ws take over
        const closed = graphqlWsServer.opened({
            protocol: socket.protocol, // will be validated
            send: (data) => new Promise((resolve, reject) => {
                socket.send(data, (err) => (err ? reject(err) : resolve()));
            }), // control your data flow by timing the promise resolve
            close: (code, reason) => socket.close(code, reason), // there are protocol standard closures
            onMessage: (cb) => socket.on("message", async (event) => {
                try {
                    // wait for the the operation to complete
                    // - if init message, waits for connect
                    // - if query/mutation, waits for result
                    // - if subscription, waits for complete
                    await cb(event.toString());
                }
                catch (err) {
                    try {
                        // all errors that could be thrown during the
                        // execution of operations will be caught here
                        socket.close(graphql_ws_1.CloseCode.InternalServerError, err.message);
                    }
                    catch {
                        /*noop*/
                    }
                }
            }),
        }, 
        // pass values to the `extra` field in the context
        { socket, request });
        // notify server that the socket closed
        socket.once("close", closed);
    };
    wsServer.on("connection", onConnection);
    instance.onRelease(() => {
        wsServer.off("connection", onConnection);
        wsServer.close();
    });
    return onUpgrade;
}
//# sourceMappingURL=index.js.map