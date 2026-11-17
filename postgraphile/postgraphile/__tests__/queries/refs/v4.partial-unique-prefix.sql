select
  __ref_sources__."id"::text as "0",
  (
    select array[
      __book_authors__."pen_name_id"::text,
      __pen_names__."id"::text
    ]::text[]
    from "refs"."book_authors" as __book_authors__
    left outer join "refs"."pen_names" as __pen_names__
    on (
    /* WHERE becoming ON */ (
      __pen_names__."id" = __book_authors__."pen_name_id"
    ))
    where
      (
        __book_authors__."book_id" = __ref_sources__."source_book"
      ) and (
        __book_authors__."pen_name_id" = __ref_sources__."source_pen"
      )
  )::text as "1"
from "refs"."ref_sources" as __ref_sources__
order by __ref_sources__."id" asc;

with __books_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids
)
select __books_result__.*
from __books_identifiers__,
lateral (
  select
    __books__."title" as "0",
    __books_identifiers__.idx as "1"
  from "refs"."books" as __books__
  inner join "refs"."book_authors" as __book_authors__
  on (__books__."id" = __book_authors__."book_id")
  where (
    __book_authors__."pen_name_id" = __books_identifiers__."id0"
  )
  order by __books__."id" asc
) as __books_result__;

with __books_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids
)
select __books_result__.*
from __books_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __books_identifiers__.idx as "1"
  from "refs"."books" as __books__
  inner join "refs"."book_authors" as __book_authors__
  on (__books__."id" = __book_authors__."book_id")
  where (
    __book_authors__."pen_name_id" = __books_identifiers__."id0"
  )
) as __books_result__;