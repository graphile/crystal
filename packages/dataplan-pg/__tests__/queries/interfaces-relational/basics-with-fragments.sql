select
  __people__."username"::text as "0",
  array(
    select array[
      __relational_items__."type"::text,
      __relational_topics__."title"::text,
      __relational_posts__."title"::text,
      __relational_posts__."description"::text,
      __relational_posts__."note"::text,
      __relational_dividers__."title"::text,
      __relational_dividers__."color"::text,
      __relational_checklists__."title"::text,
      __relational_checklist_items__."description"::text,
      __relational_checklist_items__."note"::text,
      __relational_items__."id"::text,
      __relational_items__."type2"::text,
      __relational_items__."position"::text,
      __relational_items__."created_at"::text,
      __relational_items__."updated_at"::text,
      __relational_items__."is_explicitly_archived"::text,
      __relational_items__."archived_at"::text
    ]::text[]
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
  ) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc