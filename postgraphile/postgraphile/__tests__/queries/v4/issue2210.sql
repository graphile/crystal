select
  __some_messages__."id" as "0",
  __some_messages__."message" as "1",
  to_char(__some_messages__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2",
  __some_messages__."test_user_id" as "3",
  (row_number() over (partition by 1))::text as "4"
from "issue_2210"."some_messages"($1::"uuid") as __some_messages__
limit 51;

select __test_user_result__.*
from rows from (json_to_recordset($1::json) as ("0" "uuid"))
with ordinality as __test_user_identifiers__ ("id0", ord),
lateral (
  select
    __test_user__."id" as "0",
    __test_user__."name" as "1",
    (__test_user_identifiers__.ord - 1) as "2"
  from "issue_2210"."test_user" as __test_user__
  where (
    __test_user__."id" = __test_user_identifiers__."id0"
  )
) as __test_user_result__;