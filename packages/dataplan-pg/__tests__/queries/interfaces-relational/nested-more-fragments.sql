select
  __people__."username" as "0",
  (select json_agg(_) from (
    select
      __relational_items_2."type"::text as "0",
      __relational_topics_2."title" as "1",
      __relational_topics_2."id"::text as "2",
      __relational_posts_2."title" as "3",
      __relational_posts_2."description" as "4",
      __relational_posts_2."note" as "5",
      __relational_posts_2."id"::text as "6",
      __relational_dividers_2."title" as "7",
      __relational_dividers_2."color" as "8",
      __relational_dividers_2."id"::text as "9",
      __relational_checklists_2."title" as "10",
      __relational_checklists_2."id"::text as "11",
      __relational_checklist_items_2."description" as "12",
      __relational_checklist_items_2."note" as "13",
      __relational_items_2."id"::text as "14",
      __relational_items__."type"::text as "15",
      __relational_topics__."title" as "16",
      __relational_topics__."id"::text as "17",
      __relational_posts__."title" as "18",
      __relational_posts__."description" as "19",
      __relational_posts__."note" as "20",
      __relational_posts__."id"::text as "21",
      __relational_dividers__."title" as "22",
      __relational_dividers__."color" as "23",
      __relational_dividers__."id"::text as "24",
      __relational_checklists__."title" as "25",
      __relational_checklists__."id"::text as "26",
      __relational_checklist_items__."description" as "27",
      __relational_checklist_items__."note" as "28",
      __relational_items__."id"::text as "29",
      __relational_items__."type2"::text as "30",
      __people_2."username" as "31",
      __relational_items__."position"::text as "32",
      to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "33",
      to_char(__relational_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "34",
      __relational_items__."is_explicitly_archived"::text as "35",
      to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "36",
      __relational_items_2."type2"::text as "37",
      __people_3."username" as "38",
      __relational_items_2."position"::text as "39",
      to_char(__relational_items_2."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "40",
      to_char(__relational_items_2."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "41",
      __relational_items_2."is_explicitly_archived"::text as "42",
      to_char(__relational_items_2."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "43"
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
    left outer join interfaces_and_unions.people as __people_2
    on (__relational_items__."author_id"::"int4" = __people_2."person_id")
    left outer join interfaces_and_unions.people as __people_3
    on (__relational_items_2."author_id"::"int4" = __people_3."person_id")
    where
      (
        __people__."person_id"::"int4" = __relational_items_2."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items_2."id" asc
  ) _) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc