"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrafservEnvelopPreset = exports.GrafservEnvelopPlugin = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@envelop/core");
const graphql = tslib_1.__importStar(require("graphql"));
const version_js_1 = require("../version.js");
exports.GrafservEnvelopPlugin = {
    name: "GrafservEnvelopPlugin",
    version: version_js_1.version,
    grafserv: {
        middleware: {
            setPreset(next, event) {
                const { resolvedPreset } = event;
                const userGetEnveloped = resolvedPreset.grafserv?.getEnveloped;
                if (!userGetEnveloped) {
                    throw new Error(`GrafservEnvelopPlugin is enabled, but there is no 'preset.grafserv.getEnveloped' method to call`);
                }
                const originalGetExecutionConfig = event.getExecutionConfig;
                event.getExecutionConfig = async function getExecutionConfig(ctx) {
                    const config = await originalGetExecutionConfig.call(this, ctx);
                    const getEnveloped = (0, core_1.envelop)({
                        plugins: [
                            // PERF: memoize argument if it makes any difference
                            (0, core_1.useEngine)({
                                ...graphql,
                                execute: config.execute,
                                subscribe: config.subscribe,
                                specifiedRules: event.validationRules,
                            }),
                            (0, core_1.useSchema)(config.schema),
                            (0, core_1.useEnvelop)(userGetEnveloped),
                        ],
                    });
                    const { schema, execute, subscribe, contextFactory, parse: envelopedParse, validate: envelopedValidate, } = getEnveloped(ctx);
                    const parseAndValidate = (query) => {
                        const source = new graphql.Source(query, "GraphQL HTTP Request");
                        let document;
                        try {
                            document = envelopedParse(source);
                        }
                        catch (e) {
                            return { errors: [e] };
                        }
                        const errors = envelopedValidate(schema, document);
                        return errors.length ? { errors } : { document };
                    };
                    return {
                        ...config,
                        contextValue: contextFactory(ctx),
                        schema,
                        execute,
                        subscribe,
                        parseAndValidate,
                    };
                };
                return next();
            },
        },
    },
};
exports.GrafservEnvelopPreset = {
    plugins: [exports.GrafservEnvelopPlugin],
    grafserv: {
        // Let Envelop handle error masking
        maskError(e) {
            return e;
        },
    },
};
//# sourceMappingURL=index.js.map