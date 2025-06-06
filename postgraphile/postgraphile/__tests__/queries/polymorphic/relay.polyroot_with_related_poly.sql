select
  __single_table_items_2."id"::text as "0",
  __single_table_items_2."type"::text as "1",
  __single_table_items__."id"::text as "2",
  __single_table_items__."type"::text as "3"
from "polymorphic"."single_table_items" as __single_table_items_2
left outer join "polymorphic"."single_table_items" as __single_table_items__
on (
/* WHERE becoming ON */ (
  __single_table_items__."id" = __single_table_items_2."parent_id"
))
order by __single_table_items_2."id" asc;

select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1",
  __relational_topics__."topic_item_id"::text as "2",
  __relational_posts__."post_item_id"::text as "3",
  __relational_dividers__."divider_item_id"::text as "4",
  __relational_checklists__."checklist_item_id"::text as "5",
  __relational_checklist_items__."checklist_item_item_id"::text as "6"
from "polymorphic"."relational_items" as __relational_items__
left outer join "polymorphic"."relational_topics" as __relational_topics__
on (
/* WHERE becoming ON */ (
  __relational_topics__."topic_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_posts" as __relational_posts__
on (
/* WHERE becoming ON */ (
  __relational_posts__."post_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_dividers" as __relational_dividers__
on (
/* WHERE becoming ON */ (
  __relational_dividers__."divider_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_checklists" as __relational_checklists__
on (
/* WHERE becoming ON */ (
  __relational_checklists__."checklist_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_checklist_items" as __relational_checklist_items__
on (
/* WHERE becoming ON */ (
  __relational_checklist_items__."checklist_item_item_id" = __relational_items__."id"
))
order by __relational_items__."id" asc;

select
  __single_table_item_relations__."id"::text as "0",
  __single_table_items__."id"::text as "1",
  __single_table_items__."type"::text as "2",
  __single_table_items_2."id"::text as "3",
  __single_table_items_2."type"::text as "4"
from "polymorphic"."single_table_item_relations" as __single_table_item_relations__
left outer join "polymorphic"."single_table_items" as __single_table_items__
on (
/* WHERE becoming ON */ (
  __single_table_items__."id" = __single_table_item_relations__."child_id"
))
left outer join "polymorphic"."single_table_items" as __single_table_items_2
on (
/* WHERE becoming ON */ (
  __single_table_items_2."id" = __single_table_item_relations__."parent_id"
))
where (
  __single_table_item_relations__."child_id" = $1::"int4"
)
order by __single_table_item_relations__."id" asc;

select
  __relational_item_relations__."id"::text as "0",
  __relational_items__."type"::text as "1",
  __relational_items__."id"::text as "2",
  __relational_topics__."topic_item_id"::text as "3",
  __relational_posts__."post_item_id"::text as "4",
  __relational_dividers__."divider_item_id"::text as "5",
  __relational_checklists__."checklist_item_id"::text as "6",
  __relational_checklist_items__."checklist_item_item_id"::text as "7",
  __relational_items_2."type"::text as "8",
  __relational_items_2."id"::text as "9",
  __relational_topics_2."topic_item_id"::text as "10",
  __relational_posts_2."post_item_id"::text as "11",
  __relational_dividers_2."divider_item_id"::text as "12",
  __relational_checklists_2."checklist_item_id"::text as "13",
  __relational_checklist_items_2."checklist_item_item_id"::text as "14"
from "polymorphic"."relational_item_relations" as __relational_item_relations__
left outer join "polymorphic"."relational_items" as __relational_items__
on (
/* WHERE becoming ON */ (
  __relational_items__."id" = __relational_item_relations__."child_id"
))
left outer join "polymorphic"."relational_topics" as __relational_topics__
on (
/* WHERE becoming ON */ (
  __relational_topics__."topic_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_posts" as __relational_posts__
on (
/* WHERE becoming ON */ (
  __relational_posts__."post_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_dividers" as __relational_dividers__
on (
/* WHERE becoming ON */ (
  __relational_dividers__."divider_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_checklists" as __relational_checklists__
on (
/* WHERE becoming ON */ (
  __relational_checklists__."checklist_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_checklist_items" as __relational_checklist_items__
on (
/* WHERE becoming ON */ (
  __relational_checklist_items__."checklist_item_item_id" = __relational_items__."id"
))
left outer join "polymorphic"."relational_items" as __relational_items_2
on (
/* WHERE becoming ON */ (
  __relational_items_2."id" = __relational_item_relations__."parent_id"
))
left outer join "polymorphic"."relational_topics" as __relational_topics_2
on (
/* WHERE becoming ON */ (
  __relational_topics_2."topic_item_id" = __relational_items_2."id"
))
left outer join "polymorphic"."relational_posts" as __relational_posts_2
on (
/* WHERE becoming ON */ (
  __relational_posts_2."post_item_id" = __relational_items_2."id"
))
left outer join "polymorphic"."relational_dividers" as __relational_dividers_2
on (
/* WHERE becoming ON */ (
  __relational_dividers_2."divider_item_id" = __relational_items_2."id"
))
left outer join "polymorphic"."relational_checklists" as __relational_checklists_2
on (
/* WHERE becoming ON */ (
  __relational_checklists_2."checklist_item_id" = __relational_items_2."id"
))
left outer join "polymorphic"."relational_checklist_items" as __relational_checklist_items_2
on (
/* WHERE becoming ON */ (
  __relational_checklist_items_2."checklist_item_item_id" = __relational_items_2."id"
))
where (
  __relational_item_relations__."child_id" = $1::"int4"
)
order by __relational_item_relations__."id" asc;

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
    __relational_items__."type"::text as "0",
    __relational_topics__."topic_item_id"::text as "1",
    __relational_posts__."post_item_id"::text as "2",
    __relational_dividers__."divider_item_id"::text as "3",
    __relational_checklists__."checklist_item_id"::text as "4",
    __relational_checklist_items__."checklist_item_item_id"::text as "5",
    __relational_items_identifiers__.idx as "6"
  from "polymorphic"."relational_items" as __relational_items__
  left outer join "polymorphic"."relational_topics" as __relational_topics__
  on (
  /* WHERE becoming ON */ (
    __relational_topics__."topic_item_id" = __relational_items__."id"
  ))
  left outer join "polymorphic"."relational_posts" as __relational_posts__
  on (
  /* WHERE becoming ON */ (
    __relational_posts__."post_item_id" = __relational_items__."id"
  ))
  left outer join "polymorphic"."relational_dividers" as __relational_dividers__
  on (
  /* WHERE becoming ON */ (
    __relational_dividers__."divider_item_id" = __relational_items__."id"
  ))
  left outer join "polymorphic"."relational_checklists" as __relational_checklists__
  on (
  /* WHERE becoming ON */ (
    __relational_checklists__."checklist_item_id" = __relational_items__."id"
  ))
  left outer join "polymorphic"."relational_checklist_items" as __relational_checklist_items__
  on (
  /* WHERE becoming ON */ (
    __relational_checklist_items__."checklist_item_item_id" = __relational_items__."id"
  ))
  where (
    __relational_items__."id" = __relational_items_identifiers__."id0"
  )
) as __relational_items_result__;