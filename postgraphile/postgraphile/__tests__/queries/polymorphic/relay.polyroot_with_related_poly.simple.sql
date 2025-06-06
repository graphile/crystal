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