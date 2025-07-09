"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.true = exports.query = exports.null = exports.fragment = exports.false = exports.sql = exports.dot = exports.blank = exports.$$symbolToIdentifier = exports.$$toSQL = exports.version = void 0;
exports.escapeSqlIdentifier = escapeSqlIdentifier;
exports.compile = compile;
exports.raw = raw;
exports.identifier = identifier;
exports.value = value;
exports.literal = literal;
exports.join = join;
exports.indent = indent;
exports.indentIf = indentIf;
exports.parens = parens;
exports.symbolAlias = symbolAlias;
exports.placeholder = placeholder;
exports.arraysMatch = arraysMatch;
exports.isEquivalent = isEquivalent;
exports.replaceSymbol = replaceSymbol;
exports.withTransformer = withTransformer;
exports.isSQL = isSQL;
const tslib_1 = require("tslib");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
const assert = tslib_1.__importStar(require("assert"));
const util_1 = require("util");
const thereCanBeOnlyOne_js_1 = require("./thereCanBeOnlyOne.js");
var version_js_1 = require("./version.js");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_js_1.version; } });
/** Use this to enable coercing objects to SQL to make composing SQL fragments more ergonomic */
exports.$$toSQL = Symbol("toSQL");
function exportAs(thing, exportName) {
    const existingExport = thing.$$export;
    if (existingExport) {
        if (existingExport.exportName !== exportName) {
            throw new Error(`Attempted to export same thing under multiple names '${existingExport.exportName}' and '${exportName}'`);
        }
    }
    else {
        Object.defineProperty(thing, "$$export", {
            value: { moduleName: "pg-sql2", exportName },
        });
    }
    return thing;
}
/** Experimental! */
exports.$$symbolToIdentifier = Symbol("symbolToIdentifier");
const isDev = typeof process !== "undefined" &&
    (process.env.GRAPHILE_ENV === "development" ||
        process.env.GRAPHILE_ENV === "test");
const nodeInspect = function (depth, options) {
    if (this[thereCanBeOnlyOne_js_1.$$type] === "VALUE") {
        if (depth < 0) {
            return `sql.value(...)`;
        }
        return `sql.value(${(0, util_1.inspect)(this.v, {
            ...options,
            depth: options.depth == null ? null : options.depth - 1,
        })})`;
    }
    else if (this[thereCanBeOnlyOne_js_1.$$type] === "RAW") {
        return `sql\`${this.t}\``;
    }
    else if (this[thereCanBeOnlyOne_js_1.$$type] === "IDENTIFIER") {
        return `sql.identifier(${JSON.stringify(this.n)})`;
    }
    else if (this[thereCanBeOnlyOne_js_1.$$type] === "QUERY") {
        if (depth < 0) {
            return `sql\`...\``;
        }
        else {
            return `sql\`${this.n.map((n) => (n[thereCanBeOnlyOne_js_1.$$type] === "RAW" ? n.t : "${" + nodeInspect.call(n, depth + 1, options) + "}")).join("")}\``;
        }
    }
    else {
        return `sql{${this[thereCanBeOnlyOne_js_1.$$type]}}`;
    }
};
const pgSQL2Proto = Object.assign(Object.create(null), {
    [util_1.inspect.custom]: nodeInspect,
});
const FLAG_HAS_PARENS = 1 << 0;
/**
 * This helps us to avoid GC overhead of allocating new raw nodes all the time
 * when they're likely to be the same values over and over. The average raw
 * string is likely to be around 20 bytes; allowing for 50 bytes once this has
 * been turned into an object, 10000 would mean 500kB which seems an acceptable
 * amount of memory to consume for this.
 */
const CACHE_RAW_NODES = new lru_1.default({ maxLength: 10000 });
/**
 * Given a string, this will return an SQL-identifier-safe version of the
 * string using only the characters [0-9a-z_], at least 1 and at most 50
 * characters in length, with no leading, trailing or consecutive underscores.
 * Information loss is likely, this is only to aid with debugging.
 */
