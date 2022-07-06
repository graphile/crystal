SAVEPOINT graphql_mutation

with __local_0__ as (
  update "pg11"."types" set "regrole" = $1,
  "regnamespace" = $2,
  "bigint_domain_array_domain" = array[$3,
  $4,
  $5]::"c"."_bigint_domain",
  "domain_constrained_compound_type" = row(
    $6::"pg_catalog"."int4",
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  )::"c"."compound_type"
  where (
    "id" = $7
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"pg11"."types"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'regrole'::text,
      (__local_0__."regrole"),
      'regnamespace'::text,
      (__local_0__."regnamespace"),
      'bigintDomainArrayDomain'::text,
      (
        case when (__local_0__."bigint_domain_array_domain") is null then null else array(
          select (val)::text
          from unnest((__local_0__."bigint_domain_array_domain")) as unnest(val)
        ) end
      ),
      'domainConstrainedCompoundType'::text,
      (__local_0__."domain_constrained_compound_type")
    )
  )
) as "@type"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "pg11"."types" (
    "regrole",
    "regnamespace",
    "bigint_domain_array_domain",
    "domain_constrained_compound_type"
  ) values(
    $1,
    $2,
    array[$3,
    $4,
    $5]::"c"."_bigint_domain",
    row(
      $6::"pg_catalog"."int4",
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL
    )::"c"."compound_type"
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"pg11"."types"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'regrole'::text,
      (__local_0__."regrole"),
      'regnamespace'::text,
      (__local_0__."regnamespace"),
      'bigintDomainArrayDomain'::text,
      (
        case when (__local_0__."bigint_domain_array_domain") is null then null else array(
          select (val)::text
          from unnest((__local_0__."bigint_domain_array_domain")) as unnest(val)
        ) end
      ),
      'domainConstrainedCompoundType'::text,
      (__local_0__."domain_constrained_compound_type")
    )
  )
) as "@type"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation