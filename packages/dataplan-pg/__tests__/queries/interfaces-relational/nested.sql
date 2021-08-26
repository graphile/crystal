select
  __people__."username"::text as "0",
  array(
    select array[
      __relational_items_2."type"::text,
      __relational_topics_2."id"::text,
      __relational_posts_2."id"::text,
      __relational_dividers_2."id"::text,
      __relational_checklists_2."id"::text,
      __relational_checklist_items_2."id"::text,
      __relational_items_2."id"::text,
      __relational_items__."type"::text,
      __relational_topics__."id"::text,
      __relational_posts__."id"::text,
      __relational_dividers__."id"::text,
      __relational_checklists__."id"::text,
      __relational_checklist_items__."id"::text,
      __relational_items__."id"::text,
      __relational_items_2."parent_id"::text
    ]::text[]
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
    where
      (
        __people__."person_id"::"int4" = __relational_items_2."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items_2."id" asc
  ) as "1",
  __people__."person_id"::text as "2"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc