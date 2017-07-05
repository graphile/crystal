// Full credit: https://raw.githubusercontent.com/postgraphql/postgraphql/master/src/postgres/utils/sql.ts
const isString = require("lodash/isString");
const isNumber = require("lodash/isNumber");
const isBoolean = require("lodash/isBoolean");
const isSymbol = require("lodash/isSymbol");
const isNil = require("lodash/isNil");
const isPlainObject = require("lodash/isPlainObject");
const lodashIsFinite = require("lodash/isFinite");
const debug = require("debug")("pg-sql2");

const isDev = ["test", "development"].includes(process.env.NODE_ENV);

const debugError = err => {
  debug(err);
  return err;
};

const $$type = Symbol("type");
function makeNode(type, obj) {
  const newObj = Object.assign({}, obj);
  Object.defineProperty(newObj, $$type, {
    enumerable: false,
    configurable: false,
    value: type,
  });
  return newObj;
}

const ensureNonEmptyArray = (array, allowZeroLength = false) => {
  if (!Array.isArray(array)) {
    throw debugError(new Error("Expected array"));
  }
  if (array.length < 1 && !allowZeroLength) {
    throw debugError(new Error("Expected non-empty array"));
  }
  array.forEach((entry, idx) => {
    if (entry == null) {
      throw debugError(new Error(`Array index ${idx} is ${entry}`));
    }
  });
  return array;
};

function compile(sql) {
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

  const items = Array.isArray(sql) ? sql : [sql];

  for (const item of items) {
    switch (item[$$type]) {
      case "RAW":
        sqlFragments.push(item.text);
        break;
      case "IDENTIFIER":
        if (item.names.length === 0)
          throw new Error("Identifier must have a name");

        sqlFragments.push(
          item.names
            .map(name => {
              if (typeof name === "string") return escapeSqlIdentifier(name);
              if (!isSymbol(name)) {
                throw debugError(
                  new Error(`Expected string or symbol, received '${name}'`)
                );
              }

              // Get the correct identifier string for this symbol.
              let identifier = symbolToIdentifier.get(name);

              // If there is no identifier, create one and set it.
              if (!identifier) {
                identifier = `__local_${nextSymbolId++}__`;
                symbolToIdentifier.set(name, identifier);
              }

              // Return the identifier. Since we create it, we won’t have to
              // escape it because we know all of the characters are safe.
              return identifier;
            })
            .join(".")
        );
        break;
      case "VALUE":
        values.push(item.value);
        sqlFragments.push(`$${values.length}`);
        break;
      default:
        throw new Error(
          `Unexpected Sql item type '${item[$$type]}' (full item: '${item}').`
        );
    }
  }

  const text = sqlFragments.join("");
  return {
    text,
    values,
  };
}

/**
 * A template string tag that creates a `Sql` query out of some strings and
 * some values. Use this to construct all PostgreSQL queries to avoid SQL
 * injection.
 *
 * Note that using this function, the user *must* specify if they are injecting
 * raw text. This makes a SQL injection vulnerability harder to create.
 */
const query = (strings, ...values) =>
  strings.reduce((items, text, i) => {
    if (!values[i]) {
      return items.concat(makeNode("RAW", { text }));
    } else {
      const value = values[i];
      if (isDev) {
        // These errors don't give you additional safety, they just catch
        // mistakes earlier to aid debugging, so they're fine to disable in
        // production
        if (!Array.isArray(value) && !isPlainObject(value)) {
          if (isString(value)) {
            throw new Error(`Raw string passed into SQL query: '${value}'.`);
          } else if (isNumber(value)) {
            throw new Error(`Raw number passed into SQL query: '${value}'.`);
          } else {
            throw new Error(
              `Invalid raw value passed into SQL query: '${value}'.`
            );
          }
        }
      }
      return items.concat(makeNode("RAW", { text }), value);
    }
  }, []);

/**
 * Creates a Sql item for some raw Sql text. Just plain ol‘ raw Sql. This
 * method is dangerous though because it involves no escaping, so proceed
 * with caution!
 */
const raw = text => makeNode("RAW", { text });

/**
 * Creates a Sql item for a Sql identifier. A Sql identifier is anything like
 * a table, schema, or column name. An identifier may also have a namespace,
 * thus why many names are accepted.
 */
const identifier = (...names) =>
  makeNode("IDENTIFIER", {
    names: ensureNonEmptyArray(names),
  });

/**
 * Creates a Sql item for a value that will be included in our final query.
 * This value will be added in a way which avoids Sql injection.
 */
const value = val => makeNode("VALUE", { value: val });

/**
 * If the value is simple will inline it into the query, otherwise will defer
 * to value.
 */
const literal = val => {
  if (isString(val) && val.match(/^[a-zA-Z0-9_-]*$/)) {
    return raw(`'${val}'`);
  } else if (lodashIsFinite(val)) {
    if (Number.isInteger(val)) {
      return raw(String(val));
    } else {
      return raw(`'${0 + val}'::float`);
    }
  } else if (isBoolean(val)) {
    if (val) {
      return raw(`TRUE`);
    } else {
      return raw(`FALSE`);
    }
  } else if (isNil(val)) {
    return raw(`NULL`);
  } else {
    return makeNode("VALUE", { value: val });
  }
};

/**
 * Join some Sql items together seperated by a string. Useful when dealing
 * with lists of Sql items that doesn’t make sense as a Sql query.
 */
const join = (items, seperator = "") =>
  ensureNonEmptyArray(items, true).reduce((currentItems, item, i) => {
    if (i === 0 || !seperator) {
      return currentItems.concat(item);
    } else {
      return currentItems.concat(makeNode("RAW", { text: seperator }), item);
    }
  }, []);

// Copied from https://github.com/brianc/node-postgres/blob/860cccd53105f7bc32fed8b1de69805f0ecd12eb/lib/client.js#L285-L302
// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
const escapeSqlIdentifier = function(str) {
  var escaped = '"';

  for (var i = 0; i < str.length; i++) {
    var c = str[i];
    if (c === '"') {
      escaped += c + c;
    } else {
      escaped += c;
    }
  }

  escaped += '"';

  return escaped;
};

exports.query = query;
exports.fragment = query;
exports.raw = raw;
exports.identifier = identifier;
exports.value = value;
exports.literal = literal;
exports.join = join;
exports.compile = compile;
exports.null = literal(null);
