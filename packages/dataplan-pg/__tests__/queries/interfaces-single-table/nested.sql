select
  __people__."username" as "0",
  (select json_agg(_) from (
    select
      __single_table_items_2."type"::text as "0",
      __single_table_items__."type"::text as "1",
      __single_table_items__."type2"::text as "2",
      __single_table_items_2."parent_id"::text as "3",
      __single_table_items_2."id"::text as "4",
      __single_table_items_2."type2"::text as "5"
    from interfaces_and_unions.single_table_items as __single_table_items_2
    left outer join interfaces_and_unions.single_table_items as __single_table_items__
    on (__single_table_items_2."parent_id"::"int4" = __single_table_items__."id")
    where
      (
        __people__."person_id"::"int4" = __single_table_items_2."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items_2."id" asc
  ) _) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc