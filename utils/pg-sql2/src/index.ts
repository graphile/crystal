import LRU from "@graphile/lru";
import * as assert from "assert";
import { inspect } from "util";

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
      value: { moduleName: "pg-sql2", exportName },
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
const $$type = Symbol("pg-sql2-type");

/**
 * Represents raw SQL, the text will be output verbatim into the compiled query.
 */
export interface SQLRawNode {
  readonly [$$type]: "RAW";
  readonly text: string;
}

/**
 * Represents an SQL identifier such as table, column, function, etc name. These
 * identifiers will be automatically escaped when compiled, respecting any
 * reserved words.
 */
export interface SQLIdentifierNode {
  readonly [$$type]: "IDENTIFIER";
  readonly s: symbol;
  readonly n: string;
}

/**
 * A value that can be used in `sql.value(...)`; note that objects are **NOT**
 * valid values; you must `JSON.stringify(obj)` or similar.
 */
export type SQLRawValue =
  | string
  | number
  | boolean
  | null
  | ReadonlyArray<SQLRawValue>;

/**
 * Represents an SQL value that will be replaced with a placeholder in the
 * compiled SQL statement.
 */
export interface SQLValueNode {
  readonly [$$type]: "VALUE";
  readonly value: SQLRawValue;
}

/**
 * Represents that the SQL inside this should be indented when pretty printed.
 */
export interface SQLIndentNode {
  readonly [$$type]: "INDENT";
  readonly content: SQLQuery;
  readonly flags: number;
}

/**
 * Informs pg-sql2 to treat symbol2 as if it were the same as symbol1
 */
export interface SQLSymbolAliasNode {
  readonly [$$type]: "SYMBOL_ALIAS";
  readonly as: symbol;
  readonly bs: symbol;
}

/**
 * A placeholder that should be replaced at compile time using one of the
 * replacements provided.
 */
export interface SQLPlaceholderNode {
  readonly [$$type]: "PLACEHOLDER";
  readonly symbol: symbol;
  readonly fallback?: SQL;
}

/** @internal */
export type SQLNode =
  | SQLRawNode
  | SQLValueNode
  | SQLIdentifierNode
  | SQLIndentNode
  | SQLSymbolAliasNode
  | SQLPlaceholderNode;

/** @internal */
export interface SQLQuery {
  readonly [$$type]: "QUERY";
  readonly nodes: ReadonlyArray<SQLNode>;
  readonly flags: number;
}
const FLAG_HAS_PARENS = 1 << 0;

/**
 * Representation of SQL, identifiers, values, etc; to generate a query that
 * can be issued to the database it needs to be fed to `sql.compile`.
 */
export type SQL = SQLNode | SQLQuery;

/**
 * This helps us to avoid GC overhead of allocating new raw nodes all the time
 * when they're likely to be the same values over and over. The average raw
 * string is likely to be around 20 bytes; allowing for 50 bytes once this has
 * been turned into an object, 10000 would mean 500kB which seems an acceptable
 * amount of memory to consume for this.
 */
const CACHE_RAW_NODES = new LRU<string, SQLRawNode>({ maxLength: 10000 });

/**
 * Given a string, this will return an SQL-identifier-safe version of the
 * string using only the characters [0-9a-z_], at least 1 and at most 50
 * characters in length, with no leading, trailing or consecutive underscores.
 * Information loss is likely, this is only to aid with debugging.
 */
function mangleName(str: string): string {
  return (
    str
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
      .substr(0, 50)

      // Don't end in an underscore, since we'll be adding one anyway (and we
      // don't want double-underscores). This must be done after length limiting
      // otherwise we might prune to a length that ends in an underscore.
      .replace(/_$/, "") || "local"
  );
}

// Alas we cannot use WeakMap to cache this because symbols cannot be WeakMap
// keys (and we wouldn't want to open the user to memory exhaustion via a map).
// Symbol.prototype.description is available since Node 11.15.0, 12.4.0.
function getSymbolName(symbol: symbol): string {
  return mangleName(symbol.description || "local");
}

