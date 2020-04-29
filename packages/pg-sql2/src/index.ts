import debugFactory from "debug";
import { QueryConfig } from "pg";
import LRU from "@graphile/lru";
import { inspect } from "util";

const debug = debugFactory("pg-sql2");

function debugError(source: string, err: Error): Error {
  debug("pg-sql2 error occurred in %s: %o", source, err);
  return err;
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

export type SQLNode = SQLRawNode | SQLValueNode | SQLIdentifierNode;
export type SQLQuery = Array<SQLNode>;
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
      .replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)
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

function makeRawNode(text: string): SQLRawNode {
  const n = CACHE_RAW_NODES.get(text);
  if (n) {
    return n;
  }
  if (typeof text !== "string") {
    throw new Error("Invalid argument to makeRawNode - expected string");
  }
  const newNode: SQLRawNode = Object.freeze({
    type: "RAW",
    text,
    [$$trusted]: true,
  });
  CACHE_RAW_NODES.set(text, newNode);
  return newNode;
}

// Simple function to help V8 optimize it.
function makeIdentifierNode(
  names: Array<string | SymbolAndName>,
): SQLIdentifierNode {
  return Object.freeze({ type: "IDENTIFIER", names, [$$trusted]: true });
}

// Simple function to help V8 optimize it.
function makeValueNode(rawValue: SQLRawValue): SQLValueNode {
  return Object.freeze({ type: "VALUE", value: rawValue, [$$trusted]: true });
}

function isSQLNode(node: unknown): node is SQLNode {
  return typeof node === "object" && node !== null && node[$$trusted] === true;
}

function enforceValidNode(node: unknown): SQLNode {
  if (isSQLNode(node)) {
    return node;
  }
  throw new Error(
    `Invalid pg-sql2 expression. Expected an SQL item but received '${inspect(
      node,
    )}'. This may mean that there is an issue in the SQL expression where a dynamic value was not escaped via 'sql.value(...)', an identifier wasn't wrapped with 'sql.identifier(...)', or a SQL expression was added without using the \`sql\` tagged template literal.`,
  );
}

/**
 * Accepts an sql`...` expression and compiles it out to SQL text with
 * placeholders, and the values to substitute for these values.
 */
export function compile(sql: SQLQuery | SQLNode): QueryConfig {
  const items: SQLQuery = Array.isArray(sql) ? sql : [sql];

  const itemCount = items.length;

  /**
   * Join this to generate the SQL query
   */
  const sqlFragments: string[] = [];

  /**
   * Values hold the JavaScript values that are represented in the query string
   * by placeholders. They are eager because they were provided before compile
   * time.
   */
  const values: SQLRawValue = [];

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

  for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
    const item = enforceValidNode(items[itemIndex]);
    switch (item.type) {
      case "RAW":
        sqlFragments.push(item.text);
        break;
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
              const { s: symbol, n: safeDesc } = name;
              if (!descCounter[safeDesc]) {
                descCounter[safeDesc] = 0;
              }
              const number = ++descCounter[safeDesc];

              // NOTE: we don't omit number for the first instance because
              // safeDesc might end in, e.g., `_2` and cause conflicts later.
              identifierForSymbol = `__${safeDesc}_${number}__`;

              // Store so this symbol gets the same identifier next time
              symbolToIdentifier.set(symbol, identifierForSymbol);
            }

            // Return the identifier. Since we create it, we won’t have to
            // escape it because we know all of the characters are safe.
            mappedNames.push(identifierForSymbol);
          } else {
            throw debugError(
              "compile/IDENTIFIER",
              new Error(
                `Expected string or SymbolAndName, received '${inspect(name)}'`,
              ),
            );
          }
        }
        sqlFragments.push(
          nameCount === 1 ? mappedNames[0] : mappedNames.join("."),
        );
        break;
      }
      case "VALUE":
        values.push(item.value);
        sqlFragments.push(`$${values.length}`);
        break;
      default:
      // This cannot happen
    }
  }

  const text = sqlFragments.join("");
  return {
    text,
    values,
  };
}

/**
 * A template string tag that creates a `SQL` query out of some strings and
 * some values. Use this to construct all PostgreSQL queries to avoid SQL
 * injection.
 *
 * Note that using this function, the user *must* specify if they are injecting
 * raw text. This makes a SQL injection vulnerability harder to create.
 */
// LRU not necessary
const CACHE_SIMPLE_FRAGMENTS = new Map<string, SQLQuery>();
export function query(
  strings: TemplateStringsArray,
  ...values: Array<SQL>
): SQLQuery {
  if (!Array.isArray(strings)) {
    throw new Error(
      "sql.query should be used as a template literal, not a function call!",
    );
  }
  const first = strings[0];
  // Reduce memory churn with a cache
  if (strings.length === 1 && typeof first === "string" && first.length < 20) {
    const cached = CACHE_SIMPLE_FRAGMENTS.get(first);
    if (cached) {
      return cached;
    }
    const node = [makeRawNode(first)];
    CACHE_SIMPLE_FRAGMENTS.set(first, node);
    return node;
  }
  const items = [];
  for (let i = 0, l = strings.length; i < l; i++) {
    const text = strings[i];
    if (typeof text !== "string") {
      throw new Error(
        "sql.query should be used as a template literal, not a function call.",
      );
    }
    if (text.length > 0) {
      items.push(makeRawNode(text));
    }
    if (values[i]) {
      const val = values[i];
      if (Array.isArray(val)) {
        const nodes: SQLQuery = val.map(enforceValidNode);
        items.push(...nodes);
      } else {
        const node: SQLNode = enforceValidNode(val);
        items.push(node);
      }
    }
  }
  return items;
}

/**
 * Creates a SQL item for some raw SQL text. Just plain ol‘ raw SQL. This
 * method is dangerous though because it involves no escaping, so proceed
 * with caution!
 */
export function raw(text: string): SQLNode {
  return makeRawNode(String(text));
}

/**
 * Creates a SQL item for a SQL identifier. A SQL identifier is anything like
 * a table, schema, or column name. An identifier may also have a namespace,
 * thus why many names are accepted.
 */
export function identifier(...names: Array<string | symbol>): SQLNode {
  // By doing the validation here rather than at compile time we can reduce
  // redundant work - the same sql.identifier can be used in multiple queries.

  const nameCount = names.length;
  if (nameCount === 0) {
    throw new Error(
      "Invalid call to sql.identifier() - you must pass at least one argument.",
    );
  }

  const finalNames: Array<string | SymbolAndName> = new Array(nameCount);
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
        `Invalid argument to sql.identifier - argument ${i} (0-indexed) should be a string or a symbol, but was '${inspect(
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
export function value(val: SQLRawValue): SQLNode {
  return makeValueNode(val);
}

const trueNode = raw(`TRUE`);
const falseNode = raw(`FALSE`);
const nullNode = raw(`NULL`);

/**
 * If the value is simple will inline it into the query, otherwise will defer
 * to value.
 */
export function literal(val: string | number | boolean | null): SQLNode {
  if (typeof val === "string" && val.match(/^[-a-zA-Z0-9_@! ]*$/)) {
    return raw(`'${val}'`);
  } else if (typeof val === "number" && Number.isFinite(val)) {
    if (Number.isInteger(val)) {
      return raw(String(val));
    } else {
      return raw(`'${0 + val}'::float`);
    }
  } else if (typeof val === "boolean") {
    return val ? trueNode : falseNode;
  } else if (val == null) {
    return nullNode;
  } else {
    return makeValueNode(val);
  }
}

/**
 * Join some SQL items together separated by a string. Useful when dealing
 * with lists of SQL items that doesn’t make sense as a SQL query.
 */
export function join(
  items: Array<Array<SQLNode> | SQLNode>,
  separator = "",
): SQLQuery {
  if (!Array.isArray(items)) {
    throw new Error(
      `Invalid sql.join call - the first argument should be an array, but it wasn't.`,
    );
  }
  if (typeof separator !== "string") {
    throw new Error("Invalid separator - must be a string");
  }
  const sepNode = makeRawNode(separator);
  const hasSeparator = separator.length > 0;

  const currentItems: Array<SQLNode> = [];
  for (let i = 0, l = items.length; i < l; i++) {
    const nodeOrNodes = items[i];
    const addSeparator = i > 0 && hasSeparator;
    if (Array.isArray(nodeOrNodes)) {
      // Performance: we don't map here because we don't want to allocate a new array.
      nodeOrNodes.forEach(enforceValidNode);
      const nodes: Array<SQLNode> = nodeOrNodes;
      if (addSeparator) {
        currentItems.push(sepNode, ...nodes);
      } else {
        currentItems.push(...nodes);
      }
    } else {
      const node: SQLNode = enforceValidNode(nodeOrNodes);
      if (addSeparator) {
        currentItems.push(sepNode, node);
      } else {
        currentItems.push(node);
      }
    }
  }
  return currentItems;
}

export const blank = query``;

export {
  query as fragment,
  trueNode as true,
  falseNode as false,
  nullNode as null,
};

export interface PgSQL {
  (strings: TemplateStringsArray, ...values: Array<SQL>): SQLQuery;
  escapeSqlIdentifier: typeof escapeSqlIdentifier;
  compile: typeof compile;
  query: typeof query;
  raw: typeof raw;
  identifier: typeof identifier;
  value: typeof value;
  literal: typeof literal;
  join: typeof join;
  blank: typeof blank;
  fragment: typeof query;
  true: typeof trueNode;
  false: typeof falseNode;
  null: typeof nullNode;
}

const pgSql: PgSQL = Object.assign(query, {
  escapeSqlIdentifier,
  compile,
  query,
  raw,
  identifier,
  value,
  literal,
  join,
  blank,
  fragment: query,
  true: trueNode,
  false: falseNode,
  null: nullNode,
});

export default pgSql;
