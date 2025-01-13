select __authenticate_fail_result__.*
from (select 0 as idx) as __authenticate_fail_identifiers__,
lateral (
  select
    case when (__authenticate_fail__) is not distinct from null then null::text else json_build_array(((__authenticate_fail__)."role"), (((__authenticate_fail__)."exp"))::text, (((__authenticate_fail__)."a"))::text, (((__authenticate_fail__)."b"))::text, (((__authenticate_fail__)."c"))::text)::text end as "0",
    (not (__authenticate_fail__ is null))::text as "1",
    __authenticate_fail_identifiers__.idx as "2"
  from "b"."authenticate_fail"() as __authenticate_fail__
) as __authenticate_fail_result__;