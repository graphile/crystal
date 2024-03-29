select __my_table_result__.*
from (select 0 as idx, $1::"jsonb" as "id0") as __my_table_identifiers__,
lateral (
  select
    __my_table__."id"::text as "0",
    __my_table__."json_data"::text as "1",
    __my_table_identifiers__.idx as "2"
  from "c"."my_table" as __my_table__
  where (
    __my_table__."json_data" = __my_table_identifiers__."id0"
  )
  order by __my_table__."id" asc
) as __my_table_result__;