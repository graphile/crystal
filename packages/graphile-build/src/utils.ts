import { EXPORTABLE } from "graphile-exporter";
import type { GraphQLNamedType, GraphQLScalarTypeConfig } from "graphql";
import { GraphQLObjectType, Kind } from "graphql";
import camelCaseAll from "lodash/camelCase.js";
import upperFirstAll from "lodash/upperFirst.js";
import plz from "pluralize";

const bindAll = (obj: object, keys: Array<string>) => {
  keys.forEach((key) => {
    if (
      typeof obj[key] === "function" &&
      !("$$export" in obj[key]) &&
      !("$exporter$factory" in obj[key])
    ) {
      // The Object.assign is to copy across any function properties
      obj[key] = Object.assign(obj[key].bind(obj), obj[key]);
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

export const stringScalarSpec = Object.freeze({
  serialize: (value) => String(value),
  parseValue: (value) => String(value),
  parseLiteral: EXPORTABLE(
    (Kind) => (ast) => {
      if (ast.kind !== Kind.STRING) {
        throw new Error("Can only parse string values");
      }
      return ast.value;
    },
    [Kind],
  ),
} as Omit<GraphQLScalarTypeConfig<unknown, unknown>, "name" | "description">);

// Copied from GraphQL v14, MIT license (c) GraphQL Contributors.
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
  serialize: (value) => String(value),
  parseValue: coerce
    ? EXPORTABLE((coerce) => (value) => coerce(String(value)), [coerce])
    : EXPORTABLE(() => (value) => String(value), []),
  parseLiteral: coerce
    ? EXPORTABLE(
        (Kind, coerce) => (ast) => {
          if (ast.kind !== Kind.STRING) {
            throw new Error("Can only parse string values");
          }
          return coerce(ast.value);
        },
        [Kind, coerce],
      )
    : EXPORTABLE(
        (Kind) => (ast) => {
          if (ast.kind !== Kind.STRING) {
            throw new Error("Can only parse string values");
          }
          return ast.value;
        },
        [Kind],
      ),
});
