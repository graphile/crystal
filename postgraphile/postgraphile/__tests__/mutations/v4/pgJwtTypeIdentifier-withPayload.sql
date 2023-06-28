select __authenticate_payload_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"numeric" as "id1", $3::"int8" as "id2") as __authenticate_payload_identifiers__,
lateral (
  select
    __authenticate_payload__."jwt"::text as "0",
    __authenticate_payload__."admin"::text as "1",
    __authenticate_payload__."id"::text as "2",
    (not (__authenticate_payload__ is null))::text as "3",
    __authenticate_payload_identifiers__.idx as "4"
  from "b"."authenticate_payload"(
    __authenticate_payload_identifiers__."id0",
    __authenticate_payload_identifiers__."id1",
    __authenticate_payload_identifiers__."id2"
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

select __frmcdc_jwt_token_result__.*
from (select 0 as idx, $1::"b"."jwt_token" as "id0") as __frmcdc_jwt_token_identifiers__,
lateral (
  select
    __frmcdc_jwt_token__::text as "0",
    (not (__frmcdc_jwt_token__ is null))::text as "1",
    __frmcdc_jwt_token_identifiers__.idx as "2"
  from (select (__frmcdc_jwt_token_identifiers__."id0").*) as __frmcdc_jwt_token__
) as __frmcdc_jwt_token_result__;