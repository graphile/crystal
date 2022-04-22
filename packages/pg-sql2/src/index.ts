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
 * Returns true if the given expression does not need parenthesis to be
 * inserted into another expression, false if not wrapping in parenthesis could
 * cause ambiguity. We're relying on the user to be sensible here, this is not
 * fool-proof.
 *
 * @remarks The following are all parens safe:
 *
 * - A placeholder `$1`
 * - A number `0.123456`
 * - A string `'Foo bar'` / `E'Foo bar'`
 * - An identifier `schema.table.column` / `"MyScHeMa"."MyTaBlE"."MyCoLuMn"`
 *
 * The following might seem but are not parens safe:
 *
 * - A function call `schema.func(param)` - reason: `schema.func(param).*`
 *   should be `(schema.func(param)).*`
 * - A simple expression `1 = 2` - reason: `1 = 2 = false` is invalid; whereas
 *   `(1 = 2) = false` is fine. Similarly `1 = 2::text` differs from `(1 = 2)::text`.
 */
function isParensSafe(expr: string): boolean {
  if (expr.match(/^\$[0-9]+$/)) {
    return true;
  } else if (expr.match(/^[0-9]+(?:\.[0-9]+)?$/) || expr.match(/^\.[0-9]+$/)) {
    return true;
  } else if (expr.match(/^'[^']+'$/)) {
    return true;
  } else {
    // Identifiers
    const parts = expr.split(".");
    if (
      parts.every((p) => p.match(/^"[^"]+"$/) || p.match(/^[a-zA-Z0-9_]+$/))
    ) {
      return true;
    }
  }
  return false;
}
/**
 * This is the secret to our safety; since this is a symbol it cannot be faked
 * in a JSON payload and it cannot be constructed with a new Symbol (even with
 * the same argument), so external data cannot make itself trusted.
 */
const $$trusted = Symbol("pg-sql2-trusted");

/**
 * Represents raw SQL, the text will be output verbatim into the compiled query.
 */
export interface SQLRawNode {
  text: string;
  type: "RAW";
  [$$trusted]: true;
}

/**
 * Represents an SQL identifier such as table, column, function, etc name. These
 * identifiers will be automatically escaped when compiled, respecting any
 * reserved words.
 */
export interface SQLIdentifierNode {
  names: Array<string | SymbolAndName>;
  type: "IDENTIFIER";
  [$$trusted]: true;
}

/**
 * A value that can be used in `sql.value(...)`; note that objects are **NOT**
 * valid values; you must `JSON.stringify(obj)` or similar.
 */
export type SQLRawValue = string | number | boolean | null | Array<SQLRawValue>;

/**
 * Represents an SQL value that will be replaced with a placeholder in the
 * compiled SQL statement.
 */
export interface SQLValueNode {
  value: SQLRawValue;
  type: "VALUE";
  [$$trusted]: true;
}

/**
 * Represents that the SQL inside this should be indented when pretty printed.
 */
export interface SQLIndentNode {
  content: SQL;
  type: "INDENT";
  [$$trusted]: true;
}

/**
 * Represents that the SQL inside this should be wrapped in parenthesis if necessary.
 */
export interface SQLParensNode {
  content: SQL;
  type: "PARENS";
  force: boolean;
  [$$trusted]: true;
}

/**
 * Informs pg-sql2 to treat symbol2 as if it were the same as symbol1
 */
export interface SQLSymbolAliasNode {
  a: SymbolAndName;
  b: SymbolAndName;
  type: "SYMBOL_ALIAS";
  [$$trusted]: true;
}

/**
 * A placeholder that should be replaced at compile time using one of the
 * replacements provided.
 */
export interface SQLPlaceholderNode {
  type: "PLACEHOLDER";
  symbol: symbol;
  fallback?: SQL;
  [$$trusted]: true;
}

/** @internal */
export type SQLNode =
  | SQLRawNode
  | SQLValueNode
  | SQLIdentifierNode
  | SQLIndentNode
  | SQLParensNode
  | SQLSymbolAliasNode
  | SQLPlaceholderNode;
/** @internal */
export type SQLQuery = Array<SQLNode>;

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

// Objects with short fixed properties are more efficient than tuples in V8.
type SymbolAndName = { s: symbol; n: string };

// Alas we cannot use WeakMap to cache this because symbols cannot be WeakMap
// keys (and we wouldn't want to open the user to memory exhaustion via a map).
// Symbol.prototype.description is available since Node 11.15.0, 12.4.0.
function getSymbolAndName(symbol: symbol): SymbolAndName {
  return { s: symbol, n: mangleName(symbol.description || "local") };
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
    type: "RAW",
    text,
    [$$trusted]: true,
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
  names: Array<string | SymbolAndName>,
): SQLIdentifierNode {
  return Object.freeze({
    type: "IDENTIFIER",
    names,
    [$$trusted]: true as true,
  });
}

// Simple function to help V8 optimize it.
function makeValueNode(rawValue: SQLRawValue): SQLValueNode {
  return Object.freeze({
    type: "VALUE",
    value: rawValue,
    [$$trusted]: true as true,
  });
}

function makeIndentNode(content: SQL): SQLIndentNode {
  return Object.freeze({ type: "INDENT", content, [$$trusted]: true as true });
}

function makeParensNode(content: SQL, force = false): SQLParensNode {
  return Object.freeze({
    type: "PARENS",
    content,
    force,
    [$$trusted]: true as true,
  });
}

function makeSymbolAliasNode(a: symbol, b: symbol): SQLSymbolAliasNode {
  return Object.freeze({
    type: "SYMBOL_ALIAS",
    a: getSymbolAndName(a),
    b: getSymbolAndName(b),
    [$$trusted]: true as true,
  });
}

function makePlaceholderNode(
  symbol: symbol,
  fallback?: SQL,
): SQLPlaceholderNode {
  return Object.freeze({
    type: "PLACEHOLDER",
    symbol,
    fallback,
    [$$trusted]: true as true,
  });
}

function isSQLNode(node: unknown): node is SQLNode {
  return typeof node === "object" && node !== null && node[$$trusted] === true;
}

function isSQL(fragment: unknown): fragment is SQL {
  return Array.isArray(fragment)
    ? fragment.length > 0 && fragment.every((el) => isSQLNode(el))
    : isSQLNode(fragment);
}

function enforceValidNode(node: unknown, where = ""): SQLNode {
  if (isSQLNode(node)) {
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
  { placeholderValues }: { placeholderValues?: Map<symbol, SQL> } = {},
): {
  text: string;
  values: SQLRawValue[];
} {
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
  function makeIdentifierForSymbol(name: SymbolAndName) {
    const { s: symbol, n: safeDesc } = name;
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

  function print(inItems: SQL, indent = 0) {
    /**
     * Join this to generate the SQL query
     */
    const sqlFragments: string[] = [];

    const items: Array<SQLNode> = Array.isArray(inItems) ? inItems : [inItems];
    const itemCount = items.length;

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
      const item = enforceValidNode(items[itemIndex], `item ${itemIndex}`);
      switch (item.type) {
        case "RAW": {
          sqlFragments.push(
            isDev
              ? item.text.replace(/\n/g, "\n" + "  ".repeat(indent))
              : item.text,
          );
          break;
        }
        case "IDENTIFIER": {
          const nameCount = item.names.length;
          const mappedNames = [];
          for (const name of item.names) {
            if (typeof name === "string") {
              // This was escaped inside of `sql.identifier`
              mappedNames.push(name);
            } else if (name.s) {
              // Get the correct identifier string for this symbol.
              // NOTE: we cannot use `SymbolAndName` as the key as a symbol may may
              // generate multiple SymbolAndName objects.
              let identifierForSymbol = symbolToIdentifier.get(name.s);

              // If there is no identifier, create one and set it.
              if (!identifierForSymbol) {
                identifierForSymbol = makeIdentifierForSymbol(name);
              }

              // Return the identifier. Since we create it, we won’t have to
              // escape it because we know all of the characters are safe.
              mappedNames.push(identifierForSymbol);
            } else {
              throw new Error(
                `[pg-sql2] Invalid IDENTIFIER node, expected string or SymbolAndName, received '${inspect(
                  name,
                )}' - this could be a bug in pg-sql2, please report it.`,
              );
            }
          }
          sqlFragments.push(
            nameCount === 1 ? mappedNames[0]! : mappedNames.join("."),
          );
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
        case "PARENS": {
          const inner = print(item.content, indent);
          if (item.force || !isParensSafe(inner)) {
            sqlFragments.push(`(${inner})`);
          } else {
            sqlFragments.push(inner);
          }
          break;
        }
        case "SYMBOL_ALIAS": {
          const symbol1 = item.a.s;
          const symbol2 = item.b.s;
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
            const identifierForSymbol = makeIdentifierForSymbol(item.a);
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
  const first = strings[0];
  // Reduce memory churn with a cache
  if (strings.length === 1) {
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
  const items: Array<SQLNode> = [];
  for (let i = 0, l = strings.length; i < l; i++) {
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
      const val = values[i];
      if (Array.isArray(val)) {
        // Avoid allocating a new array by using forEach rather than map.
        val.forEach((v, j) =>
          enforceValidNode(v, `template literal placeholder ${i} child ${j}`),
        );
        items.push(...val);
      } else {
        const node: SQLNode = enforceValidNode(
          val,
          `template literal placeholder ${i}`,
        );
        items.push(node);
      }
    }
  }
  return items;
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

  const finalNames: Array<string | SymbolAndName> = [];
  for (let i = 0; i < nameCount; i++) {
    const name = names[i];
    if (typeof name === "string") {
      // By escaping here rather than during compile we can reduce redundant computation.
      finalNames[i] = escapeSqlIdentifier(name);
    } else if (typeof name === "symbol") {
      // The final name has to be evaluated at compile-time, but we can at least mangle it up front.
      finalNames[i] = getSymbolAndName(name);
    } else {
      throw new Error(
        `[pg-sql2] Invalid argument to sql.identifier - argument ${i} (0-indexed) should be a string or a symbol, but was '${inspect(
          name,
        )}'`,
      );
    }
  }

  return makeIdentifierNode(finalNames);
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
      return makeRawNode(String(val));
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
export function join(
  items: Array<Array<SQLNode> | SQLNode>,
  separator = "",
): SQL {
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
    return [];
  } else if (items.length === 1) {
    const nodeOrNodes = items[0];
    if (Array.isArray(nodeOrNodes)) {
      // Performance: we don't map here because we don't want to allocate a new array.
      nodeOrNodes.forEach((n, j) =>
        enforceValidNode(n, `join item ${0} child ${j}`),
      );
      const nodes: Array<SQLNode> = nodeOrNodes;
      return nodes;
    } else {
      const node: SQLNode = enforceValidNode(nodeOrNodes, `join item ${0}`);
      return node;
    }
  }

  const hasSeparator = separator.length > 0;
  const sepNode = hasSeparator ? makeRawNode(separator) : blank;

  const currentItems: Array<SQLNode> = [];
  for (let i = 0, l = items.length; i < l; i++) {
    const nodeOrNodes = items[i];
    const addSeparator = i > 0 && hasSeparator;
    if (Array.isArray(nodeOrNodes)) {
      // Performance: we don't map here because we don't want to allocate a new array.
      nodeOrNodes.forEach((n, j) =>
        enforceValidNode(n, `join item ${i} child ${j}`),
      );
      const nodes: Array<SQLNode> = nodeOrNodes;
      if (addSeparator) {
        currentItems.push(sepNode, ...nodes);
      } else {
        currentItems.push(...nodes);
      }
    } else {
      const node: SQLNode = enforceValidNode(nodeOrNodes, `join item ${i}`);
      if (addSeparator) {
        currentItems.push(sepNode, node);
      } else {
        currentItems.push(node);
      }
    }
  }
  return currentItems;
}

export function indent(fragment: SQL): SQL {
  return isDev ? makeIndentNode(fragment) : fragment;
}

export function indentIf(condition: boolean, fragment: SQL): SQL {
  return isDev && condition ? makeIndentNode(fragment) : fragment;
}

/**
 * Wraps the given fragment in parens if necessary (or if forced, e.g. for a
 * subquery or maybe stylistically a join condition).
 */
export function parens(fragment: SQL, force = false): SQL {
  // No need to recursively wrap with parens
  if (Array.isArray(fragment)) {
    if (fragment.length === 1) {
      // Pretend that the child was just a single node
      return parens(fragment[0]!, force);
    } else {
      // Normal behavior (fall through)
    }
  } else if (fragment.type === "PARENS") {
    if (fragment.force || !force) {
      // No change; use existing fragment
      return fragment;
    } else {
      // Need to force parens on previous fragment content
      return parens(fragment.content, true);
    }
  } else if (fragment.type === "INDENT") {
    if (Array.isArray(fragment.content)) {
      if (fragment.content.length === 1) {
        const inner = fragment.content[0]!;
        if (inner.type === "PARENS" && !inner.force) {
          return makeParensNode(inner.content, force);
        } else {
          // Normal behavior (fall through)
        }
      } else {
        // Normal behavior (fall through)
      }
    } else if (fragment.content.type === "PARENS" && !fragment.content.force) {
      return makeParensNode(fragment.content.content, force);
    }
  }

  return makeParensNode(fragment, force);
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
  comparator: (val1: T, val2: T) => boolean = (v1, v2) => v1 === v2,
): boolean {
  const l = array1.length;
  if (l !== array2.length) {
    return false;
  }
  for (let i = 0; i < l; i++) {
    if (!comparator(array1[i]!, array2[i]!)) {
      return false;
    }
  }
  return true;
}

export function isEquivalent(
  sql1: SQL | symbol,
  sql2: SQL | symbol,
  options: {
    symbolSubstitutes?: Map<symbol, symbol>;
  } = {},
): boolean {
  const { symbolSubstitutes } = options;
  if (typeof sql1 === "symbol") {
    if (symbolSubstitutes?.has(sql1)) {
      return symbolSubstitutes.get(sql1) === sql2;
    } else {
      return sql2 === sql1;
    }
  } else if (typeof sql2 === "symbol") {
    return false;
  }
  if (Array.isArray(sql1)) {
    if (!Array.isArray(sql2)) {
      return false;
    }
    return arraysMatch(sql1, sql2, (a, b) => isEquivalent(a, b, options));
  } else if (Array.isArray(sql2)) {
    return false;
  } else {
    switch (sql1.type) {
      case "RAW": {
        if (sql2.type !== sql1.type) {
          return false;
        }
        return sql1.text === sql2.text;
      }
      case "VALUE": {
        if (sql2.type !== sql1.type) {
          return false;
        }
        return sql1.value === sql2.value;
      }
      case "INDENT": {
        if (sql2.type !== sql1.type) {
          return false;
        }
        return isEquivalent(sql1.content, sql2.content, options);
      }
      case "PARENS": {
        if (sql2.type !== sql1.type) {
          return false;
        }
        if (sql2.force !== sql1.force) {
          return false;
        }
        return isEquivalent(sql1.content, sql2.content, options);
      }
      case "IDENTIFIER": {
        if (sql2.type !== sql1.type) {
          return false;
        }
        return arraysMatch(sql1.names, sql2.names, (a, b) =>
          identifiersAreEquivalent(a, b, symbolSubstitutes),
        );
      }
      case "PLACEHOLDER": {
        if (sql2.type !== sql1.type) {
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

type IdentifierName = SQLIdentifierNode["names"] extends ReadonlyArray<infer U>
  ? U
  : never;
function identifiersAreEquivalent(
  ids1: IdentifierName,
  ids2: IdentifierName,
  symbolSubstitutes?: Map<symbol, symbol>,
): boolean {
  if (typeof ids1 === "string") {
    return ids2 === ids1;
  } else if (typeof ids2 === "string") {
    return false;
  }
  const namesMatch = ids1.n === ids2.n;
  const symbol1 = getSubstitute(ids1.s, symbolSubstitutes);
  const symbol2 = getSubstitute(ids2.s, symbolSubstitutes);
  const symbolsMatch = symbol1 === symbol2;
  return namesMatch && symbolsMatch;
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
  isSQL,
};

Object.entries(attributes).forEach(([exportName, value]) => {
  if (!(value as any).$$export) {
    exportAs(value, exportName);
  }
});

Object.assign(sqlBase, attributes);