function mangleName(str) {
    return (str
        // Keep the identifier simple so it doesn't need escaping.
        .replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`)
        .replace(/[^a-z0-9_]+/g, "_")
        // Avoid double-underscores.
        .replace(/__+/g, "_")
        .replace(/^_/, "")
        // Maximum identifier length in PostgreSQL is 63. We need 5 underscores
        // (`__desc_number__`) and the number might be up to, say, 8 digits long.
        // (It'll never be anywhere near this, surely?) This leaves 50 characters
        // for description.
        .substring(0, 50)
        // Don't end in an underscore, since we'll be adding one anyway (and we
        // don't want double-underscores). This must be done after length limiting
        // otherwise we might prune to a length that ends in an underscore.
        .replace(/_$/, "") || "local");
}
// Alas we cannot use WeakMap to cache this because symbols cannot be WeakMap
// keys (and we wouldn't want to open the user to memory exhaustion via a map).
// Symbol.prototype.description is available since Node 11.15.0, 12.4.0.
function getSymbolName(symbol) {
    return mangleName(symbol.description || "local");
}
// Copied from https://github.com/brianc/node-postgres/blob/860cccd53105f7bc32fed8b1de69805f0ecd12eb/lib/client.js#L285-L302
// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
// Trivial performance optimizations by Benjie.
// Replaced with regexp because it's 11x faster by Benjie.
function escapeSqlIdentifier(str) {
    return `"${str.replace(/["\0]/g, '""')}"`;
}
function makeRawNode(text, exportName) {
    const n = CACHE_RAW_NODES.get(text);
    if (n) {
        return n;
    }
    if (typeof text !== "string") {
        throw new Error(`[pg-sql2] Invalid argument to makeRawNode - expected string, but received '${(0, util_1.inspect)(text)}'`);
    }
    const newNode = {
        __proto__: pgSQL2Proto,
        [thereCanBeOnlyOne_js_1.$$type]: "RAW",
        t: text,
    };
    if (exportName) {
        exportAs(newNode, exportName);
    }
    // Cannot freeze here, otherwise the SQL node cannot be marked EXPORTABLE later. Maybe wait a tick?
    // Object.freeze(newNode);
    CACHE_RAW_NODES.set(text, newNode);
    return newNode;
}
// Simple function to help V8 optimize it.
function makeIdentifierNode(s, n = getSymbolName(s)) {
    return Object.freeze({
        __proto__: pgSQL2Proto,
        [thereCanBeOnlyOne_js_1.$$type]: "IDENTIFIER",
        s,
        n,
    });
}
// Simple function to help V8 optimize it.
function makeValueNode(rawValue) {
    return Object.freeze({
        __proto__: pgSQL2Proto,
        [thereCanBeOnlyOne_js_1.$$type]: "VALUE",
        v: rawValue,
    });
}
function makeIndentNode(content) {
    const flags = content[thereCanBeOnlyOne_js_1.$$type] === "QUERY" ? content.f : 0;
    return Object.freeze({
        [thereCanBeOnlyOne_js_1.$$type]: "INDENT",
        f: flags,
        c: content[thereCanBeOnlyOne_js_1.$$type] === "QUERY" ? content : makeQueryNode([content]),
    });
}
function makeSymbolAliasNode(a, b) {
    return Object.freeze({
        [thereCanBeOnlyOne_js_1.$$type]: "SYMBOL_ALIAS",
        a: a,
        b: b,
    });
}
function makePlaceholderNode(symbol, fallback) {
    return Object.freeze({
        [thereCanBeOnlyOne_js_1.$$type]: "PLACEHOLDER",
        s: symbol,
        k: fallback,
    });
}
function makeQueryNode(nodes, flags = 0) {
    let checksum = 0;
    for (const node of nodes) {
        switch (node[thereCanBeOnlyOne_js_1.$$type]) {
            case "RAW": {
                const { t } = node;
                // Max value of charCodeAt is 65535. 65535 * 10000 < 2^30.
                for (let i = 0, l = t.length, l2 = l > 10000 ? 10000 : l; i < l2; i++) {
                    checksum += t.charCodeAt(i);
                }
                break;
            }
            case "VALUE": {
                checksum += 211;
                break;
            }
            case "IDENTIFIER": {
                checksum -= 53;
                break;
            }
            case "INDENT": {
                checksum += node.c.c;
                break;
            }
            case "SYMBOL_ALIAS": {
                checksum += 93;
                break;
            }
            case "PLACEHOLDER": {
                checksum += 87;
                break;
            }
            default: {
                const never = node[thereCanBeOnlyOne_js_1.$$type];
                throw new Error(`Unrecognized node type ${never}`);
            }
        }
    }
    return Object.freeze({
        __proto__: pgSQL2Proto,
        [thereCanBeOnlyOne_js_1.$$type]: "QUERY",
        n: nodes,
        f: flags,
        c: checksum,
    });
}
function isSQL(node) {
    return (typeof node === "object" &&
        node !== null &&
        typeof node[thereCanBeOnlyOne_js_1.$$type] === "string");
}
function isSQLable(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value[exports.$$toSQL] === "function");
}
function enforceValidNode(node, where) {
    if (isSQL(node)) {
        return node;
    }
    for (let i = _userTransformers.length - 1; i >= 0; i--) {
        const transformer = _userTransformers[i];
        const transformed = transformer(exports.sql, node, where);
        if (transformed !== node) {
            return enforceValidNode(transformed);
        }
        else {
            // Continue onward; `node` is unchanged
        }
    }
    if (isSQLable(node)) {
        return enforceValidNode(node[exports.$$toSQL](), where);
    }
    throw new Error(`[pg-sql2] Invalid expression. Expected an SQL item${where ? ` at ${where}` : ""} but received '${(0, util_1.inspect)(node)}'. This may mean that there is an issue in the SQL expression where a dynamic value was not escaped via 'sql.value(...)', an identifier wasn't wrapped with 'sql.identifier(...)', or a SQL expression was added without using the \`sql\` tagged template literal. Alternatively, perhaps you forgot to call sql.withTransformer() when building your SQL?`);
}
/**
 * Accepts an sql`...` expression and compiles it out to SQL text with
 * placeholders, and the values to substitute for these values.
 */
