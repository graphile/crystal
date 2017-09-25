// @flow
import pluralize from "pluralize";
import { upperCamelCase, camelCase, constantCase } from "./utils";

type Keys = Array<{
  column: string,
  table: string,
  schema: ?string,
}>;

type InflectorUtils = {|
  constantCase: string => string,
  camelCase: string => string,
  upperCamelCase: string => string,
  pluralize: string => string,
  singularize: string => string,
|};

export const defaultUtils: InflectorUtils = {
  constantCase,
  camelCase,
  upperCamelCase,
  pluralize,
  singularize: pluralize.singular,
};

export type Inflector = {
  // TODO: tighten this up!
  // eslint-disable-next-line flowtype/no-weak-types
  [string]: (...input: Array<any>) => string,
};

export const newInflector = (
  overrides: ?{ [string]: () => string } = undefined,
  {
    constantCase,
    camelCase,
    upperCamelCase,
    pluralize,
    singularize,
  }: InflectorUtils = defaultUtils
): Inflector =>
  Object.assign(
    {
      pluralize,
      argument(name: ?string, index: number) {
        return camelCase(name || `arg${index}`);
      },
      orderByType(typeName: string) {
        return upperCamelCase(`${pluralize(typeName)}-order-by`);
      },
      orderByEnum(
        name: string,
        ascending: boolean,
        _table: string,
        _schema: ?string
      ) {
        return constantCase(`${name}_${ascending ? "asc" : "desc"}`);
      },
      domainType(name: string) {
        return upperCamelCase(name);
      },
      enumName(value: string) {
        if (value === "") {
          return "_EMPTY_";
        }
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
      tableName(name: string, _schema: ?string) {
        return camelCase(singularize(name));
      },
      tableNode(name: string, _schema: ?string) {
        return camelCase(singularize(name));
      },
      allRows(name: string, schema: ?string) {
        return camelCase(`all-${this.pluralize(this.tableName(name, schema))}`);
      },
      functionName(name: string, _schema: ?string) {
        return camelCase(name);
      },
      functionPayloadType(name: string, _schema: ?string) {
        return upperCamelCase(`${name}-payload`);
      },
      functionInputType(name: string, _schema: ?string) {
        return upperCamelCase(`${name}-input`);
      },
      tableType(name: string, schema: ?string) {
        return upperCamelCase(this.tableName(name, schema));
      },
      column(name: string, _table: string, _schema: ?string) {
        return camelCase(name);
      },
      singleRelationByKeys(detailedKeys: Keys, table: string, schema: ?string) {
        return camelCase(
          `${this.tableName(table, schema)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      rowByUniqueKeys(detailedKeys: Keys, table: string, schema: ?string) {
        return camelCase(
          `${this.tableName(table, schema)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      updateByKeys(detailedKeys: Keys, table: string, schema: ?string) {
        return camelCase(
          `update-${this.tableName(table, schema)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      deleteByKeys(detailedKeys: Keys, table: string, schema: ?string) {
        return camelCase(
          `delete-${this.tableName(table, schema)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}`
        );
      },
      updateNode(name: string, _schema: ?string) {
        return camelCase(`update-${singularize(name)}`);
      },
      deleteNode(name: string, _schema: ?string) {
        return camelCase(`delete-${singularize(name)}`);
      },
      updateByKeysInputType(
        detailedKeys: Keys,
        name: string,
        _schema: ?string
      ) {
        return upperCamelCase(
          `update-${singularize(name)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}-input`
        );
      },
      deleteByKeysInputType(
        detailedKeys: Keys,
        name: string,
        _schema: ?string
      ) {
        return upperCamelCase(
          `delete-${singularize(name)}-by-${detailedKeys
            .map(key => this.column(key.column, key.table, key.schema))
            .join("-and-")}-input`
        );
      },
      updateNodeInputType(name: string, _schema: ?string) {
        return upperCamelCase(`update-${singularize(name)}-input`);
      },
      deleteNodeInputType(name: string, _schema: ?string) {
        return upperCamelCase(`delete-${singularize(name)}-input`);
      },
      manyRelationByKeys(
        detailedKeys: Keys,
        table: string,
        schema: ?string,
        _foreignTable: string,
        _foreignSchema: ?string
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
      edgeField(name: string, _schema: ?string) {
        return camelCase(`${singularize(name)}-edge`);
      },
      connection(typeName: string) {
        return upperCamelCase(`${this.pluralize(typeName)}-connection`);
      },
      scalarFunctionConnection(procName: string, _procSchema: ?string) {
        return upperCamelCase(`${procName}-connection`);
      },
      scalarFunctionEdge(procName: string, _procSchema: ?string) {
        return upperCamelCase(`${procName}-edge`);
      },
      createField(name: string, _schema: ?string) {
        return camelCase(`create-${singularize(name)}`);
      },
      createInputType(name: string, _schema: ?string) {
        return upperCamelCase(`create-${singularize(name)}-input`);
      },
      createPayloadType(name: string, _schema: ?string) {
        return upperCamelCase(`create-${singularize(name)}-payload`);
      },
      updatePayloadType(name: string, _schema: ?string) {
        return upperCamelCase(`update-${singularize(name)}-payload`);
      },
      deletePayloadType(name: string, _schema: ?string) {
        return upperCamelCase(`delete-${singularize(name)}-payload`);
      },
    },
    overrides
  );

export const defaultInflection = newInflector();
