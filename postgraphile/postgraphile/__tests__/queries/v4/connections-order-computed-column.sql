select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
order by "c"."person_computed_out"(__person__) asc, __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
order by "c"."person_computed_out"(__person__) desc, __person__."id" desc;