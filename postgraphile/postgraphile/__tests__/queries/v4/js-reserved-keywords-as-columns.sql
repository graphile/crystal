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
    __material__."id"::text as "1",
    __material_identifiers__.idx as "2"
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
    __material__."id"::text as "1",
    __material_identifiers__.idx as "2"
  from "js_reserved"."material" as __material__
  where (
    __material__."valueof" = __material_identifiers__."id0"
  )
  order by __material__."id" asc
) as __material_result__;

select
  __crop__."id"::text as "0",
  __crop__."amount"::text as "1",
  __crop__."yield" as "2"
from "js_reserved"."crop" as __crop__
order by __crop__."id" asc;

select __crop_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __crop_identifiers__,
lateral (
  select
    __crop__."yield" as "0",
    __crop__."amount"::text as "1",
    __crop__."id"::text as "2",
    __crop_identifiers__.idx as "3"
  from "js_reserved"."crop" as __crop__
  where (
    __crop__."id" = __crop_identifiers__."id0"
  )
  order by __crop__."id" asc
) as __crop_result__;

select __crop_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __crop_identifiers__,
lateral (
  select
    __crop__."amount"::text as "0",
    __crop__."id"::text as "1",
    __crop_identifiers__.idx as "2"
  from "js_reserved"."crop" as __crop__
  where (
    __crop__."yield" = __crop_identifiers__."id0"
  )
  order by __crop__."id" asc
) as __crop_result__;

select
  __material__."valueof" as "0",
  __material__."class" as "1",
  __material__."id"::text as "2"
from "js_reserved"."material" as __material__
order by __material__."id" asc;