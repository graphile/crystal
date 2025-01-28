select
  __compound_key__."person_id_2"::text as "0",
  __compound_key__."extra"::text as "1",
  __compound_key__."person_id_1"::text as "2",
  __compound_key__."extra" as "3",
  __compound_key__."person_id_1" as "4",
  __compound_key__."person_id_2" as "5"
from "c"."compound_key" as __compound_key__
order by __compound_key__."extra" asc, __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
limit 2;

select
  (count(*))::text as "0"
from "c"."compound_key" as __compound_key__;

select
  __compound_key__."person_id_2"::text as "0",
  __compound_key__."extra"::text as "1",
  __compound_key__."person_id_1"::text as "2",
  __compound_key__."extra" as "3",
  __compound_key__."person_id_1" as "4",
  __compound_key__."person_id_2" as "5"
from "c"."compound_key" as __compound_key__
where (
  (((__compound_key__."extra" > $1::"bool") or (__compound_key__."extra" is not null and $1::"bool" is null)))
  or (
    __compound_key__."extra" is not distinct from $1::"bool"
    and 
      ((__compound_key__."person_id_1" > $2::"int4")
      or (
        __compound_key__."person_id_1" = $2::"int4"
        and 
          (__compound_key__."person_id_2" > $3::"int4")
      ))
  )
)
order by __compound_key__."extra" asc, __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
limit 2;