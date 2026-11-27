select
  __constructor__."name" as "0",
  __constructor__."export" as "1",
  __constructor__."id"::text as "2"
from "js_reserved"."constructor" as __constructor__
order by __constructor__."id" asc;

select
  __constructor__."name" as "0",
  __constructor__."id"::text as "1"
from "js_reserved"."constructor" as __constructor__
where (
  __constructor__."export" = $1::"text"
);

select
  __constructor__."export" as "0",
  __constructor__."name" as "1",
  __constructor__."id"::text as "2"
from "js_reserved"."constructor" as __constructor__
where (
  __constructor__."id" = $1::"int4"
);

select
  __constructor__."export" as "0",
  __constructor__."id"::text as "1"
from "js_reserved"."constructor" as __constructor__
where (
  __constructor__."name" = $1::"text"
);

select
  __yield__."crop" as "0",
  __yield__."export" as "1",
  __yield__."id"::text as "2"
from "js_reserved"."yield" as __yield__
order by __yield__."id" asc;

select
  __yield__."crop" as "0",
  __yield__."id"::text as "1"
from "js_reserved"."yield" as __yield__
where (
  __yield__."export" = $1::"text"
);

select
  __yield__."crop" as "0",
  __yield__."export" as "1",
  __yield__."id"::text as "2"
from "js_reserved"."yield" as __yield__
where (
  __yield__."id" = $1::"int4"
);

select
  __proto__."id"::text as "0",
  __proto__."name" as "1",
  __proto__."brand" as "2"
from "js_reserved"."__proto__" as __proto__
order by __proto__."id" asc;

select
  __proto__."brand" as "0",
  __proto__."name" as "1",
  __proto__."id"::text as "2"
from "js_reserved"."__proto__" as __proto__
where (
  __proto__."id" = $1::"int4"
);

select
  __proto__."brand" as "0",
  __proto__."id"::text as "1"
from "js_reserved"."__proto__" as __proto__
where (
  __proto__."name" = $1::"text"
);

select
  __null__."break" as "0",
  __null__."hasOwnProperty" as "1",
  __null__."id"::text as "2"
from "js_reserved"."null" as __null__
order by __null__."id" asc;

select
  __null__."hasOwnProperty" as "0",
  __null__."id"::text as "1"
from "js_reserved"."null" as __null__
where (
  __null__."break" = $1::"text"
);

select
  __null__."break" as "0",
  __null__."id"::text as "1"
from "js_reserved"."null" as __null__
where (
  __null__."hasOwnProperty" = $1::"text"
);

select
  __null__."break" as "0",
  __null__."hasOwnProperty" as "1",
  __null__."id"::text as "2"
from "js_reserved"."null" as __null__
where (
  __null__."id" = $1::"int4"
);