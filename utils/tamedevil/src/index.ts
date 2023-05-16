import { reservedWords } from "./reservedWords.js";

type Primitive = null | boolean | number | string;

/**
 * For compatibility with graphile-export
 */
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

const isDev =
  typeof process !== "undefined" && process.env.GRAPHILE_ENV === "development";

/**
 * This is the secret to our safety; since this is a symbol it cannot be faked
 * in a JSON payload and it cannot be constructed with a new Symbol (even with
 * the same argument), so external data cannot make itself trusted.
 *
 * @internal
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
  /** name */
  readonly n: string | undefined;
}

/**
 * Represents a temporary variable that will be created, primarily useful for
 * inline wrangling of data where statements are not available.
 */
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
 * A tamedevil node or fragment, ready to be combined into a larger fragment or
 * evaluated directly. To evaluate, feed this node into `te.run()`.
 */
export type TE = TENode | TEQuery;

function makeRawNode(text: string): TERawNode {
  return {
    [$$type]: "RAW" as const,
    t: text,
  } as TERawNode;
}

function makeExportedRawNode(text: string, exportName: string): TERawNode {
  const newNode: TERawNode = {
    [$$type]: "RAW" as const,
    t: text,
  };
  exportAs(newNode, exportName);
  return newNode;
}

// Simple function to help V8 optimize it.
function makeRefNode(rawValue: any, name?: string): TERefNode {
  return Object.freeze({
    [$$type]: "REF" as const,
    v: rawValue,
    n: name,
  });
}

// Simple function to help V8 optimize it.
function makeTemporaryVariableNode(symbol: symbol): TETemporaryVariableNode {
  return Object.freeze({
    [$$type]: "VARIABLE" as const,
    s: symbol,
  });
}

// Simple function to help V8 optimize it.
function makeIndentNode(content: TE): TEIndentNode {
  return Object.freeze({
    [$$type]: "INDENT" as const,
    c: content[$$type] === "QUERY" ? content : makeQueryNode([content]),
  });
}

// Simple function to help V8 optimize it.
function makeQueryNode(nodes: ReadonlyArray<TENode>): TEQuery {
  return Object.freeze({
    [$$type]: "QUERY" as const,
    n: nodes,
  });
}

/**
 * Returns true if the given node is a TE node, false otherwise.
 */
function isTE(node: unknown): node is TE {
  return (
    typeof node === "object" &&
    node !== null &&
    typeof (node as any)[$$type] === "string"
  );
}

/**
 * If the given node is a valid TE node it will be returned, otherwise an error
 * will be thrown.
 *
 * @internal
 */
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
    } but received '${String(
      node,
    )}'. This may mean that there is an issue in the TE expression where a dynamic value was not escaped via 'te.ref(...)', an embedded string wasn't wrapped with 'te.string(...)', or a TE expression was added without using the \`te\` tagged template literal.`,
  );
}

function findAvailableName(
  refs: { [key: string]: any },
  suggestedName: string,
) {
  if (!(suggestedName in refs)) {
    return suggestedName;
  }
  for (let i = 0; i < 1000000; i++) {
    const name = suggestedName + i;
    if (!(name in refs)) {
      return name;
    }
  }
  throw new Error("Failed to find an available variable name to use");
}

const makeRef = (
  refs: { [key: string]: any },
  refMap: Map<any, string>,
  value: any,
  suggestedName?: string,
): string => {
  const existingIdentifier = refMap.get(value);
  if (existingIdentifier) {
    return existingIdentifier;
  }
  const refCount = refMap.size + 1;
  // Arbitrary
  if (refCount > 65535) {
    throw new Error(
      "[tamedevil] This TE statement would contain too many placeholders; tamedevil supports at most 65535 placeholders. To solve this, consider passing multiple values in using a single array or object.",
    );
  }
  const identifier = suggestedName
    ? findAvailableName(refs, suggestedName)
    : `_$$_ref_${refCount}`;
  refMap.set(value, identifier);
  refs[identifier] = value;
  return identifier;
};

