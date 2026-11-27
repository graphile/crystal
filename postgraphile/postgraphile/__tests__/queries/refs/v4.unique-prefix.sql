select
  __ref_sources__."id"::text as "0",
  (
    select array[
      (
        select array[
          (
            select array[
              __people__."id"::text,
              __people__."name",
              array(
                select array[
                  __posts__."id"::text
                ]::text[]
                from "refs"."posts" as __posts__
                where (
                  __posts__."user_id" = __people__."id"
                )
                order by __posts__."id" asc
              )::text
            ]::text[]
            from "refs"."people" as __people__
            where (
              __people__."id" = __pen_names__."person_id"
            )
          )::text
        ]::text[]
        from "refs"."pen_names" as __pen_names__
        where (
          __pen_names__."id" = __book_authors__."pen_name_id"
        )
      )::text
    ]::text[]
    from "refs"."book_authors" as __book_authors__
    where
      (
        __book_authors__."book_id" = __ref_sources__."source_book"
      ) and (
        __book_authors__."pen_name_id" = __ref_sources__."source_pen"
      )
  )::text as "1"
from "refs"."ref_sources" as __ref_sources__
order by __ref_sources__."id" asc;

with __posts_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids
)
select __posts_result__.*
from __posts_identifiers__,
lateral (
  select
    __posts__."id"::text as "0",
    __posts_identifiers__.idx as "1"
  from "refs"."posts" as __posts__
  where (
    __posts__."user_id" = __posts_identifiers__."id0"
  )
  order by __posts__."id" asc
  limit 2
  offset 1
) as __posts_result__;

with __posts_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids
)
select __posts_result__.*
from __posts_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __posts_identifiers__.idx as "1"
  from "refs"."posts" as __posts__
  where (
    __posts__."user_id" = __posts_identifiers__."id0"
  )
) as __posts_result__;