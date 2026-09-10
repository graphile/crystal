select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  "c"."person_first_name"(__person__) as "2",
  (
    select array[
      __left_arm__."id"::text,
      __left_arm__."person_id"::text,
      __left_arm__."length_in_metres"::text,
      __person_2."id"::text,
      __person_2."person_full_name",
      "c"."person_first_name"(__person_2)
    ]::text[]
    from "c"."left_arm" as __left_arm__
    left outer join "c"."person" as __person_2
    on (
    /* WHERE becoming ON */ (
      __person_2."id" = __left_arm__."person_id"
    ))
    where (
      __left_arm__."person_id" = __person__."id"
    )
  )::text as "3",
  (
    select array[
      __person_secret__."person_id"::text,
      __person_secret__."sekrit",
      __person_3."id"::text,
      __person_3."person_full_name",
      "c"."person_first_name"(__person_3)
    ]::text[]
    from "c"."person_secret" as __person_secret__
    left outer join "c"."person" as __person_3
    on (
    /* WHERE becoming ON */ (
      __person_3."id" = __person_secret__."person_id"
    ))
    where (
      __person_secret__."person_id" = __person__."id"
    )
  )::text as "4"
from "c"."person" as __person__
order by __person__."id" asc;