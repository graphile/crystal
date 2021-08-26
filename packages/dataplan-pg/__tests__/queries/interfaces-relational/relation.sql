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
    __people__."username"::text as "2",
    __relational_items_3."author_id"::text as "3",
    __relational_topics__."id"::text as "4",
    __people_2."username"::text as "5",
    __relational_items_4."author_id"::text as "6",
    __relational_posts__."id"::text as "7",
    __people_3."username"::text as "8",
    __relational_items_5."author_id"::text as "9",
    __relational_dividers__."id"::text as "10",
    __people_4."username"::text as "11",
    __relational_items_6."author_id"::text as "12",
    __relational_checklists__."id"::text as "13",
    __people_5."username"::text as "14",
    __relational_items_7."author_id"::text as "15",
    __relational_checklist_items__."id"::text as "16",
    __relational_items_2."id"::text as "17",
    __relational_items_8."parent_id"::text as "18",
    __relational_topics_2."id"::text as "19",
    __relational_items_9."type"::text as "20",
    __people_6."username"::text as "21",
    __relational_items_10."author_id"::text as "22",
    __relational_topics_3."id"::text as "23",
    __people_7."username"::text as "24",
    __relational_items_11."author_id"::text as "25",
    __relational_posts_2."id"::text as "26",
    __people_8."username"::text as "27",
    __relational_items_12."author_id"::text as "28",
    __relational_dividers_2."id"::text as "29",
    __people_9."username"::text as "30",
    __relational_items_13."author_id"::text as "31",
    __relational_checklists_2."id"::text as "32",
    __people_10."username"::text as "33",
    __relational_items_14."author_id"::text as "34",
    __relational_checklist_items_2."id"::text as "35",
    __relational_items_9."id"::text as "36",
    __relational_items_15."parent_id"::text as "37",
    __relational_posts_3."id"::text as "38",
    __relational_items_16."type"::text as "39",
    __people_11."username"::text as "40",
    __relational_items_17."author_id"::text as "41",
    __relational_topics_4."id"::text as "42",
    __people_12."username"::text as "43",
    __relational_items_18."author_id"::text as "44",
    __relational_posts_4."id"::text as "45",
    __people_13."username"::text as "46",
    __relational_items_19."author_id"::text as "47",
    __relational_dividers_3."id"::text as "48",
    __people_14."username"::text as "49",
    __relational_items_20."author_id"::text as "50",
    __relational_checklists_3."id"::text as "51",
    __people_15."username"::text as "52",
    __relational_items_21."author_id"::text as "53",
    __relational_checklist_items_3."id"::text as "54",
    __relational_items_16."id"::text as "55",
    __relational_items_22."parent_id"::text as "56",
    __relational_dividers_4."id"::text as "57",
    __relational_items_23."type"::text as "58",
    __people_16."username"::text as "59",
    __relational_items_24."author_id"::text as "60",
    __relational_topics_5."id"::text as "61",
    __people_17."username"::text as "62",
    __relational_items_25."author_id"::text as "63",
    __relational_posts_5."id"::text as "64",
    __people_18."username"::text as "65",
    __relational_items_26."author_id"::text as "66",
    __relational_dividers_5."id"::text as "67",
    __people_19."username"::text as "68",
    __relational_items_27."author_id"::text as "69",
    __relational_checklists_4."id"::text as "70",
    __people_20."username"::text as "71",
    __relational_items_28."author_id"::text as "72",
    __relational_checklist_items_4."id"::text as "73",
    __relational_items_23."id"::text as "74",
    __relational_items_29."parent_id"::text as "75",
    __relational_checklists_5."id"::text as "76",
    __relational_items_30."type"::text as "77",
    __people_21."username"::text as "78",
    __relational_items_31."author_id"::text as "79",
    __relational_topics_6."id"::text as "80",
    __people_22."username"::text as "81",
    __relational_items_32."author_id"::text as "82",
    __relational_posts_6."id"::text as "83",
    __people_23."username"::text as "84",
    __relational_items_33."author_id"::text as "85",
    __relational_dividers_6."id"::text as "86",
    __people_24."username"::text as "87",
    __relational_items_34."author_id"::text as "88",
    __relational_checklists_6."id"::text as "89",
    __people_25."username"::text as "90",
    __relational_items_35."author_id"::text as "91",
    __relational_checklist_items_5."id"::text as "92",
    __relational_items_30."id"::text as "93",
    __relational_items_36."parent_id"::text as "94",
    __relational_checklist_items_6."id"::text as "95",
    __relational_items__."id"::text as "96",
    __relational_items_identifiers__.idx as "97"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_topics as __relational_topics_2
  on (__relational_items__."id"::"int4" = __relational_topics_2."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_8
  on (__relational_topics_2."id"::"int4" = __relational_items_8."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_2
  on (__relational_items_8."parent_id"::"int4" = __relational_items_2."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items_2."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_3
  on (__relational_topics__."id"::"int4" = __relational_items_3."id")
  left outer join interfaces_and_unions.people as __people__
  on (__relational_items_3."author_id"::"int4" = __people__."person_id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items_2."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_4
  on (__relational_posts__."id"::"int4" = __relational_items_4."id")
  left outer join interfaces_and_unions.people as __people_2
  on (__relational_items_4."author_id"::"int4" = __people_2."person_id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items_2."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_5
  on (__relational_dividers__."id"::"int4" = __relational_items_5."id")
  left outer join interfaces_and_unions.people as __people_3
  on (__relational_items_5."author_id"::"int4" = __people_3."person_id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items_2."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_6
  on (__relational_checklists__."id"::"int4" = __relational_items_6."id")
  left outer join interfaces_and_unions.people as __people_4
  on (__relational_items_6."author_id"::"int4" = __people_4."person_id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items_2."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_7
  on (__relational_checklist_items__."id"::"int4" = __relational_items_7."id")
  left outer join interfaces_and_unions.people as __people_5
  on (__relational_items_7."author_id"::"int4" = __people_5."person_id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts_3
  on (__relational_items__."id"::"int4" = __relational_posts_3."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_15
  on (__relational_posts_3."id"::"int4" = __relational_items_15."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_9
  on (__relational_items_15."parent_id"::"int4" = __relational_items_9."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics_3
  on (__relational_items_9."id"::"int4" = __relational_topics_3."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_10
  on (__relational_topics_3."id"::"int4" = __relational_items_10."id")
  left outer join interfaces_and_unions.people as __people_6
  on (__relational_items_10."author_id"::"int4" = __people_6."person_id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts_2
  on (__relational_items_9."id"::"int4" = __relational_posts_2."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_11
  on (__relational_posts_2."id"::"int4" = __relational_items_11."id")
  left outer join interfaces_and_unions.people as __people_7
  on (__relational_items_11."author_id"::"int4" = __people_7."person_id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers_2
  on (__relational_items_9."id"::"int4" = __relational_dividers_2."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_12
  on (__relational_dividers_2."id"::"int4" = __relational_items_12."id")
  left outer join interfaces_and_unions.people as __people_8
  on (__relational_items_12."author_id"::"int4" = __people_8."person_id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists_2
  on (__relational_items_9."id"::"int4" = __relational_checklists_2."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_13
  on (__relational_checklists_2."id"::"int4" = __relational_items_13."id")
  left outer join interfaces_and_unions.people as __people_9
  on (__relational_items_13."author_id"::"int4" = __people_9."person_id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_2
  on (__relational_items_9."id"::"int4" = __relational_checklist_items_2."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_14
  on (__relational_checklist_items_2."id"::"int4" = __relational_items_14."id")
  left outer join interfaces_and_unions.people as __people_10
  on (__relational_items_14."author_id"::"int4" = __people_10."person_id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers_4
  on (__relational_items__."id"::"int4" = __relational_dividers_4."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_22
  on (__relational_dividers_4."id"::"int4" = __relational_items_22."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_16
  on (__relational_items_22."parent_id"::"int4" = __relational_items_16."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics_4
  on (__relational_items_16."id"::"int4" = __relational_topics_4."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_17
  on (__relational_topics_4."id"::"int4" = __relational_items_17."id")
  left outer join interfaces_and_unions.people as __people_11
  on (__relational_items_17."author_id"::"int4" = __people_11."person_id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts_4
  on (__relational_items_16."id"::"int4" = __relational_posts_4."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_18
  on (__relational_posts_4."id"::"int4" = __relational_items_18."id")
  left outer join interfaces_and_unions.people as __people_12
  on (__relational_items_18."author_id"::"int4" = __people_12."person_id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers_3
  on (__relational_items_16."id"::"int4" = __relational_dividers_3."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_19
  on (__relational_dividers_3."id"::"int4" = __relational_items_19."id")
  left outer join interfaces_and_unions.people as __people_13
  on (__relational_items_19."author_id"::"int4" = __people_13."person_id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists_3
  on (__relational_items_16."id"::"int4" = __relational_checklists_3."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_20
  on (__relational_checklists_3."id"::"int4" = __relational_items_20."id")
  left outer join interfaces_and_unions.people as __people_14
  on (__relational_items_20."author_id"::"int4" = __people_14."person_id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_3
  on (__relational_items_16."id"::"int4" = __relational_checklist_items_3."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_21
  on (__relational_checklist_items_3."id"::"int4" = __relational_items_21."id")
  left outer join interfaces_and_unions.people as __people_15
  on (__relational_items_21."author_id"::"int4" = __people_15."person_id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists_5
  on (__relational_items__."id"::"int4" = __relational_checklists_5."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_29
  on (__relational_checklists_5."id"::"int4" = __relational_items_29."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_23
  on (__relational_items_29."parent_id"::"int4" = __relational_items_23."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics_5
  on (__relational_items_23."id"::"int4" = __relational_topics_5."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_24
  on (__relational_topics_5."id"::"int4" = __relational_items_24."id")
  left outer join interfaces_and_unions.people as __people_16
  on (__relational_items_24."author_id"::"int4" = __people_16."person_id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts_5
  on (__relational_items_23."id"::"int4" = __relational_posts_5."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_25
  on (__relational_posts_5."id"::"int4" = __relational_items_25."id")
  left outer join interfaces_and_unions.people as __people_17
  on (__relational_items_25."author_id"::"int4" = __people_17."person_id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers_5
  on (__relational_items_23."id"::"int4" = __relational_dividers_5."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_26
  on (__relational_dividers_5."id"::"int4" = __relational_items_26."id")
  left outer join interfaces_and_unions.people as __people_18
  on (__relational_items_26."author_id"::"int4" = __people_18."person_id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists_4
  on (__relational_items_23."id"::"int4" = __relational_checklists_4."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_27
  on (__relational_checklists_4."id"::"int4" = __relational_items_27."id")
  left outer join interfaces_and_unions.people as __people_19
  on (__relational_items_27."author_id"::"int4" = __people_19."person_id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_4
  on (__relational_items_23."id"::"int4" = __relational_checklist_items_4."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_28
  on (__relational_checklist_items_4."id"::"int4" = __relational_items_28."id")
  left outer join interfaces_and_unions.people as __people_20
  on (__relational_items_28."author_id"::"int4" = __people_20."person_id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_6
  on (__relational_items__."id"::"int4" = __relational_checklist_items_6."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_36
  on (__relational_checklist_items_6."id"::"int4" = __relational_items_36."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_30
  on (__relational_items_36."parent_id"::"int4" = __relational_items_30."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics_6
  on (__relational_items_30."id"::"int4" = __relational_topics_6."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_31
  on (__relational_topics_6."id"::"int4" = __relational_items_31."id")
  left outer join interfaces_and_unions.people as __people_21
  on (__relational_items_31."author_id"::"int4" = __people_21."person_id")
  left outer join interfaces_and_unions.relational_posts as __relational_posts_6
  on (__relational_items_30."id"::"int4" = __relational_posts_6."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_32
  on (__relational_posts_6."id"::"int4" = __relational_items_32."id")
  left outer join interfaces_and_unions.people as __people_22
  on (__relational_items_32."author_id"::"int4" = __people_22."person_id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers_6
  on (__relational_items_30."id"::"int4" = __relational_dividers_6."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_33
  on (__relational_dividers_6."id"::"int4" = __relational_items_33."id")
  left outer join interfaces_and_unions.people as __people_23
  on (__relational_items_33."author_id"::"int4" = __people_23."person_id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists_6
  on (__relational_items_30."id"::"int4" = __relational_checklists_6."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_34
  on (__relational_checklists_6."id"::"int4" = __relational_items_34."id")
  left outer join interfaces_and_unions.people as __people_24
  on (__relational_items_34."author_id"::"int4" = __people_24."person_id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items_5
  on (__relational_items_30."id"::"int4" = __relational_checklist_items_5."id")
  left outer join interfaces_and_unions.relational_items as __relational_items_35
  on (__relational_checklist_items_5."id"::"int4" = __relational_items_35."id")
  left outer join interfaces_and_unions.people as __people_25
  on (__relational_items_35."author_id"::"int4" = __people_25."person_id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__