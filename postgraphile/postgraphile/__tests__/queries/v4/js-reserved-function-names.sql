select __await_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2", $4::"int4" as "id3") as __await_identifiers__,
lateral (
  select
    __await__.v::text as "0",
    __await_identifiers__.idx as "1"
  from "js_reserved"."await"(
    __await_identifiers__."id0",
    __await_identifiers__."id1",
    __await_identifiers__."id2",
    __await_identifiers__."id3"
  ) as __await__(v)
) as __await_result__;

select __case_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2", $4::"int4" as "id3") as __case_identifiers__,
lateral (
  select
    __case__.v::text as "0",
    __case_identifiers__.idx as "1"
  from "js_reserved"."case"(
    __case_identifiers__."id0",
    __case_identifiers__."id1",
    __case_identifiers__."id2",
    __case_identifiers__."id3"
  ) as __case__(v)
) as __case_result__;

select __value_of_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2", $4::"int4" as "id3") as __value_of_identifiers__,
lateral (
  select
    __value_of__.v::text as "0",
    __value_of_identifiers__.idx as "1"
  from "js_reserved"."valueOf"(
    __value_of_identifiers__."id0",
    __value_of_identifiers__."id1",
    __value_of_identifiers__."id2",
    __value_of_identifiers__."id3"
  ) as __value_of__(v)
) as __value_of_result__;

select __null_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2", $4::"int4" as "id3", $5::"int4" as "id4") as __null_identifiers__,
lateral (
  select
    ("js_reserved"."null_yield"(
      __null__,
      __null_identifiers__."id1",
      __null_identifiers__."id2",
      __null_identifiers__."id3",
      __null_identifiers__."id4"
    ))::text as "0",
    __null__."break" as "1",
    __null__."id"::text as "2",
    __null_identifiers__.idx as "3"
  from "js_reserved"."null" as __null__
  where (
    __null__."id" = __null_identifiers__."id0"
  )
  order by __null__."id" asc
) as __null_result__;