function compile(sql, options) {
    const placeholderValues = options?.placeholderValues;
    /**
     * Values hold the JavaScript values that are represented in the query string
     * by placeholders. They are eager because they were provided before compile
     * time.
     */
    const values = [];
    let valueCount = 0;
    /**
     * When we come across a symbol in our identifier, we create a unique alias
     * for it that shouldn’t be in the users schema. This helps maintain sanity
     * when constructing large SQL queries with many aliases.
     */
    const symbolToIdentifier = new Map();
    const valueToPlaceholder = new Map();
    /**
     * When the same description is used more than once in different symbols we
     * must generate different identifiers, so we keep a counter of each symbol
     * usage here.
     */
    const descCounter = Object.create(null);
    /**
     * Makes a friendly name to use in the query for the given SymbolAndName.
     */
    function makeIdentifierForSymbol(symbol, safeDesc) {
        if (!descCounter[safeDesc]) {
            descCounter[safeDesc] = 0;
        }
        const number = ++descCounter[safeDesc];
        // NOTE: we don't omit the suffix for the first instance because safeDesc
        // might end in, e.g., `_1` and cause conflicts later; however we do
        // replace `_1` with `__`.
        const identifierForSymbol = `__${safeDesc}_${number === 1 ? "_" : number}`;
        // Store so this symbol gets the same identifier next time
        symbolToIdentifier.set(symbol, identifierForSymbol);
        return identifierForSymbol;
    }
    function print(untrustedInput, indent = 0) {
        /**
         * Join this to generate the SQL query
         */
        const sqlFragments = [];
        const trustedInput = untrustedInput?.[thereCanBeOnlyOne_js_1.$$type] !== undefined
            ? untrustedInput
            : enforceValidNode(untrustedInput, ``);
        const items = trustedInput[thereCanBeOnlyOne_js_1.$$type] === "QUERY"
            ? expandQueryNodes(trustedInput)
            : [trustedInput];
        const itemCount = items.length;
        for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
            const itemAtIndex = items[itemIndex];
            const item = itemAtIndex?.[thereCanBeOnlyOne_js_1.$$type] !== undefined
                ? itemAtIndex
                : enforceValidNode(itemAtIndex, `item ${itemIndex}`);
            switch (item[thereCanBeOnlyOne_js_1.$$type]) {
                case "RAW": {
                    if (item.t === "") {
                        // No need to add blank raw text!
                        break;
                    }
                    // Special-case `;` - remove the previous \n
                    if (isDev && itemIndex === itemCount - 1 && item.t === ";") {
                        const prevIndex = sqlFragments.length - 1;
                        const prev = sqlFragments[prevIndex];
                        if (prev.endsWith("\n")) {
                            sqlFragments[prevIndex] = prev.substring(0, prev.length - 1);
                        }
                    }
                    sqlFragments.push(isDev ? item.t.replace(/\n/g, "\n" + "  ".repeat(indent)) : item.t);
                    break;
                }
                case "IDENTIFIER": {
                    // Get the correct identifier string for this symbol.
                    let identifierForSymbol = symbolToIdentifier.get(item.s);
                    // If there is no identifier, create one and set it.
                    if (!identifierForSymbol) {
                        identifierForSymbol = makeIdentifierForSymbol(item.s, item.n);
                    }
                    // Return the identifier. Since we create it, we won’t have to
                    // escape it because we know all of the characters are safe.
                    sqlFragments.push(identifierForSymbol);
                    break;
                }
                case "VALUE": {
                    const existing = valueToPlaceholder.get(item);
                    if (existing != null) {
                        sqlFragments.push(existing);
                    }
                    else {
                        valueCount++;
                        const sqlString = `$${valueCount}`;
                        valueToPlaceholder.set(item, sqlString);
                        if (valueCount > 65535) {
                            throw new Error("[pg-sql2] This SQL statement would contain too many placeholders; PostgreSQL supports at most 65535 placeholders. To solve this, consider refactoring the query to use arrays/unnest where possible, or split it into multiple queries.");
                        }
                        values[valueCount - 1] = item.v;
                        sqlFragments.push(sqlString);
                    }
                    break;
                }
                case "INDENT": {
                    assert.ok(isDev, "INDENT nodes only allowed in development mode");
                    sqlFragments.push("\n" +
                        "  ".repeat(indent + 1) +
                        print(item.c, indent + 1) +
                        "\n" +
                        "  ".repeat(indent));
                    break;
                }
                case "SYMBOL_ALIAS": {
                    const symbol1 = item.a;
                    const symbol2 = item.b;
                    const name1 = symbolToIdentifier.get(symbol1);
                    const name2 = symbolToIdentifier.get(symbol2);
                    if (name1 && name2 && name1 !== name2) {
                        throw new Error("ERROR: sql.symbolAlias was used after the symbols were used, they already have (non-matching) aliases");
                    }
                    if (name1) {
                        symbolToIdentifier.set(symbol2, name1);
                    }
                    else if (name2) {
                        symbolToIdentifier.set(symbol1, name2);
                    }
                    else {
                        const identifierForSymbol = makeIdentifierForSymbol(symbol1, getSymbolName(symbol1));
                        symbolToIdentifier.set(symbol1, identifierForSymbol);
                        symbolToIdentifier.set(symbol2, identifierForSymbol);
                    }
                    break;
                }
                case "PLACEHOLDER": {
                    // TODO: should `item.s` be checked in symbol substitutes?
                    const resolvedPlaceholder = placeholderValues?.get(item.s) ?? item.k;
                    if (!resolvedPlaceholder) {
                        throw new Error("ERROR: sql.placeholder was used in this query, but no value was supplied for it, and it has no fallback.");
                    }
                    const resolved = print(resolvedPlaceholder, indent);
                    if (resolved !== "") {
                        sqlFragments.push(resolved);
                    }
                    break;
                }
                default: {
                    const never = item;
                    // This cannot happen
                    throw new Error(`Unsupported node found in SQL: ${(0, util_1.inspect)(never)}`);
                }
            }
        }
        return sqlFragments.join("");
    }
    const text = isDev ? print(sql).replace(/\n\s*\n/g, "\n") : print(sql);
    return {
        text,
        values,
        [exports.$$symbolToIdentifier]: symbolToIdentifier,
    };
}
// LRU not necessary
const CACHE_SIMPLE_FRAGMENTS = new Map();
/**
 * A template string tag that creates a `SQL` query out of some strings and
 * some values. Use this to construct all PostgreSQL queries to avoid SQL
 * injection.
 *
 * Note that using this function, the user *must* specify if they are injecting
 * raw text. This makes a SQL injection vulnerability harder to create.
 */
