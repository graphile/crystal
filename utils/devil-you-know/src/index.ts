import LRU from "@graphile/lru";
import * as assert from "assert";
import { inspect } from "util";

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
      value: { moduleName: "devil-you-know", exportName },
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
const $$type = Symbol("devil-you-know-type");

/**
 * Represents raw DYK, the text will be output verbatim into the compiled code.
 */
export interface DYKRawNode {
  readonly [$$type]: "RAW";
  /** text */
  readonly t: string;
}

/**
 * Represents an DYK value that will be replaced with a closure variable in the
 * compiled DYK statement.
 */
export interface DYKRefNode {
  readonly [$$type]: "REF";
  /** value */
  readonly v: any;
}

/**
 * Represents that the DYK inside this should be indented when pretty printed.
 */
export interface DYKIndentNode {
  readonly [$$type]: "INDENT";
  /** content */
  readonly c: DYKQuery;
}

/** @internal */
export type DYKNode = DYKRawNode | DYKRefNode | DYKIndentNode;

/** @internal */
export interface DYKQuery {
  readonly [$$type]: "QUERY";
  /** nodes */
  readonly n: ReadonlyArray<DYKNode>;
}

/**
 * Representation of DYK, identifiers, values, etc; to generate a query that
 * can be issued to the database it needs to be fed to `dyk.compile`.
 */
export type DYK = DYKNode | DYKQuery;

/**
 * This helps us to avoid GC overhead of allocating new raw nodes all the time
 * when they're likely to be the same values over and over. The average raw
 * string is likely to be around 20 bytes; allowing for 50 bytes once this has
 * been turned into an object, 10000 would mean 500kB which seems an acceptable
 * amount of memory to consume for this.
 */
const CACHE_RAW_NODES = new LRU<string, DYKRawNode>({ maxLength: 10000 });

function makeRawNode(text: string, exportName?: string): DYKRawNode {
  const n = CACHE_RAW_NODES.get(text);
  if (n) {
    return n;
  }
  if (typeof text !== "string") {
    throw new Error(
      `[devil-you-know] Invalid argument to makeRawNode - expected string, but received '${inspect(
        text,
      )}'`,
    );
  }
  const newNode: DYKRawNode = {
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
function makeRefNode(rawValue: any): DYKRefNode {
  return Object.freeze({
    [$$type]: "REF" as const,
    v: rawValue,
  });
}

function makeIndentNode(content: DYK): DYKIndentNode {
  return Object.freeze({
    [$$type]: "INDENT" as const,
    c: content[$$type] === "QUERY" ? content : makeQueryNode([content]),
  });
}

function makeQueryNode(nodes: ReadonlyArray<DYKNode>): DYKQuery {
  return Object.freeze({
    [$$type]: "QUERY" as const,
    n: nodes,
  });
}

function isDYK(node: unknown): node is DYK {
  return (
    typeof node === "object" &&
    node !== null &&
    typeof node[$$type] === "string"
  );
}

function enforceValidNode(node: DYKQuery, where?: string): DYKQuery;
function enforceValidNode(node: DYKNode, where?: string): DYKNode;
function enforceValidNode(node: DYK, where?: string): DYK;
function enforceValidNode(node: unknown, where?: string): DYK {
  if (isDYK(node)) {
    return node;
  }
  throw new Error(
    `[devil-you-know] Invalid expression. Expected an DYK item${
      where ? ` at ${where}` : ""
    } but received '${inspect(
      node,
    )}'. This may mean that there is an issue in the DYK expression where a dynamic value was not escaped via 'dyk.ref(...)', an embedded string wasn't wrapped with 'dyk.string(...)', or a DYK expression was added without using the \`dyk\` tagged template literal.`,
  );
}

/**
 * Accepts an dyk`...` expression and compiles it out to DYK text with
 * placeholders, and the values to substitute for these values.
 */
function out(fragment: DYK): {
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
        "[devil-you-know] This DYK statement would contain too many placeholders; devil-you-know supports at most 65535 placeholders. To solve this, consider passing multiple values in using a single array or object.",
      );
    }
    const identifier = `_$$_ref_${refCount}`;
    refMap.set(value, identifier);
    refs[identifier] = value;
    return identifier;
  };

  function print(untrustedInput: DYK, indent = 0) {
    /**
     * Join this to generate the DYK query
     */
    const dykFragments: string[] = [];

    const trustedInput = enforceValidNode(untrustedInput, ``);
    const items: ReadonlyArray<DYKNode> =
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
          dykFragments.push(
            isDev ? item.t.replace(/\n/g, "\n" + "  ".repeat(indent)) : item.t,
          );
          break;
        }
        case "REF": {
          const identifier = makeRef(item.v);
          dykFragments.push(identifier);
          break;
        }
        case "INDENT": {
          assert.ok(isDev, "INDENT nodes only allowed in development mode");
          dykFragments.push(
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
          throw new Error(`Unsupported node found in DYK: ${inspect(never)}`);
        }
      }
    }
    return dykFragments.join("");
  }
  const string = isDev
    ? print(fragment).replace(/\n\s*\n/g, "\n")
    : print(fragment);

  return {
    string,
    refs,
  };
}

