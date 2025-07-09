"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTypeSpec = exports.wrapDescription = exports.singularize = exports.pluralize = exports.upperCamelCase = exports.constantCase = exports.camelCase = exports.upperFirst = exports.formatInsideUnderscores = exports.constantCaseAll = exports.bindAll = void 0;
exports.EXPORTABLE = EXPORTABLE;
exports.EXPORTABLE_OBJECT_CLONE = EXPORTABLE_OBJECT_CLONE;
exports.exportNameHint = exportNameHint;
exports.isValidObjectType = isValidObjectType;
exports.gatherConfig = gatherConfig;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const graphql_1 = require("grafast/graphql");
// ENHANCE: remove 'lodash' dependency
const camelCase_js_1 = tslib_1.__importDefault(require("lodash/camelCase.js"));
const upperFirst_js_1 = tslib_1.__importDefault(require("lodash/upperFirst.js"));
const pluralize_1 = tslib_1.__importDefault(require("pluralize"));
const tamedevil_1 = tslib_1.__importDefault(require("tamedevil"));
function EXPORTABLE(factory, args, nameHint) {
    const fn = factory(...args);
    if ((typeof fn === "function" || (typeof fn === "object" && fn !== null)) &&
        !("$exporter$factory" in fn)) {
        Object.defineProperties(fn, {
            $exporter$args: { value: args },
            $exporter$factory: { value: factory },
            $exporter$name: { writable: true, value: nameHint },
        });
    }
    return fn;
}
function EXPORTABLE_OBJECT_CLONE(obj) {
    if (Object.getPrototypeOf(obj) === Object.prototype) {
        const keys = Object.keys(obj);
        const values = Object.values(obj);
        const fn = tamedevil_1.default.eval `return (${tamedevil_1.default.join(keys.map((_key, i) => tamedevil_1.default.identifier(`key${i}`)), ", ")}) => ({${tamedevil_1.default.indent(tamedevil_1.default.join(keys.map((key, i) => (0, tamedevil_1.default) `${tamedevil_1.default.safeKeyOrThrow(key)}: ${tamedevil_1.default.identifier(`key${i}`)}`), ",\n"))}});`;
        // eslint-disable-next-line graphile-export/exhaustive-deps
        return EXPORTABLE(fn, values);
    }
    else {
        throw new Error("EXPORTABLE_OBJECT_CLONE can currently only be used with POJOs.");
    }
}
function exportNameHint(obj, nameHint) {
    if ((typeof obj === "object" && obj != null) || typeof obj === "function") {
        if (!("$exporter$name" in obj)) {
            Object.defineProperty(obj, "$exporter$name", {
                writable: true,
                value: nameHint,
            });
        }
        else if (!obj.$exporter$name) {
            obj.$exporter$name = nameHint;
        }
    }
}
/**
 * Loops over all the given `keys` and binds the method of that name on `obj`
 * to `obj` so that destructuring `build`/etc won't relate in broken `this`
 * references.
 */
const bindAll = (obj, keys) => {
    keys.forEach((key) => {
        if (typeof obj[key] === "function" &&
            !("$$export" in obj[key]) &&
            !("$exporter$factory" in obj[key])) {
            // The Object.assign is to copy across any function properties
            obj[key] = Object.assign(obj[key].bind(obj), obj[key]);
        }
    });
    return obj;
};
exports.bindAll = bindAll;
const constantCaseAll = (str) => str
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/[A-Z]+/g, "_$&")
    .replace(/__+/g, "_")
    .replace(/^[^a-zA-Z0-9]+/, "")
    .replace(/^[0-9]/, "_$&") // GraphQL enums must not start with a number
    .toUpperCase();
exports.constantCaseAll = constantCaseAll;
/**
 * Applies the given format function `fn` to a string, but maintains any
 * leading/trailing underscores.
 */
