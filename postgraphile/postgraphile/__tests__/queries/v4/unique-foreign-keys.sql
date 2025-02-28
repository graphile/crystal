select
  __unique_foreign_key__."compound_key_1"::text as "0",
  __unique_foreign_key__."compound_key_2"::text as "1",
  (not (__unique_foreign_key__ is null))::text as "2",
  __compound_key__."person_id_1"::text as "3",
  __compound_key__."person_id_2"::text as "4"
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
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;

select __compound_key_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __compound_key_identifiers__,
lateral (
  select
    __unique_foreign_key__."compound_key_1"::text as "0",
    __unique_foreign_key__."compound_key_2"::text as "1",
    (not (__unique_foreign_key__ is null))::text as "2",
    __compound_key__."person_id_1"::text as "3",
    __compound_key__."person_id_2"::text as "4",
    __compound_key_identifiers__.idx as "5"
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
  where
    (
      __compound_key__."person_id_1" = __compound_key_identifiers__."id0"
    ) and (
      __compound_key__."person_id_2" = __compound_key_identifiers__."id1"
    )
) as __compound_key_result__;