"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgContextPlugin = exports.EMPTY_OBJECT = void 0;
const pgServices_js_1 = require("../pgServices.js");
const version_js_1 = require("../version.js");
exports.EMPTY_OBJECT = Object.freeze(Object.create(null));
exports.PgContextPlugin = {
    name: "PgContextPlugin",
    description: "Extends the runtime GraphQL context with details needed to support your configured pgServices",
    version: version_js_1.version,
    grafast: {
        middleware: {
            prepareArgs(next, { args }) {
                if (!args.contextValue) {
                    args.contextValue = Object.create(null);
                }
                const { resolvedPreset: config, requestContext: ctx } = args;
                const contextValue = args.contextValue;
                if (config?.pgServices) {
                    for (const pgService of config.pgServices) {
                        const { pgSettings, pgSettingsKey, withPgClientKey, pgSubscriberKey, pgSubscriber, } = pgService;
                        if (pgSettings && pgSettingsKey == null) {
                            throw new Error(`pgService '${pgService.name}' specifies pgSettings, but has no pgSettingsKey.`);
                        }
                        if (pgSubscriber && pgSubscriberKey == null) {
                            throw new Error(`pgService '${pgService.name}' specifies pgSubscriber, but has no pgSubscriberKey.`);
                        }
                        if (pgSettingsKey != null) {
                            if (pgSettingsKey in contextValue) {
                                throw new Error(`Key '${pgSettingsKey}' already set on the context; refusing to overwrite - please check your configuration.`);
                            }
                            contextValue[pgSettingsKey] =
                                typeof pgSettings === "function"
                                    ? pgSettings(ctx ?? exports.EMPTY_OBJECT)
                                    : (pgSettings ?? undefined);
                        }
                        if (pgSubscriberKey != null) {
                            if (pgSubscriberKey in contextValue) {
                                throw new Error(`Key '${pgSubscriberKey}' already set on the context; refusing to overwrite - please check your configuration.`);
                            }
                            contextValue[pgSubscriberKey] = pgSubscriber;
                        }
                        if (withPgClientKey in contextValue) {
                            throw new Error(`Key '${withPgClientKey}' already set on the context; refusing to overwrite - please check your configuration.`);
                        }
                        contextValue[withPgClientKey] = pgServices_js_1.withPgClientFromPgService.bind(null, pgService);
                    }
                }
                return next();
            },
        },
    },
};
//# sourceMappingURL=PgContextPlugin.js.map