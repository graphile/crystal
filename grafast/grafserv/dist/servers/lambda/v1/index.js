"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaGrafserv = void 0;
exports.grafserv = grafserv;
const base_js_1 = require("../../../core/base.js");
const utils_js_1 = require("../../../utils.js");
/** @experimental */
class LambdaGrafserv extends base_js_1.GrafservBase {
    lambdaRequestToGrafserv(event, context) {
        const version = event.requestContext.protocol.match(/^HTTP\/(?<major>[0-9]+)\.(?<minor>[0-9]+)$/);
        return {
            httpVersionMajor: parseInt(version?.groups?.major ?? "1"),
            httpVersionMinor: parseInt(version?.groups?.minor ?? "0"),
            isSecure: false, // Because we don't trust X-Forwarded-Proto
            method: event.httpMethod,
            path: event.requestContext.path,
            headers: (0, utils_js_1.processHeaders)(event.multiValueHeaders),
            getQueryParams() {
                return Object.fromEntries(Object.entries(event.queryStringParameters ?? {}).filter(([_k, v]) => v !== undefined));
            },
            getBody() {
                return {
                    type: "text",
                    text: event.body ?? "",
                };
            },
            requestContext: {
                lambdav1: { event, context },
            },
            preferJSON: true,
        };
    }
    grafservResponseToLambda(response) {
        if (response === null) {
            return {
                statusCode: 404,
                body: "¯\\_(ツ)_/¯",
            };
        }
        switch (response.type) {
            case "error": {
                const { statusCode, headers, error } = response;
                return {
                    statusCode,
                    headers: { ...headers, "Content-Type": "text/plain" },
                    body: error.message,
                };
            }
            case "buffer": {
                const { statusCode, headers, buffer } = response;
                return { statusCode, headers, body: buffer.toString("utf8") };
            }
            case "json": {
                const { statusCode, headers, json } = response;
                return { statusCode, headers, body: JSON.stringify(json) };
            }
            default: {
                console.log("Unhandled:");
                console.dir(response);
                return {
                    statusCode: 501,
                    headers: { "Content-Type": "text/plain" },
                    body: "Server hasn't implemented this yet",
                };
            }
        }
    }
    createHandler() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        return async (event, context) => {
            return this.grafservResponseToLambda(await this.processLambdaRequest(event, context, this.lambdaRequestToGrafserv(event, context)));
        };
    }
    processLambdaRequest(_event, _context, request) {
        return this.processRequest(request);
    }
}
exports.LambdaGrafserv = LambdaGrafserv;
/** @experimental */
function grafserv(config) {
    return new LambdaGrafserv(config);
}
//# sourceMappingURL=index.js.map