select
  __relational_commentables__."type"::text as "0",
  __relational_commentables__."id"::text as "1"
from interfaces_and_unions.relational_commentables as __relational_commentables__
where (
  true /* authorization checks */
)
order by __relational_commentables__.id asc;

select __relational_posts_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."id"::text as "0",
    __relational_posts__."title" as "1",
    __relational_posts__."description" as "2",
    __relational_posts__."note" as "3",
    __relational_items__."type"::text as "4",
    __relational_items__."type2"::text as "5",
    __relational_items__."position"::text as "6",
    __relational_posts_identifiers__.idx as "7"
  from interfaces_and_unions.relational_posts as __relational_posts__
  left outer join interfaces_and_unions.relational_items as __relational_items__
  on (
  /* WHERE becoming ON */
    (
      __relational_items__."id" = __relational_posts__."id"
    ) and (
      true /* authorization checks */
    )
  )
  where
    (
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    ) and (
      true /* authorization checks */
    )
) as __relational_posts_result__;

select
  __relational_checklists__."id"::text as "0",
  __relational_checklists__."title" as "1",
  __relational_items__."type"::text as "2",
  __relational_items__."type2"::text as "3",
  __relational_items__."position"::text as "4"
from interfaces_and_unions.relational_checklists as __relational_checklists__
left outer join interfaces_and_unions.relational_items as __relational_items__
on (
/* WHERE becoming ON */
  (
    __relational_items__."id" = __relational_checklists__."id"
  ) and (
    true /* authorization checks */
  )
)
where
  (
    __relational_checklists__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select __relational_checklist_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_checklist_items_identifiers__,
lateral (
  select
    __relational_checklist_items__."id"::text as "0",
    __relational_checklist_items__."description" as "1",
    __relational_checklist_items__."note" as "2",
    __relational_items__."type"::text as "3",
    __relational_items__."type2"::text as "4",
    __relational_items__."position"::text as "5",
    __relational_checklist_items_identifiers__.idx as "6"
  from interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  left outer join interfaces_and_unions.relational_items as __relational_items__
  on (
  /* WHERE becoming ON */
    (
      __relational_items__."id" = __relational_checklist_items__."id"
    ) and (
      true /* authorization checks */
    )
  )
  where
    (
      __relational_checklist_items__."id" = __relational_checklist_items_identifiers__."id0"
    ) and (
      true /* authorization checks */
    )
) as __relational_checklist_items_result__;
