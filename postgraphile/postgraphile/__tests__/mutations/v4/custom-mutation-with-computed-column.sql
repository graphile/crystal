select
  __upsert_setting__."id"::text as "0",
  __upsert_setting__."username" as "1",
  "issue_2287"."users_setting"(
    __upsert_setting__,
    $1::"text"
  ) as "2",
  "issue_2287"."users_setting"(
    __upsert_setting__,
    $2::"text"
  ) as "3",
  "issue_2287"."users_setting"(
    __upsert_setting__,
    $3::"text"
  ) as "4"
from "issue_2287"."upsert_setting"(
  $4::"int4",
  $5::"text",
  $6::"text"
) as __upsert_setting__;