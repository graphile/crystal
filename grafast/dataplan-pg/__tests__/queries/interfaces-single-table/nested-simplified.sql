select
  __people__."username" as "0",
  array(
    select array[
      __single_table_items_2."type"::text,
      __single_table_items_2."id"::text,
      __single_table_items_2."type2"::text,
      __single_table_items_2."parent_id"::text,
      __single_table_items__."type"::text,
      __single_table_items__."type2"::text
    ]::text[]
    from interfaces_and_unions.single_table_items as __single_table_items_2
    left outer join interfaces_and_unions.single_table_items as __single_table_items__
    on (
    /* WHERE becoming ON */
      (
        __single_table_items__."id" = __single_table_items_2."parent_id"
      ) and (
        true /* authorization checks */
      )
    )
    where
      (
        __single_table_items_2."author_id" = __people__."person_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items_2."id" asc
    limit 1
    offset 1
  )::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc
limit 1;
