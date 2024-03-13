begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

update "c"."person" as __person__ set "person_full_name" = $1::"varchar", "aliases" = $2::"text"[], "about" = $3::"text", "email" = $4::"b"."email", "site" = $5::"b"."wrapped_url" where (__person__."id" = $6::"int4") returning
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."aliases"::text as "2",
  __person__."about" as "3",
  __person__."email" as "4",
  case when (__person__."site") is not distinct from null then null::text else json_build_array(((__person__."site")."url"))::text end as "5";

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select __frmcdc_wrapped_url_result__.*
from (select 0 as idx, $1::"b"."wrapped_url" as "id0") as __frmcdc_wrapped_url_identifiers__,
lateral (
  select
    __frmcdc_wrapped_url__."url" as "0",
    __frmcdc_wrapped_url_identifiers__.idx as "1"
  from (select (__frmcdc_wrapped_url_identifiers__."id0").*) as __frmcdc_wrapped_url__
) as __frmcdc_wrapped_url_result__;

commit; /*fake*/