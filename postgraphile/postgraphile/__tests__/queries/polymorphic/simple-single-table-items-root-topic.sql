select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  __single_table_items__."root_topic_id"::text as "2",
  __single_table_items_2."id"::text as "3",
  __single_table_items_2."title" as "4"
from "polymorphic"."single_table_items" as __single_table_items__
left outer join "polymorphic"."single_table_items" as __single_table_items_2
on (
/* WHERE becoming ON */ (
  __single_table_items_2."id" = __single_table_items__."root_topic_id"
))
where (
  __single_table_items__."id" = $1::"int4"
);

select
  __single_table_items_2."id"::text as "0",
  __single_table_items_2."type"::text as "1",
  __single_table_items_2."root_topic_id"::text as "2",
  __single_table_items__."id"::text as "3",
  __single_table_items__."title" as "4"
from "polymorphic"."single_table_items" as __single_table_items_2
left outer join "polymorphic"."single_table_items" as __single_table_items__
on (
/* WHERE becoming ON */ (
  __single_table_items__."id" = __single_table_items_2."root_topic_id"
))
order by __single_table_items_2."id" asc;