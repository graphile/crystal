SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."left_arm_identity"(
    row(
      $1::"pg_catalog"."int4",
      $2::"pg_catalog"."int4",
      $3::"pg_catalog"."float8",
      $4::"pg_catalog"."text"
    )::"c"."left_arm"
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
    str::"c"."left_arm"
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
      'personId'::text,
      (__local_0__."person_id"),
      'lengthInMetres'::text,
      (__local_0__."length_in_metres"),
      'mood'::text,
      (__local_0__."mood")
    )
  )
) as "@leftArm"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation