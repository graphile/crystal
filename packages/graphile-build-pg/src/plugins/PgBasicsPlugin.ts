import * as sql from "pg-sql2";
import { inspect } from "util";
import { Plugin, Context, Build, Inflection } from "graphile-build";
// @ts-ignore
import { version } from "../../package.json";
import {
  PgProc,
  PgType,
  PgClass,
  PgAttribute,
  PgConstraint,
  PgEntity,
  SmartTagValue,
} from "./PgIntrospectionPlugin";
import pgField from "./pgField";

import queryFromResolveDataFactory from "../queryFromResolveDataFactory";
import addStartEndCursor from "./addStartEndCursor";
import baseOmit, {
  CREATE,
  READ,
  UPDATE,
  DELETE,
  ALL,
  MANY,
  ORDER,
  FILTER,
  EXECUTE,
} from "../omit";
import makeProcField from "./makeProcField";
import parseIdentifier from "../parseIdentifier";
import viaTemporaryTable from "./viaTemporaryTable";
import chalk from "chalk";
import pickBy = require("lodash/pickBy");
import PgLiveProvider from "../PgLiveProvider";
import pgPrepareAndRun from "../pgPrepareAndRun";
import { PoolClient } from "pg";

export type PgTypeModifier = string | number | null;

/**
 * Given a PgEntity and a tag name, fetches the tag with that name. If it
 * exists, asserts that it is a string (and not a boolean, or array). If it
 * doesn't exist, returns null.
 */
export function stringTag(pgEntity: PgEntity, tagName: string): string | null {
  const tagVal: SmartTagValue | null = pgEntity.tags[tagName] || null;
  if (typeof tagVal === "string") {
    return tagVal;
  } else if (!tagVal) {
    return null;
  } else {
    throw new Error(
      `Expected smart tag '${tagName}' on '${describePgEntity(
        pgEntity
      )}' to be a string, but instead received '${inspect(tagVal)}'`
    );
  }
}

type PgColumnFilterFunction = (
  attr: PgAttribute,
  build: Build,
  context: Context
) => boolean;

type PgConfig = import("pg").Pool | import("pg").PoolClient | string;

declare module "graphile-build" {
  interface GraphileResolverContext {
    pgClient: PoolClient;
  }

  interface GraphileBuildOptions {
    pgConfig: PgConfig;
    pgSchemas: Array<string>;
    persistentMemoizeWithKey?: <T>(key: string, fn: () => T) => T;

    pgDisableDefaultMutations?: boolean;
    pgSimpleCollections?: "only" | "both" | "omit";
    pgStrictFunctions?: boolean;
    pgColumnFilter?: PgColumnFilterFunction;
    pgIgnoreRBAC?: boolean;
    pgIgnoreIndexes?: boolean;
    pgHideIndexWarnings?: boolean;
    pgLegacyJsonUuid?: boolean;
  }

  interface Build {
    pgSql: typeof import("pg-sql2");
    graphileBuildPgVersion: string;
    pgStrictFunctions: boolean;
    pgColumnFilter: PgColumnFilterFunction;
    pgQueryFromResolveData: ReturnType<typeof queryFromResolveDataFactory>;
    pgAddStartEndCursor: typeof addStartEndCursor;
    pgOmit: typeof baseOmit;
    pgMakeProcField: typeof makeProcField;
    pgParseIdentifier: typeof parseIdentifier;
    pgViaTemporaryTable: typeof viaTemporaryTable;
    describePgEntity: typeof describePgEntity;
    pgField: typeof pgField;
    sqlCommentByAddingTags: typeof sqlCommentByAddingTags;
    pgPrepareAndRun: typeof pgPrepareAndRun;
  }

  interface Inflection {
    conditionType(typeName: string): string;
    inputType(typeName: string): string;
    rangeBoundType(typeName: string): string;
    rangeType(typeName: string): string;
    patchType(typeName: string): string;
    baseInputType(typeName: string): string;
    patchField(itemName: string): string;
    orderByType(typeName: string): string;
    edge(typeName: string): string;
    connection(typeName: string): string;

    // These helpers handle overrides via smart comments. They should only
    // be used in other inflectors, hence the underscore prefix.
    //
    // IMPORTANT: do NOT do case transforms here, because detail can be
    // lost, e.g.
    // `constantCase(camelCase('foo_1')) !== constantCase('foo_1')`
    _functionName(proc: PgProc): string;
    _typeName(type: PgType): string;
    _tableName(table: PgClass): string;
    _singularizedTableName(table: PgClass): string;
    _columnName(attr: PgAttribute, _options?: { skipRowId?: boolean }): string;

    // From here down, functions are passed database introspection results
    enumType(type: PgType): string;
    argument(name: string | null | undefined, index: number): string;
    orderByEnum(columnName, ascending): string;
    orderByColumnEnum(attr: PgAttribute, ascending: boolean): string;
    orderByComputedColumnEnum(
      pseudoColumnName: string,
      proc: PgProc,
      table: PgClass,
      ascending: boolean
    ): string;
    domainType(type: PgType): string;
    enumName(inValue: string): string;

    tableNode(table: PgClass): string;
    tableFieldName(table: PgClass): string;
    allRows(table: PgClass): string;
    allRowsSimple(table: PgClass): string;
    functionMutationName(proc: PgProc): string;
    functionMutationResultFieldName(
      proc: PgProc,
      gqlType,
      plural?: boolean,
      outputArgNames?: Array<string>
    ): string;
    functionQueryName(proc: PgProc): string;
    functionQueryNameList(proc: PgProc): string;
    functionPayloadType(proc: PgProc): string;
    functionInputType(proc: PgProc): string;
    functionOutputFieldName(
      proc: PgProc,
      outputArgName: string,
      index: number
    ): string;
    tableType(table: PgClass): string;
    column(attr: PgAttribute): string;
    computedColumn(
      pseudoColumnName: string,
      proc: PgProc,
      _table: PgClass
    ): string;
    computedColumnList(
      pseudoColumnName: string,
      proc: PgProc,
      _table: PgClass
    ): string;
    singleRelationByKeys(
      detailedKeys: PgAttribute[],
      table: PgClass,
      _foreignTable: PgClass,
      constraint: PgConstraint
    ): string;
    singleRelationByKeysBackwards(
      detailedKeys: PgAttribute[],
      table: PgClass,
      _foreignTable: PgClass,
      constraint: PgConstraint
    ): string;
    manyRelationByKeys(
      detailedKeys: PgAttribute[],
      table: PgClass,
      _foreignTable: PgClass,
      constraint: PgConstraint
    ): string;
    manyRelationByKeysSimple(
      detailedKeys: PgAttribute[],
      table: PgClass,
      _foreignTable: PgClass,
      constraint: PgConstraint
    ): string;
    rowByUniqueKeys(
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ): string;
    updateByKeys(
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ): string;
    deleteByKeys(
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ): string;
    updateByKeysInputType(
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ): string;
    deleteByKeysInputType(
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ): string;
    updateNode(table: PgClass): string;
    deleteNode(table: PgClass): string;
    deletedNodeId(table: PgClass): string;
    updateNodeInputType(table: PgClass): string;
    deleteNodeInputType(table: PgClass): string;
    edgeField(table: PgClass): string;
    recordFunctionReturnType(proc: PgProc): string;
    recordFunctionConnection(proc: PgProc): string;
    recordFunctionEdge(proc: PgProc): string;
    scalarFunctionConnection(proc: PgProc): string;
    scalarFunctionEdge(proc: PgProc): string;
    createField(table: PgClass): string;
    createInputType(table: PgClass): string;
    createPayloadType(table: PgClass): string;
    updatePayloadType(table: PgClass): string;
    deletePayloadType(table: PgClass): string;
  }
}

