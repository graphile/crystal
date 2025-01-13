select
  __mutation_in_inout__.v::text as "0"
from "c"."mutation_in_inout"(
  $1::"int4",
  $2::"int4"
) as __mutation_in_inout__(v);

select
  __mutation_in_out__.v::text as "0"
from "c"."mutation_in_out"($1::"int4") as __mutation_in_out__(v);

select
  __mutation_out__.v::text as "0"
from "c"."mutation_out"() as __mutation_out__(v);

select
  __mutation_out_complex__."x"::text as "0",
  case when (__mutation_out_complex__."y") is not distinct from null then null::text else json_build_array((((__mutation_out_complex__."y")."a"))::text, ((__mutation_out_complex__."y")."b"), (((__mutation_out_complex__."y")."c"))::text, ((__mutation_out_complex__."y")."d"), (((__mutation_out_complex__."y")."e"))::text, (((__mutation_out_complex__."y")."f"))::text, to_char(((__mutation_out_complex__."y")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__mutation_out_complex__."y")."foo_bar"))::text)::text end as "1",
  case when (__mutation_out_complex__."z") is not distinct from null then null::text else json_build_array((((__mutation_out_complex__."z")."id"))::text, ((__mutation_out_complex__."z")."person_full_name"), (((__mutation_out_complex__."z")."aliases"))::text, ((__mutation_out_complex__."z")."about"), ((__mutation_out_complex__."z")."email"), case when (((__mutation_out_complex__."z")."site")) is not distinct from null then null::text else json_build_array(((((__mutation_out_complex__."z")."site"))."url"))::text end, (((__mutation_out_complex__."z")."config"))::text, (((__mutation_out_complex__."z")."last_login_from_ip"))::text, (((__mutation_out_complex__."z")."last_login_from_subnet"))::text, (((__mutation_out_complex__."z")."user_mac"))::text, to_char(((__mutation_out_complex__."z")."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "2",
  (not (__mutation_out_complex__ is null))::text as "3"
from "c"."mutation_out_complex"(
  $1::"int4",
  $2::"text"
) as __mutation_out_complex__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  (not (__frmcdc_compound_type__ is null))::text as "3"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  (select json_agg(s) from (
    select
      __post__."id"::text as "0"
    from "a"."post" as __post__
    where (
      __person__."id"::"int4" = __post__."author_id"
    )
    order by __post__."id" asc
  ) s) as "0",
  __person__."id"::text as "1",
  __person__."person_full_name" as "2"
from (select ($1::"c"."person").*) as __person__;

select
  __mutation_out_complex_setof__."x"::text as "0",
  case when (__mutation_out_complex_setof__."y") is not distinct from null then null::text else json_build_array((((__mutation_out_complex_setof__."y")."a"))::text, ((__mutation_out_complex_setof__."y")."b"), (((__mutation_out_complex_setof__."y")."c"))::text, ((__mutation_out_complex_setof__."y")."d"), (((__mutation_out_complex_setof__."y")."e"))::text, (((__mutation_out_complex_setof__."y")."f"))::text, to_char(((__mutation_out_complex_setof__."y")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__mutation_out_complex_setof__."y")."foo_bar"))::text)::text end as "1",
  case when (__mutation_out_complex_setof__."z") is not distinct from null then null::text else json_build_array((((__mutation_out_complex_setof__."z")."id"))::text, ((__mutation_out_complex_setof__."z")."person_full_name"), (((__mutation_out_complex_setof__."z")."aliases"))::text, ((__mutation_out_complex_setof__."z")."about"), ((__mutation_out_complex_setof__."z")."email"), case when (((__mutation_out_complex_setof__."z")."site")) is not distinct from null then null::text else json_build_array(((((__mutation_out_complex_setof__."z")."site"))."url"))::text end, (((__mutation_out_complex_setof__."z")."config"))::text, (((__mutation_out_complex_setof__."z")."last_login_from_ip"))::text, (((__mutation_out_complex_setof__."z")."last_login_from_subnet"))::text, (((__mutation_out_complex_setof__."z")."user_mac"))::text, to_char(((__mutation_out_complex_setof__."z")."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "2",
  (not (__mutation_out_complex_setof__ is null))::text as "3"
from "c"."mutation_out_complex_setof"(
  $1::"int4",
  $2::"text"
) as __mutation_out_complex_setof__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  (not (__frmcdc_compound_type__ is null))::text as "3"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  (select json_agg(s) from (
    select
      __post__."id"::text as "0"
    from "a"."post" as __post__
    where (
      __person__."id"::"int4" = __post__."author_id"
    )
    order by __post__."id" asc
  ) s) as "0",
  __person__."id"::text as "1",
  __person__."person_full_name" as "2"
from (select ($1::"c"."person").*) as __person__;

select
  __mutation_out_out__."first_out"::text as "0",
  __mutation_out_out__."second_out" as "1",
  (not (__mutation_out_out__ is null))::text as "2"
from "c"."mutation_out_out"() as __mutation_out_out__;

select
  __mutation_out_out_compound_type__."o1"::text as "0",
  case when (__mutation_out_out_compound_type__."o2") is not distinct from null then null::text else json_build_array((((__mutation_out_out_compound_type__."o2")."a"))::text, ((__mutation_out_out_compound_type__."o2")."b"), (((__mutation_out_out_compound_type__."o2")."c"))::text, ((__mutation_out_out_compound_type__."o2")."d"), (((__mutation_out_out_compound_type__."o2")."e"))::text, (((__mutation_out_out_compound_type__."o2")."f"))::text, to_char(((__mutation_out_out_compound_type__."o2")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__mutation_out_out_compound_type__."o2")."foo_bar"))::text)::text end as "1",
  (not (__mutation_out_out_compound_type__ is null))::text as "2"
from "c"."mutation_out_out_compound_type"($1::"int4") as __mutation_out_out_compound_type__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  (not (__frmcdc_compound_type__ is null))::text as "3"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  __mutation_out_out_setof__."o1"::text as "0",
  __mutation_out_out_setof__."o2" as "1",
  (not (__mutation_out_out_setof__ is null))::text as "2"
from "c"."mutation_out_out_setof"() as __mutation_out_out_setof__;

select
  __mutation_out_out_unnamed__."column1"::text as "0",
  __mutation_out_out_unnamed__."column2" as "1",
  (not (__mutation_out_out_unnamed__ is null))::text as "2"
from "c"."mutation_out_out_unnamed"() as __mutation_out_out_unnamed__;

select
  __mutation_out_setof__.v::text as "0"
from "c"."mutation_out_setof"() as __mutation_out_setof__(v);

select
  __mutation_out_table__."id"::text as "0"
from "c"."mutation_out_table"() as __mutation_out_table__;

select
  __mutation_out_table_setof__."id"::text as "0"
from "c"."mutation_out_table_setof"() as __mutation_out_table_setof__;

select
  __mutation_out_unnamed__.v::text as "0"
from "c"."mutation_out_unnamed"() as __mutation_out_unnamed__(v);

select
  __mutation_out_unnamed_out_out_unnamed__."column1"::text as "0",
  __mutation_out_unnamed_out_out_unnamed__."column3"::text as "1",
  __mutation_out_unnamed_out_out_unnamed__."o2" as "2",
  (not (__mutation_out_unnamed_out_out_unnamed__ is null))::text as "3"
from "c"."mutation_out_unnamed_out_out_unnamed"() as __mutation_out_unnamed_out_out_unnamed__;

select
  __mutation_returns_table_multi_col__."col1"::text as "0",
  __mutation_returns_table_multi_col__."col2" as "1",
  (not (__mutation_returns_table_multi_col__ is null))::text as "2"
from "c"."mutation_returns_table_multi_col"($1::"int4") as __mutation_returns_table_multi_col__;

select
  __mutation_returns_table_one_col__.v::text as "0"
from "c"."mutation_returns_table_one_col"($1::"int4") as __mutation_returns_table_one_col__(v);