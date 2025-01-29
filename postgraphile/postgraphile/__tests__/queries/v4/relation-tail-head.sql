select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1",
  __compound_key__."extra"::text as "2"
from "c"."compound_key" as __compound_key__
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;

select
  __foreign_key__."person_id"::text as "0",
  __foreign_key__."compound_key_1"::text as "1",
  __foreign_key__."compound_key_2"::text as "2",
  (not (__foreign_key__ is null))::text as "3"
from "a"."foreign_key" as __foreign_key__
order by __foreign_key__."person_id" asc, __foreign_key__."compound_key_1" desc, __foreign_key__."compound_key_2" asc;

select __person_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_identifiers__,
lateral (
  select
    __person__."person_full_name" as "0",
    __person__."email" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_identifiers__,
lateral (
  select
    __person__."person_full_name" as "0",
    __person__."email" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_identifiers__,
lateral (
  select
    __person__."person_full_name" as "0",
    __person__."email" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __compound_key_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __compound_key_identifiers__,
lateral (
  select
    __compound_key__."person_id_1"::text as "0",
    __compound_key__."person_id_2"::text as "1",
    __compound_key__."extra"::text as "2",
    __compound_key_identifiers__.idx as "3"
  from "c"."compound_key" as __compound_key__
  where
    (
      __compound_key__."person_id_1" = __compound_key_identifiers__."id0"
    ) and (
      __compound_key__."person_id_2" = __compound_key_identifiers__."id1"
    )
) as __compound_key_result__;