select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;

select __unique_foreign_key_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __unique_foreign_key_identifiers__,
lateral (
  select
    __unique_foreign_key__."compound_key_1"::text as "0",
    __unique_foreign_key__."compound_key_2"::text as "1",
    (not (__unique_foreign_key__ is null))::text as "2",
    __unique_foreign_key_identifiers__.idx as "3"
  from "a"."unique_foreign_key" as __unique_foreign_key__
  where
    (
      __unique_foreign_key__."compound_key_1" = __unique_foreign_key_identifiers__."id0"
    ) and (
      __unique_foreign_key__."compound_key_2" = __unique_foreign_key_identifiers__."id1"
    )
) as __unique_foreign_key_result__;

select __compound_key_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __compound_key_identifiers__,
lateral (
  select
    __compound_key__."person_id_1"::text as "0",
    __compound_key__."person_id_2"::text as "1",
    __compound_key_identifiers__.idx as "2"
  from "c"."compound_key" as __compound_key__
  where
    (
      __compound_key__."person_id_1" = __compound_key_identifiers__."id0"
    ) and (
      __compound_key__."person_id_2" = __compound_key_identifiers__."id1"
    )
) as __compound_key_result__;