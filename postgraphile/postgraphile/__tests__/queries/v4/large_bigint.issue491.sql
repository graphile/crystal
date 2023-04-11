select __large_node_id_result__.*
from (select 0 as idx, $1::"int8" as "id0") as __large_node_id_identifiers__,
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
) as __large_node_id_result__;

select __large_node_id_result__.*
from (select 0 as idx, $1::"int8" as "id0") as __large_node_id_identifiers__,
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
) as __large_node_id_result__;

select
  __large_node_id__."id"::text as "0",
  __large_node_id__."text" as "1"
from "large_bigint"."large_node_id" as __large_node_id__
order by __large_node_id__."id" asc;