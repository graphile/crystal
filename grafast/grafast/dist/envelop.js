"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMoreDetailedErrors = exports.useGrafast = void 0;
const graphile_config_1 = require("graphile-config");
const execute_js_1 = require("./execute.js");
const stripAnsi_js_1 = require("./stripAnsi.js");
const subscribe_js_1 = require("./subscribe.js");
function processExplain(explainAllowed, explainHeaders) {
    if (explainAllowed === false ||
        (Array.isArray(explainAllowed) && explainAllowed.length === 0)) {
        return undefined;
    }
    const explainHeader = Array.isArray(explainHeaders)
        ? explainHeaders.join(",")
        : explainHeaders;
    if (typeof explainHeader !== "string") {
        return undefined;
    }
    const explainParts = explainHeader.split(",");
    if (explainAllowed === true || explainAllowed === undefined) {
        return explainParts;
    }
    // Assumption: explainAllowed is relatively short (and unique).
    // PERF: there's probably a faster way to do this...
    return explainAllowed.filter((p) => explainParts.includes(p));
}
/**
 * An Envelop plugin that uses Grafast to prepare and execute the GraphQL
 * query.
 */
const useGrafast = (options = {}) => {
    const { explainAllowed = true } = options;
    return {
        async onExecute(opts) {
            const explainHeaders = opts.args.contextValue?.req?.headers["x-graphql-explain"];
            const explain = processExplain(explainAllowed, explainHeaders);
            opts.setExecuteFn((args) => (0, execute_js_1.execute)(args, (0, graphile_config_1.resolvePreset)({
                grafast: { explain },
            })));
        },
        async onSubscribe(opts) {
            const ctx = opts.args.contextValue;
            const headersObj = ctx?.req?.headers ||
                ctx?.request?.headers ||
                ctx?.normalizedConnectionParams ||
                ctx?.connectionParams;
            let explainHeaders;
            if (headersObj) {
                explainHeaders = headersObj["x-graphql-explain"];
                if (explainHeaders == null) {
                    const key = Object.keys(headersObj).find((k) => k.toLowerCase() === "x-graphql-explain");
                    if (key != null) {
                        explainHeaders = headersObj[key];
                    }
                }
            }
            const explain = processExplain(explainAllowed, explainHeaders);
            opts.setSubscribeFn(async (args) => (0, subscribe_js_1.subscribe)(args, (0, graphile_config_1.resolvePreset)({
                grafast: { explain },
            })));
        },
    };
};
exports.useGrafast = useGrafast;
/**
 * An Envelop plugin that will make any GraphQL errors easier to read from
 * inside of GraphiQL.
 */
const useMoreDetailedErrors = () => ({
    onExecute: () => ({
        onExecuteDone({ result }) {
            if ("errors" in result && result.errors) {
                result.errors = result.errors.map((e) => {
                    const obj = e.toJSON();
                    return Object.assign(obj, {
                        message: (0, stripAnsi_js_1.stripAnsi)(obj.message),
                        extensions: { stack: (0, stripAnsi_js_1.stripAnsi)(e.stack ?? "").split("\n") },
                    });
                });
            }
        },
    }),
});
exports.useMoreDetailedErrors = useMoreDetailedErrors;
//# sourceMappingURL=envelop.js.map