select
  __letter_descriptions__."id"::text as "0",
  __letter_descriptions__."letter"::text as "1",
  __letter_descriptions__."letter_via_view"::text as "2",
  __letter_descriptions__."description" as "3"
from "enum_tables"."letter_descriptions" as __letter_descriptions__
where (
  __letter_descriptions__."letter" = $1::"text"
);

select
  __letter_descriptions__."id"::text as "0",
  __letter_descriptions__."letter"::text as "1",
  __letter_descriptions__."letter_via_view"::text as "2",
  __letter_descriptions__."description" as "3"
from "enum_tables"."letter_descriptions" as __letter_descriptions__
where (
  __letter_descriptions__."letter_via_view" = $1::"text"
);

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

select
  __letter_descriptions__."id"::text as "0",
  __letter_descriptions__."letter"::text as "1",
  __letter_descriptions__."letter_via_view"::text as "2",
  __letter_descriptions__."description" as "3"
from "enum_tables"."letter_descriptions" as __letter_descriptions__
where (
  __letter_descriptions__."letter" = $1::"text"
)
order by __letter_descriptions__."id" asc;

select
  __letter_descriptions__."id"::text as "0",
  __letter_descriptions__."letter"::text as "1",
  __letter_descriptions__."letter_via_view"::text as "2",
  __letter_descriptions__."description" as "3"
from "enum_tables"."letter_descriptions" as __letter_descriptions__
where (
  __letter_descriptions__."letter_via_view" = $1::"text"
)
order by __letter_descriptions__."id" asc;