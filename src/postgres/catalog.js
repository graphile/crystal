import { flatten, camelCase, upperFirst } from 'lodash'
import sql from 'sql'

const replaceInsideUnderscores = (string, replacer) => {
  const [, start, substring, finish] = /^(_*)(.*?)(_*)$/.exec(string)
  return `${start}${replacer(substring)}${finish}`
}

const camelCaseInsideUnderscores = string => replaceInsideUnderscores(string, camelCase)

const pascalCaseInsideUnderscores = string => replaceInsideUnderscores(
  string,
  substring => upperFirst(camelCase(substring))
)

/**
 * A catalog of all objects relevant in the database to PostGraphQL.
 *
 * The `Catalog` class also contains a `pgConfig` object which allows it to
 * acquire clients from the `pg` connection pool at will.
 *
 * @member {Object} pgConfig
 * @member {Schema[]} schemas
 * @member {ForeignKey[]} foreignKeys
 */
export class Catalog {
  schemas = []
  foreignKeys = []

  constructor ({ pgConfig }) {
    this.pgConfig = pgConfig
  }

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

  /**
   * Gets a procedure in a schema.
   *
   * @param {string} schemaName
   * @param {string} procedureName
   * @returns {?Procedure}
   */
  getProcedure (schemaName, procedureName) {
    return this.getSchema(schemaName).getProcedure(procedureName)
  }
}

/**
 * Represents a PostgreSQL schema.
 *
 * @member {number} oid
 * @member {Catalog} catalog
 * @member {string} name
 * @member {string} description
 * @member {Table[]} tables
 * @member {Enum[]} enums
 * @member {Procedure[]} procedures
 */
export class Schema {
  tables = []
  enums = []
  procedures = []

  constructor ({ oid, catalog, name, description }) {
    this.oid = oid
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
   * Return all of our columns in all of our tables.
   *
   * @returns {Column[]}
   */
  getAllColumns () {
    return flatten(this.tables.map(table => table.getAllColumns()))
  }

  /**
   * Gets a procedure in this schema.
   *
   * @param {string} procedureName
   * @returns {?Procedure}
   */
  getProcedure (procedureName) {
    return this.procedures.find(({ name }) => name === procedureName)
  }
}

/**
 * Represents a PostgreSQL table.
 *
 * @member {number} oid
 * @member {Schema} schema
 * @member {string} name
 * @member {string} description
 * @member {Column[]} columns
 */
export class Table {
  columns = []

  constructor ({ oid, schema, name, description }) {
    this.oid = oid
    this.schema = schema
    this.name = name
    this.description = description
  }

  getFieldName () {
    return camelCaseInsideUnderscores(this.name)
  }

  getTypeName () {
    return pascalCaseInsideUnderscores(this.name)
  }

  getMarkdownTypeName () {
    return `\`${this.getTypeName()}\``
  }

  /**
   * Returns a table type from the `sql` module based off of this table. This
   * is so we can use the superior capabilities of the `sql` module to
   * construct SQL queries with our table type.
   *
   * @returns {SqlTable}
   */
  sql () {
    return sql.define({
      schema: this.schema.name,
      name: this.name,
      columns: this.columns.map(({ name }) => name),
    })
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
   * Return all of our column.
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
   * @returns {ForeignKey[]}
   */
  getForeignKeys () {
    return this.schema.catalog.foreignKeys.filter(({ nativeTable }) => this === nativeTable)
  }

  /**
   * Gets foreign keys in the opposite direction for this table.
   *
   * @returns {ForeignKey[]}
   */
  getReverseForeignKeys () {
    return this.schema.catalog.foreignKeys.filter(({ foreignTable }) => this === foreignTable)
  }
}

/**
 * Represents a PostgreSQL column.
 *
 * @member {number} num
 * @member {Table} table
 * @member {string} name
 * @member {string} description
 * @member {Type} type
 * @member {boolean} isNullable
 * @member {boolean} isPrimaryKey
 * @member {boolean} hasDefault
 */
export class Column {
  constructor ({
    num,
    table,
    name,
    description,
    type,
    isNullable = true,
    isPrimaryKey,
    hasDefault = false,
  }) {
    this.num = num
    this.table = table
    this.name = name
    this.description = description
    this.type = type
    this.isNullable = isNullable
    this.isPrimaryKey = isPrimaryKey
    this.hasDefault = hasDefault
  }

  getFieldName () {
    // There is a conflict with the `Node` interface. Therefore we need to alias `rowId`.
    if (this.name === 'id')
      return 'rowId'

    return camelCaseInsideUnderscores(this.name)
  }

  getMarkdownFieldName () {
    return `\`${this.getFieldName()}\``
  }
}

/**
 * Represents a type defined in a PostgreSQL database.
 *
 * @member {number} oid
 */
export class Type {
  constructor (oid) {
    this.oid = oid
  }
}

/**
 * Represents a user defined enum PostgreSQL column.
 *
 * @member {number} oid
 * @member {Schema} schema
 * @member {string} name
 * @member {string[]} variants
 */
export class Enum extends Type {
  isEnum = true

  constructor ({ oid, schema, name, variants }) {
    super(oid)
    this.schema = schema
    this.name = name
    this.variants = variants
  }
}

/**
 * A foreign key describing a reference between one table and another.
 *
 * @member {Catalog} catalog
 * @member {Table} nativeTable
 * @member {Column[]} nativeColumns
 * @member {Table} foreignTable
 * @member {Column[]} foreignColumns
 */
export class ForeignKey {
  constructor ({ catalog, nativeTable, nativeColumns, foreignTable, foreignColumns }) {
    this.catalog = catalog
    this.nativeTable = nativeTable
    this.nativeColumns = nativeColumns
    this.foreignTable = foreignTable
    this.foreignColumns = foreignColumns
  }
}

/**
 * A user defined remote procedure in PostgreSQL which can be called by
 * PostGraphQL.
 *
 * @member {Schema} schema
 * @member {string} name
 * @member {boolean} isMutation
 * @member {boolean} isStrict
 * @member {number[]} argTypes
 * @member {string[]} argNames
 * @member {number} returnType
 * @member {boolean} returnsSet
 */
export class Procedure {
  constructor ({
    schema,
    name,
    isMutation,
    isStrict,
    argTypes,
    argNames,
    returnType,
    returnsSet,
  }) {
    this.schema = schema
    this.name = name
    this.isMutation = isMutation
    this.isStrict = isStrict
    this.argTypes = argTypes
    this.argNames = argNames
    this.returnType = returnType
    this.returnsSet = returnsSet
  }
}
