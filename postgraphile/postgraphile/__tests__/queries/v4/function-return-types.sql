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
  __frmcdc_compound_type__."a"::text as "1",
  __frmcdc_compound_type__."b" as "2",
  __frmcdc_compound_type__."c"::text as "3",
  (not (__frmcdc_compound_type__ is null))::text as "4",
  (select json_agg(s) from (
    select
      __post__."id"::text as "0"
    from "a"."post" as __post__
    where (
      __person__."id"::"int4" = __post__."author_id"
    )
    order by __post__."id" asc
  ) s) as "5",
  __person__."id"::text as "6",
  __person__."person_full_name" as "7",
  (not (__func_out_complex__ is null))::text as "8"
from "c"."func_out_complex"(
  $1::"int4",
  $2::"text"
) as __func_out_complex__
left outer join lateral (select (__func_out_complex__."y").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__func_out_complex__."z").*) as __person__
on TRUE;

select
  __func_out_out__."first_out"::text as "0",
  __func_out_out__."second_out" as "1",
  (not (__func_out_out__ is null))::text as "2"
from "c"."func_out_out"() as __func_out_out__;

select
  __func_out_out_compound_type__."o1"::text as "0",
  __frmcdc_compound_type__."a"::text as "1",
  __frmcdc_compound_type__."b" as "2",
  __frmcdc_compound_type__."c"::text as "3",
  (not (__frmcdc_compound_type__ is null))::text as "4",
  (not (__func_out_out_compound_type__ is null))::text as "5"
from "c"."func_out_out_compound_type"($1::"int4") as __func_out_out_compound_type__
left outer join lateral (select (__func_out_out_compound_type__."o2").*) as __frmcdc_compound_type__
on TRUE;

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
  __person_computed_complex__."x"::text as "2",
  __frmcdc_compound_type__."a"::text as "3",
  __frmcdc_compound_type__."b" as "4",
  __frmcdc_compound_type__."c"::text as "5",
  (not (__frmcdc_compound_type__ is null))::text as "6",
  (select json_agg(s) from (
    select
      __post__."id"::text as "0"
    from "a"."post" as __post__
    where (
      __person_2."id"::"int4" = __post__."author_id"
    )
    order by __post__."id" asc
  ) s) as "7",
  __person_2."id"::text as "8",
  __person_2."person_full_name" as "9",
  (not (__person_computed_complex__ is null))::text as "10",
  __person_computed_first_arg_inout__."id"::text as "11",
  __person_computed_first_arg_inout__."person_full_name" as "12",
  __person_3."id"::text as "13",
  __person_3."person_full_name" as "14",
  __person_computed_first_arg_inout_out__."o"::text as "15",
  (not (__person_computed_first_arg_inout_out__ is null))::text as "16",
  __person_computed_inout_out__."ino" as "17",
  __person_computed_inout_out__."o" as "18",
  (not (__person_computed_inout_out__ is null))::text as "19",
  __person_computed_out_out__."o1" as "20",
  __person_computed_out_out__."o2" as "21",
  (not (__person_computed_out_out__ is null))::text as "22",
  "c"."person_computed_inout"(
    __person__,
    $1::"text"
  ) as "23",
  "c"."person_computed_out"(__person__) as "24"
from "c"."person" as __person__
left outer join "c"."person_computed_complex"(
  __person__,
  $2::"int4",
  $3::"text"
) as __person_computed_complex__
on TRUE
left outer join lateral (select (__person_computed_complex__."y").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__person_computed_complex__."z").*) as __person_2
on TRUE
left outer join "c"."person_computed_first_arg_inout"(__person__) as __person_computed_first_arg_inout__
on TRUE
left outer join "c"."person_computed_first_arg_inout_out"(__person__) as __person_computed_first_arg_inout_out__
on TRUE
left outer join lateral (select (__person_computed_first_arg_inout_out__."person").*) as __person_3
on TRUE
left outer join "c"."person_computed_inout_out"(
  __person__,
  $4::"text"
) as __person_computed_inout_out__
on TRUE
left outer join "c"."person_computed_out_out"(__person__) as __person_computed_out_out__
on TRUE
where (
  __person__."id" = $5::"int4"
);

