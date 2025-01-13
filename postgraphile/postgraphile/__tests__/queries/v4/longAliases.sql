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
  ) s) as "3"
from "c"."person" as __person__
where (
  __person__."email" = $1::"b"."email"
);