select
  __people__."username" as "0",
  array(
    select array[
      __single_table_items__."type"::text,
      __single_table_items__."parent_id"::text,
      __single_table_items__."id"::text,
      __single_table_items__."type2"::text
    ]::text[]
    from interfaces_and_unions.single_table_items as __single_table_items__
    where
      (
        __single_table_items__."author_id" = __people__."person_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items__."id" asc
  )::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc;

select __single_table_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __single_table_items_identifiers__,
lateral (
  select
    __single_table_items__."type"::text as "0",
    __single_table_items__."type2"::text as "1",
    __single_table_items_identifiers__.idx as "2"
  from interfaces_and_unions.single_table_items as __single_table_items__
  where
    (
      __single_table_items__."id" = __single_table_items_identifiers__."id0"
    ) and (
      true /* authorization checks */
    )
) as __single_table_items_result__;
