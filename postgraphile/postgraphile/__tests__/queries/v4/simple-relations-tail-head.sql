select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1",
  __compound_key__."extra"::text as "2",
  __person__."person_full_name" as "3",
  __person__."email" as "4",
  __person_2."person_full_name" as "5",
  __person_2."email" as "6"
from "c"."compound_key" as __compound_key__
left outer join "c"."person" as __person__
on (
/* WHERE becoming ON */ (
  __person__."id" = __compound_key__."person_id_1"
))
left outer join "c"."person" as __person_2
on (
/* WHERE becoming ON */ (
  __person_2."id" = __compound_key__."person_id_2"
))
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;

select
  __foreign_key__."person_id"::text as "0",
  __foreign_key__."compound_key_1"::text as "1",
  __foreign_key__."compound_key_2"::text as "2",
  (not (__foreign_key__ is null))::text as "3",
  __person__."person_full_name" as "4",
  __person__."email" as "5",
  __compound_key__."person_id_1"::text as "6",
  __compound_key__."person_id_2"::text as "7",
  __compound_key__."extra"::text as "8"
from "a"."foreign_key" as __foreign_key__
left outer join "c"."person" as __person__
on (
/* WHERE becoming ON */ (
  __person__."id" = __foreign_key__."person_id"
))
left outer join "c"."compound_key" as __compound_key__
on (
/* WHERE becoming ON */
  (
    __compound_key__."person_id_1" = __foreign_key__."compound_key_1"
  ) and (
    __compound_key__."person_id_2" = __foreign_key__."compound_key_2"
  )
)
order by __foreign_key__."person_id" asc, __foreign_key__."compound_key_1" desc, __foreign_key__."compound_key_2" asc;