select __relational_topics_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_topics_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items__."type2"::text as "1",
    __relational_items__."position"::text as "2",
    to_char(__relational_items__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "3",
    to_char(__relational_items__."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "4",
    __relational_items__."is_explicitly_archived"::text as "5",
    to_char(__relational_items__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "6",
    __relational_topics__."id"::text as "7",
    __relational_topics__."title" as "8",
    __relational_topics_identifiers__.idx as "9"
  from interfaces_and_unions.relational_topics as __relational_topics__
  left outer join interfaces_and_unions.relational_items as __relational_items__
  on (__relational_topics__."id"::"int4" = __relational_items__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_topics__."id" = __relational_topics_identifiers__."id0"
    )
  order by __relational_topics__."id" asc
) as __relational_topics_result__;
