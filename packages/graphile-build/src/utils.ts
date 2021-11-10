import type { GraphQLNamedType, GraphQLScalarTypeConfig } from "graphql";
import { GraphQLObjectType, Kind } from "graphql";
import camelCaseAll from "lodash/camelCase";
import upperFirstAll from "lodash/upperFirst";
import plz from "pluralize";

const bindAll = (obj: object, keys: Array<string>) => {
  keys.forEach((key) => {
    // The Object.assign is to copy across any function properties
    obj[key] = Object.assign(obj[key].bind(obj), obj[key]);
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
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new Error("Can only parse string values");
    }
    return ast.value;
  },
} as Omit<GraphQLScalarTypeConfig<unknown, unknown>, "name" | "description">);
