select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  __single_table_items__."type2"::text as "2",
  __single_table_items__."position"::text as "3",
  to_char(__single_table_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "4",
  to_char(__single_table_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "5",
  __single_table_items__."is_explicitly_archived"::text as "6",
  to_char(__single_table_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "7",
  __single_table_items__."title" as "8"
from interfaces_and_unions.single_table_items as __single_table_items__
where
  (
    true /* authorization checks */
  ) and (
    __single_table_items__."id" = $1::"int4"
  ) and (
    __single_table_items__."type" = $2::interfaces_and_unions.item_type
  );
