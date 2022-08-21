select
  (select json_agg(_) from (
    select
      (count(*))::text as "0"
    from "c"."person_friends"(__person__) as __person_friends__
  ) _) as "0",
  (select json_agg(_) from (
    select
      (row_number() over (partition by 1))::text as "0",
      __person_friends__."id"::text as "1",
      "c"."person_first_name"(__person_friends__) as "2",
      __person_friends__."person_full_name" as "3"
    from "c"."person_friends"(__person__) as __person_friends__
  ) _) as "1",
  "c"."person_first_name"(__person_2) as "2",
  __person_2."person_full_name" as "3",
  __person_2."id"::text as "4",
  __person_first_post__."author_id"::text as "5",
  "a"."post_headline_trimmed"(__person_first_post__) as "6",
  __person_first_post__."headline" as "7",
  __person_first_post__."id"::text as "8",
  "c"."person_first_name"(__person__) as "9",
  __person__::text as "10",
  __person__."person_full_name" as "11",
  __person__."id"::text as "12",
  __post__."author_id"::text as "13",
  "a"."post_headline_trimmed"(__post__) as "14",
  __post__."headline" as "15",
  __post__."id"::text as "16"
from "a"."post" as __post__
left outer join "c"."person" as __person__
on (__post__."author_id"::"int4" = __person__."id")
left outer join "c"."person_first_post"(__person__) as __person_first_post__
on TRUE
left outer join "c"."person" as __person_2
on (__person_first_post__."author_id"::"int4" = __person_2."id")
order by __post__."id" asc