const getVar = (varMap: Map<symbol, string>, sym: symbol) => {
  const existing = varMap.get(sym);
  if (existing) {
    return existing;
  }
  const tmpCounter = varMap.size + 1;
  const varName = `_$_tmp${tmpCounter}`;
  varMap.set(sym, varName);
  return varName;
};

function serialize(
  item: TE,
  refs: { [key: string]: any },
  refMap: Map<any, string>,
  varMap: Map<symbol, string>,
  indent = 0,
): string {
  let str = "";
  if (item == null) {
    enforceValidNode(item);
  }
  switch (item[$$type]) {
    case "QUERY": {
      for (const listItem of item.n) {
        str += serialize(listItem, refs, refMap, varMap, indent);
      }
      break;
    }
    case "RAW": {
      if (item.t === "") {
        // No need to add blank raw text!
        break;
      }
      // IMPORTANT: this **must not** mangle primitives. Fortunately they're all single line so it should be fine.
      str += isDev ? item.t.replace(/\n/g, "\n" + "  ".repeat(indent)) : item.t;
      break;
    }
    case "REF": {
      const identifier = makeRef(refs, refMap, item.v, item.n);
      str += identifier;
      break;
    }
    case "VARIABLE": {
      const identifier = getVar(varMap, item.s);
      str += identifier;
      break;
    }
    case "INDENT": {
      if (!isDev) {
        throw new Error("INDENT nodes only allowed in development mode");
      }
      str += "\n" + "  ".repeat(indent + 1);
      str += serialize(item.c, refs, refMap, varMap, indent + 1);
      str += "\n" + "  ".repeat(indent);
      break;
    }
    default: {
      const never: never = item;
      // This cannot happen
      throw new Error(
        `Unsupported node found in TE: ${String(enforceValidNode(never))}`,
      );
    }
  }
  return str;
}

/**
 * Accepts an te`...` expression and compiles it out to the function body
 * `string` and the `refs` that need to be passed via the closure.
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
  const refMap = new Map<any, string>();
  const varMap = new Map<symbol, string>();

  /**
   * Join this to generate the TE string
   */
  let str = serialize(fragment, refs, refMap, varMap);
  let variables = "";
  for (const varName of varMap.values()) {
    variables = variables + `let ${varName};\n`;
  }
  if (variables.length > 0) {
    str = variables + "\n" + str;
  }
  const string = isDev ? str.replace(/\n\s*\n/g, "\n") : str;

  return {
    string,
    refs,
  };
}

/**
 * A template string tag function that creates a `TE` query out of some strings and
 * some TE values. Use this to prepare all dynamically executed code code
 * injection attacks.
 *
 * Note that this function enforces that every passed placeholder is a TE node,
 * preventing potentially untrusted raw text from being injected into the code
 * to be evaluated, thereby seriously reducing the risk of code injection
 * attacks. Care must still be taken in the building and management of these
 * code strings, however, since no parsing takes place - so it is up to the
 * coder to use the right TE helper in the right positions in the constructed
 * code.
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
  // Reduce memory churn with a cache
  if (stringsLength === 1) {
    const first = strings[0];
    if (first === "") {
      return blankNode;
    } else if (first === "undefined") {
      return undefinedNode;
    }
    return makeRawNode(first);
  }

  // Special case te`${...}` - just return the node directly
  if (stringsLength === 2 && strings[0] === "" && strings[1] === "") {
    const v = values[0];
    return v[$$type] !== undefined ? v : enforceValidNode(v);
  }

  const items: Array<TENode> = [];
  let lastRawNode: TERawNode | null = null;
  let currentText = "";

  const addText = () => {
    if (lastRawNode === null || lastRawNode.t !== currentText) {
      lastRawNode = makeRawNode(currentText);
    }
    items.push(lastRawNode);
    currentText = "";
  };

  const finalStringIndex = stringsLength - 1;
  for (let i = 0; i < stringsLength; i++) {
    const text = strings[i];
    currentText += text;
    if (i !== finalStringIndex) {
      const v = values[i];
      const valid: TE =
        v[$$type] !== undefined
          ? v
          : enforceValidNode(v, `literal placeholder ${i}`);
      if (valid[$$type] === "RAW") {
        lastRawNode = valid;
        currentText += valid.t;
      } else if (valid[$$type] === "QUERY") {
        const nodes = valid.n;
        const nodeCount = nodes.length;

        for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
          const node = nodes[nodeIndex];
          if (node[$$type] === "RAW") {
            lastRawNode = node;
            currentText += node.t;
          } else {
            if (currentText !== "") {
              /*#__INLINE__*/ addText();
            }
            items.push(node);
          }
        }
      } else {
        if (currentText !== "") {
          /*#__INLINE__*/ addText();
        }
        items.push(valid);
      }
    }
  }
  if (currentText !== "") {
    /*#__INLINE__*/ addText();
  }
  return items.length === 1 ? items[0] : makeQueryNode(items);
};

