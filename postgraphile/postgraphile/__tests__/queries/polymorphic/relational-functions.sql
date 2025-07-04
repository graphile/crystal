select
  __relational_item_by_id_fn__."id"::text as "0",
  __relational_item_by_id_fn__."type"::text as "1",
  __relational_item_by_id_fn__."parent_id"::text as "2"
from "polymorphic"."relational_item_by_id_fn"($1::"int4") as __relational_item_by_id_fn__;

select
  __relational_item_by_id_fn__."id"::text as "0",
  __relational_item_by_id_fn__."type"::text as "1",
  __relational_item_by_id_fn__."parent_id"::text as "2"
from "polymorphic"."relational_item_by_id_fn"($1::"int4") as __relational_item_by_id_fn__;

select
  __relational_topic_by_id_fn__."title" as "0",
  __relational_topic_by_id_fn__."topic_item_id"::text as "1",
  __relational_items__."id"::text as "2",
  __relational_items__."type"::text as "3",
  __relational_items__."parent_id"::text as "4",
  __relational_topics_parent_fn__."id"::text as "5",
  __relational_topics_parent_fn__."type"::text as "6"
from "polymorphic"."relational_topic_by_id_fn"($1::"int4") as __relational_topic_by_id_fn__
left outer join "polymorphic"."relational_items" as __relational_items__
on (
/* WHERE becoming ON */ (
  __relational_items__."id" = __relational_topic_by_id_fn__."topic_item_id"
))
left outer join "polymorphic"."relational_topics_parent_fn"(__relational_topic_by_id_fn__) as __relational_topics_parent_fn__
on TRUE;

select
  __relational_topic_by_id_fn__."title" as "0",
  __relational_topic_by_id_fn__."topic_item_id"::text as "1",
  __relational_items__."id"::text as "2",
  __relational_items__."type"::text as "3",
  __relational_items__."parent_id"::text as "4",
  __relational_topics_parent_fn__."id"::text as "5",
  __relational_topics_parent_fn__."type"::text as "6"
from "polymorphic"."relational_topic_by_id_fn"($1::"int4") as __relational_topic_by_id_fn__
left outer join "polymorphic"."relational_items" as __relational_items__
on (
/* WHERE becoming ON */ (
  __relational_items__."id" = __relational_topic_by_id_fn__."topic_item_id"
))
left outer join "polymorphic"."relational_topics_parent_fn"(__relational_topic_by_id_fn__) as __relational_topics_parent_fn__
on TRUE;

select
  __relational_topic_by_id_fn__."title" as "0",
  __relational_topic_by_id_fn__."topic_item_id"::text as "1",
  __relational_items__."id"::text as "2",
  __relational_items__."type"::text as "3",
  __relational_items__."parent_id"::text as "4",
  __relational_topics_parent_fn__."id"::text as "5",
  __relational_topics_parent_fn__."type"::text as "6"
from "polymorphic"."relational_topic_by_id_fn"($1::"int4") as __relational_topic_by_id_fn__
left outer join "polymorphic"."relational_items" as __relational_items__
on (
/* WHERE becoming ON */ (
  __relational_items__."id" = __relational_topic_by_id_fn__."topic_item_id"
))
left outer join "polymorphic"."relational_topics_parent_fn"(__relational_topic_by_id_fn__) as __relational_topics_parent_fn__
on TRUE;

select
  __all_relational_items_fn__."id"::text as "0",
  __all_relational_items_fn__."type"::text as "1",
  __all_relational_items_fn__."parent_id"::text as "2"
from "polymorphic"."all_relational_items_fn"() as __all_relational_items_fn__;

select
  __relational_topics__."title" as "0"
from "polymorphic"."relational_topics" as __relational_topics__
where (
  __relational_topics__."topic_item_id" = $1::"int4"
);

select
  __relational_checklists__."checklist_item_id"::text as "0"
from "polymorphic"."relational_checklists" as __relational_checklists__
where (
  __relational_checklists__."checklist_item_id" = $1::"int4"
);

select __relational_topics_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_topics_identifiers__,
lateral (
  select
    __relational_topics__."title" as "0",
    __relational_topics__."topic_item_id"::text as "1",
    __relational_topics_parent_fn__."id"::text as "2",
    __relational_topics_parent_fn__."type"::text as "3",
    __relational_topics_identifiers__.idx as "4"
  from "polymorphic"."relational_topics" as __relational_topics__
  left outer join "polymorphic"."relational_topics_parent_fn"(__relational_topics__) as __relational_topics_parent_fn__
  on TRUE
  where (
    __relational_topics__."topic_item_id" = __relational_topics_identifiers__."id0"
  )
) as __relational_topics_result__;

select __relational_posts_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."title" as "0",
    __relational_posts__."description" as "1",
    __relational_posts__."post_item_id"::text as "2",
    __relational_posts_identifiers__.idx as "3"
  from "polymorphic"."relational_posts" as __relational_posts__
  where (
    __relational_posts__."post_item_id" = __relational_posts_identifiers__."id0"
  )
) as __relational_posts_result__;

