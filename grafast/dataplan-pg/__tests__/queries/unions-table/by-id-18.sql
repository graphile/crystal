select __union_items_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __union_items_identifiers__,
lateral (
  select
    __union_items__."type"::text as "0",
    __union_items__."id"::text as "1",
    __union_items_identifiers__.idx as "2"
  from interfaces_and_unions.union_items as __union_items__
  where
    (
      true /* authorization checks */
    ) and (
      __union_items__."id" = __union_items_identifiers__."id0"
    )
  order by __union_items__."id" asc
) as __union_items_result__;

select __union_checklist_items_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __union_checklist_items_identifiers__,
lateral (
  select
    __union_checklist_items__."id"::text as "0",
    __union_checklist_items__."description" as "1",
    __union_checklist_items__."note" as "2",
    __union_checklist_items_identifiers__.idx as "3"
  from interfaces_and_unions.union_checklist_items as __union_checklist_items__
  where
    (
      true /* authorization checks */
    ) and (
      __union_checklist_items__."id" = __union_checklist_items_identifiers__."id0"
    )
  order by __union_checklist_items__."id" asc
) as __union_checklist_items_result__;
