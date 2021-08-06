select
  array(
    select array[
      __single_table_items__."type"::text,
      __single_table_items__."position"::text,
      __single_table_items__."created_at"::text,
      __single_table_items__."updated_at"::text,
      __single_table_items__."is_explicitly_archived"::text,
      __single_table_items__."archived_at"::text
    ]::text[]
    from interfaces_and_unions.single_table_items as __single_table_items__
    where
      (
        __people__."person_id"::"int4" = __single_table_items__."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items__."id" asc
  ) as "0",
  __people__."person_id"::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc