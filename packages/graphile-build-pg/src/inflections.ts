/* THIS ENTIRE FILE IS DEPRECATED. DO NOT USE THIS. DO NOT EDIT THIS. */

import {
  upperCamelCase,
  camelCase,
  constantCase,
  pluralize,
  singularize,
} from "graphile-build";

import { preventEmptyResult } from "./plugins/PgBasicsPlugin";

const outputMessages: string[] = [];

function deprecate(fn: (...input: Array<any>) => string, message: string) {
  if (typeof fn !== "function") {
    return fn;
  }
  return function(...args: any[]) {
    if (outputMessages.indexOf(message) === -1) {
      outputMessages.push(message);
      // eslint-disable-next-line no-console
      console.warn(new Error(message));
    }
    return fn.apply(this, args);
  };
}

function deprecateEverything(obj: {
  [a: string]: (...input: Array<any>) => string;
}) {
  return Object.keys(obj).reduce((memo, key) => {
    memo[key] = deprecate(
      obj[key],
      `Something (probably a plugin) called the old inflection system (inflector: '${key}'). This system has been deprecated since 4.0.0-beta.6 (4th May 2018) and is not used internally so using it may cause inconsistencies, instead please use the plugin-capable inflection system https://www.graphile.org/postgraphile/inflection/`
    );

    return memo;
  }, {});
}

type Keys = Array<{
  column: string;
  table: string;
  schema: string | null | undefined;
}>;

type InflectorUtils = {
  constantCase: (a: string) => string;
  camelCase: (a: string) => string;
  upperCamelCase: (a: string) => string;
  pluralize: (a: string) => string;
  singularize: (a: string) => string;
};

export const defaultUtils: InflectorUtils = {
  constantCase,
  camelCase,
  upperCamelCase,
  pluralize,
  singularize,
};

export type Inflector = {
  // TODO: tighten this up!
  [a: string]: (...input: Array<any>) => string;
};

export const newInflector = (
  overrides: { [a: string]: () => string } | null | undefined = undefined,
  {
    constantCase,
    camelCase,
    upperCamelCase,
    pluralize,
    singularize,
  }: InflectorUtils = defaultUtils
): Inflector => {
  function singularizeTable(tableName: string): string {
    return singularize(tableName).replace(
      /.(?:(?:[_-]i|I)nput|(?:[_-]p|P)atch)$/,
      "$&_record"
    );
  }

  return deprecateEverything(
    preventEmptyResult({
      pluralize,
      argument(name: string | null | undefined, index: number) {
        return camelCase(name || `arg${index}`);
      },
      orderByType(typeName: string) {
        return upperCamelCase(`${pluralize(typeName)}-order-by`);
      },
      orderByEnum(
        name: string,
        ascending: boolean,
        _table: string,
        _schema: string | null | undefined
      ) {
        return constantCase(`${name}_${ascending ? "asc" : "desc"}`);
      },
      domainType(name: string) {
        return upperCamelCase(name);
      },
      enumName(inValue: string) {
        let value = inValue;

        if (value === "") {
          return "_EMPTY_";
        }

        // Some enums use asterisks to signify wildcards - this might be for
        // the whole item, or prefixes/suffixes, or even in the middle.  This
        // is provided on a best efforts basis, if it doesn't suit your
        // purposes then please pass a custom inflector as mentioned below.
        value = value
          .replace(/\*/g, "_ASTERISK_")
          .replace(/^(_?)_+ASTERISK/, "$1ASTERISK")
          .replace(/ASTERISK_(_?)_*$/, "ASTERISK$1");

        // This is a best efforts replacement for common symbols that you
        // might find in enums. Generally we only support enums that are
        // alphanumeric, if these replacements don't work for you, you should
        // pass a custom inflector that replaces this `enumName` method
        // with one of your own chosing.
        value =
          {
            // SQL comparison operators
            ">": "GREATER_THAN",
            ">=": "GREATER_THAN_OR_EQUAL",
            "=": "EQUAL",
            "!=": "NOT_EQUAL",
            "<>": "DIFFERENT",
            "<=": "LESS_THAN_OR_EQUAL",
            "<": "LESS_THAN",

            // PostgreSQL LIKE shortcuts
            "~~": "LIKE",
            "~~*": "ILIKE",
            "!~~": "NOT_LIKE",
            "!~~*": "NOT_ILIKE",

            // '~' doesn't necessarily represent regexps, but the three
            // operators following it likely do, so we'll use the word TILDE
            // in all for consistency.
            "~": "TILDE",
            "~*": "TILDE_ASTERISK",
            "!~": "NOT_TILDE",
            "!~*": "NOT_TILDE_ASTERISK",

            // A number of other symbols where we're not sure of their
            // meaning.  We give them common generic names so that they're
            // suitable for multiple purposes, e.g. favouring 'PLUS' over
            // 'ADDITION' and 'DOT' over 'FULL_STOP'
            "%": "PERCENT",
            "+": "PLUS",
            "-": "MINUS",
            "/": "SLASH",
            "\\": "BACKSLASH",
            _: "UNDERSCORE",
            "#": "POUND",
            "£": "STERLING",
            $: "DOLLAR",
            "&": "AMPERSAND",
            "@": "AT",
            "'": "APOSTROPHE",
            '"': "QUOTE",
            "`": "BACKTICK",
            ":": "COLON",
            ";": "SEMICOLON",
            "!": "EXCLAMATION_POINT",
            "?": "QUESTION_MARK",
            ",": "COMMA",
            ".": "DOT",
            "^": "CARET",
            "|": "BAR",
            "[": "OPEN_BRACKET",
            "]": "CLOSE_BRACKET",
            "(": "OPEN_PARENTHESIS",
            ")": "CLOSE_PARENTHESIS",
            "{": "OPEN_BRACE",
            "}": "CLOSE_BRACE",
          }[value] || value;
        return value;
      },
      enumType(name: string) {
        return upperCamelCase(name);
      },
      conditionType(typeName: string) {
        return upperCamelCase(`${typeName}-condition`);
      },
      inputType(typeName: string) {
        return upperCamelCase(`${typeName}-input`);
      },
      rangeBoundType(typeName: string) {
        return upperCamelCase(`${typeName}-range-bound`);
      },
      rangeType(typeName: string) {
        return upperCamelCase(`${typeName}-range`);
      },
      patchType(typeName: string) {
        return upperCamelCase(`${typeName}-patch`);
      },
      patchField(itemName: string) {
        return camelCase(`${itemName}-patch`);
      },
      tableName(name: string, _schema: string | null | undefined) {
        return camelCase(singularizeTable(name));
      },
      tableNode(name: string, _schema: string | null | undefined) {
        return camelCase(singularizeTable(name));
      },
      allRows(name: string, schema: string | null | undefined) {
        return camelCase(`all-${this.pluralize(this.tableName(name, schema))}`);
      },
      functionName(name: string, _schema: string | null | undefined) {
        return camelCase(name);
      },
      functionPayloadType(name: string, _schema: string | null | undefined) {
        return upperCamelCase(`${name}-payload`);
      },
      functionInputType(name: string, _schema: string | null | undefined) {
        return upperCamelCase(`${name}-input`);
      },
      tableType(name: string, schema: string | null | undefined) {
        return upperCamelCase(this.tableName(name, schema));
      },
      column(name: string, _table: string, _schema: string | null | undefined) {
        return camelCase(name);
      },
      singleRelationByKeys(
        detailedKeys: Keys,
        table: string,
        schema: string | null | undefined
      ) {
        return camelCase(
          `${this.tableName(table, schema)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      rowByUniqueKeys(
        detailedKeys: Keys,
        table: string,
        schema: string | null | undefined
      ) {
        return camelCase(
          `${this.tableName(table, schema)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      updateByKeys(
        detailedKeys: Keys,
        table: string,
        schema: string | null | undefined
      ) {
        return camelCase(
          `update-${this.tableName(table, schema)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      deleteByKeys(
        detailedKeys: Keys,
        table: string,
        schema: string | null | undefined
      ) {
        return camelCase(
          `delete-${this.tableName(table, schema)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      updateNode(name: string, _schema: string | null | undefined) {
        return camelCase(`update-${singularizeTable(name)}`);
      },
      deleteNode(name: string, _schema: string | null | undefined) {
        return camelCase(`delete-${singularizeTable(name)}`);
      },
      updateByKeysInputType(
        detailedKeys: Keys,
        name: string,
        _schema: string | null | undefined
      ) {
        return upperCamelCase(
          `update-${singularizeTable(name)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}-input`
        );
      },
      deleteByKeysInputType(
        detailedKeys: Keys,
        name: string,
        _schema: string | null | undefined
      ) {
        return upperCamelCase(
          `delete-${singularizeTable(name)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}-input`
        );
      },
      updateNodeInputType(name: string, _schema: string | null | undefined) {
        return upperCamelCase(`update-${singularizeTable(name)}-input`);
      },
      deleteNodeInputType(name: string, _schema: string | null | undefined) {
        return upperCamelCase(`delete-${singularizeTable(name)}-input`);
      },
      manyRelationByKeys(
        detailedKeys: Keys,
        table: string,
        schema: string | null | undefined,
        _foreignTable: string,
        _foreignSchema: string | null | undefined
      ) {
        return camelCase(
          `${this.pluralize(
            this.tableName(table, schema)
          )}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      edge(typeName: string) {
        return upperCamelCase(`${pluralize(typeName)}-edge`);
      },
      edgeField(name: string, _schema: string | null | undefined) {
        return camelCase(`${singularizeTable(name)}-edge`);
      },
      connection(typeName: string) {
        return upperCamelCase(`${this.pluralize(typeName)}-connection`);
      },
      scalarFunctionConnection(
        procName: string,
        _procSchema: string | null | undefined
      ) {
        return upperCamelCase(`${procName}-connection`);
      },
      scalarFunctionEdge(
        procName: string,
        _procSchema: string | null | undefined
      ) {
        return upperCamelCase(`${procName}-edge`);
      },
      createField(name: string, _schema: string | null | undefined) {
        return camelCase(`create-${singularizeTable(name)}`);
      },
      createInputType(name: string, _schema: string | null | undefined) {
        return upperCamelCase(`create-${singularizeTable(name)}-input`);
      },
      createPayloadType(name: string, _schema: string | null | undefined) {
        return upperCamelCase(`create-${singularizeTable(name)}-payload`);
      },
      updatePayloadType(name: string, _schema: string | null | undefined) {
        return upperCamelCase(`update-${singularizeTable(name)}-payload`);
      },
      deletePayloadType(name: string, _schema: string | null | undefined) {
        return upperCamelCase(`delete-${singularizeTable(name)}-payload`);
      },
      ...overrides,
    })
  );
};

export const defaultInflection = newInflector();