// Copied from https://github.com/brianc/node-postgres/blob/860cccd53105f7bc32fed8b1de69805f0ecd12eb/lib/client.js#L285-L302
// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
// Trivial performance optimizations by Benjie.
// Replaced with regexp because it's 11x faster by Benjie.
export function escapeSqlIdentifier(str: string): string {
  return `"${str.replace(/"/g, '""')}"`;
}

function makeRawNode(text: string, exportName?: string): SQLRawNode {
  const n = CACHE_RAW_NODES.get(text);
  if (n) {
    return n;
  }
  if (typeof text !== "string") {
    throw new Error(
      `[pg-sql2] Invalid argument to makeRawNode - expected string, but received '${inspect(
        text,
      )}'`,
    );
  }
  const newNode: SQLRawNode = {
    [$$type]: "RAW" as const,
    text,
  };
  if (exportName) {
    exportAs(newNode, exportName);
  }
  Object.freeze(newNode);
  CACHE_RAW_NODES.set(text, newNode);
  return newNode;
}

// Simple function to help V8 optimize it.
function makeIdentifierNode(
  s: symbol,
  n = getSymbolName(s),
): SQLIdentifierNode {
  return Object.freeze({
    [$$type]: "IDENTIFIER" as const,
    s,
    n,
  });
}

// Simple function to help V8 optimize it.
function makeValueNode(rawValue: SQLRawValue): SQLValueNode {
  return Object.freeze({
    [$$type]: "VALUE" as const,
    value: rawValue,
  });
}

function makeIndentNode(content: SQL): SQLIndentNode {
  const flags = content[$$type] === "QUERY" ? content.flags : 0;
  return Object.freeze({
    [$$type]: "INDENT" as const,
    flags,
    content: content[$$type] === "QUERY" ? content : makeQueryNode([content]),
  });
}

function makeSymbolAliasNode(a: symbol, b: symbol): SQLSymbolAliasNode {
  return Object.freeze({
    [$$type]: "SYMBOL_ALIAS" as const,
    as: a,
    bs: b,
  });
}

function makePlaceholderNode(
  symbol: symbol,
  fallback?: SQL,
): SQLPlaceholderNode {
  return Object.freeze({
    [$$type]: "PLACEHOLDER" as const,
    symbol,
    fallback,
  });
}

function makeQueryNode(nodes: ReadonlyArray<SQLNode>, flags = 0): SQLQuery {
  // compress the nodes - squash all adjoining RAW nodes together
  let replacementNodes: Array<SQLNode> = [];
  let currentText = "";
  const l = nodes.length;
  for (let i = 0; i < l; i++) {
    const node = nodes[i];
    if (node[$$type] === "RAW") {
      currentText += node.text;
      if (currentText !== "") {
        if (!replacementNodes) {
          replacementNodes = nodes.slice(0, i - 1);
        }
      }
    } else if (replacementNodes) {
      if (currentText !== "") {
        replacementNodes.push(makeRawNode(currentText));
        currentText = "";
      }
      replacementNodes.push(node);
    }
  }
  if (currentText !== "") {
    replacementNodes.push(makeRawNode(currentText));
    currentText = "";
  }
  return Object.freeze({
    [$$type]: "QUERY" as const,
    nodes: replacementNodes ?? nodes,
    flags,
  });
}

function isSQL(node: unknown): node is SQL {
  return (
    typeof node === "object" &&
    node !== null &&
    typeof node[$$type] === "string"
  );
}

function enforceValidNode(node: SQLQuery, where?: string): SQLQuery;
function enforceValidNode(node: SQLNode, where?: string): SQLNode;
function enforceValidNode(node: SQL, where?: string): SQL;
function enforceValidNode(node: unknown, where?: string): SQL {
  if (isSQL(node)) {
    return node;
  }
  throw new Error(
    `[pg-sql2] Invalid expression. Expected an SQL item${
      where ? ` at ${where}` : ""
    } but received '${inspect(
      node,
    )}'. This may mean that there is an issue in the SQL expression where a dynamic value was not escaped via 'sql.value(...)', an identifier wasn't wrapped with 'sql.identifier(...)', or a SQL expression was added without using the \`sql\` tagged template literal.`,
  );
}

