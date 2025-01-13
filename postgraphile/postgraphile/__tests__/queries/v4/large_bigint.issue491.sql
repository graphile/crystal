select
  __large_node_id__."id"::text as "0",
  __large_node_id__."text" as "1"
from "large_bigint"."large_node_id" as __large_node_id__
where (
  __large_node_id__."id" = $1::"int8"
);

select
  __large_node_id__."id"::text as "0",
  __large_node_id__."text" as "1"
from "large_bigint"."large_node_id" as __large_node_id__
where (
  __large_node_id__."id" = $1::"int8"
);

select
  __large_node_id__."id"::text as "0",
  __large_node_id__."text" as "1"
from "large_bigint"."large_node_id" as __large_node_id__
order by __large_node_id__."id" asc;