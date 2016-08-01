-- ## Parameters
-- - `$1`: An array of strings that represent the namespaces we are
--   introspecting.
with
  namespace as (
    select
      'namespace' as "kind",
      nsp.oid as "id",
      nsp.nspname as "name",
      dsc.description as "description"
    from
      pg_catalog.pg_namespace as nsp
      left join pg_catalog.pg_description as dsc on dsc.objoid = nsp.oid
    where
      nsp.nspname = any ($1)
  ),
  class as (
    select
      'class' as "kind",
      rel.oid as "id",
      rel.relname as "name",
      dsc.description as "description",
      rel.relnamespace as "namespaceId",
      rel.reltype as "typeId",
      -- Here we determine whether or not we can use this class in a
      -- `SELECT`’s `FROM` clause. In order to determine this we look at them
      -- `relkind` column, if it is `i` (index) or `c` (composite), we cannot
      -- select this class. Otherwise we can.
      rel.relkind not in ('i', 'c') as "isSelectable",
      -- Here we are determining whether we can insert/update/delete a class.
      -- This is helpful as it lets us detect non-updatable views and then
      -- exclude them from being inserted/updated/deleted into. For more info
      -- on how `pg_catalog.pg_relation_is_updatable` works:
      --
      -- - https://www.postgresql.org/message-id/CAEZATCV2_qN9P3zbvADwME_TkYf2gR_X2cLQR4R+pqkwxGxqJg@mail.gmail.com
      -- - https://github.com/postgres/postgres/blob/2410a2543e77983dab1f63f48b2adcd23dba994e/src/backend/utils/adt/misc.c#L684
      -- - https://github.com/postgres/postgres/blob/3aff33aa687e47d52f453892498b30ac98a296af/src/backend/rewrite/rewriteHandler.c#L2351
      (pg_catalog.pg_relation_is_updatable(rel.oid, true)::bit(8) & B'00010000') = B'00010000' as "isInsertable",
      (pg_catalog.pg_relation_is_updatable(rel.oid, true)::bit(8) & B'00001000') = B'00001000' as "isUpdatable",
      (pg_catalog.pg_relation_is_updatable(rel.oid, true)::bit(8) & B'00000100') = B'00000100' as "isDeletable"
    from
      pg_catalog.pg_class as rel
      left join pg_catalog.pg_description as dsc on dsc.objoid = rel.oid and dsc.objsubid = 0
    where
      rel.relnamespace in (select "id" from namespace) and
      rel.relpersistence in ('p') and
      rel.relkind in ('r', 'v', 'm', 'c', 'f')
  ),
  attribute as (
    select
      'attribute' as "kind",
      att.attrelid as "classId",
      att.attnum as "num",
      att.attname as "name",
      dsc.description as "description",
      att.atttypid as "typeId",
      att.attnotnull as "isNotNull",
      att.atthasdef as "hasDefault"
    from
      pg_catalog.pg_attribute as att
      left join pg_catalog.pg_description as dsc on dsc.objoid = att.attrelid and dsc.objsubid = att.attnum
    where
      att.attrelid in (select "id" from class) and
      att.attnum > 0
    order by
      att.attrelid, att.attnum
  ),
  type as (
    -- Use another `WITH` statement here, because our `WHERE` clause will need
    -- to use it.
    with type_all as (
      select
        'type' as "kind",
        typ.oid as "id",
        typ.typname as "name",
        dsc.description as "description",
        typ.typnamespace as "namespaceId",
        typ.typtype as "type",
        typ.typcategory as "category",
        typ.typnotnull as "isNotNull",
        nullif(typ.typelem, 0) as "itemId",
        nullif(typ.typrelid, 0) as "classId",
        nullif(typ.typbasetype, 0) as "baseTypeId",
        -- If this type is an enum type, let’s select all of its enum variants.
        case
          when typ.typtype = 'e' then array(
            select enm.enumlabel
            from pg_catalog.pg_enum as enm
            where enm.enumtypid = typ.oid
            order by enm.enumsortorder
          )
          else null
        end as "enumVariants"
      from
        pg_catalog.pg_type as typ
        left join pg_catalog.pg_description as dsc on dsc.objoid = typ.oid
    )
    select
      *
    from
      type_all as typ
    where
      typ.id in (select "typeId" from class) or
      typ.id in (select "typeId" from attribute) or
      -- If this type is a base type for *any* domain type, we will include it
      -- in our selection. This may mean we fetch more types than we need, but
      -- the alternative is to do some funky SQL recursion which would be hard
      -- code to read. So we prefer code readability over selecting like 3 or
      -- 4 less type rows.
      typ.id in (select "baseTypeId" from type_all)
  )
select to_json(namespace.*) as object from namespace
union all
select to_json(class.*) as object from class
union all
select to_json(attribute.*) as object from attribute
union all
select to_json(type.*) as object from type
;
