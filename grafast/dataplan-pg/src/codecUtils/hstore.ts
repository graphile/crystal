import { SafeError } from "grafast";

export interface PgHStore {
  [key: string]: string | null;
}

// TESTS: need unit tests for this!
// NOTE: I've not tried running this and I was sleep-deprived when I wrote it.
// NOTE: I don't believe this is vulnerable to prototype polution since we do
//   `Object.create(null)` and you can only set the value to a string or null.

/**
 * Parses the Postgres HStore syntax
 *
 * @see {@link https://www.postgresql.org/docs/14/hstore.html#id-1.11.7.25.5}
 */
export function parseHstore(hstoreString: string): PgHStore {
  const hstore: PgHStore = Object.create(null);
  // Parse via a simple character-wise scanner
  let mode:
    | "EXPECT_KEY"
    | "KEY_RAW"
    | "KEY_QUOTES"
    | "EXPECT_ARROW"
    | "EXPECT_VALUE"
    | "VALUE_RAW"
    | "VALUE_QUOTES"
    | "EXPECT_COMMA" = "EXPECT_KEY";
  let key: string | null = null;
  let value: string | null = null;
  for (let i = 0, l = hstoreString.length; i < l; i++) {
    const char = hstoreString[i];
    switch (mode) {
      case "EXPECT_KEY": {
        if (/\s/.test(char)) {
          continue;
        } else if (char === '"') {
          mode = "KEY_QUOTES";
          key = "";
        } else if (char === "\\") {
          mode = "KEY_RAW";
          key = hstoreString[++i];
        } else {
          mode = "KEY_RAW";
          key = char;
        }
        break;
      }
      case "KEY_QUOTES": {
        if (char === '"') {
          mode = "EXPECT_ARROW";
        } else if (char === "\\") {
          key += hstoreString[++i];
        } else {
          key += char;
        }
        break;
      }
      case "KEY_RAW": {
        if (/\s/.test(char)) {
          mode = "EXPECT_ARROW";
          continue;
        } else if (char === "=" && hstoreString[i + 1] === ">") {
          ++i;
          mode = "EXPECT_VALUE";
        } else if (char === "\\") {
          key += hstoreString[++i];
        } else {
          key += char;
        }
        break;
      }
      case "EXPECT_ARROW": {
        if (/\s/.test(char)) {
          mode = "EXPECT_ARROW";
          continue;
        } else if (char === "=" && hstoreString[i + 1] === ">") {
          ++i;
          mode = "EXPECT_VALUE";
        } else {
          throw new SafeError("Invalid hstore value - expected '=>'");
        }
        break;
      }
      case "EXPECT_VALUE": {
        if (/\s/.test(char)) {
          continue;
        } else if (char === '"') {
          mode = "VALUE_QUOTES";
          value = "";
        } else if (char === "\\") {
          mode = "VALUE_RAW";
          value = hstoreString[++i];
        } else {
          mode = "VALUE_RAW";
          value = char;
        }
        break;
      }
      case "VALUE_QUOTES": {
        if (char === '"') {
          if (key == null) throw new SafeError("No key");
          hstore[key] = value;
          key = null;
          value = null;
          mode = "EXPECT_COMMA";
        } else if (char === "\\") {
          value += hstoreString[++i];
        } else {
          value += char;
        }
        break;
      }
      case "VALUE_RAW": {
        if (char === "," || /\s/.test(char)) {
          if (key == null) throw new SafeError("No key");
          hstore[key] = value === "NULL" ? null : value;
          key = null;
          value = null;
          mode = char === "," ? "EXPECT_KEY" : "EXPECT_COMMA";
          continue;
        } else if (char === "\\") {
          value += hstoreString[++i];
        } else {
          value += char;
        }
        break;
      }
      case "EXPECT_COMMA": {
        if (/\s/.test(char)) {
          continue;
        } else if (char === ",") {
          mode = "EXPECT_KEY";
        } else {
          throw new SafeError("Invalid hstore value - expected comma");
        }
        break;
      }
      default: {
        const never: never = mode;
        throw new SafeError(`Reached invalid mode ${never}`);
      }
    }
  }
  if (key != null) {
    hstore[key] = mode === "VALUE_RAW" && value === "NULL" ? null : value;
  }
  return hstore;
}

// To include a double quote or a backslash in a key or value, escape it with a
// backslash. [...] A value (but not a key) can be an SQL NULL. [...]
// Double-quote the NULL to treat it as the ordinary string “NULL”.
// -- https://www.postgresql.org/docs/14/static/hstore.html
function toHstoreString(str: string | null): string {
  return str == null ? "NULL" : '"' + str.replace(/(["\\])/g, "\\$1") + '"';
}

/**
 * Stringifies to the Postgres HStore syntax
 *
 * @see {@link https://www.postgresql.org/docs/14/hstore.html#id-1.11.7.25.5}
 */
export function stringifyHstore(o: PgHStore | null): string | null {
  if (o == null) {
    return null;
  }
  if (typeof o !== "object") {
    throw new SafeError("Expected an hstore object");
  }
  const keys = Object.keys(o);
  const encodeKeyValue = (key: string) => {
    const value = o[key];
    if (value == null) {
      return `${toHstoreString(key)} => NULL`;
    } else {
      return `${toHstoreString(key)} => ${toHstoreString(String(value))}`;
    }
  };
  return keys.map(encodeKeyValue).join(", ");
}
