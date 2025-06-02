select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  __single_table_items__."parent_id"::text as "2"
from interfaces_and_unions.single_table_items as __single_table_items__
where
  (
    __single_table_items__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __single_table_items__."type"::text as "0",
  __single_table_items__."author_id"::text as "1"
from interfaces_and_unions.single_table_items as __single_table_items__
where
  (
    __single_table_items__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __people__."username" as "0"
from interfaces_and_unions.people as __people__
where
  (
    __people__."person_id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );
