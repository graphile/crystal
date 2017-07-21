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

const formatInsideUnderscores = fn => str => {
  const [, start, middle, end] = str.match(/^(_*)([\s\S]*?)(_*)$/);
  return `${start}${fn(middle)}${end}`;
};

const upperFirst = formatInsideUnderscores(upperFirstAll);
const lowerFirst = formatInsideUnderscores(lowerFirstAll);
const camelCase = formatInsideUnderscores(camelCaseAll);
const constantCase = formatInsideUnderscores(constantCaseAll);

export const defaultInflection = {
  pluralize,
  argument(name, index) {
    return camelCase(name || `arg${index}`);
  },
  orderByType(typeName) {
    return upperFirst(camelCase(`${pluralize(typeName)}-order-by`));
  },
  orderByEnum(name, ascending, _table, _schema) {
    return constantCase(`${name}_${ascending ? "asc" : "desc"}`);
  },
  domainType(name) {
    return upperFirst(camelCase(name));
  },
  enumName(value) {
    return value;
  },
  enumType(name) {
    return upperFirst(camelCase(name));
  },
  conditionType(typeName) {
    return upperFirst(camelCase(`${typeName}-condition`));
  },
  inputType(typeName) {
    return upperFirst(camelCase(`${typeName}-input`));
  },
  rangeBoundType(typeName) {
    return upperFirst(camelCase(`${typeName}-range-bound`));
  },
  rangeType(typeName) {
    return upperFirst(camelCase(`${typeName}-range`));
  },
  patchType(typeName) {
    return upperFirst(camelCase(`${typeName}-patch`));
  },
  patchField(itemName) {
    return camelCase(`${itemName}-patch`);
  },
  tableName(name, _schema) {
    return camelCase(pluralize.singular(name));
  },
  tableNode(name, _schema) {
    return camelCase(pluralize.singular(name));
  },
  allRows(name, schema) {
    return camelCase(`all-${this.pluralize(this.tableName(name, schema))}`);
  },
  functionName(name, _schema) {
    return camelCase(name);
  },
  functionPayloadType(name, _schema) {
    return upperFirst(camelCase(`${name}-payload`));
  },
  functionInputType(name, _schema) {
    return upperFirst(camelCase(`${name}-input`));
  },
  tableType(name, schema) {
    return upperFirst(this.tableName(name, schema));
  },
  column(name, _table, _schema) {
    return camelCase(name);
  },
  singleRelationByKeys(detailedKeys, table, schema) {
    return camelCase(
      `${this.tableName(table, schema)}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  updateByKeys(detailedKeys, table, schema) {
    return camelCase(
      `update-${this.tableName(table, schema)}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  deleteByKeys(detailedKeys, table, schema) {
    return camelCase(
      `delete-${this.tableName(table, schema)}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  updateNode(name, _schema) {
    return camelCase(`update-${pluralize.singular(name)}`);
  },
  deleteNode(name, _schema) {
    return camelCase(`delete-${pluralize.singular(name)}`);
  },
  updateByKeysInputType(detailedKeys, name, _schema) {
    return upperFirst(
      camelCase(
        `update-${pluralize.singular(name)}-by-${detailedKeys
          .map(key => this.column(key.column, key.table, key.schema))
          .join("-and-")}-input`
      )
    );
  },
  deleteByKeysInputType(detailedKeys, name, _schema) {
    return upperFirst(
      camelCase(
        `delete-${pluralize.singular(name)}-by-${detailedKeys
          .map(key => this.column(key.column, key.table, key.schema))
          .join("-and-")}-input`
      )
    );
  },
  updateNodeInputType(name, _schema) {
    return upperFirst(camelCase(`update-${pluralize.singular(name)}-input`));
  },
  deleteNodeInputType(name, _schema) {
    return upperFirst(camelCase(`delete-${pluralize.singular(name)}-input`));
  },
  manyRelationByKeys(detailedKeys, table, schema) {
    return camelCase(
      `${this.pluralize(
        this.tableName(table, schema)
      )}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  edge(typeName) {
    return upperFirst(camelCase(`${pluralize(typeName)}-edge`));
  },
  edgeField(name, _schema) {
    return camelCase(`${pluralize.singular(name)}-edge`);
  },
  connection(typeName) {
    return upperFirst(camelCase(`${this.pluralize(typeName)}-connection`));
  },
  scalarFunctionConnection(procName, _procSchema) {
    return upperFirst(camelCase(`${procName}-connection`));
  },
  scalarFunctionEdge(procName, _procSchema) {
    return upperFirst(camelCase(`${procName}-edge`));
  },
  createField(name, _schema) {
    return camelCase(`create-${pluralize.singular(name)}`);
  },
  createInputType(name, _schema) {
    return upperFirst(camelCase(`create-${pluralize.singular(name)}-input`));
  },
  createPayloadType(name, _schema) {
    return upperFirst(camelCase(`create-${pluralize.singular(name)}-payload`));
  },
  updatePayloadType(name, _schema) {
    return upperFirst(camelCase(`update-${pluralize.singular(name)}-payload`));
  },
  deletePayloadType(name, _schema) {
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
    column(name, _table, _schema) {
      return name === "id" ? "rowId" : camelCase(name);
    },
  }
);
