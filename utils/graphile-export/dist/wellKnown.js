"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wellKnown = wellKnown;
const tslib_1 = require("tslib");
const cryptoStar = tslib_1.__importStar(require("crypto"));
const grafastStar = tslib_1.__importStar(require("grafast"));
const graphqlStar = tslib_1.__importStar(require("grafast/graphql"));
const utilStar = tslib_1.__importStar(require("util"));
function makeWellKnownFromOptions(options) {
    const namespaces = Object.create(null);
    const wellKnownMap = new Map();
    function exportAll(moduleStar, moduleName, preferViaDefault = false) {
        namespaces[moduleName] = moduleStar;
        for (const exportName of Object.keys(moduleStar)) {
            if (!wellKnownMap.has(moduleStar[exportName])) {
                /**
                 * ESM is still a bit flaky, so though `import { foo } from 'bar';` may
                 * work in some contexts, in raw Node it's often required to do
                 * `import bar from 'bar'; const foo = bar.foo;`. This code determines
                 * if this latter approach is desired.
                 */
                const viaDefault = preferViaDefault &&
                    exportName !== "default" &&
                    moduleStar[exportName] === moduleStar["default"]?.[exportName];
                wellKnownMap.set(moduleStar[exportName], {
                    moduleName,
                    exportName: viaDefault ? ["default", exportName] : exportName,
                });
            }
        }
        if (!wellKnownMap.has(moduleStar)) {
            wellKnownMap.set(moduleStar, { moduleName, exportName: "*" });
        }
    }
    exportAll(cryptoStar, "crypto");
    exportAll(grafastStar, "grafast");
    exportAll(graphqlStar, "graphql");
    exportAll(utilStar, "util");
    // When defining custom scalars it's often useful to copy the implementation from builtins
    for (const builtinScalarName of [
        "GraphQLBoolean",
        "GraphQLInt",
        "GraphQLFloat",
        "GraphQLString",
        "GraphQLID",
    ]) {
        for (const method of ["serialize", "parseValue", "parseLiteral"]) {
            wellKnownMap.set(graphqlStar[builtinScalarName][method], {
                moduleName: "graphql",
                exportName: [builtinScalarName, method],
            });
        }
    }
    // Now process options
    if (options.modules) {
        for (const [moduleName, moduleStar] of Object.entries(options.modules)) {
            exportAll(moduleStar, moduleName, true);
        }
    }
    return { namespaces, wellKnownMap };
}
const $$wellKnown = Symbol("wellKnown");
function getWellKnownFromOptions(options) {
    if (!options[$$wellKnown]) {
        options[$$wellKnown] = makeWellKnownFromOptions(options);
    }
    return options[$$wellKnown];
}
/**
 * Determines if the thing is something well known (like a Node.js builtin); if
 * so, returns the export description of it.
 *
 * @internal
 */
function wellKnown(options, thing) {
    const { wellKnownMap, namespaces } = getWellKnownFromOptions(options);
    // Straight imports are relatively easy:
    const simple = wellKnownMap.get(thing);
    if (simple) {
        return simple;
    }
    // Checking for namespace matches is a bit tougher
    for (const moduleName in namespaces) {
        if (isSameNamespace(thing, namespaces[moduleName])) {
            return { moduleName, exportName: "*" };
        }
    }
    return undefined;
}
function isSameNamespace(thing, namespace) {
    if (typeof thing !== "object" || thing == null) {
        return false;
    }
    const thingKeys = Object.keys(thing);
    const nspKeys = Object.keys(namespace);
    if (thingKeys.length !== nspKeys.length) {
        return false;
    }
    for (const key of nspKeys) {
        if (thing[key] !== namespace[key]) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=wellKnown.js.map