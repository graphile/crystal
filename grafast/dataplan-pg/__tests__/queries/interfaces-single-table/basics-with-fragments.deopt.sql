select
  __people__."username" as "0",
  __people__."person_id"::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc;

select __single_table_items_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __single_table_items_identifiers__,
lateral (
  select
    __single_table_items__."id"::text as "0",
    __single_table_items__."type"::text as "1",
    __single_table_items__."type2"::text as "2",
    __single_table_items__."position"::text as "3",
    to_char(__single_table_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "4",
    to_char(__single_table_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "5",
    __single_table_items__."is_explicitly_archived"::text as "6",
    to_char(__single_table_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "7",
    __single_table_items__."title" as "8",
    __single_table_items__."description" as "9",
    __single_table_items__."color" as "10",
    __single_table_items__."note" as "11",
    __single_table_items_identifiers__.idx as "12"
  from interfaces_and_unions.single_table_items as __single_table_items__
  where
    (
      __single_table_items__."author_id" = __single_table_items_identifiers__."id0"
    ) and (
      true /* authorization checks */
    )
  order by __single_table_items__."id" asc
) as __single_table_items_result__;
