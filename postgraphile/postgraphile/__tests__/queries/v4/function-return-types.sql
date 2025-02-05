select
  __func_in_inout__.v::text as "0"
from "c"."func_in_inout"(
  $1::"int4",
  $2::"int4"
) as __func_in_inout__(v);

select
  __func_in_out__.v::text as "0"
from "c"."func_in_out"($1::"int4") as __func_in_out__(v);

select
  __func_out__.v::text as "0"
from "c"."func_out"() as __func_out__(v);

select
  __func_out_complex__."x"::text as "0",
  case when (__func_out_complex__."y") is not distinct from null then null::text else json_build_array((((__func_out_complex__."y")."a"))::text, ((__func_out_complex__."y")."b"), (((__func_out_complex__."y")."c"))::text, ((__func_out_complex__."y")."d"), (((__func_out_complex__."y")."e"))::text, (((__func_out_complex__."y")."f"))::text, to_char(((__func_out_complex__."y")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__func_out_complex__."y")."foo_bar"))::text)::text end as "1",
  case when (__func_out_complex__."z") is not distinct from null then null::text else json_build_array((((__func_out_complex__."z")."id"))::text, ((__func_out_complex__."z")."person_full_name"), (((__func_out_complex__."z")."aliases"))::text, ((__func_out_complex__."z")."about"), ((__func_out_complex__."z")."email"), case when (((__func_out_complex__."z")."site")) is not distinct from null then null::text else json_build_array(((((__func_out_complex__."z")."site"))."url"))::text end, (((__func_out_complex__."z")."config"))::text, (((__func_out_complex__."z")."last_login_from_ip"))::text, (((__func_out_complex__."z")."last_login_from_subnet"))::text, (((__func_out_complex__."z")."user_mac"))::text, to_char(((__func_out_complex__."z")."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "2",
  (not (__func_out_complex__ is null))::text as "3"
from "c"."func_out_complex"(
  $1::"int4",
  $2::"text"
) as __func_out_complex__;

select
  __func_out_out__."first_out"::text as "0",
  __func_out_out__."second_out" as "1",
  (not (__func_out_out__ is null))::text as "2"
from "c"."func_out_out"() as __func_out_out__;

select
  __func_out_out_compound_type__."o1"::text as "0",
  case when (__func_out_out_compound_type__."o2") is not distinct from null then null::text else json_build_array((((__func_out_out_compound_type__."o2")."a"))::text, ((__func_out_out_compound_type__."o2")."b"), (((__func_out_out_compound_type__."o2")."c"))::text, ((__func_out_out_compound_type__."o2")."d"), (((__func_out_out_compound_type__."o2")."e"))::text, (((__func_out_out_compound_type__."o2")."f"))::text, to_char(((__func_out_out_compound_type__."o2")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__func_out_out_compound_type__."o2")."foo_bar"))::text)::text end as "1",
  (not (__func_out_out_compound_type__ is null))::text as "2"
from "c"."func_out_out_compound_type"($1::"int4") as __func_out_out_compound_type__;

select
  __func_out_out_unnamed__."column1"::text as "0",
  __func_out_out_unnamed__."column2" as "1",
  (not (__func_out_out_unnamed__ is null))::text as "2"
from "c"."func_out_out_unnamed"() as __func_out_out_unnamed__;

select
  __func_out_table__."id"::text as "0"
from "c"."func_out_table"() as __func_out_table__;

select
  __func_out_unnamed__.v::text as "0"
from "c"."func_out_unnamed"() as __func_out_unnamed__(v);

select
  __func_out_unnamed_out_out_unnamed__."column1"::text as "0",
  __func_out_unnamed_out_out_unnamed__."column3"::text as "1",
  __func_out_unnamed_out_out_unnamed__."o2" as "2",
  (not (__func_out_unnamed_out_out_unnamed__ is null))::text as "3"
from "c"."func_out_unnamed_out_out_unnamed"() as __func_out_unnamed_out_out_unnamed__;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "2",
  "c"."person_computed_inout"(
    __person__,
    $1::"text"
  ) as "3",
  "c"."person_computed_out"(__person__) as "4"
from "c"."person" as __person__
where (
  __person__."id" = $2::"int4"
);

select
  case when (__query_output_two_rows__."left_arm") is not distinct from null then null::text else json_build_array((((__query_output_two_rows__."left_arm")."id"))::text, (((__query_output_two_rows__."left_arm")."person_id"))::text, (((__query_output_two_rows__."left_arm")."length_in_metres"))::text, ((__query_output_two_rows__."left_arm")."mood"))::text end as "0",
  case when (__query_output_two_rows__."post") is not distinct from null then null::text else json_build_array((((__query_output_two_rows__."post")."id"))::text, ((__query_output_two_rows__."post")."headline"), ((__query_output_two_rows__."post")."body"), (((__query_output_two_rows__."post")."author_id"))::text, (((__query_output_two_rows__."post")."enums"))::text, (case when (((__query_output_two_rows__."post")."comptypes")) is not distinct from null then null::text else array(
    select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
    from unnest(((__query_output_two_rows__."post")."comptypes")) __comptype__
  )::text end))::text end as "1",
  __query_output_two_rows__."txt" as "2",
  (not (__query_output_two_rows__ is null))::text as "3"
from "c"."query_output_two_rows"(
  $1::"int4",
  $2::"int4",
  $3::"text"
) as __query_output_two_rows__;

select
  case when (__query_output_two_rows__."left_arm") is not distinct from null then null::text else json_build_array((((__query_output_two_rows__."left_arm")."id"))::text, (((__query_output_two_rows__."left_arm")."person_id"))::text, (((__query_output_two_rows__."left_arm")."length_in_metres"))::text, ((__query_output_two_rows__."left_arm")."mood"))::text end as "0",
  case when (__query_output_two_rows__."post") is not distinct from null then null::text else json_build_array((((__query_output_two_rows__."post")."id"))::text, ((__query_output_two_rows__."post")."headline"), ((__query_output_two_rows__."post")."body"), (((__query_output_two_rows__."post")."author_id"))::text, (((__query_output_two_rows__."post")."enums"))::text, (case when (((__query_output_two_rows__."post")."comptypes")) is not distinct from null then null::text else array(
    select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
    from unnest(((__query_output_two_rows__."post")."comptypes")) __comptype__
  )::text end))::text end as "1",
  __query_output_two_rows__."txt" as "2",
  (not (__query_output_two_rows__ is null))::text as "3"
from "c"."query_output_two_rows"(
  $1::"int4",
  $2::"int4",
  $3::"text"
) as __query_output_two_rows__;

select
  __search_test_summaries__."id"::text as "0",
  to_char(__search_test_summaries__."total_duration", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "1",
  (not (__search_test_summaries__ is null))::text as "2"
from "c"."search_test_summaries"() as __search_test_summaries__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  (not (__frmcdc_compound_type__ is null))::text as "3"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from (select ($1::"c"."person").*) as __person__;

select
  __func_out_complex_setof__."x"::text as "0",
  case when (__func_out_complex_setof__."y") is not distinct from null then null::text else json_build_array((((__func_out_complex_setof__."y")."a"))::text, ((__func_out_complex_setof__."y")."b"), (((__func_out_complex_setof__."y")."c"))::text, ((__func_out_complex_setof__."y")."d"), (((__func_out_complex_setof__."y")."e"))::text, (((__func_out_complex_setof__."y")."f"))::text, to_char(((__func_out_complex_setof__."y")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__func_out_complex_setof__."y")."foo_bar"))::text)::text end as "1",
  case when (__func_out_complex_setof__."z") is not distinct from null then null::text else json_build_array((((__func_out_complex_setof__."z")."id"))::text, ((__func_out_complex_setof__."z")."person_full_name"), (((__func_out_complex_setof__."z")."aliases"))::text, ((__func_out_complex_setof__."z")."about"), ((__func_out_complex_setof__."z")."email"), case when (((__func_out_complex_setof__."z")."site")) is not distinct from null then null::text else json_build_array(((((__func_out_complex_setof__."z")."site"))."url"))::text end, (((__func_out_complex_setof__."z")."config"))::text, (((__func_out_complex_setof__."z")."last_login_from_ip"))::text, (((__func_out_complex_setof__."z")."last_login_from_subnet"))::text, (((__func_out_complex_setof__."z")."user_mac"))::text, to_char(((__func_out_complex_setof__."z")."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "2",
  (not (__func_out_complex_setof__ is null))::text as "3"
from "c"."func_out_complex_setof"(
  $1::"int4",
  $2::"text"
) as __func_out_complex_setof__;

select
  (count(*))::text as "0"
from "c"."func_out_complex_setof"(
  $1::"int4",
  $2::"text"
) as __func_out_complex_setof__;

select
  __func_out_out_setof__."o1"::text as "0",
  __func_out_out_setof__."o2" as "1",
  (not (__func_out_out_setof__ is null))::text as "2"
from "c"."func_out_out_setof"() as __func_out_out_setof__;

select
  (count(*))::text as "0"
from "c"."func_out_out_setof"() as __func_out_out_setof__;

select
  __func_out_setof__.v::text as "0"
from "c"."func_out_setof"() as __func_out_setof__(v);

select
  (count(*))::text as "0"
from "c"."func_out_setof"() as __func_out_setof__(v);

select
  __func_out_table_setof__."id"::text as "0"
from "c"."func_out_table_setof"() as __func_out_table_setof__;

select
  (count(*))::text as "0"
from "c"."func_out_table_setof"() as __func_out_table_setof__;

select
  __func_returns_table_multi_col__."col1"::text as "0",
  __func_returns_table_multi_col__."col2" as "1",
  (not (__func_returns_table_multi_col__ is null))::text as "2"
from "c"."func_returns_table_multi_col"($1::"int4") as __func_returns_table_multi_col__;

select
  (count(*))::text as "0"
from "c"."func_returns_table_multi_col"($1::"int4") as __func_returns_table_multi_col__;

select
  __func_returns_table_one_col__.v::text as "0"
from "c"."func_returns_table_one_col"($1::"int4") as __func_returns_table_one_col__(v);

select
  (count(*))::text as "0"
from "c"."func_returns_table_one_col"($1::"int4") as __func_returns_table_one_col__(v);

select
  __person_computed_complex__."x"::text as "0",
  case when (__person_computed_complex__."y") is not distinct from null then null::text else json_build_array((((__person_computed_complex__."y")."a"))::text, ((__person_computed_complex__."y")."b"), (((__person_computed_complex__."y")."c"))::text, ((__person_computed_complex__."y")."d"), (((__person_computed_complex__."y")."e"))::text, (((__person_computed_complex__."y")."f"))::text, to_char(((__person_computed_complex__."y")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_computed_complex__."y")."foo_bar"))::text)::text end as "1",
  case when (__person_computed_complex__."z") is not distinct from null then null::text else json_build_array((((__person_computed_complex__."z")."id"))::text, ((__person_computed_complex__."z")."person_full_name"), (((__person_computed_complex__."z")."aliases"))::text, ((__person_computed_complex__."z")."about"), ((__person_computed_complex__."z")."email"), case when (((__person_computed_complex__."z")."site")) is not distinct from null then null::text else json_build_array(((((__person_computed_complex__."z")."site"))."url"))::text end, (((__person_computed_complex__."z")."config"))::text, (((__person_computed_complex__."z")."last_login_from_ip"))::text, (((__person_computed_complex__."z")."last_login_from_subnet"))::text, (((__person_computed_complex__."z")."user_mac"))::text, to_char(((__person_computed_complex__."z")."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "2",
  (not (__person_computed_complex__ is null))::text as "3"
from "c"."person_computed_complex"(
  $1::"c"."person",
  $2::"int4",
  $3::"text"
) as __person_computed_complex__;

select
  __person_computed_first_arg_inout__."id"::text as "0",
  __person_computed_first_arg_inout__."person_full_name" as "1"
from "c"."person_computed_first_arg_inout"($1::"c"."person") as __person_computed_first_arg_inout__;

select
  case when (__person_computed_first_arg_inout_out__."person") is not distinct from null then null::text else json_build_array((((__person_computed_first_arg_inout_out__."person")."id"))::text, ((__person_computed_first_arg_inout_out__."person")."person_full_name"), (((__person_computed_first_arg_inout_out__."person")."aliases"))::text, ((__person_computed_first_arg_inout_out__."person")."about"), ((__person_computed_first_arg_inout_out__."person")."email"), case when (((__person_computed_first_arg_inout_out__."person")."site")) is not distinct from null then null::text else json_build_array(((((__person_computed_first_arg_inout_out__."person")."site"))."url"))::text end, (((__person_computed_first_arg_inout_out__."person")."config"))::text, (((__person_computed_first_arg_inout_out__."person")."last_login_from_ip"))::text, (((__person_computed_first_arg_inout_out__."person")."last_login_from_subnet"))::text, (((__person_computed_first_arg_inout_out__."person")."user_mac"))::text, to_char(((__person_computed_first_arg_inout_out__."person")."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "0",
  __person_computed_first_arg_inout_out__."o"::text as "1",
  (not (__person_computed_first_arg_inout_out__ is null))::text as "2"
from "c"."person_computed_first_arg_inout_out"($1::"c"."person") as __person_computed_first_arg_inout_out__;

select
  __person_computed_inout_out__."ino" as "0",
  __person_computed_inout_out__."o" as "1",
  (not (__person_computed_inout_out__ is null))::text as "2"
from "c"."person_computed_inout_out"(
  $1::"c"."person",
  $2::"text"
) as __person_computed_inout_out__;

select
  __person_computed_out_out__."o1" as "0",
  __person_computed_out_out__."o2" as "1",
  (not (__person_computed_out_out__ is null))::text as "2"
from "c"."person_computed_out_out"($1::"c"."person") as __person_computed_out_out__;

select
  __left_arm__."id"::text as "0",
  __left_arm__."length_in_metres"::text as "1",
  __left_arm__."mood" as "2",
  __left_arm__."person_id"::text as "3"
from (select ($1::"c"."left_arm").*) as __left_arm__;

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2"
from (select ($1::"a"."post").*) as __post__;

select
  __left_arm__."id"::text as "0",
  __left_arm__."length_in_metres"::text as "1",
  __left_arm__."mood" as "2",
  __left_arm__."person_id"::text as "3"
from (select ($1::"c"."left_arm").*) as __left_arm__;

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2"
from (select ($1::"a"."post").*) as __post__;

select
  __post__."id"::text as "0"
from "a"."post" as __post__
where (
  __post__."author_id" = $1::"int4"
)
order by __post__."id" asc;

select
  __person__."person_full_name" as "0",
  __person__."id"::text as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  __person__."person_full_name" as "0",
  __person__."id"::text as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  __person_secret__."sekrit" as "0",
  __person_secret__."person_id"::text as "1"
from "c"."person_secret" as __person_secret__
where (
  __person_secret__."person_id" = $1::"int4"
);

select
  __person_secret__."sekrit" as "0",
  __person_secret__."person_id"::text as "1"
from "c"."person_secret" as __person_secret__
where (
  __person_secret__."person_id" = $1::"int4"
);