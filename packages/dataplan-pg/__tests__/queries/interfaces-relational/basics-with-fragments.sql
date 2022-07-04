select
  __people__."username" as "0",
  (select json_agg(_) from (
    select
      __relational_items__."type"::text as "0",
      __relational_topics__."title" as "1",
      __relational_topics__."id"::text as "2",
      __relational_posts__."title" as "3",
      __relational_posts__."description" as "4",
      __relational_posts__."note" as "5",
      __relational_posts__."id"::text as "6",
      __relational_dividers__."title" as "7",
      __relational_dividers__."color" as "8",
      __relational_dividers__."id"::text as "9",
      __relational_checklists__."title" as "10",
      __relational_checklists__."id"::text as "11",
      __relational_checklist_items__."description" as "12",
      __relational_checklist_items__."note" as "13",
      __relational_items__."id"::text as "14",
      __relational_items__."type2"::text as "15",
      __relational_items__."position"::text as "16",
      to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "17",
      to_char(__relational_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "18",
      __relational_items__."is_explicitly_archived"::text as "19",
      to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "20"
    from interfaces_and_unions.relational_items as __relational_items__
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
    where
      (
        __people__."person_id"::"int4" = __relational_items__."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items__."id" asc
  ) _) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc