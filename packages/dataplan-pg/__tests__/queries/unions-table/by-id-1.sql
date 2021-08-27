select __union_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __union_items_identifiers__,
lateral (
  select
    __union_items__."type"::text as "0",
    __union_topics__."id"::text as "1",
    __union_topics__."title"::text as "2",
    __union_posts__."id"::text as "3",
    __union_posts__."title"::text as "4",
    __union_posts__."description"::text as "5",
    __union_posts__."note"::text as "6",
    __union_dividers__."id"::text as "7",
    __union_dividers__."title"::text as "8",
    __union_dividers__."color"::text as "9",
    __union_checklists__."id"::text as "10",
    __union_checklists__."title"::text as "11",
    __union_checklist_items__."id"::text as "12",
    __union_checklist_items__."description"::text as "13",
    __union_checklist_items__."note"::text as "14",
    __union_items__."id"::text as "15",
    __union_items_identifiers__.idx as "16"
  from interfaces_and_unions.union_items as __union_items__
  left outer join interfaces_and_unions.union_topics as __union_topics__
  on (__union_items__."id"::"int4" = __union_topics__."id")
  left outer join interfaces_and_unions.union_posts as __union_posts__
  on (__union_items__."id"::"int4" = __union_posts__."id")
  left outer join interfaces_and_unions.union_dividers as __union_dividers__
  on (__union_items__."id"::"int4" = __union_dividers__."id")
  left outer join interfaces_and_unions.union_checklists as __union_checklists__
  on (__union_items__."id"::"int4" = __union_checklists__."id")
  left outer join interfaces_and_unions.union_checklist_items as __union_checklist_items__
  on (__union_items__."id"::"int4" = __union_checklist_items__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __union_items__."id" = __union_items_identifiers__."id0"
    )
  order by __union_items__."id" asc
) as __union_items_result__