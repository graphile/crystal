const upperFirst = require("lodash/upperFirst");
const camelcase = require("lodash/camelcase");
const snakeCase = require("lodash/snakeCase");
const pluralize = require("pluralize");

exports.defaultInflection = {
  pluralize,
  argument(name, index) {
    return camelcase(name || `arg${index}`);
  },
  orderByType(typeName) {
    return upperFirst(camelcase(`${pluralize(typeName)}-order-by`));
  },
  orderByEnum(name, ascending, _table, _schema) {
    return snakeCase(`${name}_${ascending ? "ASC" : "DESC"}`).toUpperCase();
  },
  enumName(value) {
    return value;
  },
  conditionType(typeName) {
    return upperFirst(camelcase(`${typeName}-condition`));
  },
  inputType(typeName) {
    return upperFirst(camelcase(`${typeName}-input`));
  },
  rangeBoundType(typeName) {
    return upperFirst(camelcase(`${typeName}-range-bound`));
  },
  rangeType(typeName) {
    return upperFirst(camelcase(`${typeName}-range`));
  },
  patchType(typeName) {
    return upperFirst(camelcase(`${typeName}-patch`));
  },
  patchField(itemName) {
    return camelcase(`${itemName}-patch`);
  },
  tableName(name, _schema) {
    return camelcase(pluralize.singular(name));
  },
  tableNode(name, _schema) {
    return camelcase(name);
  },
  allRows(name, schema) {
    return camelcase(`all-${this.pluralize(this.tableName(name, schema))}`);
  },
  functionName(name, _schema) {
    return camelcase(name);
  },
  functionPayloadType(name, _schema) {
    return upperFirst(camelcase(`${name}-payload`));
  },
  functionInputType(name, _schema) {
    return upperFirst(camelcase(`${name}-input`));
  },
  tableType(name, schema) {
    return upperFirst(this.tableName(name, schema));
  },
  column(name, _table, _schema) {
    return camelcase(name);
  },
  singleRelationByKeys(detailedKeys, table, schema) {
    return camelcase(
      `${this.tableName(table, schema)}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  updateByKeys(detailedKeys, table, schema) {
    return camelcase(
      `update-${this.tableName(table, schema)}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  deleteByKeys(detailedKeys, table, schema) {
    return camelcase(
      `delete-${this.tableName(table, schema)}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  updateNode(name, _schema) {
    return camelcase(`update-${pluralize.singular(name)}`);
  },
  deleteNode(name, _schema) {
    return camelcase(`delete-${pluralize.singular(name)}`);
  },
  updateByKeysInputType(detailedKeys, name, _schema) {
    return upperFirst(
      camelcase(
        `update-${pluralize.singular(name)}-by-${detailedKeys
          .map(key => this.column(key.column, key.table, key.schema))
          .join("-and-")}-input`
      )
    );
  },
  deleteByKeysInputType(detailedKeys, name, _schema) {
    return upperFirst(
      camelcase(
        `delete-${pluralize.singular(name)}-by-${detailedKeys
          .map(key => this.column(key.column, key.table, key.schema))
          .join("-and-")}-input`
      )
    );
  },
  updateNodeInputType(name, _schema) {
    return upperFirst(camelcase(`update-${pluralize.singular(name)}-input`));
  },
  deleteNodeInputType(name, _schema) {
    return upperFirst(camelcase(`delete-${pluralize.singular(name)}-input`));
  },
  deleteByKeys(detailedKeys, table, schema) {
    return camelcase(
      `delete-${this.tableName(table, schema)}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  manyRelationByKeys(detailedKeys, table, schema) {
    return camelcase(
      `${this.pluralize(
        this.tableName(table, schema)
      )}-by-${detailedKeys
        .map(key => this.column(key.column, key.table, key.schema))
        .join("-and-")}`
    );
  },
  edge(typeName) {
    return upperFirst(camelcase(`${pluralize(typeName)}-edge`));
  },
  edgeField(name, _schema) {
    return camelcase(`${pluralize.singular(name)}-edge`);
  },
  connection(typeName) {
    return upperFirst(camelcase(`${this.pluralize(typeName)}-connection`));
  },
  scalarFunctionConnection(procName, _procSchema) {
    return upperFirst(camelcase(`${procName}-connection`));
  },
  scalarFunctionEdge(procName, _procSchema) {
    return upperFirst(camelcase(`${procName}-edge`));
  },
  createField(name, _schema) {
    return camelcase(`create-${pluralize.singular(name)}`);
  },
  createInputType(name, _schema) {
    return upperFirst(camelcase(`create-${pluralize.singular(name)}-input`));
  },
  createPayloadType(name, _schema) {
    return upperFirst(camelcase(`create-${pluralize.singular(name)}-payload`));
  },
  updatePayloadType(name, _schema) {
    return upperFirst(camelcase(`update-${pluralize.singular(name)}-payload`));
  },
  deletePayloadType(name, _schema) {
    return upperFirst(camelcase(`delete-${pluralize.singular(name)}-payload`));
  },
};

exports.postGraphQLInflection = Object.assign({}, exports.defaultInflection, {
  enumName(value) {
    return snakeCase(value).toUpperCase();
  },
});

exports.postGraphQLClassicIdsInflection = Object.assign(
  {},
  exports.postGraphQLInflection,
  {
    column(name, _table, _schema) {
      return name === "id" ? "rowId" : camelcase(name);
    },
  }
);
