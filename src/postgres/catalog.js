import { once, camelCase, upperFirst } from 'lodash'

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
 */
export class Catalog {
  _schemas = new Map()
  _tables = new Map()
  _columns = new Map()
  _types = new Map()
  _enums = new Map()
  _foreignKeys = []
  _procedures = new Map()

  addSchema (schema) {
    this._schemas.set(schema.name, schema)
  }

  getSchema (s) {
    return this._schemas.get(s)
  }

  addTable (table) {
    this._tables.set(`${table.schema.name}.${table.name}`, table)
  }

  getTable (s, t) {
    return this._tables.get(`${s}.${t}`)
  }

  addColumn (column) {
    this._columns.set(`${column.table.schema.name}.${column.table.name}.${column.name}`, column)
  }

  getColumn (s, t, c) {
    return this._columns.get(`${s}.${t}.${c}`)
  }

  addType (type) {
    this._types.set(type.id, type)
  }

  getType (typeId) {
    if (!this._types.has(typeId)) this._types.set(typeId, new Type(typeId))
    return this._types.get(typeId)
  }

  addEnum (enum_) {
    this._enums.set(`${enum_.schema.name}.${enum_.name}`, enum_)
    this.addType(enum_)
  }

  getEnum (s, e) {
    return this._enums.get(`${s}.${e}`)
  }

  addForeignKey (foreignKey) {
    this._foreignKeys.push(foreignKey)
  }

  addProcedure (procedure) {
    this._procedures.set(`${procedure.schema.name}.${procedure.name}`, procedure)
  }

  getProcedure (s, p) {
    return this._procedures.get(`${s}.${p}`)
  }
}

/**
 * Represents a PostgreSQL schema.
 *
 * @member {Catalog} catalog
 * @member {string} name
 * @member {string} description
 * @member {Table[]} tables
 */
export class Schema {
  constructor ({ catalog, name, description }) {
    this.catalog = catalog
    this.name = name
    this.description = description
  }

  getTables = once(() => {
    const tables = []
    for (const [, table] of this.catalog._tables.entries())
      if (table.schema === this) tables.push(table)
    return tables
  })

  getProcedures = once(() => {
    const procedures = []
    for (const [, procedure] of this.catalog._procedures.entries())
      if (procedure.schema === this) procedures.push(procedure)
    return procedures
  })
}

/**
 * Represents a PostgreSQL table.
 *
 * @member {Schema} schema
 * @member {string} name
 * @member {string} description
 * @member {Column[]} columns
 * @member {ForeignKey[]} foreignKeys
 * @member {ForeignKey[]} reverseForeignKeys
 */
export class Table {
  constructor ({ schema, name, description }) {
    this.schema = schema
    this.name = name
    this.description = description
  }

  getColumns = once(() => {
    const columns = []
    for (const [, column] of this.schema.catalog._columns.entries())
      if (column.table === this) columns.push(column)
    return columns
  })

  getPrimaryKeys = once(() => {
    return this.getColumns().filter(({ isPrimaryKey }) => isPrimaryKey)
  })

  getForeignKeys = once(() => {
    return this.schema.catalog._foreignKeys.filter(({ nativeTable }) => nativeTable === this)
  })

  getReverseForeignKeys = once(() => {
    return this.schema.catalog._foreignKeys.filter(({ foreignTable }) => foreignTable === this)
  })

  getFieldName () {
    return camelCaseInsideUnderscores(this.name)
  }

  getTypeName () {
    return pascalCaseInsideUnderscores(this.name)
  }

  getMarkdownTypeName () {
    return `\`${this.getTypeName()}\``
  }
}

/**
 * Represents a PostgreSQL column.
 *
 * @member {Table} table
 * @member {string} name
 * @member {string} description
 * @member {number} num
 * @member {Type} type
 * @member {boolean} isNullable
 * @member {boolean} isPrimaryKey
 * @member {boolean} hasDefault
 */
export class Column {
  constructor ({
    table,
    name,
    description,
    num,
    type,
    isNullable = true,
    isPrimaryKey,
    hasDefault = false,
  }) {
    this.table = table
    this.name = name
    this.description = description
    this.num = num
    this.type = type
    this.isNullable = isNullable
    this.isPrimaryKey = isPrimaryKey
    this.hasDefault = hasDefault
  }

  getFieldName () {
    // There is a conflict with the `Node` interface. Therefore we need to alias `rowId`.
    if (this.name === 'id') return 'rowId'
    return camelCaseInsideUnderscores(this.name)
  }

  getMarkdownFieldName () {
    return `\`${this.getFieldName()}\``
  }
}

/**
 * Represents a type defined in a PostgreSQL database.
 *
 * @member {number} id
 */
export class Type {
  constructor (id) {
    this.id = id
  }
}

/**
 * Represents a user defined enum PostgreSQL column.
 *
 * @member {Schema} schema
 * @member {string} name
 * @member {string[]} variants
 */
export class Enum extends Type {
  isEnum = true

  constructor ({ id, schema, name, variants }) {
    super(id)
    this.schema = schema
    this.name = name
    this.variants = variants
  }
}

/**
 * Represents a composite PostgreSQL table type.
 *
 * @member {Table} table
 */
export class TableType extends Type {
  isTableType = true

  constructor ({ id, table }) {
    super(id)
    this.table = table
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
  constructor ({ nativeTable, nativeColumns, foreignTable, foreignColumns }) {
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
 * @member {boolean} returnsSet
 * @member {Map.<string, Type>} args
 * @member {Type} returnType
 */
export class Procedure {
  constructor ({
    schema,
    name,
    description,
    isMutation = true,
    isStrict = false,
    returnsSet = false,
    args = new Map(),
    returnType,
  }) {
    this.schema = schema
    this.name = name
    this.description = description
    this.isMutation = isMutation
    this.isStrict = isStrict
    this.returnsSet = returnsSet
    this.args = args
    this.returnType = returnType
  }

  hasTableArg () {
    return Boolean(Array.from(this.args).find(([, type]) => type.isTableType))
  }

  getFieldName () {
    return camelCaseInsideUnderscores(this.name)
  }

  getMarkdownFieldName () {
    return `\`${this.getFieldName()}\``
  }
}
