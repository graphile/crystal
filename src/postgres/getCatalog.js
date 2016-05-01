import { compact, ary } from 'lodash'
import pg from 'pg'

import {
  Catalog,
  Schema,
  Table,
  Column,
  Enum,
  ForeignKey,
  Procedure,
} from './catalog.js'

const withClient = fn => async pgConfig => {
  const client = await pg.connectAsync(pgConfig)
  const result = await fn(client)
  client.end()
  return result
}

/**
 * Gets an instance of `Catalog` for the given PostgreSQL configuration.
 *
 * @param {Object} pgConfig
 * @returns {Catalog}
 */
const getCatalog = withClient(async client => {
  const catalog = new Catalog()
  await addSchemas(client, catalog)
  await addEnumTypes(client, catalog)
  await addTables(client, catalog)
  await addColumns(client, catalog)
  await addForeignKeys(client, catalog)
  await addProcedures(client, catalog)
  return catalog
})

export default getCatalog

const addSchemas = (client, catalog) =>
  client.queryAsync(`
    select
      n.nspname as "name",
      d.description as "description"
    from
      pg_catalog.pg_namespace as n
      left join pg_catalog.pg_description as d on d.objoid = n.oid and d.objsubid = 0
    where
      n.nspname not in ('pg_catalog', 'information_schema');
  `)
  .then(({ rows }) => rows)
  .map(row => new Schema({ ...row, catalog }))
  .each(schema => catalog.addSchema(schema))

const addTables = (client, catalog) =>
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
      c.relkind in ('r', 'v', 'm', 'f');
  `)
  .then(({ rows }) => rows)
  .map(row => new Table({
    ...row,
    schema: catalog.getSchema(row.schemaName),
  }))
  .each(table => catalog.addTable(table))

const addColumns = (client, catalog) =>
  client.queryAsync(`
    select
      n.nspname as "schemaName",
      c.relname as "tableName",
      a.attname as "name",
      d.description as "description",
      a.attnum as "num",
      a.atttypid as "typeId",
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
        cp.conkey @> array[a.attnum]
    where
      n.nspname not in ('pg_catalog', 'information_schema') and
      c.relkind in ('r', 'v', 'm', 'f') and
      a.attnum > 0 and
      not a.attisdropped
    order by
      n.nspname, c.relname, a.attnum;
  `)
  .then(({ rows }) => rows)
  .map(row => new Column({
    ...row,
    table: catalog.getTable(row.schemaName, row.tableName),
    type: catalog.getType(row.typeId),
  }))
  .each(column => catalog.addColumn(column))

const addEnumTypes = (client, catalog) =>
  client.queryAsync(`
    select
      t.oid as "id",
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
      n.nspname not in ('pg_catalog', 'information_schema') and
      t.typtype = 'e';
  `)
  .then(({ rows }) => rows)
  .map(row => new Enum({
    ...row,
    schema: catalog.getSchema(row.schemaName),
  }))
  .each(type => catalog.addEnum(type))

const addForeignKeys = (client, catalog) =>
  client.queryAsync(`
    select
      nn.nspname as "nativeSchemaName",
      cn.relname as "nativeTableName",
      c.conkey as "nativeColumnNums",
      nf.nspname as "foreignSchemaName",
      cf.relname as "foreignTableName",
      c.confkey as "foreignColumnNums"
    from
      pg_catalog.pg_constraint as c
      left join pg_catalog.pg_class as cn on cn.oid = c.conrelid
      left join pg_catalog.pg_class as cf on cf.oid = c.confrelid
      left join pg_catalog.pg_namespace as nn on nn.oid = cn.relnamespace
      left join pg_catalog.pg_namespace as nf on nf.oid = cf.relnamespace
    where
      nn.nspname not in ('pg_catalog', 'information_schema') and
      nf.nspname not in ('pg_catalog', 'information_schema') and
      c.contype = 'f'
    order by
      nn.nspname, cn.relname, nf.nspname, cf.relname, c.conkey, c.confkey;
  `)
  .then(({ rows }) => rows)
  .map(({
    nativeSchemaName,
    nativeTableName,
    nativeColumnNums,
    foreignSchemaName,
    foreignTableName,
    foreignColumnNums,
  }) => {
    const nativeTable = catalog.getTable(nativeSchemaName, nativeTableName)
    const foreignTable = catalog.getTable(foreignSchemaName, foreignTableName)
    const nativeColumns = nativeTable.getColumns()
    const foreignColumns = foreignTable.getColumns()
    return new ForeignKey({
      nativeTable,
      foreignTable,
      nativeColumns: nativeColumnNums.map(colNum => nativeColumns.find(({ num }) => num === colNum)),
      foreignColumns: foreignColumnNums.map(colNum => foreignColumns.find(({ num }) => num === colNum)),
    })
  })
  .each(foreignKey => catalog.addForeignKey(foreignKey))

const addProcedures = (client, catalog) =>
  client.queryAsync(`
    select
      n.nspname as "schemaName",
      p.proname as "name",
      case
        when p.provolatile = 'i' then false
        when p.provolatile = 's' then false
        else true
      end as "isMutation",
      p.proisstrict as "isStrict",
      p.proargtypes as "argTypes",
      p.proargnames as "argNames",
      p.prorettype as "returnType",
      p.proretset as "returnsSet"
    from
      pg_catalog.pg_proc as p
      left join pg_catalog.pg_namespace as n on n.oid = p.pronamespace
      left join pg_catalog.pg_description as d on d.objoid = n.oid and d.objsubid = 0
    where
      n.nspname not in ('pg_catalog', 'information_schema');
  `)
  .then(({ rows }) => rows)
  .map(row => {
    const argTypes = compact(row.argTypes.split(' ').map(ary(parseInt, 1))).map(t => catalog.getType(t))
    const argNames = (row.argNames || Array(argTypes.length).fill(null)).map((n, i) => n || `arg${i + 1}`)
    return new Procedure({
      schema: catalog.getSchema(row.schemaName),
      ...row,
      argTypes,
      argNames,
      returnType: catalog.getType(row.returnType),
    })
  })
  .each(procedure => catalog.addProcedure(procedure))
