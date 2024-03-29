select __single_table_items_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::interfaces_and_unions.item_type as "id1") as __single_table_items_identifiers__,
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
    __single_table_items_identifiers__.idx as "9"
  from interfaces_and_unions.single_table_items as __single_table_items__
  where
    (
      true /* authorization checks */
    ) and (
      __single_table_items__."id" = __single_table_items_identifiers__."id0"
    ) and (
      __single_table_items__."type" = __single_table_items_identifiers__."id1"
    )
) as __single_table_items_result__;
