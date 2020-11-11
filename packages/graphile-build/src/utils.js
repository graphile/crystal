// @flow
import upperFirstAll from "lodash/upperFirst";
import camelCaseAll from "lodash/camelCase";
import plz from "pluralize";

const bindAll = (obj: {}, keys: Array<string>): string => {
  keys.forEach(key => {
    obj[key] = obj[key].bind(obj);
  });
  return obj;
};

export { bindAll };

export const constantCaseAll = (str: string): string =>
  str
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/[A-Z]+/g, "_$&")
    .replace(/__+/g, "_")
    .replace(/^[^a-zA-Z0-9]+/, "")
    .replace(/^[0-9]/, "_$&") // GraphQL enums must not start with a number
    .toUpperCase();

export const formatInsideUnderscores = (fn: (input: string) => string) => (
  str: string
): string => {
  const matches = str.match(/^(_*)([\s\S]*?)(_*)$/);
  if (!matches) {
    throw new Error("Impossible?"); // Satiate Flow
  }
  const [, start, middle, end] = matches;
  return `${start}${fn(middle)}${end}`;
};

export const upperFirst = formatInsideUnderscores(upperFirstAll);
export const camelCase = formatInsideUnderscores(camelCaseAll);
export const constantCase = formatInsideUnderscores(constantCaseAll);
export const upperCamelCase = (str: string): string =>
  upperFirst(camelCase(str));

export const pluralize = (str: string): string => plz(str);
export const singularize = (str: string): string => plz.singular(str);

// Copied from GraphQL v14, MIT license (c) GraphQL Contributors.
function breakLine(line: string, maxLen: number): Array<string> {
  const parts = line.split(new RegExp(`((?: |^).{15,${maxLen - 40}}(?= |$))`));
  if (parts.length < 4) {
    return [line];
  }
  const sublines = [parts[0] + parts[1] + parts[2]];
  for (let i = 3; i < parts.length; i += 2) {
    sublines.push(parts[i].slice(1) + parts[i + 1]);
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
  position: "root" | "type" | "field" | "arg"
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
    .map(line => {
      if (line.length < maxLen + 5) {
        return line;
      }
      // For > 120 character long lines, cut at space boundaries into sublines
      // of ~80 chars.
      return breakLine(line, maxLen).join("\n");
    })
    .join("\n");
};