const sqlBase = function sql(strings, ...values) {
    if (!Array.isArray(strings) || !strings.raw) {
        throw new Error("[pg-sql2] sql should be used as a template literal, not a function call.");
    }
    const stringsLength = strings.length;
    const first = strings[0];
    // Reduce memory churn with a cache
    if (stringsLength === 1) {
        if (first === "") {
            return exports.blank;
        }
        const existing = CACHE_SIMPLE_FRAGMENTS.get(first);
        if (existing)
            return existing;
        const node = makeRawNode(first);
        CACHE_SIMPLE_FRAGMENTS.set(first, node);
        return node;
    }
    // Special case sql`${...}` - just return the node directly
    if (stringsLength === 2 && strings[0] === "" && strings[1] === "") {
        return enforceValidNode(values[0]);
    }
    const items = [];
    let currentText = "";
    for (let i = 0, l = stringsLength; i < l; i++) {
        const text = strings[i];
        currentText += text;
        if (i < l - 1) {
            const rawVal = values[i];
            const valid = rawVal?.[thereCanBeOnlyOne_js_1.$$type] !== undefined
                ? rawVal
                : enforceValidNode(rawVal, `template literal placeholder ${i}`);
            if (valid[thereCanBeOnlyOne_js_1.$$type] === "RAW") {
                currentText += valid.t;
            }
            else if (valid[thereCanBeOnlyOne_js_1.$$type] === "QUERY") {
                // NOTE: this clears the flags
                const nodes = expandQueryNodes(valid);
                const nodeCount = nodes.length;
                for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
                    const node = nodes[nodeIndex];
                    if (node[thereCanBeOnlyOne_js_1.$$type] === "RAW") {
                        currentText += node.t;
                    }
                    else {
                        if (currentText !== "") {
                            items.push(makeRawNode(currentText));
                            currentText = "";
                        }
                        items.push(node);
                    }
                }
            }
            else {
                if (currentText !== "") {
                    items.push(makeRawNode(currentText));
                    currentText = "";
                }
                items.push(valid);
            }
        }
    }
    if (currentText !== "") {
        items.push(makeRawNode(currentText));
        currentText = "";
    }
    return items.length === 1 ? items[0] : makeQueryNode(items);
};
let sqlRawWarningOutput = false;
/**
 * Creates a SQL item for some raw SQL text. Just plain ol‘ raw SQL. This
 * method is dangerous though because it involves no escaping, so proceed with
 * caution! It's very very rarely warranted - there is likely a safer way of
 * achieving your goal.
 */
