import { memoize, assign } from 'lodash'
import Promise from 'bluebird'
import { Catalog, Schema, Table, Column, Enum } from './objects.js'

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
  .map(({ _oid, name, description }) => new Schema({
    _oid,
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
  .map(({ _oid, name, description }) => new Table({
    _oid,
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
  .map(({ _num, name, description, type, isNullable, isPrimaryKey }) =>
    new Column({
      _num,
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
