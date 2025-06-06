select
  __relational_items__."id"::text as "0",
  __relational_items__."type"::text as "1"
from "polymorphic"."relational_items" as __relational_items__
order by __relational_items__."id" asc;

select __relational_topics_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_topics_identifiers__,
lateral (
  select
    __relational_topics__."topic_item_id"::text as "0",
    __relational_topics_identifiers__.idx as "1"
  from "polymorphic"."relational_topics" as __relational_topics__
  where (
    __relational_topics__."topic_item_id" = __relational_topics_identifiers__."id0"
  )
) as __relational_topics_result__;

select __relational_posts_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."post_item_id"::text as "0",
    __relational_posts_identifiers__.idx as "1"
  from "polymorphic"."relational_posts" as __relational_posts__
  where (
    __relational_posts__."post_item_id" = __relational_posts_identifiers__."id0"
  )
) as __relational_posts_result__;

select __relational_dividers_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_dividers_identifiers__,
lateral (
  select
    __relational_dividers__."divider_item_id"::text as "0",
    __relational_dividers_identifiers__.idx as "1"
  from "polymorphic"."relational_dividers" as __relational_dividers__
  where (
    __relational_dividers__."divider_item_id" = __relational_dividers_identifiers__."id0"
  )
) as __relational_dividers_result__;

select
  __relational_checklists__."checklist_item_id"::text as "0"
from "polymorphic"."relational_checklists" as __relational_checklists__
where (
  __relational_checklists__."checklist_item_id" = $1::"int4"
);

select __relational_checklist_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_checklist_items_identifiers__,
lateral (
  select
    __relational_checklist_items__."checklist_item_item_id"::text as "0",
    __relational_checklist_items_identifiers__.idx as "1"
  from "polymorphic"."relational_checklist_items" as __relational_checklist_items__
  where (
    __relational_checklist_items__."checklist_item_item_id" = __relational_checklist_items_identifiers__."id0"
  )
) as __relational_checklist_items_result__;

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
    __relational_items__."id"::text as "1",
    __relational_items_identifiers__.idx as "2"
  from "polymorphic"."relational_items" as __relational_items__
  where (
    __relational_items__."id" = __relational_items_identifiers__."id0"
  )
) as __relational_items_result__;

select
  __relational_posts__."post_item_id"::text as "0"
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