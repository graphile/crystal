begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

update "c"."left_arm" as __left_arm__ set "mood" = $1::"text" where (__left_arm__."id" = $2::"int4") returning
  __left_arm__."id"::text as "0",
  __left_arm__."person_id"::text as "1",
  __left_arm__."length_in_metres"::text as "2",
  __left_arm__."mood" as "3";

commit; /*fake*/