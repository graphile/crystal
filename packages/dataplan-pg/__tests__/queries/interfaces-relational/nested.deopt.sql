select
  __people__."username"::text as "0",
  __people__."person_id"::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items_6."type"::text as "0",
    __relational_items__."parent_id"::text as "1",
    __relational_items__."type"::text as "2",
    __relational_topics__."id"::text as "3",
    __relational_items_2."parent_id"::text as "4",
    __relational_items_2."type"::text as "5",
    __relational_posts__."id"::text as "6",
    __relational_items_3."parent_id"::text as "7",
    __relational_items_3."type"::text as "8",
    __relational_dividers__."id"::text as "9",
    __relational_items_4."parent_id"::text as "10",
    __relational_items_4."type"::text as "11",
    __relational_checklists__."id"::text as "12",
    __relational_items_5."parent_id"::text as "13",
    __relational_items_5."type"::text as "14",
    __relational_checklist_items__."id"::text as "15",
    __relational_items_6."id"::text as "16",
    __relational_items_identifiers__.idx as "17"
  from interfaces_and_unions.relational_items as __relational_items_6
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items_6."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items__
  on (__relational_topics__."id"::"int4" = __relational_items__."id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items_6."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_2
  on (__relational_posts__."id"::"int4" = __relational_items_2."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items_6."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_3
  on (__relational_dividers__."id"::"int4" = __relational_items_3."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items_6."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_4
  on (__relational_checklists__."id"::"int4" = __relational_items_4."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items_6."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_5
  on (__relational_checklist_items__."id"::"int4" = __relational_items_5."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items_6."author_id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items_6."id" asc
) as __relational_items_result__

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items_2."type"::text as "1",
    __relational_topics__."id"::text as "2",
    __relational_items_3."type"::text as "3",
    __relational_posts__."id"::text as "4",
    __relational_items_4."type"::text as "5",
    __relational_dividers__."id"::text as "6",
    __relational_items_5."type"::text as "7",
    __relational_checklists__."id"::text as "8",
    __relational_items_6."type"::text as "9",
    __relational_checklist_items__."id"::text as "10",
    __relational_items__."id"::text as "11",
    __relational_items_identifiers__.idx as "12"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_2
  on (__relational_topics__."id"::"int4" = __relational_items_2."id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_3
  on (__relational_posts__."id"::"int4" = __relational_items_3."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_4
  on (__relational_dividers__."id"::"int4" = __relational_items_4."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_5
  on (__relational_checklists__."id"::"int4" = __relational_items_5."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_6
  on (__relational_checklist_items__."id"::"int4" = __relational_items_6."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items_2."type"::text as "1",
    __relational_topics__."id"::text as "2",
    __relational_items_3."type"::text as "3",
    __relational_posts__."id"::text as "4",
    __relational_items_4."type"::text as "5",
    __relational_dividers__."id"::text as "6",
    __relational_items_5."type"::text as "7",
    __relational_checklists__."id"::text as "8",
    __relational_items_6."type"::text as "9",
    __relational_checklist_items__."id"::text as "10",
    __relational_items__."id"::text as "11",
    __relational_items_identifiers__.idx as "12"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_2
  on (__relational_topics__."id"::"int4" = __relational_items_2."id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_3
  on (__relational_posts__."id"::"int4" = __relational_items_3."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_4
  on (__relational_dividers__."id"::"int4" = __relational_items_4."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_5
  on (__relational_checklists__."id"::"int4" = __relational_items_5."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_6
  on (__relational_checklist_items__."id"::"int4" = __relational_items_6."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items_2."type"::text as "1",
    __relational_topics__."id"::text as "2",
    __relational_items_3."type"::text as "3",
    __relational_posts__."id"::text as "4",
    __relational_items_4."type"::text as "5",
    __relational_dividers__."id"::text as "6",
    __relational_items_5."type"::text as "7",
    __relational_checklists__."id"::text as "8",
    __relational_items_6."type"::text as "9",
    __relational_checklist_items__."id"::text as "10",
    __relational_items__."id"::text as "11",
    __relational_items_identifiers__.idx as "12"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_2
  on (__relational_topics__."id"::"int4" = __relational_items_2."id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_3
  on (__relational_posts__."id"::"int4" = __relational_items_3."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_4
  on (__relational_dividers__."id"::"int4" = __relational_items_4."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_5
  on (__relational_checklists__."id"::"int4" = __relational_items_5."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_6
  on (__relational_checklist_items__."id"::"int4" = __relational_items_6."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items_2."type"::text as "1",
    __relational_topics__."id"::text as "2",
    __relational_items_3."type"::text as "3",
    __relational_posts__."id"::text as "4",
    __relational_items_4."type"::text as "5",
    __relational_dividers__."id"::text as "6",
    __relational_items_5."type"::text as "7",
    __relational_checklists__."id"::text as "8",
    __relational_items_6."type"::text as "9",
    __relational_checklist_items__."id"::text as "10",
    __relational_items__."id"::text as "11",
    __relational_items_identifiers__.idx as "12"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_2
  on (__relational_topics__."id"::"int4" = __relational_items_2."id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_3
  on (__relational_posts__."id"::"int4" = __relational_items_3."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_4
  on (__relational_dividers__."id"::"int4" = __relational_items_4."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_5
  on (__relational_checklists__."id"::"int4" = __relational_items_5."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_6
  on (__relational_checklist_items__."id"::"int4" = __relational_items_6."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__