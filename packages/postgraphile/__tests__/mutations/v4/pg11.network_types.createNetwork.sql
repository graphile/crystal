SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "pg11"."network" (
    "inet",
    "cidr",
    "macaddr",
    "macaddr8"
  ) values(
    $1,
    $2,
    $3,
    $4
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
    str::"pg11"."network"
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
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'inet'::text,
      (__local_0__."inet"),
      'cidr'::text,
      (__local_0__."cidr"),
      'macaddr'::text,
      (__local_0__."macaddr"),
      'macaddr8'::text,
      (__local_0__."macaddr8")
    )
  )
) as "@network"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation