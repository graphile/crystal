"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwallowErrorsPlugin = void 0;
const tslib_1 = require("tslib");
require("graphile-config");
const swallowError_js_1 = tslib_1.__importDefault(require("../swallowError.js"));
const version_js_1 = require("../version.js");
/**
 * This plugin changes the default handling for "recoverable" errors from
 * throwing the error to instead logging it and carrying on.  We do not
 * recommend the use of this plugin in production, however it is useful when
 * evaluating the tool in development as it allows you to continue using other
 * parts of your schema even if conflicts occur that result in sections of
 * your GraphQL schema being omitted.
 *
 * We've registered the `dontSwallowErrors` option in case you want to opt out
 * of this without changing your plugin list.
 */
exports.SwallowErrorsPlugin = {
    name: "SwallowErrorsPlugin",
    description: "Adding this plugin will cause 'recoverable' errors to be 'swallowed' - i.e. schema build will continue despite certain errors. You should not use this in a production schema but it can be useful for development.",
    version: version_js_1.version,
    schema: {
        hooks: {
            build: {
                callback: (build) => {
                    if (build.options.dontSwallowErrors !== true) {
                        // Explicitly overwrite the error handler
                        build.handleRecoverableError = swallowError_js_1.default;
                    }
                    return build;
                },
                provides: ["SwallowErrors"],
            },
        },
    },
};
//# sourceMappingURL=SwallowErrorsPlugin.js.map