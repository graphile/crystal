import { memoize, assign } from 'lodash'
import Promise from 'bluebird'
import pg from 'pg'
import { Catalog, Schema, Table, Column, Enum, ForeignKey } from './catalog.js'

const getRawSchemas = memoize(client =>
  client.queryAsync(`
    select
      n.oid as "_oid",
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
      c.oid as "_oid",
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
      a.attnum as "_num",
      n.nspname as "schemaName",
      c.relname as "tableName",
      a.attname as "name",
      d.description as "description",
      a.atttypid as "type",
      not(a.attnotnull) as "isNullable",
      cp.oid is not null as "isPrimaryKey",
      a.atthasdef as "hasDefault"
    from
      pg_catalog.pg_attribute as a
      left join pg_catalog.pg_class as c on c.oid = a.attrelid
      left join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
      left join pg_catalog.pg_description as d on d.objoid = c.oid and d.objsubid = a.attnum
      left join pg_catalog.pg_constraint as cp on
        cp.contype = 'p' and
        cp.conrelid = a.attrelid and
        cp.conkey::int[] @> array[a.attnum::int]
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

const getRawForeignKeys = memoize(client =>
  client.queryAsync(`
    select
      c.conrelid as "nativeTableOid",
      c.conkey as "nativeColumnNums",
      c.confrelid as "foreignTableOid",
      c.confkey as "foreignColumnNums"
    from
      pg_catalog.pg_constraint as c
    where
      c.contype = 'f'
  `)
  .then(({ rows }) => rows)
)

/**
 * Gets an instance of `Catalog` for the given PostgreSQL configuration.
 *
 * @param {Object} pgConfig
 * @returns {Catalog}
 */
const getCatalog = async pgConfig => {
  const client = await pg.connectAsync(pgConfig)
  const catalog = new Catalog({ pgConfig })
  const schemas = await getSchemas(client, catalog)
  catalog.schemas = schemas
  const foreignKeys = await getForeignKeys(client, catalog)
  catalog.foreignKeys = foreignKeys
  client.end()
  return catalog
}

export default getCatalog

const getSchemas = (client, catalog) =>
  // Get the raw schemas.
  getRawSchemas(client)
  .map(row => new Schema({ catalog, ...row }))
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
  .map(row => new Table({ schema, ...row }))
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
  .map(row => new Column({ table, ...row }))

const getEnums = (client, schema) =>
  getRawEnums(client)
  .filter(({ schemaName }) =>
    schema.name === schemaName
  )
  .map(row => new Enum({ schema, ...row }))

const getForeignKeys = (client, catalog) =>
  getRawForeignKeys(client)
  .map(({ nativeTableOid, nativeColumnNums, foreignTableOid, foreignColumnNums }) => {
    const nativeTable = catalog.getAllTables().find(({ _oid }) => _oid === nativeTableOid)
    const foreignTable = catalog.getAllTables().find(({ _oid }) => _oid === foreignTableOid)

    return new ForeignKey({
      catalog,
      nativeTable,
      foreignTable,
      nativeColumns: nativeColumnNums.map(num => nativeTable.columns.find(({ _num }) => _num === num)),
      foreignColumns: foreignColumnNums.map(num => foreignTable.columns.find(({ _num }) => _num === num)),
    })
  })