const teCacheCache = Object.create(null);
function cache(strings: TemplateStringsArray): TE {
  if (strings.length !== 1) {
    throw new Error(`te.cache can currently only be used with a static string`);
  }
  const str = strings[0];
  const existing = teCacheCache[str];
  if (existing) return existing;
  const node = makeRawNode(str);
  teCacheCache[str] = node;
  return node;
}

let rawWarningOutput = false;
/**
 * Creates a TE node for a raw code string. Just plain ol‘ raw code - EXTREMELY
 * DANGEROUS.
 *
 * This method is dangerous because it involves no escaping, so proceed with
 * caution!
 *
 * It's very very rarely warranted to use this - there is likely a safer way of
 * achieving your goal. DO NOT USE THIS WITH UNTRUSTED INPUT!
 */
function dangerouslyIncludeRawCode(text: string): TE {
  if (!rawWarningOutput) {
    rawWarningOutput = true;
    try {
      throw new Error("te.dangerouslyIncludeRawCode first invoked here");
    } catch (e: any) {
      console.warn(
        `[tamedevil] WARNING: you're using the te.dangerouslyIncludeRawCode escape hatch, usage of this API is rarely required and is highly discouraged due to the potential security ramifications. Please be sure this is what you intend. ${e.stack}`,
      );
    }
  }
  if (typeof text !== "string") {
    throw new Error(
      `[tamedevil] te.dangerouslyIncludeRawCode must be passed a string, but it was passed '${String(
        text,
      )}'.`,
    );
  }
  return makeRawNode(text);
}

/**
 * Creates a TE node for an arbitrary JS object that will be made available
 * (via a closure) to the final code that will be executed. This value is not
 * serialized or similar, it is passed by reference.
 */
function ref(val: any, name?: string): TE {
  if (name != null) {
    if (!isValidVariableName(name)) {
      throw new Error(`Invalid variable name '${name}'`);
    }
    return makeRefNode(val, name);
  } else {
    return makeRefNode(val);
  }
}

const blankNode = makeExportedRawNode(``, "blank");
const undefinedNode = makeExportedRawNode(`undefined`, "undefined");

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

/**
 * Similar to `JSON.stringify(string)`, but faster. Bizarrely this seems to be
 * faster than the regexp approach
 */
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

