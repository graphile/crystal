select
  __compound_key__."extra"::text as "0",
  __compound_key__."person_id_1"::text as "1",
  __compound_key__."person_id_2"::text as "2"
from "c"."compound_key" as __compound_key__
order by __compound_key__."extra" asc, __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
limit 2;

select
  (count(*))::text as "0"
from "c"."compound_key" as __compound_key__;

select __compound_key_result__.*
from (select 0 as idx, $1::"bool" as "id0", $2::"int4" as "id1", $3::"int4" as "id2") as __compound_key_identifiers__,
lateral (
  select
    __compound_key__."extra"::text as "0",
    __compound_key__."person_id_1"::text as "1",
    __compound_key__."person_id_2"::text as "2",
    __compound_key_identifiers__.idx as "3"
  from "c"."compound_key" as __compound_key__
  where (
    (((__compound_key__."extra" > __compound_key_identifiers__."id0") or (__compound_key__."extra" is not null and __compound_key_identifiers__."id0" is null)))
    or (
      __compound_key__."extra" is not distinct from __compound_key_identifiers__."id0"
      and 
        ((__compound_key__."person_id_1" > __compound_key_identifiers__."id1")
        or (
          __compound_key__."person_id_1" = __compound_key_identifiers__."id1"
          and 
            (__compound_key__."person_id_2" > __compound_key_identifiers__."id2")
        ))
    )
  )
  order by __compound_key__."extra" asc, __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
  limit 2
) as __compound_key_result__;