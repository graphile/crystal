select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1",
  __unique_foreign_key__."compound_key_1"::text as "2",
  __unique_foreign_key__."compound_key_2"::text as "3",
  (not (__unique_foreign_key__ is null))::text as "4",
  __compound_key_2."person_id_1"::text as "5",
  __compound_key_2."person_id_2"::text as "6",
  __unique_foreign_key_2."compound_key_1"::text as "7",
  __unique_foreign_key_2."compound_key_2"::text as "8",
  (not (__unique_foreign_key_2 is null))::text as "9"
from "c"."compound_key" as __compound_key__
left outer join "a"."unique_foreign_key" as __unique_foreign_key__
on (
/* WHERE becoming ON */
  (
    __unique_foreign_key__."compound_key_1" = __compound_key__."person_id_1"
  ) and (
    __unique_foreign_key__."compound_key_2" = __compound_key__."person_id_2"
  )
)
left outer join "c"."compound_key" as __compound_key_2
on (
/* WHERE becoming ON */
  (
    __compound_key_2."person_id_1" = __unique_foreign_key__."compound_key_1"
  ) and (
    __compound_key_2."person_id_2" = __unique_foreign_key__."compound_key_2"
  )
)
left outer join "a"."unique_foreign_key" as __unique_foreign_key_2
on (
/* WHERE becoming ON */
  (
    __unique_foreign_key_2."compound_key_1" = __compound_key_2."person_id_1"
  ) and (
    __unique_foreign_key_2."compound_key_2" = __compound_key_2."person_id_2"
  )
)
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;