select
  __material__."class" as "0",
  __material__."id"::text as "1"
from "js_reserved"."material" as __material__
where (
  __material__."class" = $1::"text"
);

select
  __material__."class" as "0",
  __material__."id"::text as "1"
from "js_reserved"."material" as __material__
where (
  __material__."valueOf" = $1::"text"
);

select
  __crop__."id"::text as "0",
  __crop__."amount"::text as "1",
  __crop__."yield" as "2"
from "js_reserved"."crop" as __crop__
order by __crop__."id" asc;

select
  __crop__."yield" as "0",
  __crop__."amount"::text as "1",
  __crop__."id"::text as "2"
from "js_reserved"."crop" as __crop__
where (
  __crop__."id" = $1::"int4"
);

select
  __crop__."amount"::text as "0",
  __crop__."id"::text as "1"
from "js_reserved"."crop" as __crop__
where (
  __crop__."yield" = $1::"text"
);

select
  __material__."valueOf" as "0",
  __material__."class" as "1",
  __material__."id"::text as "2"
from "js_reserved"."material" as __material__
order by __material__."id" asc;