function raw(text) {
    if (!sqlRawWarningOutput) {
        sqlRawWarningOutput = true;
        try {
            throw new Error("sql.raw first invoked here");
        }
        catch (e) {
            console.warn(`[pg-sql2] WARNING: you're using the sql.raw escape hatch, usage of this API is rarely required and is highly discouraged. Please be sure this is what you intend. ${e.stack}`);
        }
    }
    if (typeof text !== "string") {
        throw new Error(`[pg-sql2] sql.raw must be passed a string, but it was passed '${(0, util_1.inspect)(text)}'.`);
    }
    return makeRawNode(text);
}
/**
 * Creates a SQL item for a SQL identifier. A SQL identifier is anything like
 * a table, schema, or column name. An identifier may also have a namespace,
 * thus why many names are accepted.
 */
function identifier(...names) {
    // By doing the validation here rather than at compile time we can reduce
    // redundant work - the same sql.identifier can be used in multiple queries.
    const nameCount = names.length;
    if (nameCount === 0) {
        throw new Error("[pg-sql2] Invalid call to sql.identifier() - you must pass at least one argument.");
    }
    const items = [];
    let currentText = "";
    for (let i = 0; i < nameCount; i++) {
        if (i > 0) {
            currentText += ".";
        }
        const name = names[i];
        if (typeof name === "string") {
            // By escaping here rather than during compile we can reduce redundant computation.
            const escaped = escapeSqlIdentifier(name);
            currentText += escaped;
        }
        else if (typeof name === "symbol") {
            if (currentText !== "") {
                items.push(makeRawNode(currentText));
                currentText = "";
            }
            // The final name has to be evaluated at compile-time, but we can at least mangle it up front.
            items.push(makeIdentifierNode(name));
        }
        else {
            throw new Error(`[pg-sql2] Invalid argument to sql.identifier - argument ${i} (0-indexed) should be a string or a symbol, but was '${(0, util_1.inspect)(name)}'`);
        }
    }
    if (currentText !== "") {
        items.push(makeRawNode(currentText));
        currentText = "";
    }
    return items.length === 1 ? items[0] : makeQueryNode(items);
}
/**
 * Creates a SQL item for a value that will be included in our final query.
 * This value will be added in a way which avoids SQL injection.
 */
function value(val) {
    return makeValueNode(val);
}
const trueNode = makeRawNode(`TRUE`, "true");
exports.true = trueNode;
const falseNode = makeRawNode(`FALSE`, "false");
exports.false = falseNode;
const nullNode = makeRawNode(`NULL`, "null");
exports.null = nullNode;
exports.blank = makeRawNode(``, "blank");
exports.dot = makeRawNode(`.`, "dot");
const OPEN_PARENS = makeRawNode(`(`);
const CLOSE_PARENS = makeRawNode(`)`);
/**
 * If the value is simple will inline it into the query, otherwise will defer
 * to `sql.value`.
 */
function literal(val) {
    if (typeof val === "string" && val.match(/^[-a-zA-Z0-9_@!$ :".]*$/)) {
        // Examples of things we'd like to be included raw:
        // - 1
        // - myFieldName
        // - @@myFieldName
        // - $myField$
        // - YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM
        return makeRawNode(`'${val}'`);
    }
    else if (typeof val === "number" && Number.isFinite(val)) {
        if (Number.isInteger(val)) {
            return makeRawNode("" + val);
        }
        else {
            return makeRawNode(`'${0 + val}'::float`);
        }
    }
    else if (typeof val === "boolean") {
        return val ? trueNode : falseNode;
    }
    else if (val == null) {
        return nullNode;
    }
    else {
        return value(val);
    }
}
/**
 * Join some SQL items together, optionally separated by a string. Useful when
 * dealing with lists of SQL items, for example a dynamic list of columns or
 * variadic SQL function arguments.
 */
function join(items, separator = "") {
    if (!Array.isArray(items)) {
        throw new Error(`[pg-sql2] Invalid sql.join call - the first argument should be an array, but it was '${(0, util_1.inspect)(items)}'.`);
    }
    if (typeof separator !== "string") {
        throw new Error(`[pg-sql2] Invalid separator passed to sql.join - must be a string, but we received '${(0, util_1.inspect)(separator)}'`);
    }
    // Short circuit joins of size <= 1
    if (items.length === 0) {
        return exports.blank;
    }
    else if (items.length === 1) {
        const rawNode = items[0];
        const node = rawNode?.[thereCanBeOnlyOne_js_1.$$type] !== undefined
            ? rawNode
            : enforceValidNode(rawNode, `join item ${0}`);
        return node;
    }
    const hasSeparator = separator.length > 0;
    let currentText = "";
    const currentItems = [];
    for (let i = 0, l = items.length; i < l; i++) {
        const rawNode = items[i];
        const addSeparator = i > 0 && hasSeparator;
        const node = rawNode?.[thereCanBeOnlyOne_js_1.$$type] !== undefined
            ? rawNode
            : enforceValidNode(rawNode, `join item ${i}`);
        if (addSeparator) {
            currentText += separator;
        }
        if (node[thereCanBeOnlyOne_js_1.$$type] === "QUERY") {
            for (const innerNode of expandQueryNodes(node)) {
                if (innerNode[thereCanBeOnlyOne_js_1.$$type] === "RAW") {
                    currentText += innerNode.t;
                }
                else {
                    if (currentText !== "") {
                        currentItems.push(makeRawNode(currentText));
                        currentText = "";
                    }
                    currentItems.push(innerNode);
                }
            }
        }
        else if (node[thereCanBeOnlyOne_js_1.$$type] === "RAW") {
            currentText += node.t;
        }
        else {
            if (currentText !== "") {
                currentItems.push(makeRawNode(currentText));
                currentText = "";
            }
            currentItems.push(node);
        }
    }
    if (currentText !== "") {
        currentItems.push(makeRawNode(currentText));
        currentText = "";
    }
    return currentItems.length === 1
        ? currentItems[0]
        : makeQueryNode(currentItems);
}
function expandQueryNodes(node) {
    const parens = (node.f & FLAG_HAS_PARENS) === FLAG_HAS_PARENS;
    if (parens) {
        return [OPEN_PARENS, ...node.n, CLOSE_PARENS];
    }
    else {
        return node.n;
    }
}
function indent(fragmentOrStrings, ...values) {
    const fragment = "raw" in fragmentOrStrings
        ? (0, exports.sql)(fragmentOrStrings, ...values)
        : fragmentOrStrings;
    if (!isDev) {
        return fragment;
    }
    return makeIndentNode(fragment);
}
function indentIf(condition, fragment) {
    return isDev && condition ? makeIndentNode(fragment) : fragment;
}
const QUOTED_IDENTIFIER_REGEX = /^"[^"]+"$/;
const UNQUOTED_IDENTIFIER_REGEX = /^[a-zA-Z0-9_]+$/;
const NUMBER_REGEX_1 = /^[0-9]+(?:\.[0-9]+)?$/;
const NUMBER_REGEX_2 = /^\.[0-9]+$/;
const STRING_REGEX = /^'[^']+'$/;
/** For determining if a raw SQL string looks like an identifier (for parens reasons) */
function isIdentifierLike(p) {
    return p.match(QUOTED_IDENTIFIER_REGEX) || p.match(UNQUOTED_IDENTIFIER_REGEX);
}
function parenthesize(fragment, inFlags = 0) {
    const flags = inFlags | FLAG_HAS_PARENS;
    if (fragment[thereCanBeOnlyOne_js_1.$$type] === "QUERY") {
        return makeQueryNode(fragment.n, flags);
    }
    else {
        return makeQueryNode([fragment], flags);
    }
}
/**
 * Wraps the given fragment in parens if necessary (or if forced, e.g. for a
 * subquery or maybe stylistically a join condition).
 *
 * Returns the input SQL fragment if it does not need parenthesis to be
 * inserted into another expression, otherwise a parenthesised fragment if not
 * doing so could cause ambiguity. We're relying on the user to be sensible
 * here, this is not fool-proof.
 *
 * @remarks The following are all parens safe:
 *
 * - A placeholder `$1`
 * - A number `0.123456`
 * - A string `'Foo bar'` / `E'Foo bar'`
 * - An identifier `table.column` / `"MyTaBlE"."MyCoLuMn"`
 *
 * The following might seem but are not parens safe:
 *
 * - A function call `schema.func(param)` - reason: `schema.func(param).*`
 *   should be `(schema.func(param)).*`
 * - A simple expression `1 = 2` - reason: `1 = 2 = false` is invalid; whereas
 *   `(1 = 2) = false` is fine. Similarly `1 = 2::text` differs from `(1 = 2)::text`.
 * - An identifier `table.column.attribute` / `"MyTaBlE"."MyCoLuMn"."MyAtTrIbUtE"` (this needs to be `(table.column).attribute`)
 */
