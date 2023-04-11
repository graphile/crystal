begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select __left_arm_identity_result__.*
from (select 0 as idx, $1::"c"."left_arm" as "id0") as __left_arm_identity_identifiers__,
lateral (
  select
    __left_arm_identity__."id"::text as "0",
    __left_arm_identity__."person_id"::text as "1",
    __left_arm_identity__."length_in_metres"::text as "2",
    __left_arm_identity__."mood" as "3",
    __left_arm_identity_identifiers__.idx as "4"
  from "c"."left_arm_identity"(__left_arm_identity_identifiers__."id0") as __left_arm_identity__
) as __left_arm_identity_result__;

commit; /*fake*/