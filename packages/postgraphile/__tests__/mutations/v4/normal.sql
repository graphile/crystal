SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "b"."authenticate"(
    $1,
    $2,
    $3
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"b"."jwt_token"
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
      'role'::text,
      (__local_0__."role"),
      'exp'::text,
      ((__local_0__."exp"))::text,
      'a'::text,
      (__local_0__."a"),
      'b'::text,
      ((__local_0__."b"))::text,
      'c'::text,
      ((__local_0__."c"))::text
    )
  )
) as "@jwtToken"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation