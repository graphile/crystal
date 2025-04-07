select
  __relational_topics__."id"::text as "0",
  __relational_topics__."title" as "1",
  __relational_items__."type"::text as "2",
  __relational_items__."type2"::text as "3",
  __relational_items__."position"::text as "4",
  to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "5",
  to_char(__relational_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "6",
  __relational_items__."is_explicitly_archived"::text as "7",
  to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "8"
from interfaces_and_unions.relational_topics as __relational_topics__
left outer join interfaces_and_unions.relational_items as __relational_items__
on (
/* WHERE becoming ON */
  (
    __relational_items__."id" = __relational_topics__."id"
  ) and (
    true /* authorization checks */
  )
)
where
  (
    __relational_topics__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );
