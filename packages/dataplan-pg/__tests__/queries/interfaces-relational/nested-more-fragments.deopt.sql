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
    __relational_items__."author_id"::text as "3",
    __relational_items__."position"::text as "4",
    __relational_items__."created_at"::text as "5",
    __relational_items__."updated_at"::text as "6",
    __relational_items__."is_explicitly_archived"::text as "7",
    __relational_items__."archived_at"::text as "8",
    __relational_topics__."id"::text as "9",
    __relational_topics__."title"::text as "10",
    __relational_items_2."parent_id"::text as "11",
    __relational_items_2."type"::text as "12",
    __relational_items_2."author_id"::text as "13",
    __relational_items_2."position"::text as "14",
    __relational_items_2."created_at"::text as "15",
    __relational_items_2."updated_at"::text as "16",
    __relational_items_2."is_explicitly_archived"::text as "17",
    __relational_items_2."archived_at"::text as "18",
    __relational_posts__."id"::text as "19",
    __relational_posts__."title"::text as "20",
    __relational_posts__."description"::text as "21",
    __relational_posts__."note"::text as "22",
    __relational_items_3."parent_id"::text as "23",
    __relational_items_3."type"::text as "24",
    __relational_items_3."author_id"::text as "25",
    __relational_items_3."position"::text as "26",
    __relational_items_3."created_at"::text as "27",
    __relational_items_3."updated_at"::text as "28",
    __relational_items_3."is_explicitly_archived"::text as "29",
    __relational_items_3."archived_at"::text as "30",
    __relational_dividers__."id"::text as "31",
    __relational_dividers__."title"::text as "32",
    __relational_dividers__."color"::text as "33",
    __relational_items_4."parent_id"::text as "34",
    __relational_items_4."type"::text as "35",
    __relational_items_4."author_id"::text as "36",
    __relational_items_4."position"::text as "37",
    __relational_items_4."created_at"::text as "38",
    __relational_items_4."updated_at"::text as "39",
    __relational_items_4."is_explicitly_archived"::text as "40",
    __relational_items_4."archived_at"::text as "41",
    __relational_checklists__."id"::text as "42",
    __relational_checklists__."title"::text as "43",
    __relational_items_5."parent_id"::text as "44",
    __relational_items_5."type"::text as "45",
    __relational_items_5."author_id"::text as "46",
    __relational_items_5."position"::text as "47",
    __relational_items_5."created_at"::text as "48",
    __relational_items_5."updated_at"::text as "49",
    __relational_items_5."is_explicitly_archived"::text as "50",
    __relational_items_5."archived_at"::text as "51",
    __relational_checklist_items__."id"::text as "52",
    __relational_checklist_items__."description"::text as "53",
    __relational_checklist_items__."note"::text as "54",
    __relational_items_6."id"::text as "55",
    __relational_items_identifiers__.idx as "56"
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
    __relational_items_6."type"::text as "0",
    __relational_items__."type"::text as "1",
    __relational_items__."author_id"::text as "2",
    __relational_items__."position"::text as "3",
    __relational_items__."created_at"::text as "4",
    __relational_items__."updated_at"::text as "5",
    __relational_items__."is_explicitly_archived"::text as "6",
    __relational_items__."archived_at"::text as "7",
    __relational_topics__."id"::text as "8",
    __relational_topics__."title"::text as "9",
    __relational_items_2."type"::text as "10",
    __relational_items_2."author_id"::text as "11",
    __relational_items_2."position"::text as "12",
    __relational_items_2."created_at"::text as "13",
    __relational_items_2."updated_at"::text as "14",
    __relational_items_2."is_explicitly_archived"::text as "15",
    __relational_items_2."archived_at"::text as "16",
    __relational_posts__."id"::text as "17",
    __relational_posts__."title"::text as "18",
    __relational_posts__."description"::text as "19",
    __relational_posts__."note"::text as "20",
    __relational_items_3."type"::text as "21",
    __relational_items_3."author_id"::text as "22",
    __relational_items_3."position"::text as "23",
    __relational_items_3."created_at"::text as "24",
    __relational_items_3."updated_at"::text as "25",
    __relational_items_3."is_explicitly_archived"::text as "26",
    __relational_items_3."archived_at"::text as "27",
    __relational_dividers__."id"::text as "28",
    __relational_dividers__."title"::text as "29",
    __relational_dividers__."color"::text as "30",
    __relational_items_4."type"::text as "31",
    __relational_items_4."author_id"::text as "32",
    __relational_items_4."position"::text as "33",
    __relational_items_4."created_at"::text as "34",
    __relational_items_4."updated_at"::text as "35",
    __relational_items_4."is_explicitly_archived"::text as "36",
    __relational_items_4."archived_at"::text as "37",
    __relational_checklists__."id"::text as "38",
    __relational_checklists__."title"::text as "39",
    __relational_items_5."type"::text as "40",
    __relational_items_5."author_id"::text as "41",
    __relational_items_5."position"::text as "42",
    __relational_items_5."created_at"::text as "43",
    __relational_items_5."updated_at"::text as "44",
    __relational_items_5."is_explicitly_archived"::text as "45",
    __relational_items_5."archived_at"::text as "46",
    __relational_checklist_items__."id"::text as "47",
    __relational_checklist_items__."description"::text as "48",
    __relational_checklist_items__."note"::text as "49",
    __relational_items_6."id"::text as "50",
    __relational_items_identifiers__.idx as "51"
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
      __relational_items_6."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items_6."id" asc
) as __relational_items_result__

select __people_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __people_identifiers__,
lateral (
  select
    __people__."username"::text as "0",
    __people_identifiers__.idx as "1"
  from interfaces_and_unions.people as __people__
  where
    (
      true /* authorization checks */
    ) and (
      __people__."person_id" = __people_identifiers__."id0"
    )
  order by __people__."person_id" asc
) as __people_result__

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
    __relational_items__."type"::text as "1",
    __relational_items__."author_id"::text as "2",
    __relational_items__."position"::text as "3",
    __relational_items__."created_at"::text as "4",
    __relational_items__."updated_at"::text as "5",
    __relational_items__."is_explicitly_archived"::text as "6",
    __relational_items__."archived_at"::text as "7",
    __relational_topics__."id"::text as "8",
    __relational_topics__."title"::text as "9",
    __relational_items_2."type"::text as "10",
    __relational_items_2."author_id"::text as "11",
    __relational_items_2."position"::text as "12",
    __relational_items_2."created_at"::text as "13",
    __relational_items_2."updated_at"::text as "14",
    __relational_items_2."is_explicitly_archived"::text as "15",
    __relational_items_2."archived_at"::text as "16",
    __relational_posts__."id"::text as "17",
    __relational_posts__."title"::text as "18",
    __relational_posts__."description"::text as "19",
    __relational_posts__."note"::text as "20",
    __relational_items_3."type"::text as "21",
    __relational_items_3."author_id"::text as "22",
    __relational_items_3."position"::text as "23",
    __relational_items_3."created_at"::text as "24",
    __relational_items_3."updated_at"::text as "25",
    __relational_items_3."is_explicitly_archived"::text as "26",
    __relational_items_3."archived_at"::text as "27",
    __relational_dividers__."id"::text as "28",
    __relational_dividers__."title"::text as "29",
    __relational_dividers__."color"::text as "30",
    __relational_items_4."type"::text as "31",
    __relational_items_4."author_id"::text as "32",
    __relational_items_4."position"::text as "33",
    __relational_items_4."created_at"::text as "34",
    __relational_items_4."updated_at"::text as "35",
    __relational_items_4."is_explicitly_archived"::text as "36",
    __relational_items_4."archived_at"::text as "37",
    __relational_checklists__."id"::text as "38",
    __relational_checklists__."title"::text as "39",
    __relational_items_5."type"::text as "40",
    __relational_items_5."author_id"::text as "41",
    __relational_items_5."position"::text as "42",
    __relational_items_5."created_at"::text as "43",
    __relational_items_5."updated_at"::text as "44",
    __relational_items_5."is_explicitly_archived"::text as "45",
    __relational_items_5."archived_at"::text as "46",
    __relational_checklist_items__."id"::text as "47",
    __relational_checklist_items__."description"::text as "48",
    __relational_checklist_items__."note"::text as "49",
    __relational_items_6."id"::text as "50",
    __relational_items_identifiers__.idx as "51"
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
      __relational_items_6."id" = __relational_items_identifiers__."id0"
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
    __relational_items_6."type"::text as "0",
    __relational_items__."type"::text as "1",
    __relational_items__."author_id"::text as "2",
    __relational_items__."position"::text as "3",
    __relational_items__."created_at"::text as "4",
    __relational_items__."updated_at"::text as "5",
    __relational_items__."is_explicitly_archived"::text as "6",
    __relational_items__."archived_at"::text as "7",
    __relational_topics__."id"::text as "8",
    __relational_topics__."title"::text as "9",
    __relational_items_2."type"::text as "10",
    __relational_items_2."author_id"::text as "11",
    __relational_items_2."position"::text as "12",
    __relational_items_2."created_at"::text as "13",
    __relational_items_2."updated_at"::text as "14",
    __relational_items_2."is_explicitly_archived"::text as "15",
    __relational_items_2."archived_at"::text as "16",
    __relational_posts__."id"::text as "17",
    __relational_posts__."title"::text as "18",
    __relational_posts__."description"::text as "19",
    __relational_posts__."note"::text as "20",
    __relational_items_3."type"::text as "21",
    __relational_items_3."author_id"::text as "22",
    __relational_items_3."position"::text as "23",
    __relational_items_3."created_at"::text as "24",
    __relational_items_3."updated_at"::text as "25",
    __relational_items_3."is_explicitly_archived"::text as "26",
    __relational_items_3."archived_at"::text as "27",
    __relational_dividers__."id"::text as "28",
    __relational_dividers__."title"::text as "29",
    __relational_dividers__."color"::text as "30",
    __relational_items_4."type"::text as "31",
    __relational_items_4."author_id"::text as "32",
    __relational_items_4."position"::text as "33",
    __relational_items_4."created_at"::text as "34",
    __relational_items_4."updated_at"::text as "35",
    __relational_items_4."is_explicitly_archived"::text as "36",
    __relational_items_4."archived_at"::text as "37",
    __relational_checklists__."id"::text as "38",
    __relational_checklists__."title"::text as "39",
    __relational_items_5."type"::text as "40",
    __relational_items_5."author_id"::text as "41",
    __relational_items_5."position"::text as "42",
    __relational_items_5."created_at"::text as "43",
    __relational_items_5."updated_at"::text as "44",
    __relational_items_5."is_explicitly_archived"::text as "45",
    __relational_items_5."archived_at"::text as "46",
    __relational_checklist_items__."id"::text as "47",
    __relational_checklist_items__."description"::text as "48",
    __relational_checklist_items__."note"::text as "49",
    __relational_items_6."id"::text as "50",
    __relational_items_identifiers__.idx as "51"
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
      __relational_items_6."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items_6."id" asc
) as __relational_items_result__

select __people_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __people_identifiers__,
lateral (
  select
    __people__."username"::text as "0",
    __people_identifiers__.idx as "1"
  from interfaces_and_unions.people as __people__
  where
    (
      true /* authorization checks */
    ) and (
      __people__."person_id" = __people_identifiers__."id0"
    )
  order by __people__."person_id" asc
) as __people_result__

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
    __relational_items__."type"::text as "1",
    __relational_items__."author_id"::text as "2",
    __relational_items__."position"::text as "3",
    __relational_items__."created_at"::text as "4",
    __relational_items__."updated_at"::text as "5",
    __relational_items__."is_explicitly_archived"::text as "6",
    __relational_items__."archived_at"::text as "7",
    __relational_topics__."id"::text as "8",
    __relational_topics__."title"::text as "9",
    __relational_items_2."type"::text as "10",
    __relational_items_2."author_id"::text as "11",
    __relational_items_2."position"::text as "12",
    __relational_items_2."created_at"::text as "13",
    __relational_items_2."updated_at"::text as "14",
    __relational_items_2."is_explicitly_archived"::text as "15",
    __relational_items_2."archived_at"::text as "16",
    __relational_posts__."id"::text as "17",
    __relational_posts__."title"::text as "18",
    __relational_posts__."description"::text as "19",
    __relational_posts__."note"::text as "20",
    __relational_items_3."type"::text as "21",
    __relational_items_3."author_id"::text as "22",
    __relational_items_3."position"::text as "23",
    __relational_items_3."created_at"::text as "24",
    __relational_items_3."updated_at"::text as "25",
    __relational_items_3."is_explicitly_archived"::text as "26",
    __relational_items_3."archived_at"::text as "27",
    __relational_dividers__."id"::text as "28",
    __relational_dividers__."title"::text as "29",
    __relational_dividers__."color"::text as "30",
    __relational_items_4."type"::text as "31",
    __relational_items_4."author_id"::text as "32",
    __relational_items_4."position"::text as "33",
    __relational_items_4."created_at"::text as "34",
    __relational_items_4."updated_at"::text as "35",
    __relational_items_4."is_explicitly_archived"::text as "36",
    __relational_items_4."archived_at"::text as "37",
    __relational_checklists__."id"::text as "38",
    __relational_checklists__."title"::text as "39",
    __relational_items_5."type"::text as "40",
    __relational_items_5."author_id"::text as "41",
    __relational_items_5."position"::text as "42",
    __relational_items_5."created_at"::text as "43",
    __relational_items_5."updated_at"::text as "44",
    __relational_items_5."is_explicitly_archived"::text as "45",
    __relational_items_5."archived_at"::text as "46",
    __relational_checklist_items__."id"::text as "47",
    __relational_checklist_items__."description"::text as "48",
    __relational_checklist_items__."note"::text as "49",
    __relational_items_6."id"::text as "50",
    __relational_items_identifiers__.idx as "51"
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
      __relational_items_6."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items_6."id" asc
) as __relational_items_result__