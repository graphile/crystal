select
  __post__."id"::text as "0",
  case when (__post__) is not distinct from null then null::text else json_build_array((((__post__)."id"))::text, ((__post__)."headline"), ((__post__)."body"), (((__post__)."author_id"))::text, (((__post__)."enums"))::text, (case when (((__post__)."comptypes")) is not distinct from null then null::text else array(
    select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
    from unnest(((__post__)."comptypes")) __comptype__
  )::text end))::text end as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
);

select
  case when (__post__) is not distinct from null then null::text else json_build_array((((__post__)."id"))::text, ((__post__)."headline"), ((__post__)."body"), (((__post__)."author_id"))::text, (((__post__)."enums"))::text, (case when (((__post__)."comptypes")) is not distinct from null then null::text else array(
    select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
    from unnest(((__post__)."comptypes")) __comptype__
  )::text end))::text end as "0",
  __post__."id"::text as "1"
from (select ($1::"a"."post").*) as __post__;

select
  (not (__post_computed_compound_type_array__ is null))::text as "0"
from unnest("a"."post_computed_compound_type_array"(
  $1::"a"."post",
  $2::"c"."compound_type"
)) as __post_computed_compound_type_array__;