select
  __relational_commentables__."type"::text as "0",
  __relational_items__."type"::text as "1",
  __relational_items__."position"::text as "2",
  __relational_items_2."type"::text as "3",
  __relational_items_2."position"::text as "4",
  __relational_items_3."type"::text as "5",
  __relational_items_3."position"::text as "6"
from interfaces_and_unions.relational_commentables as __relational_commentables__
left outer join interfaces_and_unions.relational_posts as __relational_posts__
on (__relational_commentables__."id"::"int4" = __relational_posts__."id")
left outer join interfaces_and_unions.relational_items as __relational_items__
on (__relational_posts__."id"::"int4" = __relational_items__."id")
left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
on (__relational_commentables__."id"::"int4" = __relational_checklists__."id")
left outer join interfaces_and_unions.relational_items as __relational_items_2
on (__relational_checklists__."id"::"int4" = __relational_items_2."id")
left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
on (__relational_commentables__."id"::"int4" = __relational_checklist_items__."id")
left outer join interfaces_and_unions.relational_items as __relational_items_3
on (__relational_checklist_items__."id"::"int4" = __relational_items_3."id")
where (
  true /* authorization checks */
)
order by __relational_commentables__.id asc
limit 1