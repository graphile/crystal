// @flow
import upperFirstAll from "lodash/upperFirst";
import camelCaseAll from "lodash/camelCase";

export const constantCaseAll = (str: string) =>
  str
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/[A-Z]+/g, "_$&")
    .replace(/__+/g, "_")
    .replace(/^[^a-zA-Z0-9]+/, "")
    .replace(/^[0-9]/, "_$&") // GraphQL enums must not start with a number
    .toUpperCase();

export const formatInsideUnderscores = (fn: (input: string) => string) => (
  str: string
) => {
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

export const parseTags = (str: string) => {
  return str.split(`\n`).reduce(
    (prev, curr) => {
      if (prev.text !== "") {
        return Object.assign({}, prev, {
          text: `${prev.text}\n${curr}`,
        });
      }
      const match = curr.match(/^@[a-zA-Z][a-zA-Z0-9_]*($|\s)/);
      if (!match) {
        return Object.assign({}, prev, {
          text: curr,
        });
      }
      const key = match[0].substr(1).trim();
      const value = match[0] === curr ? true : curr.replace(match[0], "");
      return Object.assign({}, prev, {
        tags: Object.assign({}, prev.tags, {
          [key]: !prev.tags.hasOwnProperty(key)
            ? value
            : Array.isArray(prev.tags[key])
              ? [...prev.tags[key], value]
              : [prev.tags[key], value],
        }),
      });
    },
    {
      tags: {},
      text: "",
    }
  );
};
