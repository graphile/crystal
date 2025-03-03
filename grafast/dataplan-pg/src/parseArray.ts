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
const QUOTED_VALUE = 2;
const EXPECT_DELIM = 3;
type Mode =
  | typeof EXPECT_VALUE
  | typeof SIMPLE_VALUE
  | typeof QUOTED_VALUE
  | typeof EXPECT_DELIM;

type Transform<T> = (val: string) => T;

/**
 * Parses an array according to
 * https://www.postgresql.org/docs/17/arrays.html#ARRAYS-IO
 */
export function parseArray<T = string>(
  str: string,
  transform?: Transform<T>,
): T[] {
  // If starts with `[`, it is specifying the index boundas. Skip past first `=`.
  let position = 0;
  if (str[position] === LBRACKET) {
    position = str.indexOf(EQUALS) + 1;
    if (position === 0) {
      throw new Error(`Invalid array text, array indexes not understood`);
    }
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
  let currentStringParts: string[] | null = null;
  let mode: Mode = EXPECT_VALUE;
  const haveTransform = transform != null;

  for (; position < rbraceIndex; position++) {
    const char = str[position];
    // > The array output routine will put double quotes around element values if
    // > they are empty strings, contain curly braces, delimiter characters, double
    // > quotes, backslashes, or white space, or match the word NULL. Double quotes
    // > and backslashes embedded in element values will be backslash-escaped.
    if (mode === QUOTED_VALUE) {
      if (char === BACKSLASH) {
        // We contain escaping, so we have to do it the slow way
        const part = str.slice(currentStringStart, position);
        if (currentStringParts === null) {
          currentStringParts = [part];
        } else {
          currentStringParts.push(part);
        }
        currentStringStart = ++position;
      } else if (char === DQUOT) {
        const part = str.slice(currentStringStart, position);
        if (currentStringParts !== null) {
          const final = currentStringParts.join("") + part;
          current.push(haveTransform ? transform(final) : final);
          currentStringParts = null;
        } else {
          current.push(haveTransform ? transform(part) : part);
        }
        mode = EXPECT_DELIM;
      } else {
        continue;
      }
    } else if (char === DQUOT) {
      // It's escaped
      mode = QUOTED_VALUE;
      currentStringStart = position + 1;
    } else if (char === LBRACE) {
      const newArray: any[] = [];
      current.push(newArray);
      stack.push(current);
      current = newArray;
      currentStringStart = position + 1;
      mode = EXPECT_VALUE;
    } else if (char === COMMA) {
      // delim();
      if (mode === SIMPLE_VALUE) {
        const part = str.slice(currentStringStart, position);
        current.push(
          part === NULL_STRING ? null : haveTransform ? transform(part) : part,
        );
      }

      mode = EXPECT_VALUE;
    } else if (char === RBRACE) {
      //delim();
      if (mode === SIMPLE_VALUE) {
        const part = str.slice(currentStringStart, position);
        current.push(
          part === NULL_STRING ? null : haveTransform ? transform(part) : part,
        );
      }

      mode = EXPECT_DELIM;
      const arr = stack.pop();
      if (arr === undefined) {
        throw new Error(`Invalid array text - too many '}'`);
      }
      current = arr;
    } else if (mode === EXPECT_VALUE) {
      currentStringStart = position;
      mode = SIMPLE_VALUE;
    } else if (mode === SIMPLE_VALUE) {
      continue;
    } else if (mode === EXPECT_DELIM) {
      throw new Error("Was expecting delimeter");
    } else {
      const never: never = mode;
      throw new Error(`Was not expecting to be in mode ${never}`);
    }
  }

  //delim();
  if (mode === SIMPLE_VALUE) {
    const part = str.slice(currentStringStart, position);
    current.push(
      part === NULL_STRING ? null : haveTransform ? transform(part) : part,
    );
  }

  if (stack.length !== 0) {
    throw new Error(`Invalid array text - mismatched braces`);
  }

  return output;
}
