select
  __users__."id"::text as "0",
  __users__."username" as "1"
from "issue_2212"."users" as __users__
order by __users__."id" asc;