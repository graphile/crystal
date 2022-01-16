select
  __people__."username" as "0",
  array(
    select array[
      __relational_items__."type"::text,
      __relational_items__."id"::text,
      __relational_items__."type2"::text,
      __relational_items__."position"::text,
      to_char(__relational_items__."created_at", $1),
      to_char(__relational_items__."updated_at", $2),
      __relational_items__."is_explicitly_archived"::text,
      to_char(__relational_items__."archived_at", $3)
    ]::text[]
    from interfaces_and_unions.relational_items as __relational_items__
    where
      (
        __people__."person_id"::"int4" = __relational_items__."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items__."id" asc
  ) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc