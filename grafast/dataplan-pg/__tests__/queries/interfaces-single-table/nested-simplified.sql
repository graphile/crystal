select
  __people__."username" as "0",
  array(
    select array[
      __single_table_items__."type"::text,
      __single_table_items__."id"::text
    ]::text[]
    from interfaces_and_unions.single_table_items as __single_table_items__
    where
      (
        __single_table_items__."author_id" = __people__."person_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items__."id" asc
    limit 1
    offset 1
  )::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc
limit 1;

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  __single_table_items__."type2"::text as "2",
  __single_table_items__."parent_id"::text as "3"
from interfaces_and_unions.single_table_items as __single_table_items__
where
  (
    __single_table_items__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __single_table_items__."type"::text as "0"
from interfaces_and_unions.single_table_items as __single_table_items__
where
  (
    __single_table_items__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  __single_table_items__."type2"::text as "2"
from interfaces_and_unions.single_table_items as __single_table_items__
where
  (
    __single_table_items__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );
