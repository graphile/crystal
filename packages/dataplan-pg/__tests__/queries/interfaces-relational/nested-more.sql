select
  __people__."username" as "0",
  (select json_agg(_) from (
    select
      __relational_items_2."type"::text as "0",
      __relational_items_2."id"::text as "1",
      __relational_items__."type"::text as "2",
      __relational_items__."id"::text as "3",
      __relational_items__."type2"::text as "4",
      __people_2."username" as "5",
      __relational_items__."position"::text as "6",
      to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "7",
      to_char(__relational_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "8",
      __relational_items__."is_explicitly_archived"::text as "9",
      to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "10",
      __relational_items_2."type2"::text as "11",
      __people_3."username" as "12",
      __relational_items_2."position"::text as "13",
      to_char(__relational_items_2."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "14",
      to_char(__relational_items_2."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "15",
      __relational_items_2."is_explicitly_archived"::text as "16",
      to_char(__relational_items_2."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "17"
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
  ) _) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc