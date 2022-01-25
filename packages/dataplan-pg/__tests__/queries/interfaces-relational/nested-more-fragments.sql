select
  __people__."username" as "0",
  (select json_agg(_._) from (
    select json_build_array(
      __relational_items_2."type"::text,
      __relational_topics_2."title",
      __relational_topics_2."id"::text,
      __relational_posts_2."title",
      __relational_posts_2."description",
      __relational_posts_2."note",
      __relational_posts_2."id"::text,
      __relational_dividers_2."title",
      __relational_dividers_2."color",
      __relational_dividers_2."id"::text,
      __relational_checklists_2."title",
      __relational_checklists_2."id"::text,
      __relational_checklist_items_2."description",
      __relational_checklist_items_2."note",
      __relational_items_2."id"::text,
      __relational_items__."type"::text,
      __relational_topics__."title",
      __relational_topics__."id"::text,
      __relational_posts__."title",
      __relational_posts__."description",
      __relational_posts__."note",
      __relational_posts__."id"::text,
      __relational_dividers__."title",
      __relational_dividers__."color",
      __relational_dividers__."id"::text,
      __relational_checklists__."title",
      __relational_checklists__."id"::text,
      __relational_checklist_items__."description",
      __relational_checklist_items__."note",
      __relational_items__."id"::text,
      __relational_items__."type2"::text,
      __people_2."username",
      __relational_items__."position"::text,
      to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'),
      to_char(__relational_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'),
      __relational_items__."is_explicitly_archived"::text,
      to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'),
      __relational_items_2."type2"::text,
      __people_3."username",
      __relational_items_2."position"::text,
      to_char(__relational_items_2."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'),
      to_char(__relational_items_2."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'),
      __relational_items_2."is_explicitly_archived"::text,
      to_char(__relational_items_2."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM')
    ) as _
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