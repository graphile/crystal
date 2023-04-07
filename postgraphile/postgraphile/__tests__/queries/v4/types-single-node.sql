select __types_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __types_identifiers__,
lateral (
  select
    __types__."id"::text as "0",
    __types_identifiers__.idx as "1"
  from "b"."types" as __types__
  where (
    __types__."id" = __types_identifiers__."id0"
  )
  order by __types__."id" asc
) as __types_result__;