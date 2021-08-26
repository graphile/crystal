select
  __people__."username"::text as "0",
  array(
    select array[
      __relational_items_2."type"::text,
      __relational_items_2."id"::text,
      __relational_items__."type"::text,
      __relational_items__."id"::text,
      __relational_items_2."parent_id"::text
    ]::text[]
    from interfaces_and_unions.relational_items as __relational_items_2
    left outer join interfaces_and_unions.relational_items as __relational_items__
    on (__relational_items_2."parent_id"::"int4" = __relational_items__."id")
    where
      (
        __people__."person_id"::"int4" = __relational_items_2."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items_2."id" asc
  ) as "1",
  __people__."person_id"::text as "2"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc