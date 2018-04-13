// @flow
import sql from "pg-sql2";
import type { Plugin } from "graphile-build";
import { version } from "../../package.json";
import type {
  PgProc,
  PgType,
  PgClass,
  PgAttribute,
  PgConstraint,
} from "./PgIntrospectionPlugin";

const defaultPgColumnFilter = (_attr, _build, _context) => true;
type Keys = Array<{
  column: string,
  table: string,
  schema: ?string,
}>;

export function preventEmptyResult<
  // eslint-disable-next-line flowtype/no-weak-types
  O: { [key: string]: (...args: Array<any>) => string }
>(obj: O): $ObjMap<O, <V>(V) => V> {
  return Object.keys(obj).reduce((memo, key) => {
    const fn = obj[key];
    memo[key] = function(...args) {
      const result = fn.apply(this, args);
      if (typeof result !== "string" || result.length === 0) {
        const stringifiedArgs = require("util").inspect(args);
        throw new Error(
          `Inflector for '${key}' returned '${String(
            result
          )}'; expected non-empty string\n` +
            `See: https://github.com/graphile/graphile-build/blob/master/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js\n` +
            `Arguments passed to ${key}:\n${stringifiedArgs}`
        );
      }
      return result;
    };
    return memo;
  }, {});
}

export default (function PgBasicsPlugin(
  builder,
  { pgStrictFunctions = false, pgColumnFilter = defaultPgColumnFilter }
) {
  builder.hook("build", build => {
    return build.extend(build, {
      graphileBuildPgVersion: version,
      pgSql: sql,
      pgStrictFunctions,
      pgColumnFilter,
    });
  });

  builder.hook("inflection", (inflection, build) => {
    return build.extend(
      inflection,
      preventEmptyResult({
        // These helpers are passed GraphQL type names as strings
        conditionType(typeName: string) {
          return this.upperCamelCase(`${typeName}-condition`);
        },
        inputType(typeName: string) {
          return this.upperCamelCase(`${typeName}-input`);
        },
        rangeBoundType(typeName: string) {
          return this.upperCamelCase(`${typeName}-range-bound`);
        },
        rangeType(typeName: string) {
          return this.upperCamelCase(`${typeName}-range`);
        },
        patchType(typeName: string) {
          return this.upperCamelCase(`${typeName}-patch`);
        },
        patchField(itemName: string) {
          return this.camelCase(`${itemName}-patch`);
        },
        orderByType(typeName: string) {
          return this.upperCamelCase(`${this.pluralize(typeName)}-order-by`);
        },
        edge(typeName: string) {
          return this.upperCamelCase(`${this.pluralize(typeName)}-edge`);
        },
        connection(typeName: string) {
          return this.upperCamelCase(`${this.pluralize(typeName)}-connection`);
        },

        // These helpers handle overrides via smart comments. They should only
        // be used in other inflectors, hence the underscore prefix.
        //
        // IMPORTANT: do NOT do case transforms here, because detail can be
        // lost, e.g.
        // `constantCase(camelCase('foo_1')) !== constantCase('foo_1')`
        _functionName(proc: PgProc) {
          return proc.tags.name || proc.name;
        },
        _typeName(type: PgType) {
          // 'type' introspection result
          return type.tags.name || type.name;
        },
        _tableName(table: PgClass) {
          return table.tags.name || table.type.tags.name || table.name;
        },
        _singularizedTableName(table: PgClass): string {
          return this.singularize(this._tableName(table)).replace(
            /.(?:(?:[_-]i|I)nput|(?:[_-]p|P)atch)$/,
            "$&_record"
          );
        },
        _columnName(attr: PgAttribute, _options?: { skipRowId?: boolean }) {
          return attr.tags.name || attr.name;
        },

        // From here down, functions are passed database introspection results
        enumType(type: PgType) {
          return this.upperCamelCase(this._typeName(type));
        },
        argument(name: ?string, index: number) {
          return this.camelCase(name || `arg${index}`);
        },
        orderByColumnEnum(attr: PgAttribute, ascending: boolean) {
          const columnName = this._columnName(attr, {
            skipRowId: true, // Because we messed up 😔
          });
          return this.constantCase(
            `${columnName}_${ascending ? "asc" : "desc"}`
          );
        },
        domainType(type: PgType) {
          return this.upperCamelCase(this._typeName(type));
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

        tableNode(table: PgClass) {
          return this.camelCase(this._singularizedTableName(table));
        },
        tableFieldName(table: PgClass) {
          return this.camelCase(this._singularizedTableName(table));
        },
        allRows(table: PgClass) {
          return this.camelCase(
            `all-${this.pluralize(this._singularizedTableName(table))}`
          );
        },
        functionMutationName(proc: PgProc) {
          return this.camelCase(this._functionName(proc));
        },
        functionQueryName(proc: PgProc) {
          return this.camelCase(this._functionName(proc));
        },
        functionPayloadType(proc: PgProc) {
          return this.upperCamelCase(`${this._functionName(proc)}-payload`);
        },
        functionInputType(proc: PgProc) {
          return this.upperCamelCase(`${this._functionName(proc)}-input`);
        },
        tableType(table: PgClass) {
          return this.upperCamelCase(this._singularizedTableName(table));
        },
        column(attr: PgAttribute) {
          return this.camelCase(this._columnName(attr));
        },
        computedColumn(
          pseudoColumnName: string,
          proc: PgProc,
          _table: PgClass
        ) {
          return proc.tags.fieldName || this.camelCase(pseudoColumnName);
        },
        singleRelationByKeys(
          detailedKeys: Keys,
          table: PgClass,
          _foreignTable: PgClass,
          constraint: PgConstraint
        ) {
          if (constraint.tags.fieldName) {
            return constraint.tags.fieldName;
          }
          return this.camelCase(
            `${this._singularizedTableName(table)}-by-${detailedKeys
              .map(key => this.column(key))
              .join("-and-")}`
          );
        },
        manyRelationByKeys(
          detailedKeys: Keys,
          table: PgClass,
          _foreignTable: PgClass,
          constraint: PgConstraint
        ) {
          if (constraint.tags.foreignFieldName) {
            return constraint.tags.foreignFieldName;
          }
          return this.camelCase(
            `${this.pluralize(
              this._singularizedTableName(table)
            )}-by-${detailedKeys.map(key => this.column(key)).join("-and-")}`
          );
        },
        rowByUniqueKeys(
          detailedKeys: Keys,
          table: PgClass,
          constraint: PgConstraint
        ) {
          if (constraint.tags.fieldName) {
            return constraint.tags.fieldName;
          }
          return this.camelCase(
            `${this._singularizedTableName(table)}-by-${detailedKeys
              .map(key => this.column(key))
              .join("-and-")}`
          );
        },
        updateByKeys(
          detailedKeys: Keys,
          table: PgClass,
          constraint: PgConstraint
        ) {
          if (constraint.tags.updateFieldName) {
            return constraint.tags.updateFieldName;
          }
          return this.camelCase(
            `update-${this._singularizedTableName(table)}-by-${detailedKeys
              .map(key => this.column(key))
              .join("-and-")}`
          );
        },
        deleteByKeys(
          detailedKeys: Keys,
          table: PgClass,
          constraint: PgConstraint
        ) {
          if (constraint.tags.deleteFieldName) {
            return constraint.tags.deleteFieldName;
          }
          return this.camelCase(
            `delete-${this._singularizedTableName(table)}-by-${detailedKeys
              .map(key => this.column(key))
              .join("-and-")}`
          );
        },
        updateByKeysInputType(
          detailedKeys: Keys,
          table: PgClass,
          constraint: PgConstraint
        ) {
          if (constraint.tags.updateFieldName) {
            return this.upperCamelCase(
              `${constraint.tags.updateFieldName}-input`
            );
          }
          return this.upperCamelCase(
            `update-${this._singularizedTableName(table)}-by-${detailedKeys
              .map(key => this.column(key))
              .join("-and-")}-input`
          );
        },
        deleteByKeysInputType(
          detailedKeys: Keys,
          table: PgClass,
          constraint: PgConstraint
        ) {
          if (constraint.tags.deleteFieldName) {
            return this.upperCamelCase(
              `${constraint.tags.deleteFieldName}-input`
            );
          }
          return this.upperCamelCase(
            `delete-${this._singularizedTableName(table)}-by-${detailedKeys
              .map(key => this.column(key))
              .join("-and-")}-input`
          );
        },
        updateNode(table: PgClass) {
          return this.camelCase(`update-${this._singularizedTableName(table)}`);
        },
        deleteNode(table: PgClass) {
          return this.camelCase(`delete-${this._singularizedTableName(table)}`);
        },
        updateNodeInputType(table: PgClass) {
          return this.upperCamelCase(
            `update-${this._singularizedTableName(table)}-input`
          );
        },
        deleteNodeInputType(table: PgClass) {
          return this.upperCamelCase(
            `delete-${this._singularizedTableName(table)}-input`
          );
        },
        edgeField(table: PgClass) {
          return this.camelCase(`${this._singularizedTableName(table)}-edge`);
        },
        scalarFunctionConnection(proc: PgProc) {
          return this.upperCamelCase(`${this._functionName(proc)}-connection`);
        },
        scalarFunctionEdge(proc: PgProc) {
          return this.upperCamelCase(
            `${this.singularize(this._functionName(proc))}-edge`
          );
        },
        createField(table: PgClass) {
          return this.camelCase(`create-${this._singularizedTableName(table)}`);
        },
        createInputType(table: PgClass) {
          return this.upperCamelCase(
            `create-${this._singularizedTableName(table)}-input`
          );
        },
        createPayloadType(table: PgClass) {
          return this.upperCamelCase(
            `create-${this._singularizedTableName(table)}-payload`
          );
        },
        updatePayloadType(table: PgClass) {
          return this.upperCamelCase(
            `update-${this._singularizedTableName(table)}-payload`
          );
        },
        deletePayloadType(table: PgClass) {
          return this.upperCamelCase(
            `delete-${this._singularizedTableName(table)}-payload`
          );
        },
      })
    );
  });
}: Plugin);
