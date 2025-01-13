begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __left_arm_identity__."id"::text as "0",
  __left_arm_identity__."person_id"::text as "1",
  __left_arm_identity__."length_in_metres"::text as "2",
  __left_arm_identity__."mood" as "3"
from "c"."left_arm_identity"($1::"c"."left_arm") as __left_arm_identity__;

commit; /*fake*/