function makePgBaseInflectors(): Partial<Inflection> {
  const inflectors: Partial<Inflection> = {
    // These helpers are passed GraphQL type names as strings
    conditionType(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${typeName}-condition`);
    },
    inputType(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${typeName}-input`);
    },
    rangeBoundType(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${typeName}-range-bound`);
    },
    rangeType(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${typeName}-range`);
    },
    patchType(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${typeName}-patch`);
    },
    baseInputType(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${typeName}-base-input`);
    },
    patchField(this: Inflection, itemName: string) {
      return this.camelCase(`${itemName}-patch`);
    },
    orderByType(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${this.pluralize(typeName)}-order-by`);
    },
    edge(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${this.pluralize(typeName)}-edge`);
    },
    connection(this: Inflection, typeName: string) {
      return this.upperCamelCase(`${this.pluralize(typeName)}-connection`);
    },

    // These helpers handle overrides via smart comments. They should only
    // be used in other inflectors, hence the underscore prefix.
    //
    // IMPORTANT: do NOT do case transforms here, because detail can be
    // lost, e.g.
    // `constantCase(camelCase('foo_1')) !== constantCase('foo_1')`
    _functionName(this: Inflection, proc: PgProc) {
      return this.coerceToGraphQLName(stringTag(proc, "name") || proc.name);
    },
    _typeName(this: Inflection, type: PgType) {
      // 'type' introspection result
      return this.coerceToGraphQLName(stringTag(type, "name") || type.name);
    },
    _tableName(this: Inflection, table: PgClass) {
      return this.coerceToGraphQLName(
        stringTag(table, "name") || stringTag(table.type, "name") || table.name
      );
    },
    _singularizedTableName(this: Inflection, table: PgClass): string {
      return this.singularize(this._tableName(table)).replace(
        /.(?:(?:[_-]i|I)nput|(?:[_-]p|P)atch)$/,
        "$&_record"
      );
    },
    _columnName(
      this: Inflection,
      attr: PgAttribute,
      _options?: { skipRowId?: boolean }
    ) {
      return this.coerceToGraphQLName(stringTag(attr, "name") || attr.name);
    },

    // From here down, functions are passed database introspection results
    enumType(this: Inflection, type: PgType) {
      return this.upperCamelCase(this._typeName(type));
    },
    argument(this: Inflection, name: string | null | undefined, index: number) {
      return this.coerceToGraphQLName(this.camelCase(name || `arg${index}`));
    },
    orderByEnum(this: Inflection, columnName, ascending) {
      return this.constantCase(`${columnName}_${ascending ? "asc" : "desc"}`);
    },
    orderByColumnEnum(this: Inflection, attr: PgAttribute, ascending: boolean) {
      const columnName = this._columnName(attr, {
        skipRowId: true, // Because we messed up 😔
      });
      return this.orderByEnum(columnName, ascending);
    },
    orderByComputedColumnEnum(
      this: Inflection,
      pseudoColumnName: string,
      proc: PgProc,
      table: PgClass,
      ascending: boolean
    ) {
      const columnName = this.computedColumn(pseudoColumnName, proc, table);

      return this.orderByEnum(columnName, ascending);
    },
    domainType(this: Inflection, type: PgType) {
      return this.upperCamelCase(this._typeName(type));
    },
    enumName(this: Inflection, inValue: string) {
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

    tableNode(this: Inflection, table: PgClass) {
      return this.camelCase(this._singularizedTableName(table));
    },
    tableFieldName(this: Inflection, table: PgClass) {
      return this.camelCase(this._singularizedTableName(table));
    },
    allRows(this: Inflection, table: PgClass) {
      return this.camelCase(
        `all-${this.pluralize(this._singularizedTableName(table))}`
      );
    },
    allRowsSimple(this: Inflection, table: PgClass) {
      return this.camelCase(
        `all-${this.pluralize(this._singularizedTableName(table))}-list`
      );
    },
    functionMutationName(this: Inflection, proc: PgProc) {
      return this.camelCase(this._functionName(proc));
    },
    functionMutationResultFieldName(
      this: Inflection,
      proc: PgProc,
      gqlType,
      plural: boolean = false,
      outputArgNames: Array<string> = []
    ) {
      if (stringTag(proc, "resultFieldName")) {
        return stringTag(proc, "resultFieldName");
      }
      let name;
      if (outputArgNames.length === 1 && outputArgNames[0] !== "") {
        name = this.camelCase(outputArgNames[0]);
      } else if (gqlType.name === "Int") {
        name = "integer";
      } else if (gqlType.name === "Float") {
        name = "float";
      } else if (gqlType.name === "Boolean") {
        name = "boolean";
      } else if (gqlType.name === "String") {
        name = "string";
      } else if (proc.returnTypeId === "2249") {
        // returns a record type
        name = "result";
      } else {
        name = this.camelCase(gqlType.name);
      }
      return plural ? this.pluralize(name) : name;
    },
    functionQueryName(this: Inflection, proc: PgProc) {
      return this.camelCase(this._functionName(proc));
    },
    functionQueryNameList(this: Inflection, proc: PgProc) {
      return this.camelCase(`${this._functionName(proc)}-list`);
    },
    functionPayloadType(this: Inflection, proc: PgProc) {
      return this.upperCamelCase(`${this._functionName(proc)}-payload`);
    },
    functionInputType(this: Inflection, proc: PgProc) {
      return this.upperCamelCase(`${this._functionName(proc)}-input`);
    },
    functionOutputFieldName(
      this: Inflection,
      proc: PgProc,
      outputArgName: string,
      index: number
    ) {
      return this.argument(outputArgName, index);
    },
    tableType(this: Inflection, table: PgClass) {
      return this.upperCamelCase(this._singularizedTableName(table));
    },
    column(this: Inflection, attr: PgAttribute) {
      return this.camelCase(this._columnName(attr));
    },
    computedColumn(
      this: Inflection,
      pseudoColumnName: string,
      proc: PgProc,
      _table: PgClass
    ) {
      return stringTag(proc, "fieldName") || this.camelCase(pseudoColumnName);
    },
    computedColumnList(
      this: Inflection,
      pseudoColumnName: string,
      proc: PgProc,
      _table: PgClass
    ) {
      return stringTag(proc, "fieldName")
        ? stringTag(proc, "fieldName") + "List"
        : this.camelCase(`${pseudoColumnName}-list`);
    },
    singleRelationByKeys(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      _foreignTable: PgClass,
      constraint: PgConstraint
    ) {
      const fieldName = stringTag(constraint, "fieldName");
      if (fieldName) {
        return fieldName;
      }
      return this.camelCase(
        `${this._singularizedTableName(table)}-by-${detailedKeys
          .map(key => this.column(key))
          .join("-and-")}`
      );
    },
    singleRelationByKeysBackwards(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      _foreignTable: PgClass,
      constraint: PgConstraint
    ) {
      const foreignSingleFieldName = stringTag(
        constraint,
        "foreignSingleFieldName"
      );
      if (foreignSingleFieldName) {
        return foreignSingleFieldName;
      }
      const foreignFieldName = stringTag(constraint, "foreignFieldName");
      if (foreignFieldName) {
        return foreignFieldName;
      }
      return this.singleRelationByKeys(
        detailedKeys,
        table,
        _foreignTable,
        constraint
      );
    },
    manyRelationByKeys(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      _foreignTable: PgClass,
      constraint: PgConstraint
    ) {
      const foreignFieldName = stringTag(constraint, "foreignFieldName");
      if (foreignFieldName) {
        return foreignFieldName;
      }
      return this.camelCase(
        `${this.pluralize(
          this._singularizedTableName(table)
        )}-by-${detailedKeys.map(key => this.column(key)).join("-and-")}`
      );
    },
    manyRelationByKeysSimple(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      _foreignTable: PgClass,
      constraint: PgConstraint
    ) {
      const foreignSimpleFieldName = stringTag(
        constraint,
        "foreignSimpleFieldName"
      );
      if (foreignSimpleFieldName) {
        return foreignSimpleFieldName;
      }
      const foreignFieldName = stringTag(constraint, "foreignFieldName");
      if (foreignFieldName) {
        return foreignFieldName;
      }
      return this.camelCase(
        `${this.pluralize(
          this._singularizedTableName(table)
        )}-by-${detailedKeys.map(key => this.column(key)).join("-and-")}-list`
      );
    },
    rowByUniqueKeys(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ) {
      const fieldName = stringTag(constraint, "fieldName");
      if (fieldName) {
        return fieldName;
      }
      return this.camelCase(
        `${this._singularizedTableName(table)}-by-${detailedKeys
          .map(key => this.column(key))
          .join("-and-")}`
      );
    },
    updateByKeys(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ) {
      const updateFieldName = stringTag(constraint, "updateFieldName");
      if (updateFieldName) {
        return updateFieldName;
      }
      return this.camelCase(
        `update-${this._singularizedTableName(table)}-by-${detailedKeys
          .map(key => this.column(key))
          .join("-and-")}`
      );
    },
    deleteByKeys(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ) {
      const deleteFieldName = stringTag(constraint, "deleteFieldName");
      if (deleteFieldName) {
        return deleteFieldName;
      }
      return this.camelCase(
        `delete-${this._singularizedTableName(table)}-by-${detailedKeys
          .map(key => this.column(key))
          .join("-and-")}`
      );
    },
    updateByKeysInputType(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ) {
      const updateFieldName = stringTag(constraint, "updateFieldName");
      if (updateFieldName) {
        return this.upperCamelCase(`${updateFieldName}-input`);
      }
      return this.upperCamelCase(
        `update-${this._singularizedTableName(table)}-by-${detailedKeys
          .map(key => this.column(key))
          .join("-and-")}-input`
      );
    },
    deleteByKeysInputType(
      this: Inflection,
      detailedKeys: PgAttribute[],
      table: PgClass,
      constraint: PgConstraint
    ) {
      const deleteFieldName = stringTag(constraint, "deleteFieldName");
      if (deleteFieldName) {
        return this.upperCamelCase(`${deleteFieldName}-input`);
      }
      return this.upperCamelCase(
        `delete-${this._singularizedTableName(table)}-by-${detailedKeys
          .map(key => this.column(key))
          .join("-and-")}-input`
      );
    },
    updateNode(this: Inflection, table: PgClass) {
      return this.camelCase(`update-${this._singularizedTableName(table)}`);
    },
    deleteNode(this: Inflection, table: PgClass) {
      return this.camelCase(`delete-${this._singularizedTableName(table)}`);
    },
    deletedNodeId(this: Inflection, table: PgClass) {
      return this.camelCase(`deleted-${this.singularize(table.name)}-id`);
    },
    updateNodeInputType(this: Inflection, table: PgClass) {
      return this.upperCamelCase(
        `update-${this._singularizedTableName(table)}-input`
      );
    },
    deleteNodeInputType(this: Inflection, table: PgClass) {
      return this.upperCamelCase(
        `delete-${this._singularizedTableName(table)}-input`
      );
    },
    edgeField(this: Inflection, table: PgClass) {
      return this.camelCase(`${this._singularizedTableName(table)}-edge`);
    },
    recordFunctionReturnType(this: Inflection, proc: PgProc) {
      return (
        stringTag(proc, "resultTypeName") ||
        this.upperCamelCase(`${this._functionName(proc)}-record`)
      );
    },
    recordFunctionConnection(this: Inflection, proc: PgProc) {
      return this.upperCamelCase(`${this._functionName(proc)}-connection`);
    },
    recordFunctionEdge(this: Inflection, proc: PgProc) {
      return this.upperCamelCase(
        `${this.singularize(this._functionName(proc))}-edge`
      );
    },
    scalarFunctionConnection(this: Inflection, proc: PgProc) {
      return this.upperCamelCase(`${this._functionName(proc)}-connection`);
    },
    scalarFunctionEdge(this: Inflection, proc: PgProc) {
      return this.upperCamelCase(
        `${this.singularize(this._functionName(proc))}-edge`
      );
    },
    createField(this: Inflection, table: PgClass) {
      return this.camelCase(`create-${this._singularizedTableName(table)}`);
    },
    createInputType(this: Inflection, table: PgClass) {
      return this.upperCamelCase(
        `create-${this._singularizedTableName(table)}-input`
      );
    },
    createPayloadType(this: Inflection, table: PgClass) {
      return this.upperCamelCase(
        `create-${this._singularizedTableName(table)}-payload`
      );
    },
    updatePayloadType(this: Inflection, table: PgClass) {
      return this.upperCamelCase(
        `update-${this._singularizedTableName(table)}-payload`
      );
    },
    deletePayloadType(this: Inflection, table: PgClass) {
      return this.upperCamelCase(
        `delete-${this._singularizedTableName(table)}-payload`
      );
    },
  };
  return preventEmptyResult(inflectors);
}

