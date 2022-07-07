select __left_arm_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"c"."left_arm" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __left_arm_identity_identifiers__,
lateral (
  select
    __left_arm_identity__."id"::text as "0",
    __left_arm_identity__."person_id"::text as "1",
    __left_arm_identity__."length_in_metres"::text as "2",
    __left_arm_identity__."mood" as "3",
    __left_arm_identity_identifiers__.idx as "4"
  from "c"."left_arm_identity"(__left_arm_identity_identifiers__."id0") as __left_arm_identity__
) as __left_arm_identity_result__