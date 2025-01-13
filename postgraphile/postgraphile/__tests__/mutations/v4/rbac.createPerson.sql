begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

insert into "c"."person" as __person__ ("person_full_name", "aliases", "about", "email", "site") values ($1::"varchar", $2::"text"[], $3::"text", $4::"b"."email", $5::"b"."wrapped_url") returning
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
from (select 0 as idx) as __frmcdc_wrapped_url_identifiers__,
lateral (
  select
    __frmcdc_wrapped_url__."url" as "0",
    __frmcdc_wrapped_url_identifiers__.idx as "1"
  from (select ($1::"b"."wrapped_url").*) as __frmcdc_wrapped_url__
) as __frmcdc_wrapped_url_result__;

commit; /*fake*/