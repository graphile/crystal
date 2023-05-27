import type { PgCodecRefPath, PgCodecRelation, PgResource } from "@dataplan/pg";
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

  function validateParameterName(name: string): TParamName {
    if (name in result.params) {
      throw new Error(`Parameter '${name}' already set`);
    }
    if (name === "") {
      throw new Error(`Empty parameter name not allowed`);
    }
    if (!SAFE_PARAMETER_NAME.test(name)) {
      throw new Error(`Invalid parameter name`);
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

export function parseDatabaseIdentifierFromSmartTag<
  TExpectedLength extends number,
>(
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
  const parts = identifier.split(".");
  // TODO: parse this better!
  if (parts.length > expectedLength || parts.length < expectedLength - 1) {
    throw new Error(
      "Cannot parse database identifier - it has the wrong number of parts",
    );
  }
  const bits = parts.map((part) => {
    if (part[0] === '"') {
      if (part[part.length - 1] !== '"') {
        throw new Error(
          `Cannot parse database identifier; invalid quoting '${part}'`,
        );
      }
      return part.slice(1, part.length - 1);
    } else {
      return part;
    }
  });
  if (bits.length < expectedLength) {
    return [fallbackNamespace, ...bits] as any;
  } else {
    return bits as any;
  }
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
    const relation = result.resource.getRelation(
      pathEntry.relationName,
    ) as PgCodecRelation;
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
