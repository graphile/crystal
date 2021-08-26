select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items_2."type"::text as "0",
    __relational_topics_2."id"::text as "1",
    __relational_posts_2."id"::text as "2",
    __relational_dividers_2."id"::text as "3",
    __relational_checklists_2."id"::text as "4",
    __relational_checklist_items_2."id"::text as "5",
    __relational_items_2."id"::text as "6",
    __relational_items__."type"::text as "7",
    __relational_topics__."id"::text as "8",
    __relational_posts__."id"::text as "9",
    __relational_dividers__."id"::text as "10",
    __relational_checklists__."id"::text as "11",
    __relational_checklist_items__."id"::text as "12",
    __relational_items__."id"::text as "13",
    __people__."username"::text as "14",
    __relational_items__."author_id"::text as "15",
    __relational_items_2."parent_id"::text as "16",
    __relational_items_identifiers__.idx as "17"
  from interfaces_and_unions.relational_items as __relational_items_2
  left outer join interfaces_and_unions.relational_topics as __relational_topics_2
  on (__relational_items_2."id"::"int4" = __relational_topics_2."id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts_2
  on (__relational_items_2."id"::"int4" = __relational_posts_2."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers_2
  on (__relational_items_2."id"::"int4" = __relational_dividers_2."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists_2
  on (__relational_items_2."id"::"int4" = __relational_checklists_2."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_2
  on (__relational_items_2."id"::"int4" = __relational_checklist_items_2."id")
  left outer join interfaces_and_unions.relational_items as __relational_items__
  on (__relational_items_2."parent_id"::"int4" = __relational_items__."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.people as __people__
  on (__relational_items__."author_id"::"int4" = __people__."person_id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items_2."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items_2."id" asc
) as __relational_items_result__