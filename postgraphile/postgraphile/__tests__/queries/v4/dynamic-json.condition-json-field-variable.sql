select __my_table_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"jsonb" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __my_table_identifiers__,
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
) as __my_table_result__

select __my_table_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"jsonb" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __my_table_identifiers__,
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
) as __my_table_result__