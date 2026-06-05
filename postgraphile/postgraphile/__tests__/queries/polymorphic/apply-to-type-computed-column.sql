select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  "polymorphic"."single_table_items_post_only"(__single_table_items__) as "2"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
)
order by __single_table_items__."id" asc;