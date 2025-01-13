select __letter_descriptions_result__.*
from (select 0 as idx, $1::"text" as "id0") as __letter_descriptions_identifiers__,
lateral (
  select
    __letter_descriptions__."id"::text as "0",
    __letter_descriptions__."letter"::text as "1",
    __letter_descriptions__."letter_via_view"::text as "2",
    __letter_descriptions__."description" as "3",
    __letter_descriptions_identifiers__.idx as "4"
  from "enum_tables"."letter_descriptions" as __letter_descriptions__
  where (
    __letter_descriptions__."letter" = __letter_descriptions_identifiers__."id0"
  )
) as __letter_descriptions_result__;

select __letter_descriptions_result__.*
from (select 0 as idx, $1::"text" as "id0") as __letter_descriptions_identifiers__,
lateral (
  select
    __letter_descriptions__."id"::text as "0",
    __letter_descriptions__."letter"::text as "1",
    __letter_descriptions__."letter_via_view"::text as "2",
    __letter_descriptions__."description" as "3",
    __letter_descriptions_identifiers__.idx as "4"
  from "enum_tables"."letter_descriptions" as __letter_descriptions__
  where (
    __letter_descriptions__."letter_via_view" = __letter_descriptions_identifiers__."id0"
  )
) as __letter_descriptions_result__;

select
  __letter_descriptions__."id"::text as "0",
  __letter_descriptions__."letter"::text as "1",
  __letter_descriptions__."letter_via_view"::text as "2",
  __letter_descriptions__."description" as "3"
from "enum_tables"."letter_descriptions" as __letter_descriptions__
order by __letter_descriptions__."id" asc;

select
  __letter_descriptions__."id"::text as "0",
  __letter_descriptions__."letter"::text as "1",
  __letter_descriptions__."letter_via_view"::text as "2",
  __letter_descriptions__."description" as "3"
from "enum_tables"."letter_descriptions" as __letter_descriptions__
order by __letter_descriptions__."letter" desc;

select
  __letter_descriptions__."id"::text as "0",
  __letter_descriptions__."letter"::text as "1",
  __letter_descriptions__."letter_via_view"::text as "2",
  __letter_descriptions__."description" as "3"
from "enum_tables"."letter_descriptions" as __letter_descriptions__
order by __letter_descriptions__."letter_via_view" desc;

select __letter_descriptions_result__.*
from (select 0 as idx) as __letter_descriptions_identifiers__,
lateral (
  select
    __letter_descriptions__."id"::text as "0",
    __letter_descriptions__."letter"::text as "1",
    __letter_descriptions__."letter_via_view"::text as "2",
    __letter_descriptions__."description" as "3",
    __letter_descriptions_identifiers__.idx as "4"
  from "enum_tables"."letter_descriptions" as __letter_descriptions__
  where (
    __letter_descriptions__."letter" = $1::"text"
  )
  order by __letter_descriptions__."id" asc
) as __letter_descriptions_result__;

select __letter_descriptions_result__.*
from (select 0 as idx) as __letter_descriptions_identifiers__,
lateral (
  select
    __letter_descriptions__."id"::text as "0",
    __letter_descriptions__."letter"::text as "1",
    __letter_descriptions__."letter_via_view"::text as "2",
    __letter_descriptions__."description" as "3",
    __letter_descriptions_identifiers__.idx as "4"
  from "enum_tables"."letter_descriptions" as __letter_descriptions__
  where (
    __letter_descriptions__."letter_via_view" = $1::"text"
  )
  order by __letter_descriptions__."id" asc
) as __letter_descriptions_result__;