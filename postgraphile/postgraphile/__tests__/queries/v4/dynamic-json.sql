select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);

select
  __jsonb_identity__.v::text as "0"
from "c"."jsonb_identity"($1::"jsonb") as __jsonb_identity__(v);

select
  __jsonb_identity__.v::text as "0"
from "c"."jsonb_identity"($1::"jsonb") as __jsonb_identity__(v);

select
  __types__."json"::text as "0",
  __types__."jsonb"::text as "1"
from "b"."types" as __types__
order by __types__."id" asc;

with __json_identity_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, ids.id0 from rows from (json_to_recordset($1::json) as (id0 "json")) with ordinality as ids
)
select __json_identity_result__.*
from __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__(v)
) as __json_identity_result__;