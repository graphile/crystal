select
  __single_table_items_2."id"::text as "0",
  __single_table_items_2."type"::text as "1",
  __single_table_items_2."parent_id"::text as "2",
  (
    select array[
      __single_table_items__."type"::text,
      __people__."username"
    ]::text[]
    from interfaces_and_unions.single_table_items as __single_table_items__
    left outer join interfaces_and_unions.people as __people__
    on (
    /* WHERE becoming ON */
      (
        __people__."person_id" = __single_table_items__."author_id"
      ) and (
        true /* authorization checks */
      )
    )
    where
      (
        __single_table_items__."id" = __single_table_items_2."parent_id"
      ) and (
        true /* authorization checks */
      )
  )::text as "3"
from interfaces_and_unions.single_table_items as __single_table_items_2
where
  (
    __single_table_items_2."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );
