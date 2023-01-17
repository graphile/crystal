import LRU from "@graphile/lru";
import * as assert from "assert";
import { inspect } from "util";

import { reservedWords } from "./reservedWords.js";

type Primitive = null | boolean | number | string;

function exportAs<T>(thing: T, exportName: string) {
  const existingExport = (thing as any).$$export;
  if (existingExport) {
    if (existingExport.exportName !== exportName) {
      throw new Error(
        `Attempted to export same thing under multiple names '${existingExport.exportName}' and '${exportName}'`,
      );
    }
  } else {
    Object.defineProperty(thing, "$$export", {
      value: { moduleName: "tamedevil", exportName },
    });
  }
  return thing;
}

const isDev = process.env.GRAPHILE_ENV === "development";

/**
 * This is the secret to our safety; since this is a symbol it cannot be faked
 * in a JSON payload and it cannot be constructed with a new Symbol (even with
 * the same argument), so external data cannot make itself trusted.
 */
const $$type = Symbol("tamedevil-type");

/**
 * Represents raw TE, the text will be output verbatim into the compiled code.
 */
export interface TERawNode {
  readonly [$$type]: "RAW";
  /** text */
  readonly t: string;
}

/**
 * Represents an TE value that will be replaced with a closure variable in the
 * compiled TE statement.
 */
export interface TERefNode {
  readonly [$$type]: "REF";
  /** value */
  readonly v: any;
}

export interface TETemporaryVariableNode {
  readonly [$$type]: "VARIABLE";
  /** symbol */
  readonly s: symbol;
}

/**
 * Represents that the TE inside this should be indented when pretty printed.
 */
export interface TEIndentNode {
  readonly [$$type]: "INDENT";
  /** content */
  readonly c: TEQuery;
}

/** @internal */
export type TENode =
  | TERawNode
  | TERefNode
  | TETemporaryVariableNode
  | TEIndentNode;

/** @internal */
export interface TEQuery {
  readonly [$$type]: "QUERY";
  /** nodes */
  readonly n: ReadonlyArray<TENode>;
}

/**
 * Representation of TE, identifiers, values, etc; to generate a query that
 * can be issued to the database it needs to be fed to `te.compile`.
 */
export type TE = TENode | TEQuery;

/**
 * This helps us to avoid GC overhead of allocating new raw nodes all the time
 * when they're likely to be the same values over and over. The average raw
 * string is likely to be around 20 bytes; allowing for 50 bytes once this has
 * been turned into an object, 10000 would mean 500kB which seems an acceptable
 * amount of memory to consume for this.
 */
const CACHE_RAW_NODES = new LRU<string, TERawNode>({ maxLength: 10000 });

function makeRawNode(text: string, exportName?: string): TERawNode {
  const n = CACHE_RAW_NODES.get(text);
  if (n) {
    return n;
  }
  if (typeof text !== "string") {
    throw new Error(
      `[tamedevil] Invalid argument to makeRawNode - expected string, but received '${inspect(
        text,
      )}'`,
    );
  }
  const newNode: TERawNode = {
    [$$type]: "RAW" as const,
    t: text,
  };
  if (exportName) {
    exportAs(newNode, exportName);
  }
  Object.freeze(newNode);
  CACHE_RAW_NODES.set(text, newNode);
  return newNode;
}

// Simple function to help V8 optimize it.
function makeRefNode(rawValue: any): TERefNode {
  return Object.freeze({
    [$$type]: "REF" as const,
    v: rawValue,
  });
}

function makeTemporaryVariableNode(symbol: symbol): TETemporaryVariableNode {
  return Object.freeze({
    [$$type]: "VARIABLE" as const,
    s: symbol,
  });
}

function makeIndentNode(content: TE): TEIndentNode {
  return Object.freeze({
    [$$type]: "INDENT" as const,
    c: content[$$type] === "QUERY" ? content : makeQueryNode([content]),
  });
}

