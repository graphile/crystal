select
  __upsert_setting__."id"::text as "0",
  __upsert_setting__."username" as "1",
  case when (__upsert_setting__) is not distinct from null then null::text else json_build_array((((__upsert_setting__)."id"))::text, ((__upsert_setting__)."username"))::text end as "2"
from "issue_2287"."upsert_setting"(
  $1::"int4",
  $2::"text",
  $3::"text"
) as __upsert_setting__;

select
  "issue_2287"."users_setting"(
    __upsert_setting__,
    $1::"text"
  ) as "0",
  __upsert_setting__."id"::text as "1"
from (select ($2::"issue_2287"."users").*) as __upsert_setting__;

select
  "issue_2287"."users_setting"(
    __upsert_setting__,
    $1::"text"
  ) as "0",
  __upsert_setting__."id"::text as "1"
from (select ($2::"issue_2287"."users").*) as __upsert_setting__;

select
  "issue_2287"."users_setting"(
    __upsert_setting__,
    $1::"text"
  ) as "0",
  __upsert_setting__."id"::text as "1"
from (select ($2::"issue_2287"."users").*) as __upsert_setting__;