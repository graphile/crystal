import type { PgSmartTagsDict } from "pg-introspection";

export function tagToString(
  str: undefined | null | boolean | string | (string | boolean)[],
): string | undefined {
  if (!str || (Array.isArray(str) && str.length === 0)) {
    return undefined;
  }
  return Array.isArray(str) ? str.join("\n") : str === true ? " " : str;
}

export function addBehaviorToTags(
  tags: Partial<PgSmartTagsDict>,
  behavior: string,
  prepend = false,
): void {
  if (Array.isArray(tags.behavior)) {
    if (prepend) {
      tags.behavior = [behavior, ...tags.behavior];
    } else {
      tags.behavior = [...tags.behavior, behavior];
    }
  } else if (typeof tags.behavior === "string") {
    tags.behavior = prepend
      ? [behavior, tags.behavior]
      : [tags.behavior, behavior];
  } else {
    tags.behavior = [behavior];
  }
}

enum MODE {
  EXPECT_ARG = 0,
  ARG = 1,
  EXPECT_PARAM_NAME = 2,
  PARAM_NAME = 3,
  EXPECT_PARAM_VALUE = 4,
  PARAM_VALUE = 5,
}

const IGNORED = /\s/;
const SPECIAL = /[\\":]/;

export function parseSmartTagsOptsString(optsString: string, leading = 0) {
  const result = {
    args: [] as string[],
    params: Object.create(null) as {
      [paramName: string]: string;
    },
  };
  let leadingLeft = leading;
  let mode: MODE = leadingLeft > 0 ? MODE.EXPECT_ARG : MODE.EXPECT_PARAM_NAME;
  let inQuotes = false;
  let str = "";
  let name = "";

  function doneOne() {
    switch (mode) {
      case MODE.ARG: {
        result.args.push(str);
        str = "";
        mode = --leadingLeft > 0 ? MODE.EXPECT_ARG : MODE.EXPECT_PARAM_NAME;
        break;
      }
      case MODE.PARAM_NAME: {
        result.params[str] = "";
        mode = MODE.EXPECT_PARAM_NAME;
        break;
      }
      case MODE.PARAM_VALUE: {
        result.params[name] = str;
        mode = MODE.EXPECT_PARAM_NAME;
        break;
      }
      case MODE.EXPECT_PARAM_VALUE: {
        throw new Error("Unterminated expression string");
      }
      case MODE.EXPECT_ARG: {
        throw new Error("Too few args");
      }
      case MODE.EXPECT_PARAM_NAME: {
        // Fine
        break;
      }
      default: {
        const never: never = mode;
        throw new Error(`Invalid mode '${never}'`);
      }
    }
  }

  for (let i = 0, l = optsString.length; i < l; i++) {
    const char = optsString[i];
    if (inQuotes) {
      if (char === '"') {
        inQuotes = false;
      } else if (char === "\\") {
        const nextChar = optsString[++i];
        if (nextChar !== "\\" && nextChar !== '"') {
          throw new Error("That escape sequence isn't currently supported");
        }
        str += nextChar;
      } else {
        str += char;
      }
    } else {
      switch (mode) {
        case MODE.EXPECT_ARG: {
          if (IGNORED.test(char)) {
            /* noop */
          } else {
            mode = MODE.ARG;
            if (char === '"') {
              str = "";
              inQuotes = true;
            } else {
              if (SPECIAL.test(char)) {
                throw new Error("Invalid position for special char");
              }
              str = char;
            }
          }
          break;
        }
        case MODE.EXPECT_PARAM_NAME: {
          if (IGNORED.test(char)) {
            /* noop */
          } else {
            mode = MODE.PARAM_NAME;
            if (SPECIAL.test(char)) {
              throw new Error("Invalid position for special char");
            }
            str = char;
          }
          break;
        }
        case MODE.EXPECT_PARAM_VALUE: {
          if (IGNORED.test(char)) {
            /* noop */
          } else {
            mode = MODE.PARAM_VALUE;
            if (char === '"') {
              str = "";
              inQuotes = true;
            } else {
              if (SPECIAL.test(char)) {
                throw new Error("Invalid position for special char");
              }
              str = char;
            }
          }
          break;
        }
        case MODE.ARG:
        case MODE.PARAM_NAME:
        case MODE.PARAM_VALUE: {
          if (IGNORED.test(char)) {
            doneOne();
          } else if (char === '"') {
            inQuotes = true;
          } else if (char === ":") {
            if (mode !== MODE.PARAM_NAME) {
              throw new Error(
                'The colon character (":") may not occur here; please put it in quote marks',
              );
            } else {
              name = str;
              str = "";
              mode = MODE.EXPECT_PARAM_VALUE;
            }
          } else if (SPECIAL.test(char)) {
            throw new Error("Invalid position for special char");
          } else {
            str += char;
          }
          break;
        }
        default: {
          const never: never = mode;
          throw new Error(`Unhandled mode '${never}'`);
        }
      }
    }
  }
  doneOne();
  return result;
}
