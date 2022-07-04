select
  __people__."username" as "0",
  (select json_agg(_) from (
    select
      __relational_items__."type"::text as "0",
      __relational_items__."id"::text as "1",
      __relational_items__."type2"::text as "2",
      __relational_items__."position"::text as "3",
      to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "4",
      to_char(__relational_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "5",
      __relational_items__."is_explicitly_archived"::text as "6",
      to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "7"
    from interfaces_and_unions.relational_items as __relational_items__
    where
      (
        __people__."person_id"::"int4" = __relational_items__."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items__."id" asc
  ) _) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc