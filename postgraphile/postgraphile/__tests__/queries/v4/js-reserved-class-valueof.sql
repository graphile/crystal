select __material_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __material_identifiers__,
lateral (
  select
    __material__."class" as "0",
    __material__."valueof" as "1",
    __material__."id"::text as "2",
    __material_identifiers__.idx as "3"
  from "js_reserved"."material" as __material__
  where (
    __material__."class" = __material_identifiers__."id0"
  )
  order by __material__."id" asc
) as __material_result__;

select __material_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __material_identifiers__,
lateral (
  select
    __material__."class" as "0",
    __material__."valueof" as "1",
    __material__."id"::text as "2",
    __material_identifiers__.idx as "3"
  from "js_reserved"."material" as __material__
  where (
    __material__."valueof" = __material_identifiers__."id0"
  )
  order by __material__."id" asc
) as __material_result__;

select
  __material__."valueof" as "0",
  __material__."class" as "1",
  __material__."id"::text as "2"
from "js_reserved"."material" as __material__
order by __material__."id" asc;