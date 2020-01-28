import upperFirstAll = require("lodash/upperFirst");
import camelCaseAll = require("lodash/camelCase");
import plz = require("pluralize");

const bindAll = (obj: {}, keys: Array<string>) => {
  keys.forEach(key => {
    obj[key] = obj[key].bind(obj);
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

export const pluralize = (str: string) => plz(str);
export const singularize = (str: string) => plz.singular(str);
