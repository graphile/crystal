select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."aliases"::text as "2"
from "c"."person" as __person__
order by __person__."id" asc
limit 1