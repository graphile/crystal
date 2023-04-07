select __person_result__.*
from (select 0 as idx, $1::"text" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."first_name" as "1",
    __person__."last_name" as "2",
    __person__."col_no_create" as "3",
    __person__."col_no_update" as "4",
    __person__."col_no_order" as "5",
    __person__."col_no_filter" as "6",
    __person__."col_no_create_update" as "7",
    __person__."col_no_create_update_order_filter" as "8",
    __person_identifiers__.idx as "9"
  from "d"."person" as __person__
  where (
    __person__."col_no_create" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;