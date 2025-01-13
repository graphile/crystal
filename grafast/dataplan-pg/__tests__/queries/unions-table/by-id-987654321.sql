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
) as __union_items_result__;

select
  __union__."0" as "0",
  __union__."1"::text as "1"
from (
    select
      __union_topics__."0",
      __union_topics__."1",
      "n"
    from (
      select
        'UnionTopic' as "0",
        json_build_array((__union_topics__."id")::text) as "1",
        row_number() over (
          order by
            __union_topics__."id" asc
        ) as "n"
      from interfaces_and_unions.union_topics as __union_topics__
      where __union_topics__.id = $1::"int4"
      order by
        __union_topics__."id" asc
    ) as __union_topics__
  union all
    select
      __union_posts__."0",
      __union_posts__."1",
      "n"
    from (
      select
        'UnionPost' as "0",
        json_build_array((__union_posts__."id")::text) as "1",
        row_number() over (
          order by
            __union_posts__."id" asc
        ) as "n"
      from interfaces_and_unions.union_posts as __union_posts__
      where __union_posts__.id = $1::"int4"
      order by
        __union_posts__."id" asc
    ) as __union_posts__
  union all
    select
      __union_dividers__."0",
      __union_dividers__."1",
      "n"
    from (
      select
        'UnionDivider' as "0",
        json_build_array((__union_dividers__."id")::text) as "1",
        row_number() over (
          order by
            __union_dividers__."id" asc
        ) as "n"
      from interfaces_and_unions.union_dividers as __union_dividers__
      where __union_dividers__.id = $1::"int4"
      order by
        __union_dividers__."id" asc
    ) as __union_dividers__
  union all
    select
      __union_checklists__."0",
      __union_checklists__."1",
      "n"
    from (
      select
        'UnionChecklist' as "0",
        json_build_array((__union_checklists__."id")::text) as "1",
        row_number() over (
          order by
            __union_checklists__."id" asc
        ) as "n"
      from interfaces_and_unions.union_checklists as __union_checklists__
      where __union_checklists__.id = $1::"int4"
      order by
        __union_checklists__."id" asc
    ) as __union_checklists__
  union all
    select
      __union_checklist_items__."0",
      __union_checklist_items__."1",
      "n"
    from (
      select
        'UnionChecklistItem' as "0",
        json_build_array((__union_checklist_items__."id")::text) as "1",
        row_number() over (
          order by
            __union_checklist_items__."id" asc
        ) as "n"
      from interfaces_and_unions.union_checklist_items as __union_checklist_items__
      where __union_checklist_items__.id = $1::"int4"
      order by
        __union_checklist_items__."id" asc
    ) as __union_checklist_items__
  order by
    "0" asc,
    "n" asc
) __union__

