import type { PgCodecRefPath, PgResource } from "@dataplan/pg";
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
  } else if (!tags.behavior) {
    tags.behavior = [behavior];
  } else {
    throw new Error(
      `Did not understand tags.behavior - it wasn't an array or a string`,
    );
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

// NOTE: Do **NOT** add `<>` as parens; it will break arrows `->`
const OPEN_PARENS = ["(", "{", "["];
const CLOSE_PARENS = [")", "}", "]"];

const IGNORED = /\s/;
const SPECIAL = /[\\":]/;
const SAFE_PARAMETER_NAME = /^[a-zA-Z_][a-zA-Z_0-9]*$/;

export function parseSmartTagsOptsString<TParamName extends string = string>(
  optsString: string | true | (string | true)[] | undefined,
  leading = 0,
) {
  const result = {
    args: [] as string[],
    params: Object.create(null) as {
      [paramName in TParamName]?: string;
    },
  };
  if (typeof optsString !== "string") {
    return result;
  }
  let leadingLeft = leading;
  let mode: MODE = leadingLeft > 0 ? MODE.EXPECT_ARG : MODE.EXPECT_PARAM_NAME;
  let inQuotes = false;
  let str = "";
  let name = "";
  const stack: number[] = [];

  function validateParameterName(name: string): TParamName {
    if (name in result.params) {
      throw new Error(`Parameter '${name}' already set`);
    }
    if (name === "") {
      throw new Error(`Empty parameter name not allowed`);
    }
    if (!SAFE_PARAMETER_NAME.test(name)) {
      throw new Error(
        `Invalid parameter name '${name}' - please carefully check your syntax, especially the placement of spaces and quotes. (Opts string: ${JSON.stringify(
          optsString,
        )})`,
      );
    }
    return name as TParamName;
  }

  function doneOne() {
    switch (mode) {
      case MODE.ARG: {
        result.args.push(str);
        str = "";
        mode = --leadingLeft > 0 ? MODE.EXPECT_ARG : MODE.EXPECT_PARAM_NAME;
        break;
      }
      case MODE.PARAM_NAME: {
        result.params[validateParameterName(str)] = "";
        mode = MODE.EXPECT_PARAM_NAME;
        break;
      }
      case MODE.PARAM_VALUE: {
        result.params[validateParameterName(name)] = str;
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
    } else if (stack.length > 0) {
      str += char;
      if (char === CLOSE_PARENS[stack[stack.length - 1]]) {
        stack.pop();
      } else {
        const parenIdx = OPEN_PARENS.indexOf(char);
        if (parenIdx >= 0) {
          stack.push(parenIdx);
        } else if (CLOSE_PARENS.includes(char)) {
          throw new Error(
            `Found mismatched '${char}' at position ${i} (closing parenthesis; expecting '${
              CLOSE_PARENS[stack[stack.length - 1]]
            }'); if this is deliberate, be sure to escape your parameter value with quotes. (Opt string = ${JSON.stringify(
              optsString,
            )})`,
          );
        }
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
              const openIdx = OPEN_PARENS.indexOf(char);
              if (openIdx >= 0) {
                stack.push(openIdx);
              } else if (CLOSE_PARENS.includes(char)) {
                throw new Error(
                  `Argument value started with '${char}' which is a close parenthesis character; if this is intentional, please escape the argument value with double quotes.`,
                );
              }
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
            const openIdx = OPEN_PARENS.indexOf(char);
            if (openIdx >= 0) {
              stack.push(openIdx);
            } else if (CLOSE_PARENS.includes(char)) {
              throw new Error(
                `Param name started with '${char}' which is not permitted.`,
              );
            }
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
              const openIdx = OPEN_PARENS.indexOf(char);
              if (openIdx >= 0) {
                stack.push(openIdx);
              } else if (CLOSE_PARENS.includes(char)) {
                throw new Error(
                  `Parameter value started with '${char}' which is a close parenthesis character; if this is intentional, please escape the Parameter value with double quotes.`,
                );
              }
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
                `The colon character (":") may not occur here; please put it in quote marks. (Processing ${JSON.stringify(
                  optsString,
                )} with ${leading} leading params)`,
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
            const parenIdx = OPEN_PARENS.indexOf(char);
            if (parenIdx >= 0) {
              stack.push(parenIdx);
            } else if (CLOSE_PARENS.includes(char)) {
              throw new Error(
                `Found unexpected '${char}' at position ${i} (closing parenthesis; but no parenthesis is open); if this is deliberate, be sure to escape your parameter value with quotes. (Opt string: ${JSON.stringify(
                  optsString,
                )})`,
              );
            }
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

export function parseDatabaseIdentifier<TExpectedLength extends number>(
  identifier: string,
  expectedLength: TExpectedLength,
  fallbackNamespace = "public",
): TExpectedLength extends 1
  ? [string]
  : TExpectedLength extends 2
  ? [string, string]
  : TExpectedLength extends 3
  ? [string, string, string]
  : string[] {
  const identifiers = parseDatabaseIdentifiers(
    identifier,
    expectedLength,
    fallbackNamespace,
  );
  if (identifiers.length === 1) {
    return identifiers[0];
  } else {
    throw new Error(
      `Was expecting '${identifier}' to contain exactly 1 identifier`,
    );
  }
}

/**
 * Parses an identifier string like `a."fooBar",baz,"MySchema".MyCol` into a
 * list of tuples of length `expectedLength`, backfilling with fallbackNamespace
 * if necessary (e.g. to produce `[["a", "fooBar"], ["public", "baz"], ["MySchema", "mycol"]]`)
 *
 * To find this, you might also search for: `parseIdentifier()`,
 * `parseIdentifiers()`.
 */
export function parseDatabaseIdentifiers<TExpectedLength extends number>(
  identifier: string,
  expectedLength: TExpectedLength,
  fallbackNamespace = "public",
): Array<
  TExpectedLength extends 1
    ? [string]
    : TExpectedLength extends 2
    ? [string, string]
    : TExpectedLength extends 3
    ? [string, string, string]
    : string[]
> {
  const identifiers: string[][] = [];
  let currentParts: string[] = [];
  let currentIdentifier = "";
  let state:
    | "EXPECT_IDENTIFIER"
    | "QUOTED_IDENTIFIER"
    | "UNQUOTED_IDENTIFIER"
    | "EXPECT_NEXT" = "EXPECT_IDENTIFIER";

  function nextIdentifier() {
    if (currentIdentifier !== "") {
      throw new Error(
        `GraphileInternalError<05c47638-c2cd-4b47-bfc2-67ccbf861e2c>: bug in identifier parser - currentIdentifier should be blank at this point`,
      );
    }

    if (
      currentParts.length > expectedLength ||
      currentParts.length < expectedLength - 1
    ) {
      throw new Error(
        `Cannot parse database identifier '${identifier}' - it has the wrong number of parts`,
      );
    }
    const parts =
      currentParts.length < expectedLength
        ? ([fallbackNamespace, ...currentParts] as any)
        : (currentParts as any);

    identifiers.push(parts);
    currentParts = [];
  }

  for (let i = 0, l = identifier.length; i < l; i++) {
    const c = identifier[i];
    switch (state) {
      case "EXPECT_IDENTIFIER": {
        if (c === '"') {
          state = "QUOTED_IDENTIFIER";
        } else if (/[_\w]/.test(c)) {
          state = "UNQUOTED_IDENTIFIER";
          currentIdentifier += c.toLowerCase();
        } else if (/\s/.test(c)) {
          //ignore
        } else {
          throw new Error(`Failed to parse identifier string '${identifier}'`);
        }
        break;
      }
      case "QUOTED_IDENTIFIER": {
        if (c === '"') {
          currentParts.push(currentIdentifier);
          currentIdentifier = "";
          state = "EXPECT_NEXT";
        } else if (c === "\\") {
          throw new Error(
            `GraphileInternalError<72452ea1-715a-4a7b-93d5-49b5348a9c16>: parser for identifiers currently does not support backslashes`,
          );
        } else {
          currentIdentifier += c;
        }
        break;
      }
      case "UNQUOTED_IDENTIFIER": {
        if (/[_\w\d$]/.test(c)) {
          currentIdentifier += c.toLowerCase();
        } else {
          currentParts.push(currentIdentifier);
          currentIdentifier = "";
          state = "EXPECT_NEXT";
          // Process the character again, as a divider
          i--;
        }
        break;
      }
      case "EXPECT_NEXT": {
        if (c === ".") {
          state = "EXPECT_IDENTIFIER";
        } else if (c === ",") {
          nextIdentifier();
          state = "EXPECT_IDENTIFIER";
        } else if (/\s/.test(c)) {
          // ignore
        } else {
          throw new Error(
            `Unexpected character '${c}' at position '${i}' in identifiers string '${identifier}'`,
          );
        }
        break;
      }
    }
  }
  if (state === "UNQUOTED_IDENTIFIER" && currentIdentifier) {
    currentParts.push(currentIdentifier);
    currentIdentifier = "";
  } else if (currentIdentifier) {
    throw new Error(`Identifier '${identifier}' terminated unexpectedly`);
  }
  if (currentParts.length > 0) {
    nextIdentifier();
  }
  return identifiers as Array<any>;
}

type Layer = {
  relationName: string;
  localAttributes: string[];
  resource: PgResource<any, any, any, any, any>;
  remoteAttributes: string[];
  isUnique: boolean;
};

export const resolveResourceRefPath = (
  resource: PgResource<any, any, any, any, any>,
  path: PgCodecRefPath,
) => {
  if (!resource) {
    throw new Error(`Cannot call resolvePath unless there's a resource`);
  }
  const result = {
    resource,
    hasReferencee: false,
    isUnique: true,
    layers: [] as Layer[],
  };
  for (const pathEntry of path) {
    const relation = result.resource.getRelation(pathEntry.relationName);
    const {
      isReferencee,
      localAttributes,
      remoteAttributes,
      remoteResource: resource,
      isUnique,
    } = relation;
    if (isReferencee) {
      result.hasReferencee = true;
    }
    if (!isUnique) {
      result.isUnique = false;
    }
    result.layers.push({
      relationName: pathEntry.relationName,
      localAttributes: localAttributes as string[],
      remoteAttributes: remoteAttributes as string[],
      resource,
      isUnique,
    });
    result.resource = relation.remoteResource;
  }
  return result;
};
