select __test_messages_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __test_messages_identifiers__,
lateral (
  select
    __test_messages__."id" as "0",
    __test_messages__."message" as "1",
    to_char(__test_messages__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2",
    __test_user__."test_account_id" as "3",
    __test_user__."name" as "4",
    __test_messages__."ordinality"::text as "5",
    __test_messages_identifiers__.idx as "6"
  from "issue_2210"."test_messages"(__test_messages_identifiers__."id0") with ordinality as __test_messages__
  left outer join "issue_2210"."test_user" as __test_user__
  on (__test_messages__."test_user_id"::"uuid" = __test_user__."test_account_id")
  order by __test_messages__."ordinality" asc
  limit 51
) as __test_messages_result__;