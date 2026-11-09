select
  __items__."id"::text as "0",
  __items__."type" as "1",
  __items__."name" as "2"
from "relational_root_refs"."items" as __items__
order by __items__."id" asc;

select
  __books__."id"::text as "0",
  __items__."name" as "1"
from "relational_root_refs"."books" as __books__
left outer join "relational_root_refs"."items" as __items__
on (
/* WHERE becoming ON */ (
  __items__."id" = __books__."id"
))
order by __books__."id" asc;

select
  __films__."id"::text as "0"
from "relational_root_refs"."films" as __films__
order by __films__."id" asc;

select
  __books__."id"::text as "0"
from "relational_root_refs"."books" as __books__
where (
  __books__."id" = $1::"int4"
);

select
  __reviews__."body" as "0"
from "relational_root_refs"."reviews" as __reviews__
inner join "relational_root_refs"."items" as __items__
on (__reviews__."item_id" = __items__."id")
where (
  __items__."id" = $1::"int4"
)
order by __reviews__."id" asc;

select
  __films__."id"::text as "0"
from "relational_root_refs"."films" as __films__
where (
  __films__."id" = $1::"int4"
);

select
  __reviews__."body" as "0"
from "relational_root_refs"."reviews" as __reviews__
inner join "relational_root_refs"."items" as __items__
on (__reviews__."item_id" = __items__."id")
where (
  __items__."id" = $1::"int4"
)
order by __reviews__."id" asc;

select
  (count(*))::text as "0"
from "relational_root_refs"."reviews" as __reviews__
inner join "relational_root_refs"."items" as __items__
on (__reviews__."item_id" = __items__."id")
where (
  __items__."id" = $1::"int4"
);