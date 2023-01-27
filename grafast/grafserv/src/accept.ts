import LRU from "@graphile/lru";

/**
 * Returns a function that returns the (first, if multiple equal matches) type
 * from mediaTypes that best matches the accept query specified by the given
 * `acceptHeader`. If no Accept header is present then the first mediaType will
 * be returned. If no match is possible, `null` will be returned.
 */
export function makeAcceptMatcher(mediaTypes: string[]) {
  const lru = new LRU({ maxLength: 50 });
  return function preferredAccept(acceptHeader: string): string | null {
    const existing = lru.get(acceptHeader);
    if (existing) {
      return existing;
    } else {
      const specs = parseAccepts(acceptHeader);
    }
  };
}

interface Accept {
  type: string;
  subtype: string;
  parameters: Record<string, string>;
}

const SPACE = " ".charCodeAt(0);
const HORIZONTAL_TAB = "\t".charCodeAt(0);
const ASTERISK = "*".charCodeAt(0);
const SLASH = "/".charCodeAt(0);
const COMMA = ",".charCodeAt(0);
const SEMICOLON = ";".charCodeAt(0);
const EQUALS = "=".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const BACKSLASH = "\\".charCodeAt(0);

/*
 * Whitespace:
 * 9 (tab)
 * 10 (line feed)
 * 11 (vertical tab)
 * 12 (form feed)
 * 13 (carriage return)
 * 32 (space)
 */
const WHITESPACE_START = 9;
const WHITESPACE_END = 13;

/** We're more forgiving in whitespace in most cases */
function isWhitespace(charCode: number) {
  return (
    charCode === SPACE ||
    (charCode >= WHITESPACE_START && charCode <= WHITESPACE_END)
  );
}

/** is Optional White Space */
function isOWS(charCode: number) {
  return charCode === SPACE || charCode === HORIZONTAL_TAB;
}

/*
    "!" / "#" / "$" / "%" / "&" / "'" / "*"
     / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
     / DIGIT / ALPHA

33|35-39|42|43|45-57|65-90|94-122|124|126

>=33 && <= 126 && !34|40|41|44|58-64|91-93|123|125
  */

// Matches ordered from most likely to least likely for content types.
function isToken(charCode: number) {
  return (
    // ^_`a-z
    (charCode >= 94 && charCode <= 122) ||
    // symbols and numbers
    (charCode >= 35 &&
      charCode <= 57 &&
      charCode !== 40 &&
      charCode !== 41 &&
      charCode !== 44) ||
    // A-Z
    (charCode >= 65 && charCode <= 90) ||
    // !
    charCode === 33 ||
    // |
    charCode === 124 ||
    // ~
    charCode === 126
  );
}

enum State {
  EXPECT_TYPE = 0,
  CONTINUE_TYPE = 1,
  EXPECT_SUBTYPE = 2,
  CONTINUE_SUBTYPE = 3,
  EXPECT_COMMA_OR_SEMICOLON = 4,
  EXPECT_PARAMETER_NAME = 5,
  CONTINUE_PARAMETER_NAME = 6,
  EXPECT_PARAMETER_VALUE = 7,
  CONTINUE_PARAMETER_VALUE = 8,
  CONTINUE_QUOTED_PARAMETER_VALUE = 9,
}

/**
 * Parser based on https://httpwg.org/specs/rfc9110.html#rfc.section.12.5.1
 *
 * @remarks
 *
 * Why must you always write your own parsers, Benjie?
 */
function parseAccepts(acceptHeader: string) {
  const accepts: Accept[] = [];
  let state = State.EXPECT_TYPE;
  let currentAccept: Accept | null = null;
  let currentParameterName: string = "";
  function next() {
    accepts.push(currentAccept!);
    currentAccept = null;
    state = State.EXPECT_TYPE;
  }
  for (let i = 0, l = acceptHeader.length; i < l; i++) {
    const charCode = acceptHeader.charCodeAt(i);
    switch (state) {
      case State.EXPECT_TYPE: {
        // TODO: other types of whitespace?
        if (isWhitespace(charCode)) {
          continue;
        } else if (charCode === ASTERISK) {
          currentAccept = {
            type: "*",
            subtype: "",
            parameters: Object.create(null),
          };
          const nextCharCode = acceptHeader.charCodeAt(++i);
          if (nextCharCode !== SLASH) {
            throw new Error("Expected '/' after '*'");
          }
          if (acceptHeader.charCodeAt(i + 1) === ASTERISK) {
            ++i;
            currentAccept.subtype = "*";
            state = State.EXPECT_COMMA_OR_SEMICOLON;
          } else {
            state = State.EXPECT_SUBTYPE;
          }
        } else if (isToken(charCode)) {
          currentAccept = {
            type: acceptHeader[i],
            subtype: "",
            parameters: Object.create(null),
          };
          state = State.CONTINUE_TYPE;
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      case State.CONTINUE_TYPE: {
        if (charCode === SLASH) {
          state = State.EXPECT_SUBTYPE;
        } else if (isToken(charCode)) {
          currentAccept!.type += acceptHeader[i];
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      case State.EXPECT_SUBTYPE: {
        if (isToken(charCode)) {
          currentAccept!.subtype = acceptHeader[i];
          state = State.CONTINUE_SUBTYPE;
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      case State.CONTINUE_SUBTYPE: {
        if (charCode === SEMICOLON) {
          // Parameters
          state = State.EXPECT_PARAMETER_NAME;
        } else if (charCode === COMMA) {
          next();
        } else if (isToken(charCode)) {
          currentAccept!.type += acceptHeader[i];
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      case State.EXPECT_COMMA_OR_SEMICOLON: {
        if (isWhitespace(charCode)) {
          continue;
        } else if (charCode === SEMICOLON) {
          state = State.EXPECT_PARAMETER_NAME;
        } else if (charCode === COMMA) {
          next();
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      case State.EXPECT_PARAMETER_NAME: {
        if (isOWS(charCode)) {
          continue;
        } else if (isToken(charCode)) {
          currentParameterName = acceptHeader[i];
          state = State.CONTINUE_PARAMETER_NAME;
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      case State.CONTINUE_PARAMETER_NAME: {
        if (isToken(charCode)) {
          currentParameterName += acceptHeader[i];
        } else if (charCode === EQUALS) {
          state = State.EXPECT_PARAMETER_VALUE;
          /*
          if (currentAccept?.parameters[currentParameterName]) {
            throw new Error("Overriding parameter!");
          }
          */
          currentAccept!.parameters[currentParameterName] = "";
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      case State.EXPECT_PARAMETER_VALUE: {
        if (charCode === DOUBLE_QUOTE) {
          state = State.CONTINUE_QUOTED_PARAMETER_VALUE;
        } else if (isToken(charCode)) {
          state = State.CONTINUE_PARAMETER_VALUE;
          currentParameterName += acceptHeader[i];
        } else if (charCode === EQUALS) {
          state = State.EXPECT_PARAMETER_VALUE;
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      case State.CONTINUE_QUOTED_PARAMETER_VALUE: {
        if (charCode === DOUBLE_QUOTE) {
          state = State.EXPECT_COMMA_OR_SEMICOLON;
        } else if (charCode === BACKSLASH) {
          const char = acceptHeader[++i];
          if (char === undefined) {
            throw new Error(`Unexpected terminating backslash`);
          }
          // TODO: Technically we should respect `quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )`
          currentAccept!.parameters[currentParameterName] += char;
        } else {
          // TODO: Technically we should respect `qdtext = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text`
          currentAccept!.parameters[currentParameterName] += acceptHeader[i];
        }
        break;
      }
      case State.CONTINUE_PARAMETER_VALUE: {
        if (charCode === SEMICOLON) {
          // Parameters
          state = State.EXPECT_PARAMETER_NAME;
        } else if (charCode === COMMA) {
          next();
        } else if (isToken(charCode)) {
          currentAccept!.parameters[currentParameterName] += acceptHeader[i];
        } else {
          throw new Error(`Unexpected character '${acceptHeader[i]}'`);
        }
        break;
      }
      default: {
        const never: never = state;
        throw new Error(`Unhandled state '${never}'`);
      }
    }
  }
  if (state !== State.EXPECT_TYPE) {
    next();
  }
  return accepts;
}
