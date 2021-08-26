select
  __people__."username"::text as "0",
  array(
    select array[
      __relational_items_2."type"::text,
      __relational_items_2."id"::text,
      __relational_items__."type"::text,
      __relational_items__."id"::text,
      __people_2."username"::text,
      __relational_items__."author_id"::text,
      __relational_items__."position"::text,
      __relational_items__."created_at"::text,
      __relational_items__."updated_at"::text,
      __relational_items__."is_explicitly_archived"::text,
      __relational_items__."archived_at"::text,
      __relational_items_2."parent_id"::text,
      __people_3."username"::text,
      __relational_items_2."author_id"::text,
      __relational_items_2."position"::text,
      __relational_items_2."created_at"::text,
      __relational_items_2."updated_at"::text,
      __relational_items_2."is_explicitly_archived"::text,
      __relational_items_2."archived_at"::text
    ]::text[]
    from interfaces_and_unions.relational_items as __relational_items_2
    left outer join interfaces_and_unions.relational_items as __relational_items__
    on (__relational_items_2."parent_id"::"int4" = __relational_items__."id")
    left outer join interfaces_and_unions.people as __people_2
    on (__relational_items__."author_id"::"int4" = __people_2."person_id")
    left outer join interfaces_and_unions.people as __people_3
    on (__relational_items_2."author_id"::"int4" = __people_3."person_id")
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