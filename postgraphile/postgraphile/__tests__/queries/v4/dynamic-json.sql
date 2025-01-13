select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __json_identity_result__.*
from (select 0 as idx) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"($1::"json") as __json_identity__(v)
) as __json_identity_result__;

select __jsonb_identity_result__.*
from (select 0 as idx) as __jsonb_identity_identifiers__,
lateral (
  select
    __jsonb_identity__.v::text as "0",
    __jsonb_identity_identifiers__.idx as "1"
  from "c"."jsonb_identity"($1::"jsonb") as __jsonb_identity__(v)
) as __jsonb_identity_result__;

select __jsonb_identity_result__.*
from (select 0 as idx) as __jsonb_identity_identifiers__,
lateral (
  select
    __jsonb_identity__.v::text as "0",
    __jsonb_identity_identifiers__.idx as "1"
  from "c"."jsonb_identity"($1::"jsonb") as __jsonb_identity__(v)
) as __jsonb_identity_result__;

select
  __types__."json"::text as "0",
  __types__."jsonb"::text as "1"
from "b"."types" as __types__
order by __types__."id" asc;