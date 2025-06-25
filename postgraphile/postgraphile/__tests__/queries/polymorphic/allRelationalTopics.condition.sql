select
  __relational_topics__."topic_item_id"::text as "0",
  __relational_items__."id"::text as "1",
  __relational_items__."type"::text as "2",
  to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "3",
  to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "4"
from "polymorphic"."relational_topics" as __relational_topics__
left outer join "polymorphic"."relational_items" as __relational_items_by_my_topic_item_id__
on (__relational_topics__."topic_item_id" = __relational_items_by_my_topic_item_id__."id")
left outer join "polymorphic"."relational_items" as __relational_items__
on (
/* WHERE becoming ON */ (
  __relational_items__."id" = __relational_topics__."topic_item_id"
))
where (
  __relational_items_by_my_topic_item_id__."archived_at" is null
)
order by __relational_topics__."topic_item_id" asc;

select
  __relational_topics__."topic_item_id"::text as "0",
  __relational_items__."id"::text as "1"
from "polymorphic"."relational_topics" as __relational_topics__
left outer join "polymorphic"."relational_items" as __relational_items_by_my_topic_item_id__
on (__relational_topics__."topic_item_id" = __relational_items_by_my_topic_item_id__."id")
left outer join "polymorphic"."relational_items" as __relational_items__
on (
/* WHERE becoming ON */ (
  __relational_items__."id" = __relational_topics__."topic_item_id"
))
where (
  __relational_items_by_my_topic_item_id__."archived_at" is null
)
order by __relational_topics__."topic_item_id" asc;