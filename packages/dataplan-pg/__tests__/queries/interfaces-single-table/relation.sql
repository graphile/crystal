select __single_table_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __single_table_items_identifiers__,
lateral (
  select
    __single_table_items_2."type"::text as "0",
    __single_table_items__."type"::text as "1",
    __people__."username" as "2",
    __single_table_items_2."parent_id"::text as "3",
    __single_table_items_2."id"::text as "4",
    __single_table_items_identifiers__.idx as "5"
  from interfaces_and_unions.single_table_items as __single_table_items_2
  left outer join interfaces_and_unions.single_table_items as __single_table_items__
  on (__single_table_items_2."parent_id"::"int4" = __single_table_items__."id")
  left outer join interfaces_and_unions.people as __people__
  on (__single_table_items__."author_id"::"int4" = __people__."person_id")
  where
    (
      true /* authorization checks */
    ) and (
      __single_table_items_2."id" = __single_table_items_identifiers__."id0"
    )
  order by __single_table_items_2."id" asc
) as __single_table_items_result__