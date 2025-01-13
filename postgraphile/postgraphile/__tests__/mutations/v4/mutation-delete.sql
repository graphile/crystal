delete from "a"."post" as __post__ where (__post__."id" = $1::"int4") returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2";

delete from "a"."post" as __post__ where (__post__."id" = $1::"int4") returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2";

delete from "a"."post" as __post__ where (__post__."id" = $1::"int4") returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2";

delete from "a"."post" as __post__ where (__post__."id" = $1::"int4") returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2";

delete from "b"."types" as __types__ where (__types__."id" = $1::"int4") returning
  __types__."id"::text as "0";

delete from "a"."post" as __post__ where (__post__."id" = $1::"int4") returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2";

delete from "a"."post" as __post__ where (__post__."id" = $1::"int4") returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2";

delete from "a"."post" as __post__ where (__post__."id" = $1::"int4") returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2";

delete from "a"."post" as __post__ where (__post__."id" = $1::"int4") returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2";

delete from "c"."compound_key" as __compound_key__ where ((__compound_key__."person_id_1" = $1::"int4") and (__compound_key__."person_id_2" = $2::"int4")) returning
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

delete from "c"."compound_key" as __compound_key__ where ((__compound_key__."person_id_1" = $1::"int4") and (__compound_key__."person_id_2" = $2::"int4")) returning
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

delete from "c"."person" as __person__ where (__person__."email" = $1::"b"."email") returning
  __person__."id"::text as "0";

delete from "c"."person" as __person__ where (__person__."email" = $1::"b"."email") returning
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "3";

select __person_result__.*
from (select 0 as idx) as __person_identifiers__,
lateral (
  select
    ("c"."person_exists"(
      __person__,
      $1::"b"."email"
    ))::text as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from (select ($2::"c"."person").*) as __person__
) as __person_result__;

delete from "c"."person" as __person__ where (__person__."id" = $1::"int4") returning
  __person__."id"::text as "0",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "1";

select __person_result__.*
from (select 0 as idx) as __person_identifiers__,
lateral (
  select
    "c"."person_first_name"(__person__) as "0",
    __person__."id"::text as "1",
    __person__."email" as "2",
    __person_identifiers__.idx as "3"
  from (select ($1::"c"."person").*) as __person__
  order by "c"."person_first_name"(__person__) asc, __person__."id" asc
) as __person_result__;