"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressGrafserv = void 0;
exports.grafserv = grafserv;
const utils_js_1 = require("../../../utils.js");
const index_js_1 = require("../../node/index.js");
class ExpressGrafserv extends index_js_1.NodeGrafservBase {
    getDigest(dynamicOptions, req, res) {
        return {
            httpVersionMajor: req.httpVersionMajor,
            httpVersionMinor: req.httpVersionMinor,
            isSecure: req.secure,
            method: req.method,
            path: req.path,
            headers: (0, utils_js_1.processHeaders)(req.headers),
            getQueryParams() {
                return req.query;
            },
            getBody() {
                if (req.body != null) {
                    return (0, utils_js_1.getBodyFromFrameworkBody)(req.body);
                }
                else {
                    return (0, utils_js_1.getBodyFromRequest)(req, dynamicOptions.maxRequestLength);
                }
            },
            requestContext: {
                node: {
                    req,
                    res,
                },
                expressv4: {
                    req,
                    res,
                },
            },
        };
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
exports.ExpressGrafserv = ExpressGrafserv;
function grafserv(config) {
    return new ExpressGrafserv(config);
}
//# sourceMappingURL=index.js.map