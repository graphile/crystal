import { flatten, memoize, assign } from 'lodash'
import Promise from 'bluebird'

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

  constructor ({ catalog, name, description }) {
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

  constructor ({ schema, name, description }) {
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
   * Gets the primary key columns for this table. If there is no primary key
   * this will return an array with a length of 0.
   *
   * @returns {Column[]}
   */
  getPrimaryKeyColumns () {
    return this.columns.filter(({ isPrimaryKey }) => isPrimaryKey)
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
  constructor ({ table, name, description, type, isNullable = true, isPrimaryKey }) {
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
 * @member {number} oid
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

const getRawSchemas = memoize(client =>
  client.queryAsync(`
    select
      n.nspname as "name",
      d.description as "description"
    from
      pg_catalog.pg_namespace as n
      left join pg_catalog.pg_description as d on d.objoid = n.oid and d.objsubid = 0
    where
      n.nspname not in ('pg_catalog', 'information_schema')
  `)
  .then(({ rows }) => rows)
)

/*
 * Selects rows for things to be treated as tables by PostGraphQL.
 *
 * Note that the `relkind in (…)` expression in the where clause of the
 * statement filters for the following:
 *
 * - 'r': Tables.
 * - 'v': Views.
 * - 'm': Materialized views.
 * - 'f': Foreign tables.
 */
const getRawTables = memoize(client =>
  client.queryAsync(`
    select
      n.nspname as "schemaName",
      c.relname as "name",
      d.description as "description"
    from
      pg_catalog.pg_class as c
      left join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
      left join pg_catalog.pg_description as d on d.objoid = c.oid and d.objsubid = 0
    where
      n.nspname not in ('pg_catalog', 'information_schema') and
      c.relkind in ('r', 'v', 'm', 'f')
  `)
  .then(({ rows }) => rows)
)

const getRawColumns = memoize(client =>
  client.queryAsync(`
    select
      n.nspname as "schemaName",
      c.relname as "tableName",
      a.attname as "name",
      d.description as "description",
      a.atttypid as "type",
      not(a.attnotnull) as "isNullable",
      cp.oid is not null as "isPrimaryKey"
    from
      pg_catalog.pg_attribute as a
      left join pg_catalog.pg_class as c on c.oid = a.attrelid
      left join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
      left join pg_catalog.pg_description as d on d.objoid = c.oid and d.objsubid = a.attnum
      left join pg_catalog.pg_constraint as cp on
        cp.conrelid = a.attrelid and
        cp.conkey @> array[a.attnum] and
        cp.contype = 'p'
    where
      n.nspname not in ('pg_catalog', 'information_schema') and
      c.relkind in ('r', 'v', 'm', 'f') and
      a.attnum > 0 and
      not a.attisdropped
    order by
      n.nspname, c.relname, a.attnum;
  `)
  .then(({ rows }) => rows)
)

const getRawEnums = memoize(client =>
  client.queryAsync(`
    select
      t.oid as "_oid",
      n.nspname as "schemaName",
      t.typname as "name",
      array(
        select
          e.enumlabel::text
        from
          pg_catalog.pg_enum as e
        where
          e.enumtypid = t.oid
      ) as "variants"
    from
      pg_catalog.pg_type as t
      left join pg_catalog.pg_namespace as n on n.oid = t.typnamespace
    where
      t.typtype = 'e';
  `)
  .then(({ rows }) => rows)
)

/**
 * Gets an instance of `Catalog` for the given PostgreSQL configuration.
 *
 * @param {Client} client
 * @returns {Catalog}
 */
const getCatalog = async client =>
  Promise
  .resolve(new Catalog())
  .then(catalog =>
    getSchemas(client, catalog)
    .then(schemas => assign(catalog, { schemas }))
  )

export default getCatalog

const getSchemas = (client, catalog) =>
  // Get the raw schemas.
  getRawSchemas(client)
  .map(({ name, description }) => new Schema({
    catalog,
    name,
    description,
  }))
  // Get tables, set the tables property, return schema so that it is what
  // actually gets resolved.
  .map(schema =>
    Promise.join(
      getTables(client, schema),
      getEnums(client, schema),
      (tables, enums) => assign(schema, { tables, enums })
    )
  )

const getTables = (client, schema) =>
  // Get the raw tables. This function is cached because `getTables` will be
  // called once for every `schema`.
  getRawTables(client)
  // Only get tables for the passed `schema`.
  .filter(({ schemaName }) =>
    schema.name === schemaName
  )
  .map(({ name, description }) => new Table({
    schema,
    name,
    description,
  }))
  // Get columns, set the columns property, return table so that it is what
  // actually gets resolved.
  .map(table =>
    Promise.join(
      getColumns(client, table),
      columns => assign(table, { columns })
    )
  )

const getColumns = (client, table) =>
  // Get the raw columns. This function is cached because `getColumns` will be
  // called once for every `table`.
  getRawColumns(client)
  .filter(({ schemaName, tableName }) =>
    table.schema.name === schemaName &&
    table.name === tableName
  )
  .map(({ name, description, type, isNullable, isPrimaryKey }) =>
    new Column({
      table,
      name,
      description,
      type,
      isNullable,
      isPrimaryKey,
    })
  )

const getEnums = (client, schema) =>
  getRawEnums(client)
  .filter(({ schemaName }) =>
    schema.name === schemaName
  )
  .map(({ _oid, name, variants }) =>
    new Enum({
      _oid,
      schema,
      name,
      variants,
    })
  )