// LRU not necessary
const CACHE_SIMPLE_FRAGMENTS = new Map<string, DYKRawNode>();

/**
 * A template string tag that creates a `DYK` query out of some strings and
 * some values. Use this to construct all PostgreDYK queries to avoid DYK
 * injection.
 *
 * Note that using this function, the user *must* specify if they are injecting
 * raw text. This makes a DYK injection vulnerability harder to create.
 */
const dykBase = function dyk(
  strings: TemplateStringsArray,
  ...values: Array<DYK>
): DYK {
  if (!Array.isArray(strings) || !strings.raw) {
    throw new Error(
      "[devil-you-know] dyk should be used as a template literal, not a function call.",
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

  // Special case dyk`${...}` - just return the node directly
  if (stringsLength === 2 && strings[0] === "" && strings[1] === "") {
    return values[0];
  }

  const items: Array<DYKNode> = [];
  let currentText = "";
  for (let i = 0, l = stringsLength; i < l; i++) {
    const text = strings[i];
    if (typeof text !== "string") {
      throw new Error(
        "[devil-you-know] dyk must be invoked as a template literal, not a function call.",
      );
    }
    currentText += text;
    if (i < l - 1) {
      const rawVal = values[i];
      const valid: DYK = enforceValidNode(
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
 * Creates a DYK item for a raw code string. Just plain ol‘ raw code. This
 * method is dangerous though because it involves no escaping, so proceed with
 * caution! It's very very rarely warranted - there is likely a safer way of
 * achieving your goal. DO NOT USE THIS WITH UNTRUSTED INPUT!
 */
function raw(text: string): DYK {
  if (!rawWarningOutput) {
    rawWarningOutput = true;
    try {
      throw new Error("dyk.raw first invoked here");
    } catch (e: any) {
      console.warn(
        `[devil-you-know] WARNING: you're using the dyk.raw escape hatch, usage of this API is rarely required and is highly discouraged. Please be sure this is what you intend. ${e.stack}`,
      );
    }
  }
  if (typeof text !== "string") {
    throw new Error(
      `[devil-you-know] dyk.raw must be passed a string, but it was passed '${inspect(
        text,
      )}'.`,
    );
  }
  return makeRawNode(text);
}

/**
 * Creates a DYK item for a value that will be included in our final query.
 * This value will be added in a way which avoids DYK injection.
 */
function ref(val: any): DYK {
  return makeRefNode(val);
}

const blankNode = makeRawNode(``, "blank");
const undefinedNode = makeRawNode(`undefined`, "undefined");

/**
 * If the value is simple will inline it into the query, otherwise will defer
 * to `dyk.ref`.
 */
function lit(val: any): DYK {
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
    return makeRawNode(JSON.stringify(primitive));
  } else {
    return ref(val);
  }
}

const disallowedKeys = Object.keys(
  Object.getOwnPropertyDescriptors(Object.prototype),
);
/**
 * Is safe to set as the key of a POJO (without a null prototype) and doesn't
 * include any characters that would make it unsafe in eval'd code (before or
 * after JSON.stringify).
 */
export const isSafeObjectPropertyName = (key: string) =>
  /^(?:[0-9a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key) &&
  !disallowedKeys.includes(key);

/**
 * Can represent as an identifier rather than a string key
 *
 * @remarks
 * Doesn't allow it to start with two underscores.
 */
export const canRepresentAsIdentifier = (key: string) =>
  key === "_" || /^(?:[a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key);

function key(key: string): DYK {
  if (typeof key !== "string") {
    throw new Error("Invalid call to dyk.key - expected a string");
  }
  if (isSafeObjectPropertyName(key)) {
    if (canRepresentAsIdentifier(key)) {
      return makeRawNode(key);
    } else {
      return makeRawNode(JSON.stringify(key));
    }
  } else {
    throw new Error(
      `Forbidden object key: ${JSON.stringify(
        key,
      )}; consider using 'Object.create(null)' and assigning properties using dyk.lit.`,
    );
  }
}

function run(fragment: DYK): any {
  const compiled = out(fragment);
  const argNames = Object.keys(compiled.refs);
  const argValues = Object.values(compiled.refs);
  return new Function(...argNames, compiled.string)(...argValues);
}

/**
 * Join some DYK items together, optionally separated by a string. Useful when
 * dealing with lists of DYK items, for example a dynamic list of columns or
 * variadic DYK function arguments.
 */
function join(items: Array<DYK>, separator = ""): DYK {
  if (!Array.isArray(items)) {
    throw new Error(
      `[devil-you-know] Invalid dyk.join call - the first argument should be an array, but it was '${inspect(
        items,
      )}'.`,
    );
  }
  if (typeof separator !== "string") {
    throw new Error(
      `[devil-you-know] Invalid separator passed to dyk.join - must be a string, but we received '${inspect(
        separator,
      )}'`,
    );
  }

  // Short circuit joins of size <= 1
  if (items.length === 0) {
    return blankNode;
  } else if (items.length === 1) {
    const rawNode = items[0];
    const node: DYK = enforceValidNode(rawNode, `join item ${0}`);
    return node;
  }

  const hasSeparator = separator.length > 0;
  let currentText = "";
  const currentItems: Array<DYKNode> = [];
  for (let i = 0, l = items.length; i < l; i++) {
    const rawNode = items[i];
    const addSeparator = i > 0 && hasSeparator;
    const node: DYK = enforceValidNode(rawNode, `join item ${i}`);
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

function expandQueryNodes(node: DYKQuery): ReadonlyArray<DYKNode> {
  return node.n;
}

/**
 * WARNING: all lines will be indented, without any parsing, so if there are template literals that contain newlines, spaces will be added inside these too.
 */
function indent(fragment: DYK): DYK;
function indent(strings: TemplateStringsArray, ...values: Array<DYK>): DYK;
function indent(
  fragmentOrStrings: DYK | TemplateStringsArray,
  ...values: Array<DYK>
): DYK {
  const fragment =
    "raw" in fragmentOrStrings
      ? dyk(fragmentOrStrings, ...values)
      : fragmentOrStrings;
  if (!isDev) {
    return fragment;
  }
  return makeIndentNode(fragment);
}

function indentIf(condition: boolean, fragment: DYK): DYK {
  return isDev && condition ? makeIndentNode(fragment) : fragment;
}

const dyk = dykBase as DevilYouKnow;
export default dyk;

export {
  dyk,
  ref,
  lit,
  join,
  key,
  run,
  out,
  undefinedNode as undefined,
  isDYK,
};

export interface DevilYouKnow {
  (strings: TemplateStringsArray, ...values: Array<DYK>): DYK;
  dyk: DevilYouKnow;
  ref: typeof ref;
  reference: typeof ref;
  lit: typeof lit;
  literal: typeof lit;
  key: typeof key;
  run: typeof run;
  out: typeof out;
  output: typeof out;
  indent: typeof indent;
  indentIf: typeof indentIf;
  undefined: DYK;
  blank: DYK;
  isDYK: typeof isDYK;
}

const attributes = {
  dyk,
  ref,
  reference: ref,
  lit,
  literal: lit,
  join,
  key,
  run,
  out,
  output: out,
  indent,
  indentIf,
  undefined: undefinedNode,
  blank: blankNode,
  isDYK,
};

Object.entries(attributes).forEach(([exportName, value]) => {
  if (!(value as any).$$export) {
    exportAs(value, exportName);
  }
});

Object.assign(dykBase, attributes);
