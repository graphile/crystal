select
  __people__."username" as "0",
  (select json_agg(_) from (
    select
      __single_table_items_2."type"::text as "0",
      __single_table_items__."type"::text as "1",
      __single_table_items__."type2"::text as "2",
      __people_2."username" as "3",
      __single_table_items__."position"::text as "4",
      to_char(__single_table_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "5",
      to_char(__single_table_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "6",
      __single_table_items__."is_explicitly_archived"::text as "7",
      to_char(__single_table_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "8",
      __single_table_items_2."parent_id"::text as "9",
      __single_table_items_2."id"::text as "10",
      __single_table_items_2."type2"::text as "11",
      __people_3."username" as "12",
      __single_table_items_2."position"::text as "13",
      to_char(__single_table_items_2."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "14",
      to_char(__single_table_items_2."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "15",
      __single_table_items_2."is_explicitly_archived"::text as "16",
      to_char(__single_table_items_2."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "17"
    from interfaces_and_unions.single_table_items as __single_table_items_2
    left outer join interfaces_and_unions.single_table_items as __single_table_items__
    on (__single_table_items_2."parent_id"::"int4" = __single_table_items__."id")
    left outer join interfaces_and_unions.people as __people_2
    on (__single_table_items__."author_id"::"int4" = __people_2."person_id")
    left outer join interfaces_and_unions.people as __people_3
    on (__single_table_items_2."author_id"::"int4" = __people_3."person_id")
    where
      (
        __people__."person_id"::"int4" = __single_table_items_2."author_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items_2."id" asc
  ) _) as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc