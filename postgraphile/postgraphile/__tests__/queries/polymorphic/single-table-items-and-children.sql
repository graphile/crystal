select
  __single_table_items_2."id"::text as "0",
  __single_table_items_2."type"::text as "1",
  array(
    select array[
      __single_table_items__."id"::text,
      __single_table_items__."type"::text,
      __single_table_items__."position"::text
    ]::text[]
    from "polymorphic"."single_table_items" as __single_table_items__
    where (
      __single_table_items__."parent_id" = __single_table_items_2."id"
    )
    order by __single_table_items__."id" asc
  )::text as "2"
from "polymorphic"."single_table_items" as __single_table_items_2
order by __single_table_items_2."id" asc;