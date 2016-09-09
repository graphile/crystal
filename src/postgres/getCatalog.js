import { compact, ary } from 'lodash'
import pg from 'pg'

import {
  Catalog,
  Schema,
  Table,
  Column,
  Enum,
  TableType,
  Domain,
  ForeignKey,
  Procedure,
  Type,
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

  // Not all function calls can be parallelized, because some calls have
  // dependencies on one another. This should probably be cleaned up at some
  // point…

  await addSchemas(client, catalog)
  await addTables(client, catalog)

  await Promise.all([
    addEnumTypes(client, catalog),
    addTableTypes(client, catalog),
    addDomainTypes(client, catalog),
  ])

  await addColumns(client, catalog)

  await Promise.all([
    addForeignKeys(client, catalog),
    addUniqueConstraints(client, catalog),
    addProcedures(client, catalog),
  ])

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
  // Determine any views or other objects that we cannot mutate with
  // pg_relation_is_updatable, more info:
  // https://www.postgresql.org/message-id/CAEZATCV2_qN9P3zbvADwME_TkYf2gR_X2cLQR4R+pqkwxGxqJg@mail.gmail.com
  // https://github.com/postgres/postgres/blob/2410a2543e77983dab1f63f48b2adcd23dba994e/src/backend/utils/adt/misc.c#L684
  // https://github.com/postgres/postgres/blob/3aff33aa687e47d52f453892498b30ac98a296af/src/backend/rewrite/rewriteHandler.c#L2351
  client.queryAsync(`
    select
      n.nspname as "schemaName",
      c.relname as "name",
      d.description as "description",
      case when
           (pg_catalog.pg_relation_is_updatable(c.oid, true)::bit(8) & B'00010000') = B'00010000'
           then true
           else false
      end as "isInsertable",
      case when
           (pg_catalog.pg_relation_is_updatable(c.oid, true)::bit(8) & B'00001000') = B'00001000'
           then true
           else false
      end as "isUpdatable",
      case when
           (pg_catalog.pg_relation_is_updatable(c.oid, true)::bit(8) & B'00000100') = B'00000100'
           then true
           else false
      end as "isDeletable"
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

const addTableTypes = (client, catalog) =>
  client.queryAsync(`
    select
      t.oid as "id",
      n.nspname as "schemaName",
      c.relname as "tableName"
    from
      pg_catalog.pg_type as t
      left join pg_catalog.pg_class as c on c.oid = t.typrelid
      left join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
    where
      n.nspname not in ('pg_catalog', 'information_schema') and
      c.relkind in ('r', 'v', 'm', 'f');
  `)
  .then(({ rows }) => rows)
  .map(row => new TableType({
    ...row,
    table: catalog.getTable(row.schemaName, row.tableName),
  }))
  .each(type => catalog.addType(type))

const addDomainTypes = (client, catalog) =>
    client.queryAsync(`
      with recursive domains as (
        -- select all user defined domains
          select
            t.oid as "id",
            n.nspname as "schemaName",
            t.typname as "name",
            t.typbasetype as "baseType",
            t.typtype as "typtype"
          from
            pg_catalog.pg_type as t
            left join pg_catalog.pg_namespace as n on n.oid = t.typnamespace
          where
            n.nspname not in ('pg_catalog', 'information_schema')
            and t.typtype in ('d')
      ),
      builtin_types as (
        -- select all builtin types
          select
            t.oid as "id",
            n.nspname as "schemaName",
            t.typname as "name",
            t.typbasetype as "baseType",
            t.typtype as "typtype"
          from
            pg_catalog.pg_type as t
            left join pg_catalog.pg_namespace as n on n.oid = t.typnamespace
          where
            n.nspname not in ('information_schema')
            and t.typtype in ('b')
      ),
      domain_or_builtin_type as (
          select *, false as is_builtin
          from domains
            union all
          select *, true as is_builtin
          from builtin_types
      ),
      domains_resolved_basetype as (
        -- begin recursion with user defined domains
        -- each iteration joins to domain_or_builtin_type until we reach a builtin type
        select
          domains."id",
          domains."schemaName",
          domains."name",
          domains."baseType",
          domains."typtype" as "iter_typtype",
          domains."baseType" as "iter_baseType"
        from domains
        join domain_or_builtin_type on domain_or_builtin_type."id" = domains."baseType"
          union all
        select
          domains_resolved_basetype."id",
          domains_resolved_basetype."schemaName",
          domains_resolved_basetype."name",
          domain_or_builtin_type."baseType",
          domain_or_builtin_type."typtype" as "iter_typtype",
          domain_or_builtin_type."id" as "iter_baseType"
        from domains_resolved_basetype
        join domain_or_builtin_type on domain_or_builtin_type."id" = domains_resolved_basetype."baseType"
      )
      select
        "id",
        "schemaName",
        "name",
        "iter_baseType" as "baseType"
      from domains_resolved_basetype
      where "iter_typtype" = 'b';
    `)
    .then(({ rows }) => rows)
    .map(row => new Domain({
      ...row,
      baseType: new Type(row.baseType),
      schema: catalog.getSchema(row.schemaName),
    }))
    .each(type => catalog.addType(type))

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

const addUniqueConstraints = (client, catalog) =>
  client.queryAsync(`
    select
      n.nspname as "schemaName",
      t.relname as "tableName",
      c.conkey as "columnNums"
    from
      pg_catalog.pg_constraint as c
      left join pg_catalog.pg_class as t on t.oid = c.conrelid
      left join pg_catalog.pg_namespace as n on n.oid = t.relnamespace
    where
      n.nspname not in ('pg_catalog', 'information_schema') and
      (c.contype = 'u' or c.contype = 'p');
  `)
  .then(({ rows }) => rows)
  .each(({ schemaName, tableName, columnNums }) => {
    const table = catalog.getTable(schemaName, tableName)
    const allColumns = table.getColumns()
    const columns = columnNums.map(colNum => allColumns.find(({ num }) => num === colNum))
    table._uniqueConstraints.push(columns)
  })

const addProcedures = (client, catalog) =>
  client.queryAsync(`
    select
      n.nspname as "schemaName",
      p.proname as "name",
      d.description as "description",
      case
        when p.provolatile = 'i' then false
        when p.provolatile = 's' then false
        else true
      end as "isMutation",
      p.proisstrict as "isStrict",
      p.proretset as "returnsSet",
      p.proargtypes as "argTypes",
      p.proargnames as "argNames",
      p.prorettype as "returnType"
    from
      pg_catalog.pg_proc as p
      left join pg_catalog.pg_namespace as n on n.oid = p.pronamespace
      left join pg_catalog.pg_description as d on d.objoid = p.oid and d.objsubid = 0
    where
      n.nspname not in ('pg_catalog', 'information_schema');
  `)
  .then(({ rows }) => rows)
  .map(row => {
    // `argTypes` is an `oidvector` type? Which is wierd. So we need to hand
    // parse it.
    //
    // Also maps maintain order so we can use argument order to call functions,
    // yay!
    const argTypes = compact(row.argTypes.split(' ').map(ary(parseInt, 1)))
    const argNames = row.argNames || []
    const args = new Map()

    for (const i in argTypes) {
      const name = argNames[i]
      const type = argTypes[i]
      args.set(name || `arg_${parseInt(i, 10) + 1}`, catalog.getType(type))
    }

    return new Procedure({
      schema: catalog.getSchema(row.schemaName),
      ...row,
      args,
      returnType: catalog.getType(row.returnType),
    })
  })
  .filter(procedure => procedure)
  .each(procedure => catalog.addProcedure(procedure))
