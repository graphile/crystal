begin /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

delete from "c"."person" as __person__ where (__person__."id" = $1::"int4") returning
  __person__."id"::text as "0"


commit /*fake*/