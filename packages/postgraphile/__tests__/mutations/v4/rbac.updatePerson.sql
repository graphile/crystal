SAVEPOINT graphql_mutation

with __local_0__ as (
  update "c"."person" set "person_full_name" = $1,
  "aliases" = array[$2,
  $3]::"pg_catalog"."_text",
  "about" = NULL,
  "email" = $4,
  "site" = row(
    $5::"b"."not_null_url"
  )::"b"."wrapped_url"
  where (
    "id" = $6
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
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'name'::text,
      (__local_0__."person_full_name"),
      'aliases'::text,
      (
        case when (__local_0__."aliases") is null then null when coalesce(
          array_length(
            (__local_0__."aliases"),
            1
          ),
          0
        ) = 0 then '[]'::json else (
          select json_agg(__local_1__)
          from unnest((__local_0__."aliases")) as __local_1__
        ) end
      ),
      'about'::text,
      (__local_0__."about"),
      'email'::text,
      (__local_0__."email"),
      'site'::text,
      (
        case when (
          (__local_0__."site") is not distinct
          from null
        ) then null else json_build_object(
          'url'::text,
          (
            (__local_0__."site")."url"
          )
        ) end
      )
    )
  )
) as "@person"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation