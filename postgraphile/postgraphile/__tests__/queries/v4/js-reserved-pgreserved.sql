select
  __reserved__."case" as "0",
  __reserved__."do" as "1",
  __reserved__."id"::text as "2",
  __reserved__."null" as "3"
from "js_reserved"."reserved" as __reserved__
order by __reserved__."id" asc;

select __reserved_result__.*
from (select 0 as idx, $1::"text" as "id0") as __reserved_identifiers__,
lateral (
  select
    __reserved__."do" as "0",
    __reserved__."id"::text as "1",
    __reserved__."null" as "2",
    __reserved_identifiers__.idx as "3"
  from "js_reserved"."reserved" as __reserved__
  where (
    __reserved__."case" = __reserved_identifiers__."id0"
  )
  order by __reserved__."id" asc
) as __reserved_result__;

select __reserved_result__.*
from (select 0 as idx, $1::"text" as "id0") as __reserved_identifiers__,
lateral (
  select
    __reserved__."case" as "0",
    __reserved__."id"::text as "1",
    __reserved__."null" as "2",
    __reserved_identifiers__.idx as "3"
  from "js_reserved"."reserved" as __reserved__
  where (
    __reserved__."do" = __reserved_identifiers__."id0"
  )
  order by __reserved__."id" asc
) as __reserved_result__;

select __reserved_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __reserved_identifiers__,
lateral (
  select
    __reserved__."case" as "0",
    __reserved__."do" as "1",
    __reserved__."null" as "2",
    __reserved__."id"::text as "3",
    __reserved_identifiers__.idx as "4"
  from "js_reserved"."reserved" as __reserved__
  where (
    __reserved__."id" = __reserved_identifiers__."id0"
  )
  order by __reserved__."id" asc
) as __reserved_result__;

select __reserved_result__.*
from (select 0 as idx, $1::"text" as "id0") as __reserved_identifiers__,
lateral (
  select
    __reserved__."case" as "0",
    __reserved__."do" as "1",
    __reserved__."id"::text as "2",
    __reserved_identifiers__.idx as "3"
  from "js_reserved"."reserved" as __reserved__
  where (
    __reserved__."null" = __reserved_identifiers__."id0"
  )
  order by __reserved__."id" asc
) as __reserved_result__;