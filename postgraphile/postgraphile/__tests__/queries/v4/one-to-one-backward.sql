select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  "c"."person_first_name"(__person__) as "2",
  __left_arm__."id"::text as "3",
  __left_arm__."person_id"::text as "4",
  __left_arm__."length_in_metres"::text as "5",
  __person_2."id"::text as "6",
  __person_2."person_full_name" as "7",
  "c"."person_first_name"(__person_2) as "8",
  __person_secret__."person_id"::text as "9",
  __person_secret__."sekrit" as "10",
  __person_3."id"::text as "11",
  __person_3."person_full_name" as "12",
  "c"."person_first_name"(__person_3) as "13"
from "c"."person" as __person__
left outer join "c"."left_arm" as __left_arm__
on (
/* WHERE becoming ON */ (
  __left_arm__."person_id" = __person__."id"
))
left outer join "c"."person" as __person_2
on (
/* WHERE becoming ON */ (
  __person_2."id" = __left_arm__."person_id"
))
left outer join "c"."person_secret" as __person_secret__
on (
/* WHERE becoming ON */ (
  __person_secret__."person_id" = __person__."id"
))
left outer join "c"."person" as __person_3
on (
/* WHERE becoming ON */ (
  __person_3."id" = __person_secret__."person_id"
))
order by __person__."id" asc;