select __relational_dividers_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_dividers_identifiers__,
lateral (
  select
    __relational_dividers__."color" as "0",
    __relational_dividers__."divider_item_id"::text as "1",
    __relational_dividers_identifiers__.idx as "2"
  from "polymorphic"."relational_dividers" as __relational_dividers__
  where (
    __relational_dividers__."divider_item_id" = __relational_dividers_identifiers__."id0"
  )
) as __relational_dividers_result__;

select __relational_checklist_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_checklist_items_identifiers__,
lateral (
  select
    __relational_checklist_items__."description" as "0",
    __relational_checklist_items__."checklist_item_item_id"::text as "1",
    __relational_checklist_items_identifiers__.idx as "2"
  from "polymorphic"."relational_checklist_items" as __relational_checklist_items__
  where (
    __relational_checklist_items__."checklist_item_item_id" = __relational_checklist_items_identifiers__."id0"
  )
) as __relational_checklist_items_result__;

select
  __relational_items__."id"::text as "0"
from "polymorphic"."relational_items" as __relational_items__
inner join "polymorphic"."relational_items" as __relational_items_2
on (__relational_items__."id" = __relational_items_2."parent_id")
where (
  __relational_items_2."id" = $1::"int4"
);

select __relational_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."id"::text as "0",
    __relational_items_identifiers__.idx as "1"
  from "polymorphic"."relational_items" as __relational_items__
  inner join "polymorphic"."relational_items" as __relational_items_2
  on (__relational_items__."id" = __relational_items_2."parent_id")
  where (
    __relational_items_2."id" = __relational_items_identifiers__."id0"
  )
) as __relational_items_result__;

select __relational_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."id"::text as "0",
    __relational_items_identifiers__.idx as "1"
  from "polymorphic"."relational_items" as __relational_items__
  inner join "polymorphic"."relational_items" as __relational_items_2
  on (__relational_items__."id" = __relational_items_2."parent_id")
  where (
    __relational_items_2."id" = __relational_items_identifiers__."id0"
  )
) as __relational_items_result__;

select __relational_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."id"::text as "0",
    __relational_items_identifiers__.idx as "1"
  from "polymorphic"."relational_items" as __relational_items__
  inner join "polymorphic"."relational_items" as __relational_items_2
  on (__relational_items__."id" = __relational_items_2."parent_id")
  where (
    __relational_items_2."id" = __relational_items_identifiers__."id0"
  )
) as __relational_items_result__;

select __relational_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."id"::text as "0",
    __relational_items_identifiers__.idx as "1"
  from "polymorphic"."relational_items" as __relational_items__
  inner join "polymorphic"."relational_items" as __relational_items_2
  on (__relational_items__."id" = __relational_items_2."parent_id")
  where (
    __relational_items_2."id" = __relational_items_identifiers__."id0"
  )
) as __relational_items_result__;

select __relational_topics_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_topics_identifiers__,
lateral (
  select
    __relational_topics__."title" as "0",
    __relational_topics_identifiers__.idx as "1"
  from "polymorphic"."relational_topics" as __relational_topics__
  where (
    __relational_topics__."topic_item_id" = __relational_topics_identifiers__."id0"
  )
) as __relational_topics_result__;

select __relational_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items__."id"::text as "1",
    __relational_items__."parent_id"::text as "2",
    __relational_items_identifiers__.idx as "3"
  from "polymorphic"."relational_items" as __relational_items__
  where (
    __relational_items__."id" = __relational_items_identifiers__."id0"
  )
) as __relational_items_result__;

select __relational_topics_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_topics_identifiers__,
lateral (
  select
    __relational_topics__."title" as "0",
    __relational_topics_parent_fn__."id"::text as "1",
    __relational_topics_parent_fn__."type"::text as "2",
    __relational_topics_identifiers__.idx as "3"
  from "polymorphic"."relational_topics" as __relational_topics__
  left outer join "polymorphic"."relational_topics_parent_fn"(__relational_topics__) as __relational_topics_parent_fn__
  on TRUE
  where (
    __relational_topics__."topic_item_id" = __relational_topics_identifiers__."id0"
  )
) as __relational_topics_result__;

select
  __relational_posts__."title" as "0",
  __relational_posts__."description" as "1"
from "polymorphic"."relational_posts" as __relational_posts__
where (
  __relational_posts__."post_item_id" = $1::"int4"
);

select __relational_checklists_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_checklists_identifiers__,
lateral (
  select
    __relational_checklists__."checklist_item_id"::text as "0",
    __relational_checklists_identifiers__.idx as "1"
  from "polymorphic"."relational_checklists" as __relational_checklists__
  where (
    __relational_checklists__."checklist_item_id" = __relational_checklists_identifiers__."id0"
  )
) as __relational_checklists_result__;