select
  __left_arm__."id"::text as "0",
  __left_arm__."length_in_metres"::text as "1",
  __left_arm__."mood" as "2",
  __person__."person_full_name" as "3",
  __person_secret__."sekrit" as "4",
  __person_secret__."person_id"::text as "5",
  __left_arm__."person_id"::text as "6",
  __post__."id"::text as "7",
  __post__."headline" as "8",
  __person_2."person_full_name" as "9",
  __person_secret_2."sekrit" as "10",
  __person_secret_2."person_id"::text as "11",
  __post__."author_id"::text as "12",
  __query_output_two_rows__."txt" as "13",
  (not (__query_output_two_rows__ is null))::text as "14"
from "c"."query_output_two_rows"(
  $1::"int4",
  $2::"int4",
  $3::"text"
) as __query_output_two_rows__
left outer join lateral (select (__query_output_two_rows__."left_arm").*) as __left_arm__
on TRUE
left outer join "c"."person" as __person__
on (__left_arm__."person_id"::"int4" = __person__."id")
left outer join "c"."person_secret" as __person_secret__
on (__person__."id"::"int4" = __person_secret__."person_id")
left outer join lateral (select (__query_output_two_rows__."post").*) as __post__
on TRUE
left outer join "c"."person" as __person_2
on (__post__."author_id"::"int4" = __person_2."id")
left outer join "c"."person_secret" as __person_secret_2
on (__person_2."id"::"int4" = __person_secret_2."person_id");

select
  __left_arm__."id"::text as "0",
  __left_arm__."length_in_metres"::text as "1",
  __left_arm__."mood" as "2",
  __person__."person_full_name" as "3",
  __person_secret__."sekrit" as "4",
  __person_secret__."person_id"::text as "5",
  __left_arm__."person_id"::text as "6",
  __post__."id"::text as "7",
  __post__."headline" as "8",
  __person_2."person_full_name" as "9",
  __person_secret_2."sekrit" as "10",
  __person_secret_2."person_id"::text as "11",
  __post__."author_id"::text as "12",
  __query_output_two_rows__."txt" as "13",
  (not (__query_output_two_rows__ is null))::text as "14"
from "c"."query_output_two_rows"(
  $1::"int4",
  $2::"int4",
  $3::"text"
) as __query_output_two_rows__
left outer join lateral (select (__query_output_two_rows__."left_arm").*) as __left_arm__
on TRUE
left outer join "c"."person" as __person__
on (__left_arm__."person_id"::"int4" = __person__."id")
left outer join "c"."person_secret" as __person_secret__
on (__person__."id"::"int4" = __person_secret__."person_id")
left outer join lateral (select (__query_output_two_rows__."post").*) as __post__
on TRUE
left outer join "c"."person" as __person_2
on (__post__."author_id"::"int4" = __person_2."id")
left outer join "c"."person_secret" as __person_secret_2
on (__person_2."id"::"int4" = __person_secret_2."person_id");

select
  __search_test_summaries__."id"::text as "0",
  to_char(__search_test_summaries__."total_duration", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "1",
  (not (__search_test_summaries__ is null))::text as "2"
from "c"."search_test_summaries"() as __search_test_summaries__;

select
  __func_out_complex_setof__."x"::text as "0",
  __frmcdc_compound_type__."a"::text as "1",
  __frmcdc_compound_type__."b" as "2",
  __frmcdc_compound_type__."c"::text as "3",
  (not (__frmcdc_compound_type__ is null))::text as "4",
  (select json_agg(s) from (
    select
      __post__."id"::text as "0"
    from "a"."post" as __post__
    where (
      __person__."id"::"int4" = __post__."author_id"
    )
    order by __post__."id" asc
  ) s) as "5",
  __person__."id"::text as "6",
  __person__."person_full_name" as "7",
  (not (__func_out_complex_setof__ is null))::text as "8"
from "c"."func_out_complex_setof"(
  $1::"int4",
  $2::"text"
) as __func_out_complex_setof__
left outer join lateral (select (__func_out_complex_setof__."y").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__func_out_complex_setof__."z").*) as __person__
on TRUE;

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