select __person_result__.*
from (select 0 as idx, $1::"text" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    "c"."person_computed_out"(__person__) = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;