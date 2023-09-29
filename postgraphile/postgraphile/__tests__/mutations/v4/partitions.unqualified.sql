begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

insert into "measurements" as __measurements__ ("timestamp", "key", "value", "user_id") values ($1::"timestamptz", $2::"text", $3::"float8", $4::"int4") returning
  to_char(__measurements__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
  __measurements__."key" as "1",
  __measurements__."value"::text as "2",
  __measurements__."user_id"::text as "3";

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select __users_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __users_identifiers__,
lateral (
  select
    __users__."id"::text as "0",
    __users__."name" as "1",
    __users_identifiers__.idx as "2"
  from "users" as __users__
  where (
    __users__."id" = __users_identifiers__."id0"
  )
) as __users_result__;

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

update "measurements" as __measurements__ set "value" = $1::"float8" where ((__measurements__."timestamp" = $2::"timestamptz") and (__measurements__."key" = $3::"text")) returning
  to_char(__measurements__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
  __measurements__."key" as "1",
  __measurements__."value"::text as "2",
  __measurements__."user_id"::text as "3";

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select __users_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __users_identifiers__,
lateral (
  select
    __users__."id"::text as "0",
    __users__."name" as "1",
    __users_identifiers__.idx as "2"
  from "users" as __users__
  where (
    __users__."id" = __users_identifiers__."id0"
  )
) as __users_result__;

commit; /*fake*/