/**
 * Accepts an sql`...` expression and compiles it out to SQL text with
 * placeholders, and the values to substitute for these values.
 */
export function compile(
  sql: SQL,
  options?: { placeholderValues?: Map<symbol, SQL> },
): {
  text: string;
  values: SQLRawValue[];
} {
  const placeholderValues = options?.placeholderValues;
  /**
   * Values hold the JavaScript values that are represented in the query string
   * by placeholders. They are eager because they were provided before compile
   * time.
   */
  const values: SQLRawValue[] = [];
  let valueCount = 0;

  /**
   * When we come across a symbol in our identifier, we create a unique alias
   * for it that shouldn’t be in the users schema. This helps maintain sanity
   * when constructing large SQL queries with many aliases.
   */
  const symbolToIdentifier = new Map<symbol, string>();

  /**
   * When the same description is used more than once in different symbols we
   * must generate different identifiers, so we keep a counter of each symbol
   * usage here.
   */
  const descCounter: {
    [description: string]: number;
  } = {};

  /**
   * Makes a friendly name to use in the query for the given SymbolAndName.
   */
  function makeIdentifierForSymbol(symbol: symbol, safeDesc: string) {
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

  function print(untrustedInput: SQL, indent = 0) {
    /**
     * Join this to generate the SQL query
     */
    const sqlFragments: string[] = [];

    const trustedInput = enforceValidNode(untrustedInput, ``);
    const items: ReadonlyArray<SQLNode> =
      trustedInput[$$type] === "QUERY"
        ? expandQueryNodes(trustedInput)
        : [trustedInput];
    const itemCount = items.length;

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
      const item = enforceValidNode(items[itemIndex], `item ${itemIndex}`);
      switch (item[$$type]) {
        case "RAW": {
          if (item.text === "") {
            // No need to add blank raw text!
            break;
          }
          // Special-case `;` - remove the previous \n
          if (isDev && itemIndex === itemCount - 1 && item.text === ";") {
            const prevIndex = sqlFragments.length - 1;
            const prev = sqlFragments[prevIndex];
            if (prev.endsWith("\n")) {
              sqlFragments[prevIndex] = prev.substring(0, prev.length - 1);
            }
          }
          sqlFragments.push(
            isDev
              ? item.text.replace(/\n/g, "\n" + "  ".repeat(indent))
              : item.text,
          );
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
          valueCount++;
          if (valueCount > 65535) {
            throw new Error(
              "[pg-sql2] This SQL statement would contain too many placeholders; PostgreSQL supports at most 65535 placeholders. To solve this, consider refactoring the query to use arrays/unnest where possible, or split it into multiple queries.",
            );
          }
          values[valueCount - 1] = item.value;
          sqlFragments.push(`$${valueCount}`);
          break;
        }
        case "INDENT": {
          assert.ok(isDev, "INDENT nodes only allowed in development mode");
          sqlFragments.push(
            "\n" +
              "  ".repeat(indent + 1) +
              print(item.content, indent + 1) +
              "\n" +
              "  ".repeat(indent),
          );
          break;
        }
        case "SYMBOL_ALIAS": {
          const symbol1 = item.as;
          const symbol2 = item.bs;
          const name1 = symbolToIdentifier.get(symbol1);
          const name2 = symbolToIdentifier.get(symbol2);
          if (name1 && name2 && name1 !== name2) {
            throw new Error(
              "ERROR: sql.symbolAlias was used after the symbols were used, they already have (non-matching) aliases",
            );
          }
          if (name1) {
            symbolToIdentifier.set(symbol2, name1);
          } else if (name2) {
            symbolToIdentifier.set(symbol1, name2);
          } else {
            const identifierForSymbol = makeIdentifierForSymbol(
              item.as,
              getSymbolName(item.as),
            );
            symbolToIdentifier.set(symbol1, identifierForSymbol);
            symbolToIdentifier.set(symbol2, identifierForSymbol);
          }
          break;
        }
        case "PLACEHOLDER": {
          // TODO: symbol substitutes?
          const resolvedPlaceholder =
            placeholderValues?.get(item.symbol) ?? item.fallback;
          if (!resolvedPlaceholder) {
            throw new Error(
              "ERROR: sql.placeholder was used in this query, but no value was supplied for it, and it has no fallback.",
            );
          }
          sqlFragments.push(print(resolvedPlaceholder, indent));
          break;
        }
        default: {
          const never: never = item;
          // This cannot happen
          throw new Error(`Unsupported node found in SQL: ${inspect(never)}`);
        }
      }
    }
    return sqlFragments.join("");
  }
  const text = isDev ? print(sql).replace(/\n\s*\n/g, "\n") : print(sql);

  return {
    text,
    values,
  };
}

// LRU not necessary
const CACHE_SIMPLE_FRAGMENTS = new Map<string, SQLRawNode>();

/**
 * A template string tag that creates a `SQL` query out of some strings and
 * some values. Use this to construct all PostgreSQL queries to avoid SQL
 * injection.
 *
 * Note that using this function, the user *must* specify if they are injecting
 * raw text. This makes a SQL injection vulnerability harder to create.
 */
const sqlBase = function sql(
  strings: TemplateStringsArray,
  ...values: Array<SQL>
): SQL {
  if (!Array.isArray(strings) || !strings.raw) {
    throw new Error(
      "[pg-sql2] sql should be used as a template literal, not a function call.",
    );
  }
  const stringsLength = strings.length;
  const first = strings[0];
  // Reduce memory churn with a cache
  if (stringsLength === 1) {
    if (first === "") {
      return blank;
    }
    let node = CACHE_SIMPLE_FRAGMENTS.get(first);
    if (!node) {
      node = makeRawNode(first);
      CACHE_SIMPLE_FRAGMENTS.set(first, node);
    }
    return node;
  }

  // Special case sql`${...}` - just return the node directly
  if (stringsLength === 2 && strings[0] === "" && strings[1] === "") {
    return values[0];
  }

  const items: Array<SQLNode> = [];
  for (let i = 0, l = stringsLength; i < l; i++) {
    const text = strings[i];
    if (typeof text !== "string") {
      throw new Error(
        "[pg-sql2] sql.query must be invoked as a template literal, not a function call.",
      );
    }
    if (text.length > 0) {
      items.push(makeRawNode(text));
    }
    if (i < l - 1) {
      const rawVal = values[i];
      const valid: SQL = enforceValidNode(
        rawVal,
        `template literal placeholder ${i}`,
      );
      if (valid[$$type] === "QUERY") {
        // NOTE: this clears the flags

        const itemsCount = items.length;
        const nodes = expandQueryNodes(valid);
        const nodeCount = nodes.length;

        // Pre-allocate space
        // TODO: check this actually improves performance
        items.length = itemsCount + nodeCount;

        for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
          items[itemsCount + nodeIndex] = nodes[nodeIndex];
        }
      } else {
        items.push(valid);
      }
    }
  }
  return makeQueryNode(items);
};

let sqlRawWarningOutput = false;
/**
 * Creates a SQL item for some raw SQL text. Just plain ol‘ raw SQL. This
 * method is dangerous though because it involves no escaping, so proceed with
 * caution! It's very very rarely warranted - there is likely a safer way of
 * achieving your goal.
 */
export function raw(text: string): SQL {
  if (!sqlRawWarningOutput) {
    sqlRawWarningOutput = true;
    try {
      throw new Error("sql.raw first invoked here");
    } catch (e: any) {
      console.warn(
        `[pg-sql2] WARNING: you're using the sql.raw escape hatch, usage of this API is rarely required and is highly discouraged. Please be sure this is what you intend. ${e.stack}`,
      );
    }
  }
  if (typeof text !== "string") {
    throw new Error(
      `[pg-sql2] sql.raw must be passed a string, but it was passed '${inspect(
        text,
      )}'.`,
    );
  }
  return makeRawNode(text);
}

/**
 * Creates a SQL item for a SQL identifier. A SQL identifier is anything like
 * a table, schema, or column name. An identifier may also have a namespace,
 * thus why many names are accepted.
 */
