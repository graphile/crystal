select
  __books__."id"::text as "0"
from "refs"."books" as __books__
order by __books__."id" asc;

select __people_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __people_identifiers__,
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