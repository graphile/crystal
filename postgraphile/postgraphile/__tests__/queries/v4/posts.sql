select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  "a"."post_headline_trimmed"(__post__) as "2",
  __person__."id"::text as "3",
  __person__."person_full_name" as "4",
  "c"."person_first_name"(__person__) as "5",
  (
    select array[
      __person_first_post__."id"::text,
      __person_first_post__."headline",
      "a"."post_headline_trimmed"(__person_first_post__),
      __person_2."id"::text,
      __person_2."person_full_name",
      "c"."person_first_name"(__person_2)
    ]::text[]
    from "c"."person_first_post"(__person__) as __person_first_post__
    left outer join "c"."person" as __person_2
    on (
    /* WHERE becoming ON */ (
      __person_2."id" = __person_first_post__."author_id"
    ))
  )::text as "6",
  array(
    select array[
      __person_friends__."id"::text,
      __person_friends__."person_full_name",
      "c"."person_first_name"(__person_friends__),
      (row_number() over (partition by 1))::text
    ]::text[]
    from "c"."person_friends"(__person__) as __person_friends__
  )::text as "7",
  array(
    select array[
      (count(*))::text
    ]::text[]
    from "c"."person_friends"(__person__) as __person_friends__
  )::text as "8"
from "a"."post" as __post__
left outer join "c"."person" as __person__
on (
/* WHERE becoming ON */ (
  __person__."id" = __post__."author_id"
))
order by __post__."id" asc;