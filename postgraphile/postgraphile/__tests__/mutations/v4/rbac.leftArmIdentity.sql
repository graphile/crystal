begin; /*fake*/

select set_config(key, value, true) from unnest($1::text[], $2::text[]) as settings(key, value)

select
  __left_arm_identity__."id"::text as "0",
  __left_arm_identity__."person_id"::text as "1",
  __left_arm_identity__."length_in_metres"::text as "2",
  __left_arm_identity__."mood" as "3"
from "c"."left_arm_identity"($1::"c"."left_arm") as __left_arm_identity__;

commit; /*fake*/