const formatInsideUnderscores = (fn) => (str) => {
    // Guaranteed to match all strings, and to contain 3 capture groups.
    const matches = str.match(/^(_*)([\s\S]*?)(_*)$/);
    const [, start, middle, end] = matches;
    return `${start}${fn(middle)}${end}`;
};
exports.formatInsideUnderscores = formatInsideUnderscores;
exports.upperFirst = (0, exports.formatInsideUnderscores)(upperFirst_js_1.default);
exports.camelCase = (0, exports.formatInsideUnderscores)(camelCase_js_1.default);
exports.constantCase = (0, exports.formatInsideUnderscores)(exports.constantCaseAll);
const upperCamelCase = (str) => (0, exports.upperFirst)((0, exports.camelCase)(str));
exports.upperCamelCase = upperCamelCase;
const pluralize = (str) => (0, pluralize_1.default)(str);
exports.pluralize = pluralize;
const singularize = (str) => pluralize_1.default.singular(str);
exports.singularize = singularize;
/**
 * Returns true if the given type is a GraphQL object type AND that object type
 * defines fields; false otherwise.
 *
 * WARNING: this function may throw if there's issues with the type's fields,
 * since it calls Type.getFields()
 */
function isValidObjectType(Type) {
    return (Type instanceof graphql_1.GraphQLObjectType &&
        Object.keys(Type.getFields()).length > 0);
}
function toString(value) {
    return "" + value;
}
// Copied from GraphQL v14, MIT license (c) GraphQL Contributors.
/**
 * Word-wraps the given text to maxLen; for consistency with older GraphQL
 * schemas.
 */
function breakLine(line, maxLen) {
    const parts = line.split(new RegExp(`((?: |^).{15,${maxLen - 40}}(?= |$))`));
    if (parts.length < 4) {
        return [line];
    }
    const sublines = [parts[0] + parts[1] + parts[2]];
    for (let i = 3; i < parts.length; i += 2) {
        sublines.push(parts[i].slice(1) + parts[i + 1]);
    }
    return sublines;
}
/**
 * Only use this on descriptions that are plain text, or that we create
 * manually in code; since descriptions are markdown, it's not safe to use on
 * descriptions that contain code blocks or long inline code strings.
 */
const wrapDescription = (description, position) => {
    if (description == null) {
        return null;
    }
    const indentationLength = position === "root"
        ? 0
        : position === "type"
            ? 0
            : position === "field"
                ? 2
                : position === "arg"
                    ? 4
                    : 0;
    // This follows the implementation from GraphQL v14 to make our GraphQL v15
    // schema more similar. Ref:
    // https://github.com/graphql/graphql-js/pull/2223/files
    const maxLen = 120 - indentationLength;
    return description
        .split("\n")
        .map((line) => {
        if (line.length < maxLen + 5) {
            return line;
        }
        // For > 120 character long lines, cut at space boundaries into sublines
        // of ~80 chars.
        return breakLine(line, maxLen).join("\n");
    })
        .join("\n");
};
exports.wrapDescription = wrapDescription;
/**
 * Generates the spec for a GraphQLScalar (except the name) with the
 * given description/coercion.
 */
const stringTypeSpec = (description, coerce, name) => ({
    description,
    serialize: toString,
    parseValue: coerce
        ? EXPORTABLE((coerce) => (value) => coerce("" + value), [coerce])
        : toString,
    parseLiteral: coerce
        ? EXPORTABLE((GraphQLError, Kind, coerce, name) => (ast) => {
            if (ast.kind !== Kind.STRING) {
                // ERRORS: add name to this error
                throw new GraphQLError(`${name ?? "This scalar"} can only parse string values (kind = '${ast.kind}')`);
            }
            return coerce(ast.value);
        }, [graphql_1.GraphQLError, graphql_1.Kind, coerce, name])
        : EXPORTABLE((GraphQLError, Kind, name) => (ast) => {
            if (ast.kind !== Kind.STRING) {
                throw new GraphQLError(`${name ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
            }
            return ast.value;
        }, [graphql_1.GraphQLError, graphql_1.Kind, name]),
    extensions: {
        grafast: {
            idempotent: !coerce || coerce[grafast_1.$$idempotent] ? true : false,
        },
    },
});
exports.stringTypeSpec = stringTypeSpec;
/**
 * This is a TypeScript constrained identity function to save having to specify
 * all the generics manually.
 */
function gatherConfig(config) {
    return config;
}
//# sourceMappingURL=utils.js.map