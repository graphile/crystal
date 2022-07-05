SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "b"."authenticate_payload"(
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
    str::"b"."auth_payload"
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
      'jwt'::text,
      (
        case when (
          (__local_0__."jwt") is not distinct
          from null
        ) then null else to_json((__local_0__."jwt")) end
      ),
      'id'::text,
      (__local_0__."id"),
      'admin'::text,
      (__local_0__."admin"),
      '@personById'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name")
        ) as object
        from "c"."person" as __local_1__
        where (__local_0__."id" = __local_1__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@authPayload",
to_json(
  (
    select json_build_object(
      'id'::text,
      (__local_2__."id"),
      'name'::text,
      (__local_2__."person_full_name")
    ) as object
    from "c"."person" as __local_2__
    where (__local_0__."id" = __local_2__."id") and (TRUE) and (TRUE)
  )
) as "@personById"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation