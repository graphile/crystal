import * as debugFactory from "debug";
import { QueryConfig } from "pg";
import LRU from "@graphile/lru";

const debug = debugFactory("pg-sql2");

function debugError(err: Error) {
  debug(err);
  return err;
}

const $$trusted = Symbol("trusted");

interface SQLRawNode {
  text: string;
  type: "RAW";
  [$$trusted]: true;
}

interface SQLIdentifierNode {
  names: Array<string | symbol>;
  type: "IDENTIFIER";
  [$$trusted]: true;
}

interface SQLValueNode {
  value: any;
  type: "VALUE";
  [$$trusted]: true;
}

export type SQLNode = SQLRawNode | SQLValueNode | SQLIdentifierNode;
export type SQLQuery = Array<SQLNode>;
export type SQL = SQLNode | SQLQuery;

const CACHE_RAW_NODES = new LRU<string, SQLRawNode>({ maxLength: 2000 });

function makeRawNode(text: string): SQLRawNode {
  const n = CACHE_RAW_NODES.get(text);
  if (n) {
    return n;
  }
  if (typeof text !== "string") {
    throw new Error("Invalid argument to makeRawNode - expected string");
  }
  const newNode: SQLRawNode = { type: "RAW", text, [$$trusted]: true };
  CACHE_RAW_NODES.set(text, newNode);
  return newNode;
}

function isStringOrSymbol(val: any): val is string | symbol {
  return typeof val === "string" || typeof val === "symbol";
}

function makeIdentifierNode(names: Array<string | symbol>): SQLIdentifierNode {
  if (
    !Array.isArray(names) ||
    names.length === 0 ||
    !names.every(isStringOrSymbol)
  ) {
    throw new Error(
      "Invalid argument to makeIdentifierNode - expected array of strings/symbols"
    );
  }
  return { type: "IDENTIFIER", names, [$$trusted]: true };
}

function makeValueNode(rawValue: any): SQLValueNode {
  return { type: "VALUE", value: rawValue, [$$trusted]: true };
}

function ensureNonEmptyArray<T>(
  array: Array<T>,
  allowZeroLength = false
): Array<T> {
  if (!Array.isArray(array)) {
    throw debugError(new Error("Expected array"));
  }
  if (!allowZeroLength && array.length < 1) {
    throw debugError(new Error("Expected non-empty array"));
  }
  for (let idx = 0, l = array.length; idx < l; idx++) {
    if (array[idx] == null) {
      throw debugError(
        new Error(`Array index ${idx} is ${String(array[idx])}`)
      );
    }
  }
  return array;
}

export function compile(sql: SQLQuery | SQLNode): QueryConfig {
  const items = Array.isArray(sql) ? sql : [sql];

  const itemCount = items.length;

  // Join this to generate the SQL query
  const sqlFragments = [];

  // Values hold the JavaScript values that are represented in the query
  // string by placeholders. They are eager because they were provided before
  // compile time.
  const values = [];

  // When we come accross a symbol in our identifier, we create a unique
  // alias for it that shouldn’t be in the users schema. This helps maintain
  // sanity when constructing large Sql queries with many aliases.
  let nextSymbolId = 0;
  const symbolToIdentifier = new Map();

  for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
    const item: SQLNode = enforceValidNode(items[itemIndex]);
    switch (item.type) {
      case "RAW":
        sqlFragments.push(item.text);
        break;
      case "IDENTIFIER": {
        const nameCount = item.names.length;
        const mappedNames = [];
        for (let nameIndex = 0; nameIndex < nameCount; nameIndex++) {
          const name: string | symbol = item.names[nameIndex];
          if (typeof name === "string") {
            mappedNames.push(escapeSqlIdentifier(name));
          } else if (typeof name === "symbol") {
            // Get the correct identifier string for this symbol.
            let identifierForSymbol = symbolToIdentifier.get(name);

            // If there is no identifier, create one and set it.
            if (!identifierForSymbol) {
              identifierForSymbol = `__local_${nextSymbolId++}__`;
              symbolToIdentifier.set(name, identifierForSymbol);
            }

            // Return the identifier. Since we create it, we won’t have to
            // escape it because we know all of the characters are safe.
            mappedNames.push(identifierForSymbol);
          } else {
            throw debugError(
              new Error(`Expected string or symbol, received '${String(name)}'`)
            );
          }
        }
        sqlFragments.push(
          nameCount === 1 ? mappedNames[0] : mappedNames.join(".")
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
  if (values.length > 65535) {
    throw new Error(
      "PostgreSQL allows the use of up to 65535 placeholders; but your statement wants to use ${values.length} placeholders. To solve this issue you could split the statement into multiple statements, or pass more values into a single placeholder by using JSON, arrays, or similar techniques."
    );
  }
  return {
    text,
    values,
  };
}

function enforceValidNode(node: any): SQLNode {
  if (node !== null && node[$$trusted] === true) {
    return node;
  }
  throw new Error(`Expected SQL item, instead received '${String(node)}'.`);
}

/**
 * A template string tag that creates a `Sql` query out of some strings and
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
      "sql.query should be used as a template literal, not a function call!"
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
        "sql.query should be used as a template literal, not a function call."
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
 * Creates a Sql item for some raw Sql text. Just plain ol‘ raw Sql. This
 * method is dangerous though because it involves no escaping, so proceed
 * with caution!
 */
export function raw(text: string): SQLNode {
  return makeRawNode(String(text));
}

/**
 * Creates a Sql item for a Sql identifier. A Sql identifier is anything like
 * a table, schema, or column name. An identifier may also have a namespace,
 * thus why many names are accepted.
 */
export function identifier(...names: Array<string | symbol>): SQLNode {
  return makeIdentifierNode(ensureNonEmptyArray(names));
}

/**
 * Creates a Sql item for a value that will be included in our final query.
 * This value will be added in a way which avoids Sql injection.
 */
export function value(val: any): SQLNode {
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
 * Join some Sql items together seperated by a string. Useful when dealing
 * with lists of Sql items that doesn’t make sense as a Sql query.
 */
export function join(items: Array<SQL>, rawSeparator = ""): SQLQuery {
  ensureNonEmptyArray(items, true);
  if (typeof rawSeparator !== "string") {
    throw new Error("Invalid separator - must be a string");
  }
  const separator = rawSeparator;
  const currentItems = [];
  const sepNode = makeRawNode(separator);
  for (let i = 0, l = items.length; i < l; i++) {
    const rawItem: SQL = items[i];
    const itemsToAppend: SQLNode | SQLQuery = Array.isArray(rawItem)
      ? rawItem.map(enforceValidNode)
      : [enforceValidNode(rawItem)];
    if (i === 0 || !separator) {
      currentItems.push(...itemsToAppend);
    } else {
      currentItems.push(sepNode, ...itemsToAppend);
    }
  }
  return currentItems;
}

// Copied from https://github.com/brianc/node-postgres/blob/860cccd53105f7bc32fed8b1de69805f0ecd12eb/lib/client.js#L285-L302
// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
// Trivial performance optimisations by Benjie.
// Replaced with regexp because it's 11x faster by Benjie.
export function escapeSqlIdentifier(str: string) {
  return `"${str.replace(/"/g, '""')}"`;
}

export const blank = query``;

export { query as fragment, nullNode as null };
