SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "inheritence"."user" (
    "id",
    "name"
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
    str::"inheritence"."user"
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
      'name'::text,
      (__local_0__."name")
    )
  )
) as "@user"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "inheritence"."user_file" (
    "filename",
    "user_id"
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
    str::"inheritence"."user_file"
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
      'filename'::text,
      (__local_0__."filename"),
      '@userByUserId'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_1__."id"),
          'name'::text,
          (__local_1__."name")
        ) as object
        from "inheritence"."user" as __local_1__
        where (__local_0__."user_id" = __local_1__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@userFile"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation