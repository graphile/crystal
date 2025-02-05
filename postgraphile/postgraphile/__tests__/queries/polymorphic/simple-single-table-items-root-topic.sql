select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  __single_table_items__."root_topic_id"::text as "2"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
);

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  __single_table_items__."root_topic_id"::text as "2"
from "polymorphic"."single_table_items" as __single_table_items__
order by __single_table_items__."id" asc;

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."title" as "1",
  __single_table_items__."type"::text as "2"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
);

select __single_table_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __single_table_items_identifiers__,
lateral (
  select
    __single_table_items__."id"::text as "0",
    __single_table_items__."title" as "1",
    __single_table_items__."type"::text as "2",
    __single_table_items_identifiers__.idx as "3"
  from "polymorphic"."single_table_items" as __single_table_items__
  where (
    __single_table_items__."id" = __single_table_items_identifiers__."id0"
  )
) as __single_table_items_result__;