select
  (select json_agg(_) from (
    select
      (count(*))::text as "0"
    from "c"."person_friends"(__person__) as __person_friends__
  ) _) as "0",
  __person__."id"::text as "1"
from "c"."person" as __person__
order by __person__."id" asc

select
  (count(*))::text as "0"
from "c"."person" as __person__

select
  (count(*))::text as "0"
from "c"."table_set_query"() as __table_set_query__