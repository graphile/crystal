select
  __vehicles__."id"::text as "0",
  __vehicles__."type" as "1",
  __vehicles__."name" as "2",
  __trucks__."truck_type" as "3",
  __trucks__."axles"::text as "4"
from "nested_polymorphism"."vehicles" as __vehicles__
left outer join "nested_polymorphism"."trucks" as __trucks__
on (
/* WHERE becoming ON */ (
  __trucks__."id" = __vehicles__."id"
))
order by __vehicles__."id" asc;

select
  __trucks__."id"::text as "0",
  __trucks__."truck_type" as "1",
  __trucks__."axles"::text as "2",
  __vehicles__."name" as "3"
from "nested_polymorphism"."trucks" as __trucks__
left outer join "nested_polymorphism"."vehicles" as __vehicles__
on (
/* WHERE becoming ON */ (
  __vehicles__."id" = __trucks__."id"
))
order by __trucks__."id" asc;

select
  __box_trucks__."id"::text as "0",
  __vehicles__."name" as "1"
from "nested_polymorphism"."box_trucks" as __box_trucks__
left outer join "nested_polymorphism"."vehicles" as __vehicles__
on (
/* WHERE becoming ON */ (
  __vehicles__."id" = __box_trucks__."id"
))
order by __box_trucks__."id" asc;

select
  __tankers__."id"::text as "0"
from "nested_polymorphism"."tankers" as __tankers__
order by __tankers__."id" asc;

select
  __box_trucks__."volume"::text as "0",
  __box_trucks__."id"::text as "1"
from "nested_polymorphism"."box_trucks" as __box_trucks__
where (
  __box_trucks__."id" = $1::"int4"
);

select
  __tankers__."litres"::text as "0",
  __tankers__."id"::text as "1"
from "nested_polymorphism"."tankers" as __tankers__
where (
  __tankers__."id" = $1::"int4"
);

select
  __cars__."doors"::text as "0",
  __cars__."id"::text as "1"
from "nested_polymorphism"."cars" as __cars__
where (
  __cars__."id" = $1::"int4"
);

select
  __box_trucks__."id"::text as "0"
from "nested_polymorphism"."box_trucks" as __box_trucks__
where (
  __box_trucks__."id" = $1::"int4"
);

select
  __tankers__."id"::text as "0"
from "nested_polymorphism"."tankers" as __tankers__
where (
  __tankers__."id" = $1::"int4"
);

select
  __services__."note" as "0"
from "nested_polymorphism"."services" as __services__
inner join "nested_polymorphism"."vehicles" as __vehicles__
on (__services__."vehicle_id" = __vehicles__."id")
inner join "nested_polymorphism"."trucks" as __trucks__
on (__vehicles__."id" = __trucks__."id")
where (
  __trucks__."id" = $1::"int4"
)
order by __services__."id" asc;

select
  __inspections__."note" as "0"
from "nested_polymorphism"."inspections" as __inspections__
inner join "nested_polymorphism"."trucks" as __trucks__
on (__inspections__."truck_id" = __trucks__."id")
where (
  __trucks__."id" = $1::"int4"
)
order by __inspections__."id" asc;

select
  __services__."note" as "0"
from "nested_polymorphism"."services" as __services__
inner join "nested_polymorphism"."vehicles" as __vehicles__
on (__services__."vehicle_id" = __vehicles__."id")
inner join "nested_polymorphism"."trucks" as __trucks__
on (__vehicles__."id" = __trucks__."id")
where (
  __trucks__."id" = $1::"int4"
)
order by __services__."id" asc;