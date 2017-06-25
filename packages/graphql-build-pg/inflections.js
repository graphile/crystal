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
    return upperFirst(camelcase(`${typeName}-order-by`));
  },
  orderByEnum(name, ascending, _table, _schema) {
    return snakeCase(`${name}_${ascending ? "ASC" : "DESC"}`).toUpperCase();
  },
  conditionType(typeName) {
    return upperFirst(camelcase(`${typeName}-condition`));
  },
  tableName(name, _schema) {
    return camelcase(name);
  },
  allRows(name, schema) {
    return camelcase(`all-${this.pluralize(this.tableName(name, schema))}`);
  },
  functionName(name, _schema) {
    return camelcase(name);
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
    return upperFirst(camelcase(`${typeName}-edge`));
  },
  connection(typeName) {
    return upperFirst(camelcase(`${this.pluralize(typeName)}-connection`));
  },
};

exports.postGraphQLInflection = Object.assign({}, exports.defaultInflection);

exports.postGraphQLClassicIdsInflection = Object.assign(
  {},
  exports.postGraphQLInflection,
  {
    column(name, _table, _schema) {
      return name === "id" ? "rowId" : camelcase(name);
    },
  }
);