const defaultPgColumnFilter = (_attr, _build, _context) => true;

function identity<T>(val: T): T {
  return val;
}

export function preventEmptyResult<O>(obj: O): O {
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
  }, {}) as O;
}

const omitWithRBACChecks = omit => (
  entity: PgProc | PgClass | PgAttribute | PgConstraint,
  permission: string
) => {
  const ORDINARY_TABLE = "r";
  const VIEW = "v";
  const MATERIALIZED_VIEW = "m";
  const isTableLike = entity =>
    entity &&
    entity.kind === "class" &&
    (entity.classKind === ORDINARY_TABLE ||
      entity.classKind === VIEW ||
      entity.classKind === MATERIALIZED_VIEW);
  if (entity.kind === "procedure") {
    if (permission === EXECUTE && !entity.aclExecutable) {
      return true;
    }
  } else if (entity.kind === "class" && isTableLike(entity)) {
    const tableEntity: PgClass = entity;
    if (
      (permission === READ || permission === ALL || permission === MANY) &&
      !tableEntity.aclSelectable &&
      !tableEntity.attributes.some(attr => attr.aclSelectable)
    ) {
      return true;
    } else if (
      permission === CREATE &&
      !tableEntity.aclInsertable &&
      !tableEntity.attributes.some(attr => attr.aclInsertable)
    ) {
      return true;
    } else if (
      permission === UPDATE &&
      !tableEntity.aclUpdatable &&
      !tableEntity.attributes.some(attr => attr.aclUpdatable)
    ) {
      return true;
    } else if (permission === DELETE && !tableEntity.aclDeletable) {
      return true;
    }
  } else if (entity.kind === "attribute" && isTableLike(entity.class)) {
    const attributeEntity: PgAttribute = entity;

    const klass = attributeEntity.class;
    // Have we got *any* permissions on the table?
    if (
      klass.aclSelectable ||
      klass.attributes.some(attr => attr.aclSelectable)
    ) {
      // Yes; this is a regular table; omit if RBAC permissions tell us to.
      if (
        (permission === READ ||
          permission === FILTER ||
          permission === ORDER) &&
        !attributeEntity.aclSelectable
      ) {
        return true;
      } else if (permission === CREATE && !attributeEntity.aclInsertable) {
        return true;
      } else if (permission === UPDATE && !attributeEntity.aclUpdatable) {
        return true;
      }
    } else {
      // No permissions on the table at all, so normal connections will skip
      // over it. Thus we must be being exposed via a security definer function
      // or similar, so we should expose all fields except those that are
      // explicitly @omit-ed.
    }
  }
  return omit(entity, permission);
};

const omitUnindexed = (omit, hideIndexWarnings) => (
  entity: PgProc | PgClass | PgAttribute | PgConstraint,
  permission: string
) => {
  if (
    entity.kind === "attribute" &&
    !entity.isIndexed &&
    (permission === "filter" || permission === "order")
  ) {
    return true;
  }
  if (
    entity.kind === "constraint" &&
    entity.type === "f" &&
    !entity.isIndexed &&
    permission === "read"
  ) {
    const klass = entity.class;
    if (klass) {
      const shouldOutputWarning =
        !entity["_omitUnindexedReadWarningGiven"] && !hideIndexWarnings;
      if (shouldOutputWarning) {
        entity["_omitUnindexedReadWarningGiven"] = true;
        // eslint-disable-next-line no-console
        console.log(
          "%s",
          `Disabled 'read' permission for ${describePgEntity(
            entity
          )} because it isn't indexed. For more information see https://graphile.org/postgraphile/best-practices/ To fix, perform\n\n  CREATE INDEX ON ${`"${klass.namespaceName}"."${klass.name}"`}("${entity.keyAttributes
            .map(a => a.name)
            .join('", "')}");`
        );
      }
    }
    return true;
  }
  return omit(entity, permission);
};

function describePgEntity(entity: PgEntity, includeAlias = true) {
  const getAlias = !includeAlias
    ? () => ""
    : () => {
        const tags = pickBy(
          entity.tags,
          (value, key) => key === "name" || key.endsWith("Name")
        );

        if (Object.keys(tags).length) {
          return ` (with smart comments: ${chalk.bold(
            Object.keys(tags)
              .map(t => `@${t} ${tags[t]}`)
              .join(" | ")
          )})`;
        }
        return "";
      };

  try {
    if (entity.kind === "constraint") {
      return `constraint ${chalk.bold(
        `"${entity.name}"`
      )} on ${describePgEntity(entity.class, false)}${getAlias()}`;
    } else if (entity.kind === "class") {
      // see pg_class.relkind https://www.postgresql.org/docs/10/static/catalog-pg-class.html
      const kind =
        {
          c: "composite type",
          f: "foreign table",
          p: "partitioned table",
          r: "table",
          v: "view",
          m: "materialized view",
        }[entity.classKind] || "table-like";
      return `${kind} ${chalk.bold(
        `"${entity.namespaceName}"."${entity.name}"`
      )}${getAlias()}`;
    } else if (entity.kind === "procedure") {
      return `function ${chalk.bold(
        `"${entity.namespaceName}"."${entity.name}"(...args...)`
      )}${getAlias()}`;
    } else if (entity.kind === "attribute") {
      return `column ${chalk.bold(`"${entity.name}"`)} on ${describePgEntity(
        entity.class,
        false
      )}${getAlias()}`;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Error occurred while attempting to debug entity:", entity);
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return `entity of kind '${entity.kind}' with ${
    "id" in entity && typeof entity.id === "string" ? `oid '${entity.id}'` : ""
  }`;
}

function sqlCommentByAddingTags(entity, tagsToAdd) {
  // NOTE: this function is NOT intended to be SQL safe; it's for
  // displaying in error messages. Nonetheless if you find issues with
  // SQL compatibility, please send a PR or issue.

  // Ref: https://www.postgresql.org/docs/current/static/sql-syntax-lexical.html#SQL-BACKSLASH-TABLE
  const escape = str =>
    str.replace(
      /['\\\b\f\n\r\t]/g,
      chr =>
        ({
          "\b": "\\b",
          "\f": "\\f",
          "\n": "\\n",
          "\r": "\\r",
          "\t": "\\t",
        }[chr] || "\\" + chr)
    );

  // tagsToAdd is here twice to ensure that the keys in tagsToAdd come first, but that they also "win" any conflicts.
  const tags = {
    ...tagsToAdd,
    ...entity.tags,
    ...tagsToAdd,
  };

  const description = entity.description;
  const tagsSql = Object.keys(tags)
    .reduce(
      (memo, tag) => {
        const tagValue = tags[tag];
        const valueArray = Array.isArray(tagValue) ? tagValue : [tagValue];
        const highlightOrNot = tag in tagsToAdd ? chalk.bold.green : identity;
        valueArray.forEach(value => {
          memo.push(
            highlightOrNot(
              `@${escape(escape(tag))}${
                value === true ? "" : " " + escape(escape(value))
              }`
            )
          );
        });
        return memo;
      },
      [] as Array<string>
    )
    .join("\\n");
  const commentValue = `E'${tagsSql}${
    description ? "\\n" + escape(description) : ""
  }'`;
  let sqlThing;
  if (entity.kind === "class") {
    const identifier = `"${entity.namespaceName}"."${entity.name}"`;
    if (entity.classKind === "r") {
      sqlThing = `TABLE ${identifier}`;
    } else if (entity.classKind === "v") {
      sqlThing = `VIEW ${identifier}`;
    } else if (entity.classKind === "m") {
      sqlThing = `MATERIALIZED VIEW ${identifier}`;
    } else if (entity.classKind === "c") {
      sqlThing = `TYPE ${identifier}`;
    } else {
      sqlThing = `PLEASE_SEND_A_PULL_REQUEST_TO_FIX_THIS ${identifier}`;
    }
  } else if (entity.kind === "attribute") {
    sqlThing = `COLUMN "${entity.class.namespaceName}"."${entity.class.name}"."${entity.name}"`;
  } else if (entity.kind === "procedure") {
    sqlThing = `FUNCTION "${entity.namespaceName}"."${entity.name}"(...arg types go here...)`;
  } else if (entity.kind === "constraint") {
    // TODO: TEST!
    sqlThing = `CONSTRAINT "${entity.name}" ON "${entity.class.namespaceName}"."${entity.class.name}"`;
  } else {
    sqlThing = `UNKNOWN_ENTITY_PLEASE_SEND_A_PULL_REQUEST`;
  }

  return `COMMENT ON ${sqlThing} IS ${commentValue};`;
}

export default (function PgBasicsPlugin(
  builder,
  {
    pgStrictFunctions = false,
    pgColumnFilter = defaultPgColumnFilter,
    pgIgnoreRBAC = false,
    pgIgnoreIndexes = true, // TODO:v5: change this to false
    pgHideIndexWarnings = false,
    pgLegacyJsonUuid = false, // TODO:v5: remove this
  }
) {
  let pgOmit = baseOmit;
  if (!pgIgnoreRBAC) {
    pgOmit = omitWithRBACChecks(pgOmit);
  }
  if (!pgIgnoreIndexes) {
    pgOmit = omitUnindexed(pgOmit, pgHideIndexWarnings);
  }
  builder.hook(
    "build",
    build => {
      build.versions["graphile-build-pg"] = version;
      build.liveCoordinator.registerProvider(new PgLiveProvider());
      const buildExtensions: Partial<Build> = {
        graphileBuildPgVersion: version,
        pgSql: sql,
        pgStrictFunctions,
        pgColumnFilter,

        // TODO:v5: remove this workaround
        // BEWARE: this may be overridden in PgIntrospectionPlugin for PG < 9.5
        pgQueryFromResolveData: queryFromResolveDataFactory(),

        pgAddStartEndCursor: addStartEndCursor,
        pgOmit,
        pgMakeProcField: makeProcField,
        pgParseIdentifier: parseIdentifier,
        pgViaTemporaryTable: viaTemporaryTable,
        describePgEntity,
        pgField,
        sqlCommentByAddingTags,
        pgPrepareAndRun,
      };
      return build.extend(
        build,
        buildExtensions,
        "Adding the graphile-build-pg basics"
      );
    },
    ["PgBasics"]
  );

  builder.hook(
    "inflection",
    (inflection, build) => {
      // TODO:v5: move this to postgraphile-core
      const oldBuiltin = inflection.builtin;
      inflection.builtin = function(name) {
        if (pgLegacyJsonUuid && name === "JSON") return "Json";
        if (pgLegacyJsonUuid && name === "UUID") return "Uuid";
        return oldBuiltin.call(this, name);
      };

      return build.extend(
        inflection,
        makePgBaseInflectors(),
        "Default inflectors from PgBasicsPlugin. You can override these with `makeAddInflectorsPlugin(..., true)`."
      );
    },
    ["PgBasics"]
  );
} as Plugin);
