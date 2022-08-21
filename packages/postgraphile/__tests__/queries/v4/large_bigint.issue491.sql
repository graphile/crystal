select
  __large_node_id__."id"::text as "0",
  __large_node_id__."text" as "1"
from "large_bigint"."large_node_id" as __large_node_id__
order by __large_node_id__."id" asc

select __large_node_id_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int8" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __large_node_id_identifiers__,
lateral (
  select
    __large_node_id__."id"::text as "0",
    __large_node_id__."text" as "1",
    __large_node_id_identifiers__.idx as "2"
  from "large_bigint"."large_node_id" as __large_node_id__
  where (
    __large_node_id__."id" = __large_node_id_identifiers__."id0"
  )
  order by __large_node_id__."id" asc
) as __large_node_id_result__

select __large_node_id_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int8" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __large_node_id_identifiers__,
lateral (
  select
    __large_node_id__."id"::text as "0",
    __large_node_id__."text" as "1",
    __large_node_id_identifiers__.idx as "2"
  from "large_bigint"."large_node_id" as __large_node_id__
  where (
    __large_node_id__."id" = __large_node_id_identifiers__."id0"
  )
  order by __large_node_id__."id" asc
) as __large_node_id_result__