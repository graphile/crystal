select
  __people__."username"::text as "0",
  array(
    select array[
      __relational_items_6."type"::text,
      __relational_items__."type"::text,
      __relational_items__."position"::text,
      __relational_items__."created_at"::text,
      __relational_items__."updated_at"::text,
      __relational_items__."is_explicitly_archived"::text,
      __relational_items__."archived_at"::text,
      __relational_topics__."id"::text,
      __relational_topics__."title"::text,
      __relational_items_2."type"::text,
      __relational_items_2."position"::text,
      __relational_items_2."created_at"::text,
      __relational_items_2."updated_at"::text,
      __relational_items_2."is_explicitly_archived"::text,
      __relational_items_2."archived_at"::text,
      __relational_posts__."id"::text,
      __relational_posts__."title"::text,
      __relational_posts__."description"::text,
      __relational_posts__."note"::text,
      __relational_items_3."type"::text,
      __relational_items_3."position"::text,
      __relational_items_3."created_at"::text,
      __relational_items_3."updated_at"::text,
      __relational_items_3."is_explicitly_archived"::text,
      __relational_items_3."archived_at"::text,
      __relational_dividers__."id"::text,
      __relational_dividers__."title"::text,
      __relational_dividers__."color"::text,
      __relational_items_4."type"::text,
      __relational_items_4."position"::text,
      __relational_items_4."created_at"::text,
      __relational_items_4."updated_at"::text,
      __relational_items_4."is_explicitly_archived"::text,
      __relational_items_4."archived_at"::text,
      __relational_checklists__."id"::text,
      __relational_checklists__."title"::text,
      __relational_items_5."type"::text,
      __relational_items_5."position"::text,
      __relational_items_5."created_at"::text,
      __relational_items_5."updated_at"::text,
      __relational_items_5."is_explicitly_archived"::text,
      __relational_items_5."archived_at"::text,
      __relational_checklist_items__."id"::text,
      __relational_checklist_items__."description"::text,
      __relational_checklist_items__."note"::text,
      __relational_items_6."id"::text
    ]::text[]
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
        __people__."person_id"::"int4" = __relational_items_6."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items_6."id" asc
  ) as "1",
  __people__."person_id"::text as "2"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc