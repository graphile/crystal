select
  __project__."brand" as "0",
  __project__."id"::text as "1"
from "js_reserved"."project" as __project__
where (
  __project__."__proto__" = $1::"text"
);

select
  __project__."brand" as "0",
  __project__."__proto__" as "1",
  __project__."id"::text as "2"
from "js_reserved"."project" as __project__
where (
  __project__."id" = $1::"int4"
);

select
  __project__."__proto__" as "0",
  __project__."brand" as "1",
  __project__."id"::text as "2"
from "js_reserved"."project" as __project__
order by __project__."id" asc;