// PERF: more optimal stringifier
// TODO: rename to jsonStringify?
/**
 * Equivalent to JSON.stringify, but typically faster.
 */
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
 * If the value is simple this will stringify it and inject it directly into
 * the code to be evaluated, otherwise will defer to `te.ref`.
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
 * without opening yourself to code injection attacks nor doing awkward string
 * concatenation, this is the method for you. It's essential that you pass the
 * correct type of string that you're embedding into via the `stringType`
 * parameter.
 *
 * Example:
 *
 * ```js
 * const code = te`const str = "abc${te.substring(untrusted, '"')}123";`
 * ```
 */
function substring(text: string, stringType: "'" | '"' | "`"): TE {
  if (typeof text !== "string" || typeof stringType !== "string") {
    throw new Error(`Invalid call to te.substring`);
  }
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
      : inner.replace(/[`$]/g, "\\$&"); // `` strings need both '`' and `$` to be escaped (`\` has already been escaped)
  // Finally return a raw node
  return makeRawNode(escaped);
}

/**
 * Escapes `content` so that it can be safely embedded in a multiline comment.
 */
function subcomment(content: string | number | null | undefined) {
  return makeRawNode(String(content).replace(/\*\//g, "* /"));
}

/**
 * Values that cannot safely be used as the keys on a POJO (`{}`) due to
 * security or similar concerns. For example `__proto__` is disallowed.
 */
const disallowedKeys: Array<string | symbol | number> = [
  ...Object.getOwnPropertyNames(Object.prototype),
  ...Object.getOwnPropertySymbols(Object.prototype),
];

/**
 * Returns true if the given key is safe to set as the key of a POJO (without a
 * null prototype), false otherwise.
 */
export const isSafeObjectPropertyName = (key: string | symbol | number) =>
  (typeof key === "number" ||
    typeof key === "symbol" ||
    (typeof key === "string" &&
      /^(?:[0-9a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key))) &&
  !disallowedKeys.includes(key);

/**
 * Returns true if you can use the given key as the key to a POJO without
 * requiring quote marks or square braces.
 *
 * @remarks
 * Doesn't allow it to start with two underscores.
 */
const canBeObjectKeyWithoutQuotes = (
  key: string | symbol | number,
): key is string | number =>
  Number.isFinite(key) ||
  (typeof key === "string" &&
    (key === "_" || /^(?:[a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key)));

/**
 * If this returns true then the given `name` is allowed to be a variable name
 * in JavaScript. If it returns false then it may or may not be safe to use it
 * as a variable name.
 */
function isValidVariableName(name: string): boolean {
  if (reservedWords.has(name)) {
    return false;
  }
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    return false;
  }
  return true;
}

/**
 * Asserts that the given `name` is allowed to be used as an identifier
 * (variable name, function name, etc); and if so it returns a TE node
 * representing this identifier. If disallowed, will throw an error.
 */
function identifier(name: string) {
  if (typeof name !== "string" || !isValidVariableName(name)) {
    throw new Error(`Invalid identifier name '${name}'`);
  }
  return makeRawNode(name);
}

// TODO: rename to `ensureSafeKey` or `safeKeyOrThrow` or something?
/**
 * Checks that the given `key` is not explicitly disallowed as a key on a POJO and returns a TE node representing it. If disallowed, an error will be thrown. Useful for building easy to read objects:
 *
 * ```js
 * const obj = te.run`return { ${te.identifier("frogs")}: "frogs" }`;
 * ```
 *
 * IMPORTANT: It's strongly recommended that instead of defining an object via
 * `const obj = { ${te.dangerousKey(untrustedKey)}: value }` you instead use
 * `const obj = Object.create(null);` and then set the properties on the resulting
 * object via `${obj}${te.set(untrustedKey, true)} = value;` - this prevents
 * attacks such as **prototype polution** since properties like `__proto__` are
 * not special on null-prototype objects, whereas they can cause havok in
 * regular `{}` objects (POJOs).
 */
function dangerousKey(key: string | symbol | number): TE {
  if (isSafeObjectPropertyName(key)) {
    if (canBeObjectKeyWithoutQuotes(key)) {
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
 *
 * DO NOT USE THIS FOR ASSIGNMENT!
 */
function get(key: string | symbol | number): TE {
  return typeof key === "string" && canAccessViaDot(key)
    ? // ._mySimpleProperty
      makeRawNode(`.${key}`)
    : // ["@@meaning"]
    typeof key === "string" || (typeof key === "number" && Number.isFinite(key))
    ? makeRawNode(`[${toJSON(key)}]`)
    : te`[${te.lit(key)}]`;
}

/**
 * Accesses the key of an object via optional-chaining:
 * `obj${te.optionalGet(key)}` would become `obj?.foo` or `obj?.["1foo"]` as
 * appropriate.
 *
 * DO NOT USE THIS FOR ASSIGNMENT!
 */
function optionalGet(key: string | symbol | number): TE {
  return typeof key === "string" && canAccessViaDot(key)
    ? // ?._mySimpleProperty
      makeRawNode(`?.${key}`)
    : // ?.["@@meaning"]
    typeof key === "string" || (typeof key === "number" && Number.isFinite(key))
    ? makeRawNode(`?.[${toJSON(key)}]`)
    : te`?.[${te.lit(key)}]`;
}

// TODO: rename this. 'leftSet'? 'leftAccess'? 'safeAccess'?
/**
 * Access to the key of an object either via `.` or `[]` as appropriate ready
 * for being assigned to; `obj${te.set(key)}` would become `obj.foo` or
 * `obj["1foo"]` as appropriate. Note this is different to `get` because it
 * performs additional checks.
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
      makeRawNode(`.${key}`)
    : // ["@@meaning"]
    typeof key === "string" || (typeof key === "number" && Number.isFinite(key))
    ? makeRawNode(`[${toJSON(key)}]`)
    : te`[${te.lit(key)}]`;
}

/**
 * @experimental
 */
function tempVar(symbol = Symbol()): TE {
  if (typeof symbol !== "symbol") {
    throw new Error(`Invalid call to te.tempVar`);
  }
  return makeTemporaryVariableNode(symbol);
}

/**
 * @experimental
 */
function tmp(obj: TE, callback: (tmp: TE) => TE): TE {
  const trustedObj = obj[$$type] !== undefined ? obj : enforceValidNode(obj);
  // ENHANCEMENT: we should be able to reuse these tempvars between tmp calls
  // that aren't nested (or are nested at the same level).
  const varName = te.tempVar();
  return te`(${varName} = ${trustedObj}, ${callback(varName)})`;
}

/**
 * Evaluates the given TE fragment, and returns the result. Note that the
 * fragment must contain a `return` statement for the result to not be
 * undefined.
 */
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
  const fragment =
    fragmentOrStrings[$$type] !== undefined
      ? fragmentOrStrings
      : enforceValidNode(fragmentOrStrings);
  const compiled = compile(fragment);
  const argNames = Object.keys(compiled.refs);
  const argValues = Object.values(compiled.refs);
  if (isDev && activeBatch) {
    throw new Error(
      `te.run called, but batch is active - recommend you use runInBatch`,
    );
  }
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

interface Batch {
  fragment: TE;
  callback: (r: any) => void;
}
let activeBatch: Array<Batch> | null = null;

function runInBatch<TResult>(
  fragment: TE,
  callback: (r: TResult) => void,
): void {
  if (!activeBatch) {
    throw new Error(`te.runInBatch failed - there's no active batch`);
  }
  activeBatch.push({ fragment, callback });
}

function batch(callback: () => void): void {
  if (activeBatch) {
    throw new Error(`te.batch failed - there's already a batch in progress`);
  }
  let batch: Array<Batch>;
  try {
    activeBatch = [];
    callback();
    batch = activeBatch;
  } finally {
    activeBatch = null;
  }
  if (batch.length === 0) {
    return;
  }
  const finalCode = te`return [\n${te.join(
    batch.map((entry) => entry.fragment),
    ",\n",
  )}\n];`;
  const result = te.run<any[]>(finalCode);
  for (let i = 0, l = batch.length; i < l; i++) {
    batch[i].callback(result[i]);
  }
}

/** Because `new Function` retains the scope, we do it at top level to avoid capturing extra values */
function newFunction(...args: string[]) {
  return new Function(...args);
}

/**
 * Join some TE items together, optionally separated by a string. Useful when
 * dealing with lists of TE nodes, for example a dynamic list of object
 * properties.
 */
function join(items: Array<TE>, separator = ""): TE {
  if (!Array.isArray(items)) {
    throw new Error(
      `[tamedevil] Invalid te.join call - the first argument should be an array, but it was '${String(
        items,
      )}'.`,
    );
  }
  if (typeof separator !== "string") {
    throw new Error(
      `[tamedevil] Invalid separator passed to te.join - must be a string, but we received '${String(
        separator,
      )}'`,
    );
  }

  // Short circuit joins of size <= 1
  if (items.length === 0) {
    return blankNode;
  } else if (items.length === 1) {
    const rawNode = items[0];
    const node: TE =
      rawNode[$$type] !== undefined
        ? rawNode
        : enforceValidNode(rawNode, `join item ${0}`);
    return node;
  }

  const hasSeparator = separator.length > 0;
  let currentText = "";
  const currentItems: Array<TENode> = [];
  for (let i = 0, l = items.length; i < l; i++) {
    const rawNode = items[i];
    const node: TE =
      rawNode[$$type] !== undefined
        ? rawNode
        : enforceValidNode(rawNode, `join item ${i}`);
    const addSeparator = i > 0 && hasSeparator;
    if (addSeparator) {
      currentText += separator;
    }
    if (node[$$type] === "QUERY") {
      for (const innerNode of node.n) {
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

/**
 * Indicates that the given fragment should be indented when output in debug
 * mode. (Has no effect in production mode.)
 *
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
      : fragmentOrStrings[$$type] !== undefined
      ? fragmentOrStrings
      : enforceValidNode(fragmentOrStrings);
  if (!isDev) {
    return fragment;
  }
  return makeIndentNode(fragment);
}

/**
 * If the given condition is true, the fragment will be wrapped with an indent
 * node, otherwise it will be returned verbatim.
 */
function indentIf(condition: boolean, fragment: TE): TE {
  const trusted =
    fragment[$$type] !== undefined ? fragment : enforceValidNode(fragment);
  return isDev && condition ? makeIndentNode(trusted) : trusted;
}

/**
 * Makes safe identifiers
 *
 * @experimental
 * @internal
 */
export class Idents {
  // Initialized with forbidden words
  idents = new Set(reservedWords);

  /**
   * Don't allow using these identifiers (presumably because they're already in use).
   */
  forbid(identifiers: string[]) {
    for (const identifier in identifiers) {
      this.idents.add(identifier);
    }
  }

  // TODO: we need a proper understanding of lexical scope so we can generate truly safe identifiers
  makeSafeIdentifier(str: string): string {
    const { idents } = this;
    const safe = "i_" + str.replace(/[^a-zA-Z0-9_$]+/g, "").replace(/_+/, "_");
    let ident: string | undefined = undefined;
    for (let i = 1; i < 10000; i++) {
      const val = safe + (i > 1 ? String(i) : "");
      if (!idents.has(val)) {
        ident = val;
        break;
      }
    }
    if (!ident) {
      throw new Error("Too many identifiers!");
    }
    idents.add(ident);
    return ident;
  }
}

const te = teBase as TamedEvil;
export default te;

export {
  batch,
  cache,
  compile,
  dangerousKey,
  dangerouslyIncludeRawCode,
  run as eval,
  get,
  identifier,
  isTE,
  join,
  lit,
  lit as literal,
  optionalGet,
  ref,
  run,
  runInBatch,
  set,
  subcomment,
  substring,
  te,
  tempVar,
  tmp,
  undefinedNode as undefined,
};

export interface TamedEvil {
  (strings: TemplateStringsArray, ...values: Array<TE>): TE;
  te: TamedEvil;
  cache: typeof cache;
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
  runInBatch: typeof runInBatch;
  batch: typeof batch;
  compile: typeof compile;
  indent: typeof indent;
  indentIf: typeof indentIf;
  undefined: TE;
  blank: TE;
  isTE: typeof isTE;
  dangerouslyIncludeRawCode: typeof dangerouslyIncludeRawCode;
}

const attributes = {
  te,
  cache,
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
  runInBatch,
  batch,
  compile,
  indent,
  indentIf,
  undefined: undefinedNode,
  blank: blankNode,
  isTE,
  dangerouslyIncludeRawCode,
};

Object.entries(attributes).forEach(([exportName, value]) => {
  if (!(value as any).$$export) {
    exportAs(value, exportName);
  }
});

Object.assign(teBase, attributes);
