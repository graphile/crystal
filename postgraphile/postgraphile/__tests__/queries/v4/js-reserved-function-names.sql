select __await_result__.*
from (select 0 as idx) as __await_identifiers__,
lateral (
  select
    __await__.v::text as "0",
    __await_identifiers__.idx as "1"
  from "js_reserved"."await"(
    $1::"int4",
    $2::"int4",
    $3::"int4",
    $4::"int4"
  ) as __await__(v)
) as __await_result__;

select __case_result__.*
from (select 0 as idx) as __case_identifiers__,
lateral (
  select
    __case__.v::text as "0",
    __case_identifiers__.idx as "1"
  from "js_reserved"."case"(
    $1::"int4",
    $2::"int4",
    $3::"int4",
    $4::"int4"
  ) as __case__(v)
) as __case_result__;

select __value_of_result__.*
from (select 0 as idx) as __value_of_identifiers__,
lateral (
  select
    __value_of__.v::text as "0",
    __value_of_identifiers__.idx as "1"
  from "js_reserved"."valueOf"(
    $1::"int4",
    $2::"int4",
    $3::"int4",
    $4::"int4"
  ) as __value_of__(v)
) as __value_of_result__;

select __null_result__.*
from (select 0 as idx, $5::"int4" as "id0") as __null_identifiers__,
lateral (
  select
    ("js_reserved"."null_yield"(
      __null__,
      $1::"int4",
      $2::"int4",
      $3::"int4",
      $4::"int4"
    ))::text as "0",
    __null__."break" as "1",
    __null__."id"::text as "2",
    __null_identifiers__.idx as "3"
  from "js_reserved"."null" as __null__
  where (
    __null__."id" = __null_identifiers__."id0"
  )
) as __null_result__;