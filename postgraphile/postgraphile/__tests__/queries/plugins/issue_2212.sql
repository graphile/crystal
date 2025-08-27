select
  __users__."id"::text as "0",
  __users__."username" as "1"
from "issue_2212"."users" as __users__
order by __users__."id" asc;

select user_id::text, phone from issue_2212.user_contacts where user_id = any($1::int[]);

select user_id::text, phone from issue_2212.user_contacts where user_id = any($1::int[]);

select phone_e164, sum(amount_cents) as sum from issue_2212.orders where phone_e164 = any($1::text[]) group by phone_e164;

select __orders_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"text"[] as "id0" from json_array_elements($1::json) with ordinality as ids) as __orders_identifiers__,
lateral (
  select
    __orders__."id"::text as "0",
    __orders__."phone_e164" as "1",
    __orders__."amount_cents"::text as "2",
    __orders_identifiers__.idx as "3"
  from "issue_2212"."orders" as __orders__
  where (
    __orders__.phone_e164 = any(__orders_identifiers__."id0")
  )
  order by __orders__."id" asc
) as __orders_result__;