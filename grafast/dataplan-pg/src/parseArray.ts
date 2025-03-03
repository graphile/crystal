const BACKSLASH = "\\";
const DQUOT = '"';
const LBRACE = "{";
const RBRACE = "}";

const MODES = {
  EXPECT_VALUE: 0,
  IN_QUOTES: 1,
  IN_VALUE: 2,
  EXPECT_DELIM_AFTER_PROCESSED: 3,
} as const;
type Mode = (typeof MODES)[keyof typeof MODES];

/**
 * Parses an array according to
 * https://www.postgresql.org/docs/17/arrays.html#ARRAYS-IO
 */
export function parseArray(str: string, typdelim = ","): any[] {
  // If starts with `[`, it is specifying the index boundas. Skip past first `=`.
  let position = 0;
  if (str[position] === "[") {
    position = str.indexOf("=") + 1;
    if (position === 0)
      throw new Error(`Invalid array text, array indexes not understood`);
  }

  if (str[position++] !== "{") {
    throw new Error(`Invalid array text - must start with {`);
  }
  const rbraceIndex = str.length - 1;
  if (str[rbraceIndex] !== "}") {
    throw new Error(`Invalid array text - must end with }`);
  }
  const output: any[] = [];
  let current = output;
  const stack: any[][] = [];

  let currentStringStart: number = position;
  let currentStringParts: string[] | null = null;
  let mode: Mode = MODES.EXPECT_VALUE;

  function delim() {
    if (mode === MODES.IN_VALUE) {
      const part = str.slice(currentStringStart, position);
      current.push(part === "NULL" ? null : part);
      currentStringStart = position + 1;
    }
    mode = MODES.EXPECT_DELIM_AFTER_PROCESSED;
  }

  for (; position < rbraceIndex; position++) {
    const char = str[position];
    // > The array output routine will put double quotes around element values if
    // > they are empty strings, contain curly braces, delimiter characters, double
    // > quotes, backslashes, or white space, or match the word NULL. Double quotes
    // > and backslashes embedded in element values will be backslash-escaped.
    if (mode === MODES.IN_QUOTES) {
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
          current.push(currentStringParts.join("") + part);
          currentStringParts = null;
        } else {
          current.push(part);
        }
        mode = MODES.EXPECT_DELIM_AFTER_PROCESSED;
      } else {
        continue;
      }
    } else if (char === DQUOT) {
      // It's escaped
      mode = MODES.IN_QUOTES;
      currentStringStart = position + 1;
    } else if (char === LBRACE) {
      const newArray: any[] = [];
      current.push(newArray);
      stack.push(current);
      current = newArray;
      currentStringStart = position + 1;
      mode = MODES.EXPECT_VALUE;
    } else if (char === typdelim) {
      delim();
      mode = MODES.EXPECT_VALUE;
    } else if (char === RBRACE) {
      delim();
      mode = MODES.EXPECT_DELIM_AFTER_PROCESSED;
      const arr = stack.pop();
      if (arr === undefined) {
        throw new Error(`Invalid array text - too many '}'`);
      }
      current = arr;
    } else if (mode === MODES.EXPECT_VALUE) {
      currentStringStart = position;
      mode = MODES.IN_VALUE;
    } else if (mode === MODES.IN_VALUE) {
      continue;
    } else if (mode === MODES.EXPECT_DELIM_AFTER_PROCESSED) {
      throw new Error("Was expecting delimeter");
    } else {
      const never: never = mode;
      throw new Error(`Was not expecting to be in mode ${never}`);
    }
  }
  delim();

  if (stack.length !== 0) {
    throw new Error(`Invalid array text - mismatched braces`);
  }

  return output;
}
