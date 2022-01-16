select
  __people__."username" as "0",
  array(
    select array[
      __single_table_items__."type"::text,
      __single_table_items__."id"::text,
      __single_table_items__."type2"::text,
      __single_table_items__."position"::text,
      to_char(__single_table_items__."created_at", $1),
      to_char(__single_table_items__."updated_at", $2),
      __single_table_items__."is_explicitly_archived"::text,
      to_char(__single_table_items__."archived_at", $3)
    ]::text[]
    from interfaces_and_unions.single_table_items as __single_table_items__
    where
      (
        __people__."person_id"::"int4" = __single_table_items__."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items__."id" asc
  ) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc