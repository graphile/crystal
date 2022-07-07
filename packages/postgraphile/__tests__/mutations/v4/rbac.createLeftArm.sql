SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "c"."left_arm" ("length_in_metres") values(
    $1
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
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation