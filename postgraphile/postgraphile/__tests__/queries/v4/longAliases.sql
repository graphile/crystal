select __person_result__.*
from (select 0 as idx, $1::"b"."email" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."email" as "1",
    (select json_agg(s) from (
      select
        (count(*))::text as "0"
      from "c"."person_friends"(__person__) as __person_friends__
    ) s) as "2",
    (select json_agg(s) from (
      select
        (count(*))::text as "0"
      from "c"."person_friends"(__person__) as __person_friends__
    ) s) as "3",
    __person_identifiers__.idx as "4"
  from "c"."person" as __person__
  where (
    __person__."email" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;