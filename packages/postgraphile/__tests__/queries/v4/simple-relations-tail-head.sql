select
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __compound_key__."person_id_1"::text as "2",
  __person_2."person_full_name" as "3",
  __person_2."email" as "4",
  __compound_key__."person_id_2"::text as "5",
  __compound_key__."extra"::text as "6"
from "c"."compound_key" as __compound_key__
left outer join "c"."person" as __person__
on (__compound_key__."person_id_1"::"int4" = __person__."id")
left outer join "c"."person" as __person_2
on (__compound_key__."person_id_2"::"int4" = __person_2."id")
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc

select
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __foreign_key__."person_id"::text as "2",
  __compound_key__."person_id_1"::text as "3",
  __compound_key__."person_id_2"::text as "4",
  __compound_key__."extra"::text as "5",
  __foreign_key__."compound_key_1"::text as "6",
  __foreign_key__."compound_key_2"::text as "7",
  (not (__foreign_key__ is null))::text as "8"
from "a"."foreign_key" as __foreign_key__
left outer join "c"."person" as __person__
on (__foreign_key__."person_id"::"int4" = __person__."id")
left outer join "c"."compound_key" as __compound_key__
on (
  (
    __foreign_key__."compound_key_1"::"int4" = __compound_key__."person_id_1"
  ) and (
    __foreign_key__."compound_key_2"::"int4" = __compound_key__."person_id_2"
  )
)