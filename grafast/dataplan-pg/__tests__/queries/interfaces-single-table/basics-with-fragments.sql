select
  __people__."username" as "0",
  array(
    select array[
      __single_table_items__."id"::text,
      __single_table_items__."type"::text,
      __single_table_items__."type2"::text,
      __single_table_items__."position"::text,
      to_char(__single_table_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      to_char(__single_table_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      __single_table_items__."is_explicitly_archived"::text,
      to_char(__single_table_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      __single_table_items__."title",
      __single_table_items__."description",
      __single_table_items__."note",
      __single_table_items__."color"
    ]::text[]
    from interfaces_and_unions.single_table_items as __single_table_items__
    where
      (
        __single_table_items__."author_id" = __people__."person_id"
      ) and (
        true /* authorization checks */
      )
    order by __single_table_items__."id" asc
  )::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc;
