const BACKSLASH = "\\";
const DQUOT = '"';
const LBRACE = "{";
const RBRACE = "}";
const LBRACKET = "[";
const EQUALS = "=";
const COMMA = ",";

/** When the raw value is this, it means a literal `null` */
const NULL_STRING = "NULL";

const EMPTY_ARRAY = Object.freeze([]);

type Transform<T> = (val: string) => T;

/**
 * Parses an array according to
 * https://www.postgresql.org/docs/17/arrays.html#ARRAYS-IO
 *
 * Trusts the data (mostly), so only hook up to trusted Postgres servers.
 */
export function makeParseArrayWithTransform<T = string>(
  transform?: Transform<T>,
  typeDelim = COMMA,
): (str: string) => readonly T[] {
  const haveTransform = transform != null;
  return function parseArray(str) {
    const rbraceIndex = str.length - 1;
    if (rbraceIndex === 1) {
      return EMPTY_ARRAY;
    }
    if (str[rbraceIndex] !== RBRACE) {
      throw new Error("Invalid array text - must end with }");
    }

    // If starts with `[`, it is specifying the index boundas. Skip past first `=`.
    let position = 0;
    if (str[position] === LBRACKET) {
      position = str.indexOf(EQUALS) + 1;
    }

    if (str[position++] !== LBRACE) {
      throw new Error("Invalid array text - must start with {");
    }
    const output: any[] = [];
    let current = output;
    const stack: any[][] = [];

    let currentStringStart: number = position;
    // Allocate on first assignment
    let currentString = "";
    let expectValue = true;

    for (; position < rbraceIndex; ++position) {
      let char = str[position];
      // > The array output routine will put double quotes around element values if
      // > they are empty strings, contain curly braces, delimiter characters, double
      // > quotes, backslashes, or white space, or match the word NULL. Double quotes
      // > and backslashes embedded in element values will be backslash-escaped.
      if (char === DQUOT) {
        // It's escaped
        currentStringStart = ++position;
        let dquot = str.indexOf(DQUOT, currentStringStart);
        let backSlash = str.indexOf(BACKSLASH, currentStringStart);
        while (backSlash !== -1 && backSlash < dquot) {
          position = backSlash;
          const part = str.slice(currentStringStart, position);
          currentString += part;
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
        currentString += part;
        current.push(haveTransform ? transform(currentString) : currentString);
        currentString = "";
        expectValue = false;
      } else if (char === LBRACE) {
        const newArray: any[] = [];
        current.push(newArray);
        stack.push(current);
        current = newArray;
        currentStringStart = position + 1;
        expectValue = true;
      } else if (char === typeDelim) {
        expectValue = true;
      } else if (char === RBRACE) {
        expectValue = false;
        const arr = stack.pop();
        if (arr === undefined) {
          throw new Error("Invalid array text - too many '}'");
        }
        current = arr;
      } else if (expectValue) {
        currentStringStart = position;
        while (
          (char = str[position]) !== typeDelim &&
          char !== RBRACE &&
          position < rbraceIndex
        ) {
          ++position;
        }

        const part = str.slice(currentStringStart, position--);
        current.push(
          part === NULL_STRING ? null : haveTransform ? transform(part) : part,
        );
        expectValue = false;
      } else {
        throw new Error("Was expecting delimeter");
      }
    }

    return output;
  };
}

export const parseArray = makeParseArrayWithTransform();
