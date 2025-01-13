select __some_messages_result__.*
from (select 0 as idx) as __some_messages_identifiers__,
lateral (
  select
    __some_messages__."id" as "0",
    __some_messages__."message" as "1",
    to_char(__some_messages__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2",
    __some_messages__."test_user_id" as "3",
    (row_number() over (partition by 1))::text as "4",
    __some_messages_identifiers__.idx as "5"
  from "issue_2210"."some_messages"($1::"uuid") as __some_messages__
  limit 51
) as __some_messages_result__;

select __test_user_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0" from json_array_elements($1::json) with ordinality as ids) as __test_user_identifiers__,
lateral (
  select
    __test_user__."id" as "0",
    __test_user__."name" as "1",
    __test_user_identifiers__.idx as "2"
  from "issue_2210"."test_user" as __test_user__
  where (
    __test_user__."id" = __test_user_identifiers__."id0"
  )
) as __test_user_result__;