select
  case when (__authenticate_payload__."jwt") is not distinct from null then null::text else json_build_array(((__authenticate_payload__."jwt")."role"), (((__authenticate_payload__."jwt")."exp"))::text, (((__authenticate_payload__."jwt")."a"))::text, (((__authenticate_payload__."jwt")."b"))::text, (((__authenticate_payload__."jwt")."c"))::text)::text end as "0",
  __authenticate_payload__."admin"::text as "1",
  __authenticate_payload__."id"::text as "2",
  (not (__authenticate_payload__ is null))::text as "3"
from "b"."authenticate_payload"(
  $1::"int4",
  $2::"numeric",
  $3::"int8"
) as __authenticate_payload__;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  case when (__frmcdc_jwt_token__) is not distinct from null then null::text else json_build_array(((__frmcdc_jwt_token__)."role"), (((__frmcdc_jwt_token__)."exp"))::text, (((__frmcdc_jwt_token__)."a"))::text, (((__frmcdc_jwt_token__)."b"))::text, (((__frmcdc_jwt_token__)."c"))::text)::text end as "0",
  (not (__frmcdc_jwt_token__ is null))::text as "1"
from (select ($1::"b"."jwt_token").*) as __frmcdc_jwt_token__;