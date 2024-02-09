import { $$idempotent } from "grafast";
import type {
  GraphQLNamedType,
  GraphQLScalarTypeConfig,
} from "grafast/graphql";
import { GraphQLError, GraphQLObjectType, Kind } from "grafast/graphql";
// ENHANCE: remove 'lodash' dependency
import camelCaseAll from "lodash/camelCase.js";
import upperFirstAll from "lodash/upperFirst.js";
import plz from "pluralize";

export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
  nameHint?: string,
): T {
  const fn: T = factory(...args);
  if (
    (typeof fn === "function" || (typeof fn === "object" && fn !== null)) &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
      $exporter$name: { writable: true, value: nameHint },
    });
  }
  return fn;
}

export function exportNameHint(obj: any, nameHint: string): void {
  if ((typeof obj === "object" && obj != null) || typeof obj === "function") {
    if (!("$exporter$name" in obj)) {
      Object.defineProperty(obj, "$exporter$name", {
        writable: true,
        value: nameHint,
      });
    } else if (!obj.$exporter$name) {
      obj.$exporter$name = nameHint;
    }
  }
}

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
  name?: string,
): Omit<GraphQLScalarTypeConfig<any, any>, "name"> => ({
  description,
  serialize: toString,
  parseValue: coerce
    ? EXPORTABLE((coerce) => (value) => coerce("" + value), [coerce])
    : toString,
  parseLiteral: coerce
    ? EXPORTABLE(
        (GraphQLError, Kind, coerce, name) => (ast) => {
          if (ast.kind !== Kind.STRING) {
            // ERRORS: add name to this error
            throw new GraphQLError(
              `${name ?? "This scalar"} can only parse string values (kind = '${
                ast.kind
              }')`,
            );
          }
          return coerce(ast.value);
        },
        [GraphQLError, Kind, coerce, name],
      )
    : EXPORTABLE(
        (GraphQLError, Kind, name) => (ast) => {
          if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(
              `${name ?? "This scalar"} can only parse string values (kind='${
                ast.kind
              }')`,
            );
          }
          return ast.value;
        },
        [GraphQLError, Kind, name],
      ),
  extensions: {
    grafast: {
      idempotent: !coerce || (coerce as any)[$$idempotent] ? true : false,
    },
  },
});

/**
 * This is a TypeScript constrained identity function to save having to specify
 * all the generics manually.
 */
export function gatherConfig<
  const TNamespace extends keyof GraphileConfig.GatherHelpers,
  const TState extends { [key: string]: any } = { [key: string]: any },
  const TCache extends { [key: string]: any } = { [key: string]: any },
>(
  config: GraphileConfig.PluginGatherConfig<TNamespace, TState, TCache>,
): GraphileConfig.PluginGatherConfig<TNamespace, TState, TCache> {
  return config;
}
