select __authenticate_payload_result__.*
from (select 0 as idx) as __authenticate_payload_identifiers__,
lateral (
  select
    case when (__authenticate_payload__."jwt") is not distinct from null then null::text else json_build_array(((__authenticate_payload__."jwt")."role"), (((__authenticate_payload__."jwt")."exp"))::text, (((__authenticate_payload__."jwt")."a"))::text, (((__authenticate_payload__."jwt")."b"))::text, (((__authenticate_payload__."jwt")."c"))::text)::text end as "0",
    __authenticate_payload__."admin"::text as "1",
    __authenticate_payload__."id"::text as "2",
    (not (__authenticate_payload__ is null))::text as "3",
    __authenticate_payload_identifiers__.idx as "4"
  from "b"."authenticate_payload"(
    $1::"int4",
    $2::"numeric",
    $3::"int8"
  ) as __authenticate_payload__
) as __authenticate_payload_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select
  case when (__frmcdc_jwt_token__) is not distinct from null then null::text else json_build_array(((__frmcdc_jwt_token__)."role"), (((__frmcdc_jwt_token__)."exp"))::text, (((__frmcdc_jwt_token__)."a"))::text, (((__frmcdc_jwt_token__)."b"))::text, (((__frmcdc_jwt_token__)."c"))::text)::text end as "0",
  (not (__frmcdc_jwt_token__ is null))::text as "1"
from (select ($1::"b"."jwt_token").*) as __frmcdc_jwt_token__;