export function identifier(...names: Array<string | symbol>): SQL {
  // By doing the validation here rather than at compile time we can reduce
  // redundant work - the same sql.identifier can be used in multiple queries.

  const nameCount = names.length;
  if (nameCount === 0) {
    throw new Error(
      "[pg-sql2] Invalid call to sql.identifier() - you must pass at least one argument.",
    );
  }

  const items: SQLNode[] = [];
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
    } else if (typeof name === "symbol") {
      if (currentText !== "") {
        items.push(makeRawNode(currentText));
        currentText = "";
      }
      // The final name has to be evaluated at compile-time, but we can at least mangle it up front.
      items.push(makeIdentifierNode(name));
    } else {
      throw new Error(
        `[pg-sql2] Invalid argument to sql.identifier - argument ${i} (0-indexed) should be a string or a symbol, but was '${inspect(
          name,
        )}'`,
      );
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
export function value(val: SQLRawValue): SQL {
  return makeValueNode(val);
}

const trueNode = makeRawNode(`TRUE`, "true");
const falseNode = makeRawNode(`FALSE`, "false");
const nullNode = makeRawNode(`NULL`, "null");
export const blank = makeRawNode(``, "blank");
export const dot = makeRawNode(`.`, "dot");
const OPEN_PARENS = makeRawNode(`(`);
const CLOSE_PARENS = makeRawNode(`)`);

/**
 * If the value is simple will inline it into the query, otherwise will defer
 * to `sql.value`.
 */
export function literal(val: string | number | boolean | null): SQL {
  if (typeof val === "string" && val.match(/^[-a-zA-Z0-9_@!$ :".]*$/)) {
    // Examples of things we'd like to be included raw:
    // - 1
    // - myFieldName
    // - @@myFieldName
    // - $myField$
    // - YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM
    return makeRawNode(`'${val}'`);
  } else if (typeof val === "number" && Number.isFinite(val)) {
    if (Number.isInteger(val)) {
      return makeRawNode("" + val);
    } else {
      return makeRawNode(`'${0 + val}'::float`);
    }
  } else if (typeof val === "boolean") {
    return val ? trueNode : falseNode;
  } else if (val == null) {
    return nullNode;
  } else {
    return value(val);
  }
}

/**
 * Join some SQL items together, optionally separated by a string. Useful when
 * dealing with lists of SQL items, for example a dynamic list of columns or
 * variadic SQL function arguments.
 */
export function join(items: Array<SQL>, separator = ""): SQL {
  if (!Array.isArray(items)) {
    throw new Error(
      `[pg-sql2] Invalid sql.join call - the first argument should be an array, but it was '${inspect(
        items,
      )}'.`,
    );
  }
  if (typeof separator !== "string") {
    throw new Error(
      `[pg-sql2] Invalid separator passed to sql.join - must be a string, but we received '${inspect(
        separator,
      )}'`,
    );
  }

  // Short circuit joins of size <= 1
  if (items.length === 0) {
    return blank;
  } else if (items.length === 1) {
    const rawNode = items[0];
    const node: SQL = enforceValidNode(rawNode, `join item ${0}`);
    return node;
  }

  const hasSeparator = separator.length > 0;
  const sepNode = hasSeparator ? makeRawNode(separator) : blank;

  const currentItems: Array<SQLNode> = [];
  for (let i = 0, l = items.length; i < l; i++) {
    const rawNode = items[i];
    const addSeparator = i > 0 && hasSeparator;
    const node: SQL = enforceValidNode(rawNode, `join item ${i}`);
    if (addSeparator) {
      currentItems.push(sepNode);
    }
    if (node[$$type] === "QUERY") {
      for (const innerNode of expandQueryNodes(node)) {
        // TODO: optimize
        currentItems.push(innerNode);
      }
    } else {
      currentItems.push(node);
    }
  }
  return makeQueryNode(currentItems);
}

function expandQueryNodes(node: SQLQuery): ReadonlyArray<SQLNode> {
  const parens = (node.flags & FLAG_HAS_PARENS) === FLAG_HAS_PARENS;
  if (parens) {
    return [OPEN_PARENS, ...node.nodes, CLOSE_PARENS];
  } else {
    return node.nodes;
  }
}

export function indent(fragment: SQL): SQL;
export function indent(
  strings: TemplateStringsArray,
  ...values: Array<SQL>
): SQL;
export function indent(
  fragmentOrStrings: SQL | TemplateStringsArray,
  ...values: Array<SQL>
): SQL {
  const fragment =
    "raw" in fragmentOrStrings
      ? sql(fragmentOrStrings, ...values)
      : fragmentOrStrings;
  if (!isDev) {
    return fragment;
  }
  return makeIndentNode(fragment);
}

export function indentIf(condition: boolean, fragment: SQL): SQL {
  return isDev && condition ? makeIndentNode(fragment) : fragment;
}

const QUOTED_IDENTIFIER_REGEX = /^"[^"]+"$/;
const UNQUOTED_IDENTIFIER_REGEX = /^[a-zA-Z0-9_]+$/;
const NUMBER_REGEX_1 = /^[0-9]+(?:\.[0-9]+)?$/;
const NUMBER_REGEX_2 = /^\.[0-9]+$/;
const STRING_REGEX = /^'[^']+'$/;

/** For determining if a raw SQL string looks like an identifier (for parens reasons) */
function isIdentifierLike(p: string) {
  return p.match(QUOTED_IDENTIFIER_REGEX) || p.match(UNQUOTED_IDENTIFIER_REGEX);
}

function parenthesize(fragment: SQL, inFlags = 0): SQLQuery {
  const flags = inFlags | FLAG_HAS_PARENS;
  if (fragment[$$type] === "QUERY") {
    return makeQueryNode(fragment.nodes, flags);
  } else {
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
export function parens(frag: SQL, force?: boolean): SQL {
  if (frag[$$type] === "QUERY") {
    if ((frag.flags & FLAG_HAS_PARENS) === FLAG_HAS_PARENS) {
      return frag;
    }
    const { nodes } = frag;
    const nodeCount = nodes.length;
    if (nodeCount === 0) {
      throw new Error(
        `You're wrapping an empty fragment in parens; this is likely an error. If this is deliberate, please explicitly use parenthesis.`,
      );
    } else if (nodeCount === 1) {
      return parens(nodes[0], force);
    } else if (force) {
      return parenthesize(frag);
    } else if (nodeCount === 2) {
      // Check for `IDENTIFIER.rawtext`
      // TODO: check for 'rawtext.IDENTIFIER' too
      const [identifier, rawtext] = nodes;
      if (
        identifier[$$type] !== "IDENTIFIER" ||
        rawtext[$$type] !== "RAW" ||
        !rawtext.text.startsWith(".")
      ) {
        return parenthesize(frag);
      }
      const parts = rawtext.text.slice(1).split(".");
      if (!parts.every(isIdentifierLike)) {
        return parenthesize(frag);
      }
      return frag;
    } else if (nodeCount === 3) {
      // Check for `IDENTIFIER.IDENTIFIER`
      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];
        if (i % 2 === 0) {
          if (
            node[$$type] !== "IDENTIFIER" &&
            (node[$$type] !== "RAW" || !isIdentifierLike(node.text))
          ) {
            return parenthesize(frag);
          }
        } else {
          if (node[$$type] !== "RAW" || node.text !== ".") {
            return parenthesize(frag);
          }
        }
      }
      return frag;
    } else {
      return parenthesize(frag);
    }
  } else if (frag[$$type] === "INDENT") {
    const inner = parens(frag.content, force);
    if (
      inner[$$type] === "QUERY" &&
      (inner.flags & FLAG_HAS_PARENS) === FLAG_HAS_PARENS
    ) {
      // Move the parens to outside
      return parenthesize(indent(makeQueryNode(inner.nodes)), inner.flags);
    } else if (inner === frag.content) {
      return frag;
    } else {
      return makeIndentNode(inner);
    }
  } else if (force) {
    return parenthesize(frag);
  } else if (frag[$$type] === "VALUE") {
    return frag;
  } else if (frag[$$type] === "IDENTIFIER") {
    return frag;
  } else if (frag[$$type] === "RAW") {
    const expr = frag.text;
    if (expr.match(NUMBER_REGEX_1) || expr.match(NUMBER_REGEX_2)) {
      return frag;
    } else if (expr.match(STRING_REGEX)) {
      return frag;
    } else {
      // Identifiers
      const parts = expr.split(".");
      if (parts.every(isIdentifierLike)) {
        return frag;
      }
    }
  }
  return parenthesize(frag);
}

export function symbolAlias(symbol1: symbol, symbol2: symbol): SQL {
  return makeSymbolAliasNode(symbol1, symbol2);
}

export function placeholder(
  symbol: symbol,
  fallback?: SQL,
): SQLPlaceholderNode {
  return makePlaceholderNode(symbol, fallback);
}

export function arraysMatch<T>(
  array1: ReadonlyArray<T>,
  array2: ReadonlyArray<T>,
  comparator?: (val1: T, val2: T) => boolean,
): boolean {
  if (array1 === array2) return true;
  const l = array1.length;
  if (l !== array2.length) {
    return false;
  }
  for (let i = 0; i < l; i++) {
    if (
      comparator ? !comparator(array1[i]!, array2[i]!) : array1[i] !== array2[i]
    ) {
      return false;
    }
  }
  return true;
}

export function isEquivalent(
  sql1: SQL | symbol,
  sql2: SQL | symbol,
  options?: {
    symbolSubstitutes?: Map<symbol, symbol>;
  },
): boolean {
  if (sql1 === sql2) {
    return true;
  }
  const symbolSubstitutes = options?.symbolSubstitutes;
  if (typeof sql1 === "symbol") {
    return symbolSubstitutes?.get(sql1) === sql2;
  } else if (typeof sql2 === "symbol") {
    return false;
  }
  if (sql1[$$type] === "QUERY") {
    if (sql2[$$type] !== "QUERY" || sql2.flags !== sql1.flags) {
      return false;
    }
    return arraysMatch(sql1.nodes, sql2.nodes, (a, b) =>
      isEquivalent(a, b, options),
    );
  } else if (sql2[$$type] === "QUERY") {
    return false;
  } else {
    switch (sql1[$$type]) {
      case "RAW": {
        if (sql2[$$type] !== sql1[$$type]) {
          return false;
        }
        return sql1.text === sql2.text;
      }
      case "VALUE": {
        if (sql2[$$type] !== sql1[$$type]) {
          return false;
        }
        return sql1.value === sql2.value;
      }
      case "INDENT": {
        if (sql2[$$type] !== sql1[$$type]) {
          return false;
        }
        return isEquivalent(sql1.content, sql2.content, options);
      }
      case "IDENTIFIER": {
        if (sql2[$$type] !== sql1[$$type]) {
          return false;
        }
        const { n: ids1n, s: ids1s } = sql1;
        const { n: ids2n, s: ids2s } = sql2;
        const namesMatch = ids1n === ids2n;
        const symbol1 = getSubstitute(ids1s, symbolSubstitutes);
        const symbol2 = getSubstitute(ids2s, symbolSubstitutes);
        const symbolsMatch = symbol1 === symbol2;
        return namesMatch && symbolsMatch;
      }
      case "PLACEHOLDER": {
        if (sql2[$$type] !== sql1[$$type]) {
          return false;
        }
        const symbol1 = getSubstitute(sql1.symbol, symbolSubstitutes);
        const symbol2 = getSubstitute(sql2.symbol, symbolSubstitutes);
        return symbol1 === symbol2;
      }
      case "SYMBOL_ALIAS": {
        // TODO
        return false;
      }
      default: {
        const never: never = sql1;
        console.error(`Unhandled node type: ${inspect(never)}`);
        return false;
      }
    }
  }
}

function replaceSymbolInNode(
  frag: SQLNode,
  needle: symbol,
  replacement: symbol,
): SQLNode {
  switch (frag[$$type]) {
    case "RAW": {
      return frag;
    }
    case "IDENTIFIER": {
      if (frag.s === needle) {
        return makeIdentifierNode(replacement);
      } else {
        return frag;
      }
    }
    case "VALUE": {
      return frag.value === (needle as any)
        ? makeValueNode(replacement as any)
        : frag;
    }
    case "INDENT": {
      return makeIndentNode(replaceSymbol(frag.content, needle, replacement));
    }
    case "SYMBOL_ALIAS": {
      const newA = frag.as === needle ? replacement : frag.as;
      const newB = frag.bs === needle ? replacement : frag.bs;
      if (newA !== frag.as || newB !== frag.bs) {
        return makeSymbolAliasNode(newA, newB);
      } else {
        return frag;
      }
    }
    case "PLACEHOLDER": {
      if (frag.symbol === needle) {
        return makePlaceholderNode(replacement, frag.fallback);
      } else {
        return frag;
      }
    }
    default: {
      const never: never = frag;
      throw new Error(`Unhandled SQL type ${(never as any)[$$type]}`);
    }
  }
}

/**
 * @experimental
 */
export function replaceSymbol(
  frag: SQL,
  needle: symbol,
  replacement: symbol,
): SQL {
  if (frag[$$type] === "QUERY") {
    let changed = false;
    const newNodes = frag.nodes.map((node) => {
      const newNode = replaceSymbolInNode(node, needle, replacement);
      if (newNode !== node) {
        changed = true;
      }
      return newNode;
    });
    return changed ? makeQueryNode(newNodes, frag.flags) : frag;
  } else {
    return replaceSymbolInNode(frag, needle, replacement);
  }
}

/**
 * @internal
 */
function getSubstitute(
  initialSymbol: symbol,
  symbolSubstitutes?: Map<symbol, symbol>,
): symbol {
  const path: symbol[] = [];
  let symbol = initialSymbol;
  for (let i = 0; i < 1000; i++) {
    if (path.includes(symbol)) {
      throw new Error(
        `symbolSubstitute cycle detected: ${path
          .map((s) => inspect(s))
          .join(" -> ")} -> ${inspect(symbol)}`,
      );
    }
    const sub = symbolSubstitutes?.get(symbol);
    if (sub === symbol) {
      throw new Error(
        `Invalid symbolSubstitutes - a symbol cannot be an alias for itself! Symbol: ${inspect(
          symbol,
        )}`,
      );
    } else if (sub) {
      path.push(symbol);
      symbol = sub;
    } else {
      return symbol;
    }
  }
  throw new Error("symbolSubstitutes depth too deep");
}

export const sql = sqlBase as PgSQL;
export default sql;

export {
  falseNode as false,
  sql as fragment,
  isSQL,
  nullNode as null,
  sql as query,
  trueNode as true,
};

export interface PgSQL {
  (strings: TemplateStringsArray, ...values: Array<SQL>): SQL;
  escapeSqlIdentifier: typeof escapeSqlIdentifier;
  compile: typeof compile;
  isEquivalent: typeof isEquivalent;
  query: PgSQL;
  raw: typeof raw;
  identifier: typeof identifier;
  value: typeof value;
  literal: typeof literal;
  join: typeof join;
  indent: typeof indent;
  indentIf: typeof indentIf;
  parens: typeof parens;
  symbolAlias: typeof symbolAlias;
  placeholder: typeof placeholder;
  blank: typeof blank;
  fragment: PgSQL;
  true: typeof trueNode;
  false: typeof falseNode;
  null: typeof nullNode;
  isSQL: typeof isSQL;
  replaceSymbol: typeof replaceSymbol;
  sql: PgSQL;
}

const attributes = {
  sql,
  escapeSqlIdentifier,
  compile,
  isEquivalent,
  query: sql,
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
  blank,
  fragment: sql,
  true: trueNode,
  false: falseNode,
  null: nullNode,
  replaceSymbol,
  isSQL,
};

Object.entries(attributes).forEach(([exportName, value]) => {
  if (!(value as any).$$export) {
    exportAs(value, exportName);
  }
});

Object.assign(sqlBase, attributes);
