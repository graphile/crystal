insert into "c"."person" as __person__ ("id", "person_full_name", "about", "email", "config", "last_login_from_ip", "last_login_from_subnet", "user_mac") values ($1::"int4", $2::"varchar", $3::"text", $4::"b"."email", $5::"hstore", $6::"inet", $7::"cidr", $8::"macaddr") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "7",
  __person__."id"::text as "8";

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
)
order by __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
)
order by __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
)
order by __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
)
order by __person__."email" desc, __person__."id" desc;

select
  ("c"."person_exists"(
    __person__,
    $1::"b"."email"
  ))::text as "0",
  __person__."id"::text as "1"
from (select ($2::"c"."person").*) as __person__;