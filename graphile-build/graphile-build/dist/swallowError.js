"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = swallowError;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debugWarn = (0, debug_1.default)("graphile-build:warn");
/**
 * This is the default function for swallowing errors (you can override it on
 * `build`); it outputs the full error through `debug` if enabled, otherwise it
 * `console.warn`'s an abbreviated error message.
 *
 * Only used when `SwallowErrorsPlugin` is used.
 */
function swallowError(e) {
    // BE VERY CAREFUL NOT TO THROW!
    // LOGGING: Improve this
    if (debugWarn.enabled) {
        debugWarn("Recoverable error occurred: %s", e);
    }
    else {
        const errorSnippet = e && typeof e.toString === "function"
            ? String(e).replace(/\n.*/g, "").slice(0, 320).trim()
            : null;
        if (errorSnippet) {
            // eslint-disable-next-line no-console
            console.warn(`Recoverable error occurred; use envvar 'DEBUG="graphile-build:warn"' for full error (see: https://postgraphile.org/postgraphile/current/debugging )\n> ${errorSnippet}…`);
        }
        else {
            // eslint-disable-next-line no-console
            console.warn(`Recoverable error occurred; use envvar 'DEBUG="graphile-build:warn"' for error (see: https://postgraphile.org/postgraphile/current/debugging )`);
        }
    }
}
//# sourceMappingURL=swallowError.js.map