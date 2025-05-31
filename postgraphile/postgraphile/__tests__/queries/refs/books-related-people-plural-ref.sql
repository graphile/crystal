select
  __books__."title" as "0",
  __books__."id"::text as "1"
from "refs"."books" as __books__
order by __books__."id" asc;

select __people_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __people_identifiers__,
lateral (
  select
    __people__."name" as "0",
    __people_identifiers__.idx as "1"
  from "refs"."people" as __people__
  inner join (
      select __l1__."person_id" as "0"
      from "refs"."pen_names" as __l1__
      inner join "refs"."book_authors" as __l0__
      on (__l0__."pen_name_id" = __l1__."id")
      where __l0__."book_id" = __people_identifiers__."id0"
    union all
      select __l0__."person_id" as "0"
      from "refs"."book_editors" as __l0__
      where __l0__."book_id" = __people_identifiers__."id0"
  ) as __subquery__
  on (__people__."id" = __subquery__."0")
  order by __people__."id" asc
) as __people_result__;