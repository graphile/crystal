select
  __books__."id"::text as "0"
from "refs"."books" as __books__
order by __books__."id" asc;

with __people_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, ids.id0 from rows from (json_to_recordset($1::json) as (id0 "int4")) with ordinality as ids
)
select __people_result__.*
from __people_identifiers__,
lateral (
  select
    __people__."name" as "0",
    __people_identifiers__.idx as "1"
  from "refs"."people" as __people__
  inner join "refs"."book_editors" as __book_editors__
  on (__people__."id" = __book_editors__."person_id")
  where (
    __book_editors__."book_id" = __people_identifiers__."id0"
  )
  order by __people__."id" asc
) as __people_result__;