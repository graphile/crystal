select
  __reserved__."case" as "0",
  __reserved__."do" as "1",
  __reserved__."id"::text as "2",
  __reserved__."null" as "3"
from "js_reserved"."reserved" as __reserved__
order by __reserved__."id" asc;

select
  __reserved__."do" as "0",
  __reserved__."id"::text as "1",
  __reserved__."null" as "2"
from "js_reserved"."reserved" as __reserved__
where (
  __reserved__."case" = $1::"text"
);

select
  __reserved__."case" as "0",
  __reserved__."id"::text as "1",
  __reserved__."null" as "2"
from "js_reserved"."reserved" as __reserved__
where (
  __reserved__."do" = $1::"text"
);

select
  __reserved__."case" as "0",
  __reserved__."do" as "1",
  __reserved__."null" as "2",
  __reserved__."id"::text as "3"
from "js_reserved"."reserved" as __reserved__
where (
  __reserved__."id" = $1::"int4"
);

select
  __reserved__."case" as "0",
  __reserved__."do" as "1",
  __reserved__."id"::text as "2"
from "js_reserved"."reserved" as __reserved__
where (
  __reserved__."null" = $1::"text"
);