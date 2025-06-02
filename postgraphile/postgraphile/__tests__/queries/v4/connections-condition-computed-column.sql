select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  "c"."person_computed_out"(__person__) = $1::"text"
)
order by __person__."id" asc;