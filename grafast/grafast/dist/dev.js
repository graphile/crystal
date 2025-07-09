"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isDev = void 0;
exports.noop = noop;
/**
 * @internal
 */
const graphileEnv = typeof process !== "undefined" ? process.env.GRAPHILE_ENV : undefined;
const nodeEnv = typeof process !== "undefined" ? process.env.NODE_ENV : undefined;
const mode = graphileEnv !== undefined ? graphileEnv : nodeEnv;
/**
 * @internal
 */
exports.isDev = mode === "development" || mode === "test";
exports.isTest = mode === "test";
function noop() { }
if (typeof process !== "undefined" &&
    typeof graphileEnv === "undefined" &&
    typeof nodeEnv === "undefined") {
    console.warn(`The GRAPHILE_ENV environmental variable is not set; Grafast will run in production mode. In your development environments, it's recommended that you set \`GRAPHILE_ENV=development\` to opt in to additional checks that will provide guidance and help you to catch issues in your code earlier, and other changes such as formatting to improve your development experience.`);
}
else if (exports.isDev && !exports.isTest && typeof graphileEnv === "undefined") {
    console.warn(`Grafast is running in development mode due to \`NODE_ENV=${nodeEnv}\`; this is recommended for development environments (and strongly discouraged in production), but will impact on performance - in particular, planning will be significantly more expensive. To remove this warning, make this explicit with \`GRAPHILE_ENV=development\` envvar.`);
}
//# sourceMappingURL=dev.js.map