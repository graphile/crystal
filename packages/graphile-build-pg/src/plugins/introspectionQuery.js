// @flow
function makeIntrospectionQuery(
  serverVersionNum: number,
  options: { pgLegacyFunctionsOnly?: boolean } = {}
): string {
  const { pgLegacyFunctionsOnly } = options;
  return `\
-- @see https://www.postgresql.org/docs/9.5/static/catalogs.html
-- @see https://github.com/graphile/postgraphile/blob/master/resources/introspection-query.sql
--
-- ## Parameters
-- - \`$1\`: An array of strings that represent the namespaces we are introspecting.
-- - \`$2\`: set true to include functions/tables/etc that come from extensions
with
  recursive accessible_roles(_oid) as (
    select oid _oid, pg_roles.*
    from pg_roles
    where rolname = current_user
  union all
    select pg_roles.oid _oid, pg_roles.*
    from pg_roles, accessible_roles, pg_auth_members
    where pg_auth_members.roleid = pg_roles.oid
    and pg_auth_members.member = accessible_roles._oid
  ),
  -- @see https://www.postgresql.org/docs/9.5/static/catalog-pg-namespace.html
  namespace as (
    select
      'namespace' as "kind",
      nsp.oid as "id",
      nsp.nspname as "name",
      dsc.description as "description"
    from
      pg_catalog.pg_namespace as nsp
      left join pg_catalog.pg_description as dsc on dsc.objoid = nsp.oid and dsc.classoid = 'pg_catalog.pg_namespace'::regclass
    where
      nsp.nspname = any ($1)
    order by
      nsp.nspname
  ),
  -- Select all of the remote procedures we can use in this schema. This comes
  -- first so that we can select types and classes using the information we get
  -- from it.
  --
  -- @see https://www.postgresql.org/docs/9.6/static/catalog-pg-proc.html
  procedure as (
    select
      'procedure' as "kind",
      pro.oid as "id",
      pro.proname as "name",
      dsc.description as "description",
      pro.pronamespace as "namespaceId",
      nsp.nspname as "namespaceName",
      pro.proisstrict as "isStrict",
      pro.proretset as "returnsSet",
      case
        when pro.provolatile = 'i' then true
        when pro.provolatile = 's' then true
        else false
      end as "isStable",
      pro.prorettype as "returnTypeId",
      coalesce(pro.proallargtypes, pro.proargtypes) as "argTypeIds",
      coalesce(pro.proargmodes, array[]::text[]) as "argModes",
      coalesce(pro.proargnames, array[]::text[]) as "argNames",
      pro.pronargdefaults as "argDefaultsNum",
      pro.procost as "cost",
      exists(select 1 from accessible_roles where has_function_privilege(accessible_roles.oid, pro.oid, 'EXECUTE')) as "aclExecutable"
    from
      pg_catalog.pg_proc as pro
      left join pg_catalog.pg_description as dsc on dsc.objoid = pro.oid and dsc.classoid = 'pg_catalog.pg_proc'::regclass
      left join pg_catalog.pg_namespace as nsp on nsp.oid = pro.pronamespace
    where
      pro.pronamespace in (select "id" from namespace) and
      -- Currently we don’t support functions with variadic arguments. In the
      -- future we may, but for now let’s just ignore functions with variadic
      -- arguments.
      -- TODO: Variadic arguments.
      pro.provariadic = 0 and
      -- Filter our aggregate functions and window functions.
      ${
        serverVersionNum >= 110000
          ? "pro.prokind = 'f'"
          : "pro.proisagg = false and pro.proiswindow = false"
      } and
      ${
        pgLegacyFunctionsOnly
          ? `\
      -- We want to make sure the argument mode for all of our arguments is
      -- \`IN\` which means \`proargmodes\` will be null.
      pro.proargmodes is null and
      -- Do not select procedures that return \`RECORD\` (oid 2249).
      pro.prorettype <> 2249 and`
          : `\
      -- We want to make sure the argument modes for all of our arguments are
      -- \`IN\`, \`OUT\`, \`INOUT\`, or \`TABLE\` (not \`VARIADIC\`).
      (pro.proargmodes is null or pro.proargmodes <@ array['i','o','b','t']::"char"[]) and
      -- Do not select procedures that return \`RECORD\` (oid 2249) unless they
      -- have \`OUT\`, \`INOUT\`, or \`TABLE\` arguments to define the return type.
      (pro.prorettype <> 2249 or pro.proargmodes && array['o','b','t']::"char"[]) and
      -- Do not select procedures that have \`RECORD\` arguments.
      (pro.proallargtypes is null or not (pro.proallargtypes @> array[2249::oid])) and`
      }
      -- Do not select procedures that create range types. These are utility
      -- functions that really don’t need to be exposed in an API.
      pro.proname not in (select typ.typname from pg_catalog.pg_type as typ where typ.typtype = 'r' and typ.typnamespace = pro.pronamespace) and
      -- Do not expose trigger functions (type trigger has oid 2279)
      pro.prorettype <> 2279 and
      -- We don't want functions that will clash with GraphQL (treat them as private)
      pro.proname not like E'\\\\_\\\\_%' and
      -- We also don’t want procedures that have been defined in our namespace
      -- twice. This leads to duplicate fields in the API which throws an
      -- error. In the future we may support this case. For now though, it is
      -- too complex.
      (select count(pro2.*) from pg_catalog.pg_proc as pro2 where pro2.pronamespace = pro.pronamespace and pro2.proname = pro.proname) = 1 and
      ($2 is true or not exists(
        select 1
        from pg_catalog.pg_depend
        where pg_depend.refclassid = 'pg_catalog.pg_extension'::pg_catalog.regclass
        and pg_depend.deptype = 'e'
        and pg_depend.classid = 'pg_catalog.pg_proc'::pg_catalog.regclass
        and pg_depend.objid = pro.oid
      ))
    order by
      pro.pronamespace, pro.proname
  ),
  -- @see https://www.postgresql.org/docs/9.5/static/catalog-pg-class.html
  class as (
    select
      'class' as "kind",
      rel.oid as "id",
      rel.relname as "name",
      rel.relkind as "classKind",
      dsc.description as "description",
      rel.relnamespace as "namespaceId",
      nsp.nspname as "namespaceName",
      rel.reltype as "typeId",
      -- Here we determine whether or not we can use this class in a
      -- \`SELECT\`’s \`FROM\` clause. In order to determine this we look at them
      -- \`relkind\` column, if it is \`i\` (index) or \`c\` (composite), we cannot
      -- select this class. Otherwise we can.
      rel.relkind not in ('i', 'c') as "isSelectable",
      -- Here we are determining whether we can insert/update/delete a class.
      -- This is helpful as it lets us detect non-updatable views and then
      -- exclude them from being inserted/updated/deleted into. For more info
      -- on how \`pg_catalog.pg_relation_is_updatable\` works:
      --
      -- - https://www.postgresql.org/message-id/CAEZATCV2_qN9P3zbvADwME_TkYf2gR_X2cLQR4R+pqkwxGxqJg@mail.gmail.com
      -- - https://github.com/postgres/postgres/blob/2410a2543e77983dab1f63f48b2adcd23dba994e/src/backend/utils/adt/misc.c#L684
      -- - https://github.com/postgres/postgres/blob/3aff33aa687e47d52f453892498b30ac98a296af/src/backend/rewrite/rewriteHandler.c#L2351
      (pg_catalog.pg_relation_is_updatable(rel.oid, true)::bit(8) & B'00010000') = B'00010000' as "isInsertable",
      (pg_catalog.pg_relation_is_updatable(rel.oid, true)::bit(8) & B'00001000') = B'00001000' as "isUpdatable",
      (pg_catalog.pg_relation_is_updatable(rel.oid, true)::bit(8) & B'00000100') = B'00000100' as "isDeletable",
      exists(select 1 from accessible_roles where has_table_privilege(accessible_roles.oid, rel.oid, 'SELECT')) as "aclSelectable",
      exists(select 1 from accessible_roles where has_table_privilege(accessible_roles.oid, rel.oid, 'INSERT')) as "aclInsertable",
      exists(select 1 from accessible_roles where has_table_privilege(accessible_roles.oid, rel.oid, 'UPDATE')) as "aclUpdatable",
      exists(select 1 from accessible_roles where has_table_privilege(accessible_roles.oid, rel.oid, 'DELETE')) as "aclDeletable"
    from
      pg_catalog.pg_class as rel
      left join pg_catalog.pg_description as dsc on dsc.objoid = rel.oid and dsc.objsubid = 0 and dsc.classoid = 'pg_catalog.pg_class'::regclass
      left join pg_catalog.pg_namespace as nsp on nsp.oid = rel.relnamespace
    where
      rel.relpersistence in ('p') and
      -- We don't want classes that will clash with GraphQL (treat them as private)
      rel.relname not like E'\\\\_\\\\_%' and
      rel.relkind in ('r', 'v', 'm', 'c', 'f') and
      ($2 is true or not exists(
        select 1
        from pg_catalog.pg_depend
        where pg_depend.refclassid = 'pg_catalog.pg_extension'::pg_catalog.regclass
        and pg_depend.deptype = 'e'
        and pg_depend.classid = 'pg_catalog.pg_class'::pg_catalog.regclass
        and pg_depend.objid = rel.oid
      ))
    order by
      rel.relnamespace, rel.relname
  ),
  -- @see https://www.postgresql.org/docs/9.5/static/catalog-pg-attribute.html
  attribute as (
    select
      'attribute' as "kind",
      att.attrelid as "classId",
      att.attnum as "num",
      att.attname as "name",
      dsc.description as "description",
      att.atttypid as "typeId",
      nullif(att.atttypmod, -1) as "typeModifier",
      att.attnotnull as "isNotNull",
      att.atthasdef as "hasDefault",
      ${serverVersionNum >= 100000 ? "att.attidentity" : "''"} as "identity",
      exists(select 1 from accessible_roles where has_column_privilege(accessible_roles.oid, att.attrelid, att.attname, 'SELECT')) as "aclSelectable",
      exists(select 1 from accessible_roles where has_column_privilege(accessible_roles.oid, att.attrelid, att.attname, 'INSERT')) as "aclInsertable",
      exists(select 1 from accessible_roles where has_column_privilege(accessible_roles.oid, att.attrelid, att.attname, 'UPDATE')) as "aclUpdatable"
    from
      pg_catalog.pg_attribute as att
      left join pg_catalog.pg_description as dsc on dsc.objoid = att.attrelid and dsc.objsubid = att.attnum and dsc.classoid = 'pg_catalog.pg_class'::regclass
    where
      att.attrelid in (select "id" from class) and
      att.attnum > 0 and
      -- We don't want attributes that will clash with GraphQL (treat them as private)
      att.attname not like E'\\\\_\\\\_%' and
      not att.attisdropped
    order by
      att.attrelid, att.attnum
  ),
  -- @see https://www.postgresql.org/docs/9.5/static/catalog-pg-type.html
  type as (
    -- Use another \`WITH\` statement here, because our \`WHERE\` clause will need
    -- to use it.
    with type_all as (
      select
        'type' as "kind",
        typ.oid as "id",
        typ.typname as "name",
        dsc.description as "description",
        typ.typnamespace as "namespaceId",
        -- We include the namespace name in types only because we select so
        -- many types that are outside of our core set of namespaces. Having
        -- the namespace name is super helpful when generating SQL, so
        -- conditionally having namespace names for types is a pain.
        nsp.nspname as "namespaceName",
        typ.typtype as "type",
        typ.typcategory as "category",
        typ.typnotnull as "domainIsNotNull",
        nullif(typ.typelem, 0) as "arrayItemTypeId",
        typ.typlen as "typeLength",
        (typ.typelem <> 0 and typ.typlen = -1) as "isPgArray",
        nullif(typ.typrelid, 0) as "classId",
        nullif(typ.typbasetype, 0) as "domainBaseTypeId",
        nullif(typ.typtypmod, -1) as "domainTypeModifier",
        -- If this type is an enum type, let’s select all of its enum variants.
        --
        -- @see https://www.postgresql.org/docs/9.5/static/catalog-pg-enum.html
        case
          when typ.typtype = 'e' then array(
            select enm.enumlabel
            from pg_catalog.pg_enum as enm
            where enm.enumtypid = typ.oid
            order by enm.enumsortorder
          )
          else null
        end as "enumVariants",
        -- If this type is a range type, we want to select the sub type of the
        -- range.
        --
        -- @see https://www.postgresql.org/docs/9.6/static/catalog-pg-range.html
        case
          when typ.typtype = 'r' then (
            select rng.rngsubtype
            from pg_catalog.pg_range as rng
            where rng.rngtypid = typ.oid
            limit 1
          )
          else null
        end as "rangeSubTypeId"
      from
        pg_catalog.pg_type as typ
        left join pg_catalog.pg_description as dsc on dsc.objoid = typ.oid and dsc.classoid = 'pg_catalog.pg_type'::regclass
        left join pg_catalog.pg_namespace as nsp on nsp.oid = typ.typnamespace
    )
    select
      *
    from
      type_all as typ
    where
      typ.id in (select "typeId" from class) or
      typ.id in (select "typeId" from attribute) or
      typ.id in (select "returnTypeId" from procedure) or
      typ.id in (select unnest("argTypeIds") from procedure) or
      -- If this type is a base type for *any* domain type, we will include it
      -- in our selection. This may mean we fetch more types than we need, but
      -- the alternative is to do some funky SQL recursion which would be hard
      -- code to read. So we prefer code readability over selecting like 3 or
      -- 4 less type rows.
      --
      -- We also do this for range sub types and array item types.
      typ.id in (select "domainBaseTypeId" from type_all) or
      typ.id in (select "rangeSubTypeId" from type_all) or
      typ.id in (select "arrayItemTypeId" from type_all)
    order by
      "namespaceId", "name"
  ),
  -- @see https://www.postgresql.org/docs/9.5/static/catalog-pg-constraint.html
  "constraint" as (
    select distinct on (con.conrelid, con.conkey, con.confrelid, con.confkey)
      'constraint' as "kind",
      con.oid as "id",
      con.conname as "name",
      con.contype as "type",
      con.conrelid as "classId",
      nullif(con.confrelid, 0) as "foreignClassId",
      dsc.description as "description",
      con.conkey as "keyAttributeNums",
      con.confkey as "foreignKeyAttributeNums"
    from
      pg_catalog.pg_constraint as con
      inner join class on (con.conrelid = class.id)
      left join pg_catalog.pg_description as dsc on dsc.objoid = con.oid and dsc.classoid = 'pg_catalog.pg_constraint'::regclass
    where
      -- Only get constraints for classes we have selected.
      con.conrelid in (select "id" from class where "namespaceId" in (select "id" from namespace)) and
      case
        -- If this is a foreign key constraint, we want to ensure that the
        -- foreign class is also in the list of classes we have already
        -- selected.
        when con.contype = 'f' then con.confrelid in (select "id" from class where "namespaceId" in (select "id" from namespace))
        -- Otherwise, this should be true.
        else true
      end and
      -- We only want foreign key, primary key, and unique constraints. We
      -- made add support for more constraints in the future.
      con.contype in ('f', 'p', 'u')
    order by
      con.conrelid, con.conkey, con.confrelid, con.confkey, con.conname
  ),
  -- @see https://www.postgresql.org/docs/9.5/static/catalog-pg-extension.html
  "extension" as (
    select
      'extension' as "kind",
      ext.oid as "id",
      ext.extname as "name",
      ext.extnamespace as "namespaceId",
      ext.extrelocatable as "relocatable",
      ext.extversion as "version",
      ext.extconfig as "configurationClassIds",
      dsc.description as "description"
    from
      pg_catalog.pg_extension as ext
      left join pg_catalog.pg_description as dsc on dsc.objoid = ext.oid and dsc.classoid = 'pg_catalog.pg_extension'::regclass
    order by
      ext.extname, ext.oid
  ),
  -- @see https://www.postgresql.org/docs/9.5/static/catalog-pg-index.html
  "indexes" as (
    select
      'index' as "kind",
      idx.indexrelid as "id",
      idx_more.relname as "name",
      nsp.nspname as "namespaceName",
      idx.indrelid as "classId",
      idx.indnatts as "numberOfAttributes",
      idx.indisunique as "isUnique",
      idx.indisprimary as "isPrimary",
      idx.indimmediate as "isImmediate", -- enforce uniqueness immediately on insert
      idx.indisreplident as "isReplicaIdentity",
      idx.indisvalid as "isValid", -- if false, don't use for queries
      idx.indkey as "attributeNums",
      ${
        serverVersionNum >= 90600
          ? `\
      (
        select array_agg(pg_index_column_has_property(idx.indexrelid,n::int2,'asc'))
        from unnest(idx.indkey) with ordinality as ord(key,n)
      ) as "attributePropertiesAsc",
      (
        select array_agg(pg_index_column_has_property(idx.indexrelid,n::int2,'nulls_first'))
        from unnest(idx.indkey) with ordinality as ord(key,n)
      ) as "attributePropertiesNullsFirst",`
          : ""
      }
      dsc.description as "description"
    from
      pg_catalog.pg_index as idx
      inner join pg_catalog.pg_class idx_more on (idx.indexrelid = idx_more.oid)
      inner join class on (idx.indrelid = class.id)
      inner join pg_catalog.pg_namespace as nsp on (nsp.oid = idx_more.relnamespace)
      left join pg_catalog.pg_description as dsc on dsc.objoid = idx.indexrelid and dsc.objsubid = 0 and dsc.classoid = 'pg_catalog.pg_class'::regclass
    where
      idx.indislive is not false and
      idx.indisexclusion is not true and -- exclusion index
      idx.indcheckxmin is not true and -- always valid?
      not (string_to_array(idx.indkey::text, ' ')::int2[] @> ARRAY[0::int2]) and -- no expressions
      idx.indpred is null -- no partial index predicate
    order by
      idx.indrelid, idx.indexrelid
  )
select row_to_json(x) as object from namespace as x
union all
select row_to_json(x) as object from class as x
union all
select row_to_json(x) as object from attribute as x
union all
select row_to_json(x) as object from type as x
union all
select row_to_json(x) as object from "constraint" as x
union all
select row_to_json(x) as object from procedure as x
union all
select row_to_json(x) as object from extension as x
union all
select row_to_json(x) as object from indexes as x
;
`;
}

module.exports = {
  makeIntrospectionQuery,
};
