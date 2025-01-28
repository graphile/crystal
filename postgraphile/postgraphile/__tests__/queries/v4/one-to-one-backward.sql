select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  "c"."person_first_name"(__person__) as "2",
  __person__."id" as "3"
from "c"."person" as __person__
order by __person__."id" asc;

select __left_arm_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __left_arm_identifiers__,
lateral (
  select
    __left_arm__."id"::text as "0",
    __left_arm__."person_id"::text as "1",
    __left_arm__."length_in_metres"::text as "2",
    __left_arm_identifiers__.idx as "3"
  from "c"."left_arm" as __left_arm__
  where (
    __left_arm__."person_id" = __left_arm_identifiers__."id0"
  )
) as __left_arm_result__;

select __person_secret_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_secret_identifiers__,
lateral (
  select
    __person_secret__."person_id"::text as "0",
    __person_secret__."sekrit" as "1",
    __person_secret_identifiers__.idx as "2"
  from "c"."person_secret" as __person_secret__
  where (
    __person_secret__."person_id" = __person_secret_identifiers__."id0"
  )
) as __person_secret_result__;

select __person_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    "c"."person_first_name"(__person__) as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    "c"."person_first_name"(__person__) as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;