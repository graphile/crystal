SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "c"."person"
  where (
    "id" = $1
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
    str::"c"."person"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation