select
  __people__."username" as "0",
  (select json_agg(_) from (
    select
      __relational_items__."type"::text as "0",
      __relational_items__."id"::text as "1",
      __relational_items__."type2" as "2",
      __relational_items__."position"::text as "3",
      to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "4",
      to_char(__relational_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "5",
      __relational_items__."is_explicitly_archived"::text as "6",
      to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "7"
    from interfaces_and_unions.relational_items as __relational_items__
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
order by __people__."person_id" asc;

select __relational_topics_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_topics_identifiers__,
lateral (
  select
    __relational_topics__."title" as "0",
    __relational_topics__."id"::text as "1",
    __relational_topics_identifiers__.idx as "2"
  from interfaces_and_unions.relational_topics as __relational_topics__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_topics__."id" = __relational_topics_identifiers__."id0"
    )
  order by __relational_topics__."id" asc
) as __relational_topics_result__;

select __relational_posts_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."title" as "0",
    __relational_posts__."description" as "1",
    __relational_posts__."note" as "2",
    __relational_posts__."id"::text as "3",
    __relational_posts_identifiers__.idx as "4"
  from interfaces_and_unions.relational_posts as __relational_posts__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    )
  order by __relational_posts__."id" asc
) as __relational_posts_result__;

select __relational_dividers_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_dividers_identifiers__,
lateral (
  select
    __relational_dividers__."title" as "0",
    __relational_dividers__."color" as "1",
    __relational_dividers__."id"::text as "2",
    __relational_dividers_identifiers__.idx as "3"
  from interfaces_and_unions.relational_dividers as __relational_dividers__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_dividers__."id" = __relational_dividers_identifiers__."id0"
    )
  order by __relational_dividers__."id" asc
) as __relational_dividers_result__;

select __relational_checklists_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_checklists_identifiers__,
lateral (
  select
    __relational_checklists__."title" as "0",
    __relational_checklists__."id"::text as "1",
    __relational_checklists_identifiers__.idx as "2"
  from interfaces_and_unions.relational_checklists as __relational_checklists__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_checklists__."id" = __relational_checklists_identifiers__."id0"
    )
  order by __relational_checklists__."id" asc
) as __relational_checklists_result__;

select __relational_checklist_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_checklist_items_identifiers__,
lateral (
  select
    __relational_checklist_items__."description" as "0",
    __relational_checklist_items__."note" as "1",
    __relational_checklist_items_identifiers__.idx as "2"
  from interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_checklist_items__."id" = __relational_checklist_items_identifiers__."id0"
    )
  order by __relational_checklist_items__."id" asc
) as __relational_checklist_items_result__;
