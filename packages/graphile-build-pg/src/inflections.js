// @flow
import pluralize from "pluralize";
import upperFirstAll from "lodash/upperFirst";
import lowerFirstAll from "lodash/lowerFirst";
import camelCaseAll from "lodash/camelCase";

const constantCaseAll = str =>
  lowerFirst(str.replace(/^[^a-z0-9_]+/gi, ""))
    .replace(/[^a-z0-9_]+/gi, "_")
    .replace(/[A-Z]/g, str => `_${str.toLowerCase()}`)
    .replace(/__+/g, "_")
    .toUpperCase();

const formatInsideUnderscores = (fn: (input: string) => string) => (
  str: string
) => {
  const matches = str.match(/^(_*)([\s\S]*?)(_*)$/);
  if (!matches) {
    throw new Error("Impossible?"); // Satiate Flow
  }
  const [, start, middle, end] = matches;
  return `${start}${fn(middle)}${end}`;
};

const upperFirst = formatInsideUnderscores(upperFirstAll);
const lowerFirst = formatInsideUnderscores(lowerFirstAll);
const camelCase = formatInsideUnderscores(camelCaseAll);
const constantCase = formatInsideUnderscores(constantCaseAll);

type Keys = Array<{
  column: string,
  table: string,
  schema: ?string,
}>;

export const defaultInflection = {
  pluralize,
  argument(name: ?string, index: number) {
    return camelCase(name || `arg${index}`);
  },
  orderByType(typeName: string) {
    return upperFirst(camelCase(`${pluralize(typeName)}-order-by`));
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
    return upperFirst(camelCase(name));
  },
  enumName(value: string) {
    return value;
  },
  enumType(name: string) {
    return upperFirst(camelCase(name));
  },
  conditionType(typeName: string) {
    return upperFirst(camelCase(`${typeName}-condition`));
  },
  inputType(typeName: string) {
    return upperFirst(camelCase(`${typeName}-input`));
  },
  rangeBoundType(typeName: string) {
    return upperFirst(camelCase(`${typeName}-range-bound`));
  },
  rangeType(typeName: string) {
    return upperFirst(camelCase(`${typeName}-range`));
  },
  patchType(typeName: string) {
    return upperFirst(camelCase(`${typeName}-patch`));
  },
  patchField(itemName: string) {
    return camelCase(`${itemName}-patch`);
  },
  tableName(name: string, _schema: ?string) {
    return camelCase(pluralize.singular(name));
  },
  tableNode(name: string, _schema: ?string) {
    return camelCase(pluralize.singular(name));
  },
  allRows(name: string, schema: ?string) {
    return camelCase(`all-${this.pluralize(this.tableName(name, schema))}`);
  },
  functionName(name: string, _schema: ?string) {
    return camelCase(name);
  },
  functionPayloadType(name: string, _schema: ?string) {
    return upperFirst(camelCase(`${name}-payload`));
  },
  functionInputType(name: string, _schema: ?string) {
    return upperFirst(camelCase(`${name}-input`));
  },
  tableType(name: string, schema: ?string) {
    return upperFirst(this.tableName(name, schema));
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
    return camelCase(`update-${pluralize.singular(name)}`);
  },
  deleteNode(name: string, _schema: ?string) {
    return camelCase(`delete-${pluralize.singular(name)}`);
  },
  updateByKeysInputType(detailedKeys: Keys, name: string, _schema: ?string) {
    return upperFirst(
      camelCase(
        `update-${pluralize.singular(name)}-by-${detailedKeys
          .map(key => this.column(key.column, key.table, key.schema))
          .join("-and-")}-input`
      )
    );
  },
  deleteByKeysInputType(detailedKeys: Keys, name: string, _schema: ?string) {
    return upperFirst(
      camelCase(
        `delete-${pluralize.singular(name)}-by-${detailedKeys
          .map(key => this.column(key.column, key.table, key.schema))
          .join("-and-")}-input`
      )
    );
  },
  updateNodeInputType(name: string, _schema: ?string) {
    return upperFirst(camelCase(`update-${pluralize.singular(name)}-input`));
  },
  deleteNodeInputType(name: string, _schema: ?string) {
    return upperFirst(camelCase(`delete-${pluralize.singular(name)}-input`));
  },
  manyRelationByKeys(detailedKeys: Keys, table: string, schema: ?string) {
    return camelCase(
      `${this.pluralize(
        this.tableName(table, schema)
      )}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  edge(typeName: string) {
    return upperFirst(camelCase(`${pluralize(typeName)}-edge`));
  },
  edgeField(name: string, _schema: ?string) {
    return camelCase(`${pluralize.singular(name)}-edge`);
  },
  connection(typeName: string) {
    return upperFirst(camelCase(`${this.pluralize(typeName)}-connection`));
  },
  scalarFunctionConnection(procName: string, _procSchema: ?string) {
    return upperFirst(camelCase(`${procName}-connection`));
  },
  scalarFunctionEdge(procName: string, _procSchema: ?string) {
    return upperFirst(camelCase(`${procName}-edge`));
  },
  createField(name: string, _schema: ?string) {
    return camelCase(`create-${pluralize.singular(name)}`);
  },
  createInputType(name: string, _schema: ?string) {
    return upperFirst(camelCase(`create-${pluralize.singular(name)}-input`));
  },
  createPayloadType(name: string, _schema: ?string) {
    return upperFirst(camelCase(`create-${pluralize.singular(name)}-payload`));
  },
  updatePayloadType(name: string, _schema: ?string) {
    return upperFirst(camelCase(`update-${pluralize.singular(name)}-payload`));
  },
  deletePayloadType(name: string, _schema: ?string) {
    return upperFirst(camelCase(`delete-${pluralize.singular(name)}-payload`));
  },
};

export const postGraphQLInflection = Object.assign({}, defaultInflection, {
  enumName(value) {
    return constantCase(value);
  },
});

export const postGraphQLClassicIdsInflection = Object.assign(
  {},
  postGraphQLInflection,
  {
    column(name: string, _table: string, _schema) {
      return name === "id" ? "rowId" : camelCase(name);
    },
  }
);
