SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "enum_tables"."referencing_table" (
    "enum_1",
    "enum_2"
  ) values(
    $1,
    $2
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
    str::"enum_tables"."referencing_table"
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
      'enum1'::text,
      (__local_0__."enum_1"),
      'enum2'::text,
      (__local_0__."enum_2"),
      'enum3'::text,
      (__local_0__."enum_3")
    )
  )
) as "@referencingTable"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation