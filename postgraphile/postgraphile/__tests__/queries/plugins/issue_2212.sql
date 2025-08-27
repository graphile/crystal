select
  __users__."id"::text as "0",
  __users__."username" as "1"
from "issue_2212"."users" as __users__
order by __users__."id" asc;

select user_id::text, phone from issue_2212.user_contacts where id = any($1::int[]);

select phone_e164, sum(amount_cents) as sum from issue_2212.orders where phone_e164 = any($1::text[]) group by phone_e164;