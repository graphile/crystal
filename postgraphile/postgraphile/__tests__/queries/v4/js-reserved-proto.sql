select __project_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __project_identifiers__,
lateral (
  select
    __project__."brand" as "0",
    __project__."id"::text as "1",
    __project_identifiers__.idx as "2"
  from "js_reserved"."project" as __project__
  where (
    __project__."__proto__" = __project_identifiers__."id0"
  )
  order by __project__."id" asc
) as __project_result__;

select __project_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __project_identifiers__,
lateral (
  select
    __project__."brand" as "0",
    __project__."__proto__" as "1",
    __project__."id"::text as "2",
    __project_identifiers__.idx as "3"
  from "js_reserved"."project" as __project__
  where (
    __project__."id" = __project_identifiers__."id0"
  )
  order by __project__."id" asc
) as __project_result__;

select
  __project__."__proto__" as "0",
  __project__."brand" as "1",
  __project__."id"::text as "2"
from "js_reserved"."project" as __project__
order by __project__."id" asc;