function makeQueryNode(nodes: ReadonlyArray<TENode>): TEQuery {
  return Object.freeze({
    [$$type]: "QUERY" as const,
    n: nodes,
  });
}

function isTE(node: unknown): node is TE {
  return (
    typeof node === "object" &&
    node !== null &&
    typeof node[$$type] === "string"
  );
}

function enforceValidNode(node: TEQuery, where?: string): TEQuery;
function enforceValidNode(node: TENode, where?: string): TENode;
function enforceValidNode(node: TE, where?: string): TE;
function enforceValidNode(node: unknown, where?: string): TE {
  if (isTE(node)) {
    return node;
  }
  throw new Error(
    `[tamedevil] Invalid expression. Expected an TE item${
      where ? ` at ${where}` : ""
    } but received '${inspect(
      node,
    )}'. This may mean that there is an issue in the TE expression where a dynamic value was not escaped via 'te.ref(...)', an embedded string wasn't wrapped with 'te.string(...)', or a TE expression was added without using the \`te\` tagged template literal.`,
  );
}

/**
 * Accepts an te`...` expression and compiles it out to TE text with
 * placeholders, and the values to substitute for these values.
 */
function compile(fragment: TE): {
  string: string;
  refs: {
    [key: string]: any;
  };
} {
  /**
   * Values hold the JavaScript values that are represented in the query string
   * by placeholders. They are eager because they were provided before compile
   * time.
   */
  const refs: { [key: string]: any } = Object.create(null);
  let refCount = 0;
  const refMap = new Map<any, string>();
  const makeRef = (value: any): string => {
    const existingIdentifier = refMap.get(value);
    if (existingIdentifier) {
      return existingIdentifier;
    }
    refCount++;
    // Arbitrary
    if (refCount > 65535) {
      throw new Error(
        "[tamedevil] This TE statement would contain too many placeholders; tamedevil supports at most 65535 placeholders. To solve this, consider passing multiple values in using a single array or object.",
      );
    }
    const identifier = `_$$_ref_${refCount}`;
    refMap.set(value, identifier);
    refs[identifier] = value;
    return identifier;
  };

  const varMap = new Map<symbol, string>();
  let tmpCounter = 0;
  const getVar = (sym: symbol) => {
    const existing = varMap.get(sym);
    if (existing) {
      return existing;
    }
    const varName = `_$_tmp${tmpCounter++}`;
    varMap.set(sym, varName);
    return varName;
  };

  function print(untrustedInput: TE, indent = 0) {
    /**
     * Join this to generate the TE query
     */
    const teFragments: string[] = [];

    const trustedInput = enforceValidNode(untrustedInput, ``);
    const items: ReadonlyArray<TENode> =
      trustedInput[$$type] === "QUERY"
        ? expandQueryNodes(trustedInput)
        : [trustedInput];
    const itemCount = items.length;

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
      const item = enforceValidNode(items[itemIndex], `item ${itemIndex}`);
      switch (item[$$type]) {
        case "RAW": {
          if (item.t === "") {
            // No need to add blank raw text!
            break;
          }
          // IMPORTANT: this **must not** mangle primitives. Fortunately they're single line so it should be fine.
          teFragments.push(
            isDev ? item.t.replace(/\n/g, "\n" + "  ".repeat(indent)) : item.t,
          );
          break;
        }
        case "REF": {
          const identifier = makeRef(item.v);
          teFragments.push(identifier);
          break;
        }
        case "VARIABLE": {
          const identifier = getVar(item.s);
          teFragments.push(identifier);
          break;
        }
        case "INDENT": {
          assert.ok(isDev, "INDENT nodes only allowed in development mode");
          teFragments.push(
            "\n" +
              "  ".repeat(indent + 1) +
              print(item.c, indent + 1) +
              "\n" +
              "  ".repeat(indent),
          );
          break;
        }
        default: {
          const never: never = item;
          // This cannot happen
          throw new Error(`Unsupported node found in TE: ${inspect(never)}`);
        }
      }
    }
    return teFragments.join("");
  }
  let str = print(fragment);
  const variables = [];
  for (const varName of varMap.values()) {
    variables.push(`let ${varName};`);
  }
  if (variables.length > 0) {
    str = variables.join("\n") + "\n" + str;
  }
  const string = isDev ? str.replace(/\n\s*\n/g, "\n") : str;

  return {
    string,
    refs,
  };
}

// LRU not necessary
const CACHE_SIMPLE_FRAGMENTS = new Map<string, TERawNode>();

/**
 * A template string tag that creates a `TE` query out of some strings and
 * some values. Use this to construct all PostgreTE queries to avoid TE
 * injection.
 *
 * Note that using this function, the user *must* specify if they are injecting
 * raw text. This makes a TE injection vulnerability harder to create.
 */
const teBase = function te(
  strings: TemplateStringsArray,
  ...values: Array<TE>
): TE {
  if (!Array.isArray(strings) || !strings.raw) {
    throw new Error(
      "[tamedevil] te should be used as a template literal, not a function call.",
    );
  }
  const stringsLength = strings.length;
  const first = strings[0];
  // Reduce memory churn with a cache
  if (stringsLength === 1) {
    if (first === "") {
      return blankNode;
    }
    let node = CACHE_SIMPLE_FRAGMENTS.get(first);
    if (!node) {
      node = makeRawNode(first);
      CACHE_SIMPLE_FRAGMENTS.set(first, node);
    }
    return node;
  }

  // Special case te`${...}` - just return the node directly
  if (stringsLength === 2 && strings[0] === "" && strings[1] === "") {
    return values[0];
  }

  const items: Array<TENode> = [];
  let currentText = "";
  for (let i = 0, l = stringsLength; i < l; i++) {
    const text = strings[i];
    if (typeof text !== "string") {
      throw new Error(
        "[tamedevil] te must be invoked as a template literal, not a function call.",
      );
    }
    currentText += text;
    if (i < l - 1) {
      const rawVal = values[i];
      const valid: TE = enforceValidNode(
        rawVal,
        `template literal placeholder ${i}`,
      );
      if (valid[$$type] === "RAW") {
        currentText += valid.t;
      } else if (valid[$$type] === "QUERY") {
        const nodes = expandQueryNodes(valid);
        const nodeCount = nodes.length;

        for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
          const node = nodes[nodeIndex];
          if (node[$$type] === "RAW") {
            currentText += node.t;
          } else {
            if (currentText !== "") {
              items.push(makeRawNode(currentText));
              currentText = "";
            }
            items.push(node);
          }
        }
      } else {
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

let rawWarningOutput = false;
/**
 * Creates a TE item for a raw code string. Just plain ol‘ raw code. This
 * method is dangerous though because it involves no escaping, so proceed with
 * caution! It's very very rarely warranted - there is likely a safer way of
 * achieving your goal. DO NOT USE THIS WITH UNTRUSTED INPUT!
 */
function raw(text: string): TE {
  if (!rawWarningOutput) {
    rawWarningOutput = true;
    try {
      throw new Error("te.raw first invoked here");
    } catch (e: any) {
      console.warn(
        `[tamedevil] WARNING: you're using the te.raw escape hatch, usage of this API is rarely required and is highly discouraged. Please be sure this is what you intend. ${e.stack}`,
      );
    }
  }
  if (typeof text !== "string") {
    throw new Error(
      `[tamedevil] te.raw must be passed a string, but it was passed '${inspect(
        text,
      )}'.`,
    );
  }
  return makeRawNode(text);
}

/**
 * Creates a TE item for a value that will be included in our final query.
 * This value will be added in a way which avoids TE injection.
 */
function ref(val: any): TE {
  return makeRefNode(val);
}

const blankNode = makeRawNode(``, "blank");
const undefinedNode = makeRawNode(`undefined`, "undefined");

/**
 * A regexp that matches the first character that might need escaping in a JSON
 * string. ("Might" because we'd rather be safe.)
 *
 * Unsafe:
 * - `\\`
 * - `"`
 * - control characters
 * - surrogates
 */
// eslint-disable-next-line no-control-regex
// const forbiddenCharacters = /["\\\u0000-\u001f\ud800-\udfff]/;

/**
 * A 'short string' has a length less than or equal to this, and can
 * potentially have JSON.stringify skipped on it if it doesn't contain any of
 * the forbiddenCharacters. To prevent the forbiddenCharacters regexp running
 * for a long time, we cap the length of string we test.
 */
const MAX_SHORT_STRING_LENGTH = 200; // TODO: what should this be?

const BACKSLASH_CODE = "\\".charCodeAt(0);
const QUOTE_CODE = '"'.charCodeAt(0);

// Bizarrely this seems to be faster than the regexp approach
export function stringifyString(value: string): string {
  const l = value.length;
  if (l > MAX_SHORT_STRING_LENGTH) {
    return JSON.stringify(value);
  }
  // Scan through for disallowed charcodes
  for (let i = 0; i < l; i++) {
    const code = value.charCodeAt(i);
    if (
      code === BACKSLASH_CODE ||
      code === QUOTE_CODE ||
      (code & 0xffe0) === 0 || // equivalent to `code <= 0x001f`
      (code & 0xc000) !== 0 // Not quite equivalent to `code >= 0xd800`, but good enough for our purposes
    ) {
      // Backslash, quote, control character or surrogate
      return JSON.stringify(value);
    }
  }
  return `"${value}"`;
}

// TODO: more optimal stringifier
// TODO: rename to jsonStringify?
export const toJSON = (value: any): string => {
  if (value == null) return "null";
  if (value === true) return "true";
  if (value === false) return "false";
  const t = typeof value;
  if (t === "number") return "" + value;
  if (t === "string") {
    return stringifyString(value as string);
  }
  return JSON.stringify(value);
};

/**
 * If the value is simple will inline it into the query, otherwise will defer
 * to `te.ref`.
 */
function lit(val: any): TE {
  if (val === undefined) {
    return undefinedNode;
  } else if (
    val === null ||
    typeof val === "string" ||
    typeof val === "boolean" ||
    (typeof val === "number" && Number.isFinite(val))
  ) {
    /*
     * Prior to ECMAScript 2019, JSON wasn't truly a subset of JS - it was possible
     * to encode characters in JSON that JS couldn't parse via `eval` (notably
     * `\u2028` and friends), however as of ES2019 JSON is now a subset of JS, so
     * JSON.stringify is safe.
     *
     * https://github.com/tc39/proposal-json-superset
     */
    const primitive: Primitive = val;
    return makeRawNode(toJSON(primitive));
  } else {
    return ref(val);
  }
}

/**
 * If you're building a string and you want to inject untrusted content into it
 * without opening yourself to code injection attacks, this is the method for
 * you. Example:
 *
 * ```js
 * const code = te`const str = "abc${te.substring(untrusted, '"')}123";`
 * ```
 */
function substring(text: string, stringType: "'" | '"' | "`"): TE {
  // Quick scan to see if it's safe to use verbatim
  const l = text.length;
  if (l < MAX_SHORT_STRING_LENGTH) {
    const stringTypeCode = stringType.charCodeAt(0);
    let verbatim = true;
    for (let i = 0; i < l; i++) {
      const code = text.charCodeAt(i);
      if (
        code === BACKSLASH_CODE ||
        code === stringTypeCode ||
        (code & 0xffe0) === 0 || // equivalent to `code <= 0x001f`
        (code & 0xc000) !== 0 // Not quite equivalent to `code >= 0xd800`, but good enough for our purposes
      ) {
        // Backslash, quote, control character or surrogate
        verbatim = false;
        break;
      }
    }
    if (verbatim) {
      return makeRawNode(text);
    }
  }

  // Not safe to use verbatim, so let's escape it

  // This'll escape most things that need escaping - backslashes, fancy characters, double quotes, etc.
  const jsonStringified = JSON.stringify(text);
  // But we're already in a string so we don't want the quote marks
  const inner = jsonStringified.substring(1, jsonStringified.length - 1);
  // And if we're not inside a `"` we'll need to escape our string type.
  const escaped =
    stringType === '"'
      ? inner // "" strings already escapes
      : stringType === "'"
      ? inner.replace(/'/g, "\\'") // '' strings need `'` escaped too (`\` has already been escaped)
      : inner.replace(/[`$]/g, "\\$&"); // `` strings need both '`' and `$` to be escaped
  // Finally return a raw node
  return makeRawNode(escaped);
}

/**
 * Escapes `content` so that it can be safely embedded in a multiline comment.
 */
function subcomment(content: string | number | null | undefined) {
  return makeRawNode(String(content).replace(/\*\//g, "* /"));
}

const disallowedKeys: Array<string | symbol | number> = [
  ...Object.getOwnPropertyNames(Object.prototype),
  ...Object.getOwnPropertySymbols(Object.prototype),
];

/**
 * Is safe to set as the key of a POJO (without a null prototype).
 */
export const isSafeObjectPropertyName = (key: string | symbol | number) =>
  (typeof key === "number" ||
    typeof key === "symbol" ||
    (typeof key === "string" &&
      /^(?:[0-9a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key))) &&
  !disallowedKeys.includes(key);

/**
 * Can represent as an identifier rather than a string key
 *
 * @remarks
 * Doesn't allow it to start with two underscores.
 */
export const canRepresentAsIdentifier = (
  key: string | symbol | number,
): key is string | number =>
  Number.isFinite(key) ||
  (typeof key === "string" &&
    (key === "_" || /^(?:[a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key)));

function isValidVariableName(name: string): boolean {
  if (reservedWords.has(name)) {
    return false;
  }
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    return false;
  }
  return true;
}

function identifier(name: string) {
  if (!isValidVariableName(name)) {
    throw new Error(`Invalid identifier name '${name}'`);
  }
  return makeRawNode(name);
}

// TODO: rename to `ensureSafeKey` or `safeKeyOrThrow` or something?
/**
 * IMPORTANT: It's strongly recommended that instead of defining an object via
 * `const obj = { ${te.dangerousKey(untrustedKey)}: value }` you instead use
 * `const obj = Object.create(null);` and then set the properties on the resulting
 * object via `${obj}[${te.lit(untrustedKey)}] = value;` - this prevents attacks such as
 * **prototype polution** since properties like `__proto__` are not special on
 * null-prototype objects, whereas they can cause havok in regular `{}` objects.
 */
function dangerousKey(key: string | symbol | number): TE {
  if (isSafeObjectPropertyName(key)) {
    if (canRepresentAsIdentifier(key)) {
      return makeRawNode(String(key));
    } else {
      return makeRawNode(JSON.stringify(key));
    }
  } else {
    throw new Error(
      `Forbidden object key: ${JSON.stringify(
        key,
      )}; consider using 'Object.create(null)' and assigning properties using te.lit.`,
    );
  }
}

function canAccessViaDot(str: string): boolean {
  return (
    str.length < MAX_SHORT_STRING_LENGTH &&
    /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(str)
  );
}

/**
 * Accesses the key of an object either via `.` or `[]` as appropriate;
 * `obj${te.get(key)}` would become `obj.foo` or `obj["1foo"]` as
 * appropriate.
 */
function get(key: string | symbol | number): TE {
  return typeof key === "string" && canAccessViaDot(key)
    ? // ._mySimpleProperty
      te`.${makeRawNode(key)}`
    : // ["@@meaning"]
      te`[${te.lit(key)}]`;
}

/**
 * Accesses the key of an object via optional-chaining:
 * `obj${te.optionalGet(key)}` would become `obj?.foo` or `obj?.["1foo"]` as
 * appropriate.
 */
function optionalGet(key: string | symbol | number): TE {
  return typeof key === "string" && canAccessViaDot(key)
    ? // ?._mySimpleProperty
      te`?.${makeRawNode(key)}`
    : // ?.["@@meaning"]
      te`?.[${te.lit(key)}]`;
}

// TODO: rename this. 'leftSet'? 'leftAccess'? 'safeAccess'?
/**
 * Sets the key of an object either via `.` or `[]` as appropriate;
 * `obj${te.set(key)}` would become `obj.foo` or `obj["1foo"]` as
 * appropriate.
 *
 * If the object you're setting properties on has a `null` prototype
 * (`Object.create(null)`) then you can set `hasNullPrototype` to true and all
 * keys are allowed. If this is not the case, then an error will be thrown on
 * certain potentially dangerous keys such as `__proto__` or `constructor`.
 */
function set(key: string | symbol | number, hasNullPrototype = false): TE {
  if (!hasNullPrototype && disallowedKeys.includes(key)) {
    throw new Error(
      `Attempted to set '${String(
        key,
      )}' on an object that isn't declared as having a null prototype. This could be unsafe.`,
    );
  }
  return typeof key === "string" && canAccessViaDot(key)
    ? // ._mySimpleProperty
      te`.${makeRawNode(key)}`
    : // ["@@meaning"]
      te`[${te.lit(key)}]`;
}

/**
 * @experimental
 */
function tempVar(symbol = Symbol()): TE {
  return makeTemporaryVariableNode(symbol);
}

function tmp(obj: TE, callback: (tmp: TE) => TE): TE {
  const varName = te.tempVar();
  return te`(${varName} = ${obj}, ${callback(varName)})`;
}

function run<TResult>(fragment: TE): TResult;
function run<TResult>(strings: TemplateStringsArray, ...values: TE[]): TResult;
function run<TResult>(
  fragmentOrStrings: TE | TemplateStringsArray,
  ...values: TE[]
): TResult {
  if ("raw" in fragmentOrStrings) {
    return run(te(fragmentOrStrings, ...values));
  }
  if (values.length > 0) {
    throw new Error("Invalid call to `te.run`");
  }
  const fragment = fragmentOrStrings;
  const compiled = compile(fragment);
  const argNames = Object.keys(compiled.refs);
  const argValues = Object.values(compiled.refs);
  try {
    return newFunction(...argNames, compiled.string)(...argValues) as TResult;
  } catch (e) {
    // TODO: improve this!
    console.error(`Error occurred during code generation:`);
    console.error(e);
    console.error("Function definition:");
    console.error(compiled.string);
    throw new Error(`Error occurred during code generation.`);
  }
}

/** Because `new Function` retains the scope, we do it at top level to avoid capturing extra values */
function newFunction(...args: string[]) {
  return new Function(...args);
}

/**
 * Join some TE items together, optionally separated by a string. Useful when
 * dealing with lists of TE items, for example a dynamic list of columns or
 * variadic TE function arguments.
 */
function join(items: Array<TE>, separator = ""): TE {
  if (!Array.isArray(items)) {
    throw new Error(
      `[tamedevil] Invalid te.join call - the first argument should be an array, but it was '${inspect(
        items,
      )}'.`,
    );
  }
  if (typeof separator !== "string") {
    throw new Error(
      `[tamedevil] Invalid separator passed to te.join - must be a string, but we received '${inspect(
        separator,
      )}'`,
    );
  }

  // Short circuit joins of size <= 1
  if (items.length === 0) {
    return blankNode;
  } else if (items.length === 1) {
    const rawNode = items[0];
    const node: TE = enforceValidNode(rawNode, `join item ${0}`);
    return node;
  }

  const hasSeparator = separator.length > 0;
  let currentText = "";
  const currentItems: Array<TENode> = [];
  for (let i = 0, l = items.length; i < l; i++) {
    const rawNode = items[i];
    const addSeparator = i > 0 && hasSeparator;
    const node: TE = enforceValidNode(rawNode, `join item ${i}`);
    if (addSeparator) {
      currentText += separator;
    }
    if (node[$$type] === "QUERY") {
      for (const innerNode of expandQueryNodes(node)) {
        if (innerNode[$$type] === "RAW") {
          currentText += innerNode.t;
        } else {
          if (currentText !== "") {
            currentItems.push(makeRawNode(currentText));
            currentText = "";
          }
          currentItems.push(innerNode);
        }
      }
    } else if (node[$$type] === "RAW") {
      currentText += node.t;
    } else {
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

function expandQueryNodes(node: TEQuery): ReadonlyArray<TENode> {
  return node.n;
}

/**
 * WARNING: all lines will be indented, without any parsing, so if there are
 * template literals that contain newlines, spaces will be added inside these
 * too.
 */
function indent(fragment: TE): TE;
function indent(strings: TemplateStringsArray, ...values: Array<TE>): TE;
function indent(
  fragmentOrStrings: TE | TemplateStringsArray,
  ...values: Array<TE>
): TE {
  const fragment =
    "raw" in fragmentOrStrings
      ? te(fragmentOrStrings, ...values)
      : fragmentOrStrings;
  if (!isDev) {
    return fragment;
  }
  return makeIndentNode(fragment);
}

function indentIf(condition: boolean, fragment: TE): TE {
  return isDev && condition ? makeIndentNode(fragment) : fragment;
}

const te = teBase as TamedEvil;
export default te;

export {
  compile,
  dangerousKey,
  run as eval,
  get,
  identifier,
  isTE,
  join,
  lit,
  lit as literal,
  optionalGet,
  ref,
  reservedWords,
  run,
  set,
  subcomment,
  substring,
  te,
  tempVar,
  tmp,
  undefinedNode as undefined,
  raw,
};

export interface TamedEvil {
  (strings: TemplateStringsArray, ...values: Array<TE>): TE;
  te: TamedEvil;
  ref: typeof ref;
  reference: typeof ref;
  lit: typeof lit;
  literal: typeof lit;
  substring: typeof substring;
  subcomment: typeof subcomment;
  join: typeof join;
  identifier: typeof identifier;
  dangerousKey: typeof dangerousKey;
  get: typeof get;
  optionalGet: typeof optionalGet;
  set: typeof set;
  tmp: typeof tmp;
  tempVar: typeof tempVar;
  run: {
    <TResult>(fragment: TE): TResult;
    <TResult>(strings: TemplateStringsArray, ...values: TE[]): TResult;
  };
  eval: {
    <TResult>(fragment: TE): TResult;
    <TResult>(strings: TemplateStringsArray, ...values: TE[]): TResult;
  };
  compile: typeof compile;
  indent: typeof indent;
  indentIf: typeof indentIf;
  undefined: TE;
  blank: TE;
  isTE: typeof isTE;
  reservedWords: typeof reservedWords;
  raw: typeof raw;
}

const attributes = {
  te,
  ref,
  reference: ref,
  lit,
  literal: lit,
  substring,
  subcomment,
  join,
  identifier,
  dangerousKey,
  get,
  optionalGet,
  set,
  tmp,
  tempVar,
  run,
  eval: run,
  compile,
  indent,
  indentIf,
  undefined: undefinedNode,
  blank: blankNode,
  isTE,
  reservedWords,
  raw,
};

Object.entries(attributes).forEach(([exportName, value]) => {
  if (!(value as any).$$export) {
    exportAs(value, exportName);
  }
});

Object.assign(teBase, attributes);
