"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGraphiQLHandler = makeGraphiQLHandler;
const server_1 = require("ruru/server");
const utils_js_1 = require("../utils.js");
function makeGraphiQLHandler(resolvedPreset, middleware, dynamicOptions) {
    const { htmlParts: htmlPartsFromConfig } = resolvedPreset?.ruru ?? {};
    const unhookedHTMLParts = {
        ...server_1.defaultHTMLParts,
        ...htmlPartsFromConfig,
    };
    return async (request) => {
        let htmlParts = unhookedHTMLParts;
        if (middleware != null && middleware.middleware.ruruHTMLParts != null) {
            htmlParts = {
                ...(0, server_1.makeHTMLParts)(),
                ...htmlPartsFromConfig,
            };
            await middleware.run("ruruHTMLParts", {
                resolvedPreset,
                htmlParts,
                request,
            }, utils_js_1.noop);
        }
        const config = {
            endpoint: dynamicOptions.graphqlPath,
            // TODO: websocket endpoint
            debugTools: dynamicOptions.explain === true
                ? ["explain", "plan"]
                : dynamicOptions.explain === false
                    ? []
                    : dynamicOptions.explain,
        };
        return {
            statusCode: 200,
            request,
            dynamicOptions,
            type: "html",
            payload: Buffer.from((0, server_1.ruruHTML)(config, htmlParts), "utf8"),
        };
    };
}
//# sourceMappingURL=graphiql.js.map