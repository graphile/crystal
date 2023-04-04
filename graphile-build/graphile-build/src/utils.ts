import { $$idempotent, SafeError } from "grafast";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLNamedType, GraphQLScalarTypeConfig } from "graphql";
import { GraphQLError, GraphQLObjectType, Kind } from "graphql";
// TODO: remove 'lodash' dependency
import camelCaseAll from "lodash/camelCase.js";
import upperFirstAll from "lodash/upperFirst.js";
import plz from "pluralize";

/**
 * Loops over all the given `keys` and binds the method of that name on `obj`
 * to `obj` so that destructuring `build`/etc won't relate in broken `this`
 * references.
 */
const bindAll = (obj: object, keys: Array<string>) => {
  keys.forEach((key) => {
    if (
      typeof (obj as any)[key] === "function" &&
      !("$$export" in (obj as any)[key]) &&
      !("$exporter$factory" in (obj as any)[key])
    ) {
      // The Object.assign is to copy across any function properties
      (obj as any)[key] = Object.assign(
        (obj as any)[key].bind(obj),
        (obj as any)[key],
      );
    }
  });
  return obj;
};

export { bindAll };

export const constantCaseAll = (str: string) =>
  str
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/[A-Z]+/g, "_$&")
    .replace(/__+/g, "_")
    .replace(/^[^a-zA-Z0-9]+/, "")
    .replace(/^[0-9]/, "_$&") // GraphQL enums must not start with a number
    .toUpperCase();

/**
 * Applies the given format function `fn` to a string, but maintains any
 * leading/trailing underscores.
 */
export const formatInsideUnderscores =
  (fn: (input: string) => string) => (str: string) => {
    // Guaranteed to match all strings, and to contain 3 capture groups.
    const matches = str.match(/^(_*)([\s\S]*?)(_*)$/) as [
      string,
      string,
      string,
      string,
    ];
    const [, start, middle, end] = matches;
    return `${start}${fn(middle)}${end}`;
  };

export const upperFirst = formatInsideUnderscores(upperFirstAll);
export const camelCase = formatInsideUnderscores(camelCaseAll);
export const constantCase = formatInsideUnderscores(constantCaseAll);
export const upperCamelCase = (str: string): string =>
  upperFirst(camelCase(str));

export const pluralize = (str: string) => plz(str);
export const singularize = (str: string) => plz.singular(str);

/**
 * Returns true if the given type is a GraphQL object type AND that object type
 * defines fields; false otherwise.
 *
 * WARNING: this function may throw if there's issues with the type's fields,
 * since it calls Type.getFields()
 */
export function isValidObjectType(
  Type: GraphQLNamedType | null | undefined,
): Type is GraphQLObjectType {
  return (
    Type instanceof GraphQLObjectType &&
    Object.keys(Type.getFields()).length > 0
  );
}

function toString(value: any) {
  return "" + value;
}

/**
 * A GraphQL scalar spec for a scalar that'll be treated as a verbatim string
 * in and out (i.e. the type name is really just a hint to the user); purely a
 * convenience.
 */
export const stringScalarSpec = Object.freeze({
  serialize: toString,
  parseValue: toString,
  parseLiteral: EXPORTABLE(
    (Kind, SafeError) => (ast) => {
      if (ast.kind !== Kind.STRING) {
        throw new SafeError("Can only parse string values");
      }
      return ast.value;
    },
    [Kind, SafeError],
  ),
  extensions: {
    grafast: {
      idempotent: true,
    },
  },
} as Omit<GraphQLScalarTypeConfig<unknown, unknown>, "name" | "description">);

// Copied from GraphQL v14, MIT license (c) GraphQL Contributors.
/**
 * Word-wraps the given text to maxLen; for consistency with older GraphQL
 * schemas.
 */
function breakLine(line: string, maxLen: number): Array<string> {
  const parts = line.split(new RegExp(`((?: |^).{15,${maxLen - 40}}(?= |$))`));
  if (parts.length < 4) {
    return [line];
  }
  const sublines = [parts[0]! + parts[1]! + parts[2]!];
  for (let i = 3; i < parts.length; i += 2) {
    sublines.push(parts[i]!.slice(1) + parts[i + 1]);
  }
  return sublines;
}

/**
 * Only use this on descriptions that are plain text, or that we create
 * manually in code; since descriptions are markdown, it's not safe to use on
 * descriptions that contain code blocks or long inline code strings.
 */
export const wrapDescription = (
  description: string,
  position: "root" | "type" | "field" | "arg",
): string => {
  const indentationLength =
    position === "root"
      ? 0
      : position === "type"
      ? 0
      : position === "field"
      ? 2
      : position === "arg"
      ? 4
      : 0;
  // This follows the implementation from GraphQL v14 to make our GraphQL v15
  // schema more similar. Ref:
  // https://github.com/graphql/graphql-js/pull/2223/files
  const maxLen = 120 - indentationLength;
  return description
    .split("\n")
    .map((line) => {
      if (line.length < maxLen + 5) {
        return line;
      }
      // For > 120 character long lines, cut at space boundaries into sublines
      // of ~80 chars.
      return breakLine(line, maxLen).join("\n");
    })
    .join("\n");
};

/**
 * Generates the spec for a GraphQLScalar (except the name) with the
 * given description/coercion.
 */
export const stringTypeSpec = (
  description: string,
  coerce?: (input: string) => string,
): Omit<GraphQLScalarTypeConfig<any, any>, "name"> => ({
  description,
  serialize: toString,
  parseValue: coerce
    ? EXPORTABLE((coerce) => (value) => coerce("" + value), [coerce])
    : toString,
  parseLiteral: coerce
    ? EXPORTABLE(
        (GraphQLError, Kind, coerce) => (ast) => {
          if (ast.kind !== Kind.STRING) {
            // TODO: add name to this error
            throw new GraphQLError("Can only parse string values");
          }
          return coerce(ast.value);
        },
        [GraphQLError, Kind, coerce],
      )
    : EXPORTABLE(
        (GraphQLError, Kind) => (ast) => {
          if (ast.kind !== Kind.STRING) {
            throw new GraphQLError("Can only parse string values");
          }
          return ast.value;
        },
        [GraphQLError, Kind],
      ),
  extensions: {
    grafast: {
      idempotent: !coerce || (coerce as any)[$$idempotent] ? true : false,
    },
  },
});
