select __project_result__.*
from (select 0 as idx, $1::"text" as "id0") as __project_identifiers__,
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
from (select 0 as idx, $1::"int4" as "id0") as __project_identifiers__,
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