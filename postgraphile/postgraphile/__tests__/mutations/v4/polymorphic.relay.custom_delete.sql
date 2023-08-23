select __relational_items_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_items_identifiers__,
lateral (
  select
    __relational_items__::text as "0",
    __relational_items__."type"::text as "1",
    __relational_items__."id"::text as "2",
    __relational_items_identifiers__.idx as "3"
  from "polymorphic"."relational_items" as __relational_items__
  where (
    __relational_items__."id" = __relational_items_identifiers__."id0"
  )
) as __relational_items_result__;

select __custom_delete_relational_item_result__.*
from (select 0 as idx, $1::"polymorphic"."relational_items" as "id0") as __custom_delete_relational_item_identifiers__,
lateral (
  select
    __custom_delete_relational_item__.v::text as "0",
    __custom_delete_relational_item_identifiers__.idx as "1"
  from "polymorphic"."custom_delete_relational_item"(__custom_delete_relational_item_identifiers__."id0") as __custom_delete_relational_item__(v)
) as __custom_delete_relational_item_result__;

select
  __relational_items__."id"::text as "0",
  __relational_items__."type"::text as "1"
from "polymorphic"."relational_items" as __relational_items__
order by __relational_items__."id" asc
limit 1;

select __relational_topics_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_topics_identifiers__,
lateral (
  select
    __relational_topics__."topic_item_id"::text as "0",
    __relational_topics_identifiers__.idx as "1"
  from "polymorphic"."relational_topics" as __relational_topics__
  where (
    __relational_topics__."topic_item_id" = __relational_topics_identifiers__."id0"
  )
) as __relational_topics_result__;