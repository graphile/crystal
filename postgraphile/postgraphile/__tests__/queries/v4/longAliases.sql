select
  __person__."id"::text as "0",
  __person__."email" as "1",
  array(
    select array[
      (count(*))::text
    ]::text[]
    from "c"."person_friends"(__person__) as __person_friends__
  )::text as "2",
  array(
    select array[
      (count(*))::text
    ]::text[]
    from "c"."person_friends"(__person__) as __person_friends__
  )::text as "3"
from "c"."person" as __person__
where (
  __person__."email" = $1::"b"."email"
);