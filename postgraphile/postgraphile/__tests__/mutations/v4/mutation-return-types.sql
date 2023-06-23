select __mutation_in_inout_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __mutation_in_inout_identifiers__,
lateral (
  select
    __mutation_in_inout__.v::text as "0",
    __mutation_in_inout_identifiers__.idx as "1"
  from "c"."mutation_in_inout"(
    __mutation_in_inout_identifiers__."id0",
    __mutation_in_inout_identifiers__."id1"
  ) as __mutation_in_inout__(v)
) as __mutation_in_inout_result__;

select __mutation_in_out_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __mutation_in_out_identifiers__,
lateral (
  select
    __mutation_in_out__.v::text as "0",
    __mutation_in_out_identifiers__.idx as "1"
  from "c"."mutation_in_out"(__mutation_in_out_identifiers__."id0") as __mutation_in_out__(v)
) as __mutation_in_out_result__;

select
  __mutation_out__.v::text as "0"
from "c"."mutation_out"() as __mutation_out__(v);

select __mutation_out_complex_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"text" as "id1") as __mutation_out_complex_identifiers__,
lateral (
  select
    __mutation_out_complex__."x"::text as "0",
    __mutation_out_complex__."y"::text as "1",
    __mutation_out_complex__."z"::text as "2",
    (not (__mutation_out_complex__ is null))::text as "3",
    __mutation_out_complex_identifiers__.idx as "4"
  from "c"."mutation_out_complex"(
    __mutation_out_complex_identifiers__."id0",
    __mutation_out_complex_identifiers__."id1"
  ) as __mutation_out_complex__
) as __mutation_out_complex_result__;

select __frmcdc_compound_type_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    (not (__frmcdc_compound_type__ is null))::text as "3",
    __frmcdc_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0") as __person_identifiers__,
lateral (
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
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from (select (__person_identifiers__."id0").*) as __person__
  order by __person__."id" asc
) as __person_result__;

select __mutation_out_complex_setof_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"text" as "id1") as __mutation_out_complex_setof_identifiers__,
lateral (
  select
    __mutation_out_complex_setof__."x"::text as "0",
    __mutation_out_complex_setof__."y"::text as "1",
    __mutation_out_complex_setof__."z"::text as "2",
    (not (__mutation_out_complex_setof__ is null))::text as "3",
    __mutation_out_complex_setof_identifiers__.idx as "4"
  from "c"."mutation_out_complex_setof"(
    __mutation_out_complex_setof_identifiers__."id0",
    __mutation_out_complex_setof_identifiers__."id1"
  ) as __mutation_out_complex_setof__
) as __mutation_out_complex_setof_result__;

select __frmcdc_compound_type_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    (not (__frmcdc_compound_type__ is null))::text as "3",
    __frmcdc_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0") as __person_identifiers__,
lateral (
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
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from (select (__person_identifiers__."id0").*) as __person__
  order by __person__."id" asc
) as __person_result__;

select
  __mutation_out_out__."first_out"::text as "0",
  __mutation_out_out__."second_out" as "1",
  (not (__mutation_out_out__ is null))::text as "2"
from "c"."mutation_out_out"() as __mutation_out_out__;

select __mutation_out_out_compound_type_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __mutation_out_out_compound_type_identifiers__,
lateral (
  select
    __mutation_out_out_compound_type__."o1"::text as "0",
    __mutation_out_out_compound_type__."o2"::text as "1",
    (not (__mutation_out_out_compound_type__ is null))::text as "2",
    __mutation_out_out_compound_type_identifiers__.idx as "3"
  from "c"."mutation_out_out_compound_type"(__mutation_out_out_compound_type_identifiers__."id0") as __mutation_out_out_compound_type__
) as __mutation_out_out_compound_type_result__;

select __frmcdc_compound_type_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    (not (__frmcdc_compound_type__ is null))::text as "3",
    __frmcdc_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

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

select __mutation_returns_table_multi_col_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __mutation_returns_table_multi_col_identifiers__,
lateral (
  select
    __mutation_returns_table_multi_col__."col1"::text as "0",
    __mutation_returns_table_multi_col__."col2" as "1",
    (not (__mutation_returns_table_multi_col__ is null))::text as "2",
    __mutation_returns_table_multi_col_identifiers__.idx as "3"
  from "c"."mutation_returns_table_multi_col"(__mutation_returns_table_multi_col_identifiers__."id0") as __mutation_returns_table_multi_col__
) as __mutation_returns_table_multi_col_result__;

select __mutation_returns_table_one_col_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __mutation_returns_table_one_col_identifiers__,
lateral (
  select
    __mutation_returns_table_one_col__.v::text as "0",
    __mutation_returns_table_one_col_identifiers__.idx as "1"
  from "c"."mutation_returns_table_one_col"(__mutation_returns_table_one_col_identifiers__."id0") as __mutation_returns_table_one_col__(v)
) as __mutation_returns_table_one_col_result__;