function parens(frag, force) {
    if (frag[thereCanBeOnlyOne_js_1.$$type] === "QUERY") {
        if ((frag.f & FLAG_HAS_PARENS) === FLAG_HAS_PARENS) {
            return frag;
        }
        const { n: nodes } = frag;
        const nodeCount = nodes.length;
        if (nodeCount === 0) {
            throw new Error(`You're wrapping an empty fragment in parens; this is likely an error. If this is deliberate, please explicitly use parenthesis.`);
        }
        else if (nodeCount === 1) {
            return parens(nodes[0], force);
        }
        else if (force) {
            return parenthesize(frag);
        }
        else if (nodeCount === 2) {
            // Check for `IDENTIFIER.rawtext`
            // ENHANCE: check for 'rawtext.IDENTIFIER' too
            const [identifier, rawtext] = nodes;
            if (identifier[thereCanBeOnlyOne_js_1.$$type] !== "IDENTIFIER" ||
                rawtext[thereCanBeOnlyOne_js_1.$$type] !== "RAW" ||
                !rawtext.t.startsWith(".")) {
                return parenthesize(frag);
            }
            const parts = rawtext.t.slice(1).split(".");
            if (!parts.every(isIdentifierLike)) {
                return parenthesize(frag);
            }
            return frag;
        }
        else if (nodeCount === 3) {
            // Check for `IDENTIFIER.IDENTIFIER`
            for (let i = 0; i < nodeCount; i++) {
                const node = nodes[i];
                if (i % 2 === 0) {
                    if (node[thereCanBeOnlyOne_js_1.$$type] !== "IDENTIFIER" &&
                        (node[thereCanBeOnlyOne_js_1.$$type] !== "RAW" || !isIdentifierLike(node.t))) {
                        return parenthesize(frag);
                    }
                }
                else {
                    if (node[thereCanBeOnlyOne_js_1.$$type] !== "RAW" || node.t !== ".") {
                        return parenthesize(frag);
                    }
                }
            }
            return frag;
        }
        else {
            return parenthesize(frag);
        }
    }
    else if (frag[thereCanBeOnlyOne_js_1.$$type] === "INDENT") {
        const inner = parens(frag.c, force);
        if (inner[thereCanBeOnlyOne_js_1.$$type] === "QUERY" &&
            (inner.f & FLAG_HAS_PARENS) === FLAG_HAS_PARENS) {
            // Move the parens to outside
            return parenthesize(indent(makeQueryNode(inner.n)), inner.f);
        }
        else if (inner === frag.c) {
            return frag;
        }
        else {
            return makeIndentNode(inner);
        }
    }
    else if (force) {
        return parenthesize(frag);
    }
    else if (frag[thereCanBeOnlyOne_js_1.$$type] === "VALUE") {
        return frag;
    }
    else if (frag[thereCanBeOnlyOne_js_1.$$type] === "IDENTIFIER") {
        return frag;
    }
    else if (frag[thereCanBeOnlyOne_js_1.$$type] === "RAW") {
        const expr = frag.t;
        if (expr.match(NUMBER_REGEX_1) || expr.match(NUMBER_REGEX_2)) {
            return frag;
        }
        else if (expr.match(STRING_REGEX)) {
            return frag;
        }
        else {
            // Identifiers
            const parts = expr.split(".");
            if (parts.every(isIdentifierLike)) {
                return frag;
            }
        }
    }
    return parenthesize(frag);
}
function symbolAlias(symbol1, symbol2) {
    return makeSymbolAliasNode(symbol1, symbol2);
}
function placeholder(symbol, fallback) {
    return makePlaceholderNode(symbol, fallback);
}
function arraysMatch(array1, array2, comparator) {
    if (array1 === array2)
        return true;
    const l = array1.length;
    if (l !== array2.length) {
        return false;
    }
    if (comparator != null) {
        for (let i = 0; i < l; i++) {
            const a = array1[i];
            const b = array2[i];
            if (a !== b && !comparator(a, b)) {
                return false;
            }
        }
    }
    else {
        for (let i = 0; i < l; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
    }
    return true;
}
/*
export function isEquivalentSymbol(
  sql1: symbol,
  sql2: symbol,
  options?: {
    symbolSubstitutes?: Map<symbol, symbol>;
  },
): boolean {
  if (sql1 === sql2) {
    return true;
  }
  const symbolSubstitutes = options?.symbolSubstitutes;
  return symbolSubstitutes?.get(sql1) === sql2;
}
*/
function isEquivalent(sql1, sql2, options) {
    if (sql1 === sql2) {
        return true;
    }
    else if (sql1[thereCanBeOnlyOne_js_1.$$type] === "QUERY") {
        if (sql2[thereCanBeOnlyOne_js_1.$$type] !== "QUERY" || sql2.f !== sql1.f || sql2.c !== sql1.c) {
            return false;
        }
        return arraysMatch(sql1.n, sql2.n, (a, b) => isEquivalent(a, b, options));
    }
    else if (sql2[thereCanBeOnlyOne_js_1.$$type] === "QUERY") {
        return false;
    }
    else {
        switch (sql1[thereCanBeOnlyOne_js_1.$$type]) {
            case "RAW": {
                if (sql2[thereCanBeOnlyOne_js_1.$$type] !== sql1[thereCanBeOnlyOne_js_1.$$type]) {
                    return false;
                }
                return sql1.t === sql2.t;
            }
            case "VALUE": {
                if (sql2[thereCanBeOnlyOne_js_1.$$type] !== sql1[thereCanBeOnlyOne_js_1.$$type]) {
                    return false;
                }
                return sql1.v === sql2.v;
            }
            case "INDENT": {
                if (sql2[thereCanBeOnlyOne_js_1.$$type] !== sql1[thereCanBeOnlyOne_js_1.$$type]) {
                    return false;
                }
                return isEquivalent(sql1.c, sql2.c, options);
            }
            case "IDENTIFIER": {
                if (sql2[thereCanBeOnlyOne_js_1.$$type] !== sql1[thereCanBeOnlyOne_js_1.$$type]) {
                    return false;
                }
                const { n: ids1n, s: ids1s } = sql1;
                const { n: ids2n, s: ids2s } = sql2;
                const namesMatch = ids1n === ids2n;
                const symbolSubstitutes = options?.symbolSubstitutes;
                const symbol1 = getSubstitute(ids1s, symbolSubstitutes);
                const symbol2 = getSubstitute(ids2s, symbolSubstitutes);
                const symbolsMatch = symbol1 === symbol2;
                return namesMatch && symbolsMatch;
            }
            case "PLACEHOLDER": {
                if (sql2[thereCanBeOnlyOne_js_1.$$type] !== sql1[thereCanBeOnlyOne_js_1.$$type]) {
                    return false;
                }
                const symbolSubstitutes = options?.symbolSubstitutes;
                const symbol1 = getSubstitute(sql1.s, symbolSubstitutes);
                const symbol2 = getSubstitute(sql2.s, symbolSubstitutes);
                return symbol1 === symbol2;
            }
            case "SYMBOL_ALIAS": {
                // TODO
                return false;
            }
            default: {
                const never = sql1;
                console.error(`Unhandled node type: ${(0, util_1.inspect)(never)}`);
                return false;
            }
        }
    }
}
function replaceSymbolInNode(frag, needle, replacement) {
    switch (frag[thereCanBeOnlyOne_js_1.$$type]) {
        case "RAW": {
            return frag;
        }
        case "IDENTIFIER": {
            if (frag.s === needle) {
                return makeIdentifierNode(replacement);
            }
            else {
                return frag;
            }
        }
        case "VALUE": {
            return frag.v === needle
                ? makeValueNode(replacement)
                : frag;
        }
        case "INDENT": {
            return makeIndentNode(replaceSymbol(frag.c, needle, replacement));
        }
        case "SYMBOL_ALIAS": {
            const { a, b } = frag;
            const newA = a === needle ? replacement : a;
            const newB = b === needle ? replacement : b;
            if (newA !== a || newB !== b) {
                return makeSymbolAliasNode(newA, newB);
            }
            else {
                return frag;
            }
        }
        case "PLACEHOLDER": {
            if (frag.s === needle) {
                return makePlaceholderNode(replacement, frag.k);
            }
            else {
                return frag;
            }
        }
        default: {
            const never = frag;
            throw new Error(`Unhandled SQL type ${never[thereCanBeOnlyOne_js_1.$$type]}`);
        }
    }
}
/**
 * @experimental
 */
function replaceSymbol(frag, needle, replacement) {
    if (frag[thereCanBeOnlyOne_js_1.$$type] === "QUERY") {
        let changed = false;
        const newNodes = frag.n.map((node) => {
            const newNode = replaceSymbolInNode(node, needle, replacement);
            if (newNode !== node) {
                changed = true;
            }
            return newNode;
        });
        return changed ? makeQueryNode(newNodes, frag.f) : frag;
    }
    else {
        return replaceSymbolInNode(frag, needle, replacement);
    }
}
/**
 * @internal
 */
function getSubstitute(initialSymbol, symbolSubstitutes) {
    const path = [];
    let symbol = initialSymbol;
    for (let i = 0; i < 1000; i++) {
        if (path.includes(symbol)) {
            throw new Error(`symbolSubstitute cycle detected: ${path
                .map((s) => (0, util_1.inspect)(s))
                .join(" -> ")} -> ${(0, util_1.inspect)(symbol)}`);
        }
        const sub = symbolSubstitutes?.get(symbol);
        if (sub === symbol) {
            throw new Error(`Invalid symbolSubstitutes - a symbol cannot be an alias for itself! Symbol: ${(0, util_1.inspect)(symbol)}`);
        }
        else if (sub) {
            path.push(symbol);
            symbol = sub;
        }
        else {
            return symbol;
        }
    }
    throw new Error("symbolSubstitutes depth too deep");
}
const _userTransformers = [];
function withTransformer(transformer, callback) {
    _userTransformers.push(transformer);
    try {
        return callback(exports.sql);
    }
    finally {
        _userTransformers.pop();
    }
}
exports.sql = sqlBase;
exports.fragment = exports.sql;
exports.query = exports.sql;
exports.default = exports.sql;
const attributes = {
    sql: exports.sql,
    escapeSqlIdentifier,
    compile,
    isEquivalent,
    query: exports.sql,
    raw,
    identifier,
    value,
    literal,
    join,
    indent,
    indentIf,
    parens,
    symbolAlias,
    placeholder,
    blank: exports.blank,
    fragment: exports.sql,
    true: trueNode,
    false: falseNode,
    null: nullNode,
    replaceSymbol,
    isSQL,
    withTransformer,
};
Object.entries(attributes).forEach(([exportName, value]) => {
    if (!value.$$export) {
        exportAs(value, exportName);
    }
});
Object.assign(sqlBase, attributes);
//# sourceMappingURL=index.js.map