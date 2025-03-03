const BACKSLASH = "\\";
const DQUOT = '"';
const LBRACE = "{";
const RBRACE = "}";
const LBRACKET = "[";
const EQUALS = "=";
const COMMA = ",";

/** When the raw value is this, it means a literal `null` */
const NULL_STRING = "NULL";

const EXPECT_VALUE = 0;
const SIMPLE_VALUE = 1;
const EXPECT_DELIM = 3;
type Mode = typeof EXPECT_VALUE | typeof SIMPLE_VALUE | typeof EXPECT_DELIM;

type Transform<T> = (val: string) => T;

/**
 * Parses an array according to
 * https://www.postgresql.org/docs/17/arrays.html#ARRAYS-IO
 *
 * Trusts the data (mostly), so only hook up to trusted Postgres servers.
 */
export function makeParseArrayWithTransform<T = string>(
  transform?: Transform<T>,
): (str: string) => T[] {
  return function parseArray(str) {
    // If starts with `[`, it is specifying the index boundas. Skip past first `=`.
    let position = 0;
    if (str[position] === LBRACKET) {
      position = str.indexOf(EQUALS) + 1;
    }

    if (str[position++] !== LBRACE) {
      throw new Error(`Invalid array text - must start with {`);
    }
    const rbraceIndex = str.length - 1;
    if (str[rbraceIndex] !== RBRACE) {
      throw new Error(`Invalid array text - must end with }`);
    }
    const output: any[] = [];
    let current = output;
    const stack: any[][] = [];

    let currentStringStart: number = position;
    const currentStringParts: string[] = [];
    let hasStringParts = false;
    let mode: Mode = EXPECT_VALUE;
    const haveTransform = transform != null;

    for (; position < rbraceIndex; ++position) {
      const char = str[position];
      // > The array output routine will put double quotes around element values if
      // > they are empty strings, contain curly braces, delimiter characters, double
      // > quotes, backslashes, or white space, or match the word NULL. Double quotes
      // > and backslashes embedded in element values will be backslash-escaped.
      switch (char) {
        case DQUOT: {
          // It's escaped
          currentStringStart = ++position;
          let dquot = str.indexOf(DQUOT, currentStringStart);
          let backSlash = str.indexOf(BACKSLASH, currentStringStart);
          while (backSlash !== -1 && backSlash < dquot) {
            position = backSlash;
            const part = str.slice(currentStringStart, position);
            currentStringParts.push(part);
            hasStringParts = true;
            currentStringStart = ++position;
            if (dquot === position++) {
              // This was an escaped doublequote; find the next one!
              dquot = str.indexOf(DQUOT, position);
            }
            // Either way, find the next backslash
            backSlash = str.indexOf(BACKSLASH, position);
          }
          position = dquot;
          const part = str.slice(currentStringStart, position);
          if (hasStringParts) {
            const final = currentStringParts.join("") + part;
            current.push(haveTransform ? transform(final) : final);
            currentStringParts.length = 0;
            hasStringParts = false;
          } else {
            current.push(haveTransform ? transform(part) : part);
          }
          mode = EXPECT_DELIM;
          break;
        }
        case LBRACE: {
          const newArray: any[] = [];
          current.push(newArray);
          stack.push(current);
          current = newArray;
          currentStringStart = position + 1;
          mode = EXPECT_VALUE;
          break;
        }
        case COMMA: {
          // delim();
          if (mode === SIMPLE_VALUE) {
            const part = str.slice(currentStringStart, position);
            current.push(
              part === NULL_STRING
                ? null
                : haveTransform
                ? transform(part)
                : part,
            );
          }

          mode = EXPECT_VALUE;
          break;
        }
        case RBRACE: {
          //delim();
          if (mode === SIMPLE_VALUE) {
            const part = str.slice(currentStringStart, position);
            current.push(
              part === NULL_STRING
                ? null
                : haveTransform
                ? transform(part)
                : part,
            );
          }

          mode = EXPECT_DELIM;
          const arr = stack.pop();
          if (arr === undefined) {
            throw new Error(`Invalid array text - too many '}'`);
          }
          current = arr;
          break;
        }
        default: {
          switch (mode) {
            case EXPECT_VALUE: {
              currentStringStart = position;
              mode = SIMPLE_VALUE;
              break;
            }
            case SIMPLE_VALUE: {
              continue;
            }
            case EXPECT_DELIM: {
              throw new Error("Was expecting delimeter");
            }
            default: {
              const never: never = mode;
              throw new Error(`Was not expecting to be in mode ${never}`);
            }
          }
        }
      }
    }

    //delim();
    if (mode === SIMPLE_VALUE) {
      const part = str.slice(currentStringStart, position);
      current.push(
        part === NULL_STRING ? null : haveTransform ? transform(part) : part,
      );
    }

    return output;
  };
}

export const parseArray = makeParseArrayWithTransform();
