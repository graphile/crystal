import { flatten } from 'lodash'

/**
 * A catalog of all objects relevant in the database to PostGraphQL.
 *
 * @member {Schema[]} schemas
 */
export class Catalog {
  schemas = []

  /**
   * Gets the schema of a certain name.
   *
   * @param {string} schemaName
   * @returns {?Schema}
   */
  getSchema (schemaName) {
    return this.schemas.find(({ name }) => name === schemaName)
  }

  /**
   * Gets a table in a schema.
   *
   * @param {string} schemaName
   * @param {string} tableName
   * @returns {?Table}
   */
  getTable (schemaName, tableName) {
    return this.getSchema(schemaName).getTable(tableName)
  }

  /**
   * Gets all tables in all of our schemas.
   *
   * @returns {Table[]}
   */
  getAllTables () {
    return flatten(this.schemas.map(schema => schema.getAllTables()))
  }

  /**
   * Gets an enum in a schema.
   *
   * @param {string} schemaName
   * @param {string} enumName
   * @returns {?Enum}
   */
  getEnum (schemaName, enumName) {
    return this.getSchema(schemaName).getEnum(enumName)
  }

  /**
   * Gets all enums in all of our schemas.
   *
   * @returns {Enum[]}
   */
  getAllEnums () {
    return flatten(this.schemas.map(({ enums }) => enums))
  }

  /**
   * Gets the column of a table in a schema.
   *
   * @param {string} schemaName
   * @param {string} tableName
   * @param {string} columnName
   * @returns {?Column}
   */
  getColumn (schemaName, tableName, columnName) {
    return this.getSchema(schemaName).getTable(tableName).getColumn(columnName)
  }

  /**
   * Gets all columns in all of our schemas.
   *
   * @returns {Column[]}
   */
  getAllColumns () {
    return flatten(this.schemas.map(schema => schema.getAllColumns()))
  }
}

/**
 * Represents a PostgreSQL schema.
 *
 * @member {Catalog} catalog
 * @member {string} name
 * @member {string} description
 * @member {Table[]} tables
 * @member {Enum[]} enums
 */
export class Schema {
  tables = []
  enums = []

  constructor ({ _oid, catalog, name, description }) {
    this._oid = _oid
    this.catalog = catalog
    this.name = name
    this.description = description
  }

  /**
   * Gets the escaped name of the schema to be used as an identifier in SQL
   * queries.
   *
   * @returns {string}
   */
  getIdentifier () {
    return `"${this.name}"`
  }

  /**
   * Gets a table in this schema.
   *
   * @param {string} tableName
   * @returns {?Table}
   */
  getTable (tableName) {
    return this.tables.find(({ name }) => name === tableName)
  }

  /**
   * Return all of our tables.
   *
   * @returns {Table[]}
   */
  getAllTables () {
    return this.tables
  }

  /**
   * Gets an enum in this schema.
   *
   * @param {string} enumName
   * @returns {?Enum}
   */
  getEnum (enumName) {
    return this.enums.find(({ name }) => name === enumName)
  }

  /**
   * Gets a column in a table in the schema.
   *
   * @param {string} tableName
   * @param {string} columnName
   * @returns {?Column}
   */
  getColumn (tableName, columnName) {
    return this.getTable(tableName).getColumn(columnName)
  }

  /**
   * Gets all columns in all of our tables.
   *
   * @returns {Column[]}
   */
  getAllColumns () {
    return flatten(this.tables.map(table => table.getAllColumns()))
  }
}

/**
 * Represents a PostgreSQL table.
 *
 * @member {Schema} schema
 * @member {string} name
 * @member {string} description
 * @member {Column[]} columns
 */
export class Table {
  columns = []

  constructor ({ _oid, schema, name, description }) {
    this._oid = _oid
    this.schema = schema
    this.name = name
    this.description = description
  }

  /**
   * Gets the escaped, qualified, name of the schema to be used as an
   * identifier in a SQL query.
   *
   * @returns {string}
   */
  getIdentifier () {
    return `${this.schema.getIdentifier()}."${this.name}"`
  }

  /**
   * Gets a column in the table.
   *
   * @param {string} columnName
   * @returns {?Column}
   */
  getColumn (columnName) {
    return this.columns.find(({ name }) => name === columnName)
  }

  /**
   * Return all of our columns.
   *
   * @returns {Column[]}
   */
  getAllColumns () {
    return this.columns
  }

  /**
   * Gets the primary key columns for this table. If there is no primary key
   * this will return an array with a length of 0.
   *
   * @returns {Column[]}
   */
  getPrimaryKeyColumns () {
    return this.columns.filter(({ isPrimaryKey }) => isPrimaryKey)
  }

  /**
   * Gets the foreign keys for this table.
   *
   * @returns {Object[]}
   */
  getForeignKeys () {
    if (!this._foreignKeys)
      return []

    return this._foreignKeys.map(({ nativeColumnNums, foreignTableOid, foreignColumnNums }) => ({
      nativeTable: this,
      nativeColumns:
        nativeColumnNums.map(num => this.columns.find(({ _num }) => _num === num)),
      foreignTable:
        this.schema.catalog.getAllTables().find(({ _oid }) => _oid === foreignTableOid),
      foreignColumns:
        foreignColumnNums.map(num =>
          this.schema.catalog.getAllColumns()
          .find(({ table, _num }) => table._oid === foreignTableOid && _num === num)
        ),
    }))
  }
}

/**
 * Represents a PostgreSQL column.
 *
 * @member {Table} table
 * @member {string} name
 * @member {string} description
 * @member {number} type
 * @member {boolean} isNullable
 * @member {boolean} isPrimaryKey
 */
export class Column {
  constructor ({ _num, table, name, description, type, isNullable = true, isPrimaryKey }) {
    this._num = _num
    this.table = table
    this.name = name
    this.description = description
    this.type = type
    this.isNullable = isNullable
    this.isPrimaryKey = isPrimaryKey
  }

  /**
   * Gets an enum based on the column’s type. If there is no enum for the
   * column’s type, null is returned.
   *
   * @returns {?Enum}
   */
  getEnum () {
    return this.table.schema.catalog.getAllEnums().find(({ _oid }) => _oid === this.type)
  }
}

/**
 * Represents a user defined enum PostgreSQL column.
 *
 * @member {Schema} schema
 * @member {string} name
 * @member {string[]} variants
 */
export class Enum {
  constructor ({ _oid, schema, name, variants }) {
    this._oid = _oid
    this.schema = schema
    this.name = name
    this.variants = variants
  }
}
