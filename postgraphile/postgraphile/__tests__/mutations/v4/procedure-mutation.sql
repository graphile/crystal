select __json_identity_mutation_result__.*
from (select 0 as idx, $1::"json" as "id0") as __json_identity_mutation_identifiers__,
lateral (
  select
    __json_identity_mutation__.v::text as "0",
    __json_identity_mutation_identifiers__.idx as "1"
  from "c"."json_identity_mutation"(__json_identity_mutation_identifiers__."id0") as __json_identity_mutation__(v)
) as __json_identity_mutation_result__;

select __jsonb_identity_mutation_result__.*
from (select 0 as idx, $1::"jsonb" as "id0") as __jsonb_identity_mutation_identifiers__,
lateral (
  select
    __jsonb_identity_mutation__.v::text as "0",
    __jsonb_identity_mutation_identifiers__.idx as "1"
  from "c"."jsonb_identity_mutation"(__jsonb_identity_mutation_identifiers__."id0") as __jsonb_identity_mutation__(v)
) as __jsonb_identity_mutation_result__;

select __json_identity_mutation_result__.*
from (select 0 as idx, $1::"json" as "id0") as __json_identity_mutation_identifiers__,
lateral (
  select
    __json_identity_mutation__.v::text as "0",
    __json_identity_mutation_identifiers__.idx as "1"
  from "c"."json_identity_mutation"(__json_identity_mutation_identifiers__."id0") as __json_identity_mutation__(v)
) as __json_identity_mutation_result__;

select __jsonb_identity_mutation_result__.*
from (select 0 as idx, $1::"jsonb" as "id0") as __jsonb_identity_mutation_identifiers__,
lateral (
  select
    __jsonb_identity_mutation__.v::text as "0",
    __jsonb_identity_mutation_identifiers__.idx as "1"
  from "c"."jsonb_identity_mutation"(__jsonb_identity_mutation_identifiers__."id0") as __jsonb_identity_mutation__(v)
) as __jsonb_identity_mutation_result__;

select __jsonb_identity_mutation_plpgsql_result__.*
from (select 0 as idx, $1::"jsonb" as "id0") as __jsonb_identity_mutation_plpgsql_identifiers__,
lateral (
  select
    __jsonb_identity_mutation_plpgsql__.v::text as "0",
    __jsonb_identity_mutation_plpgsql_identifiers__.idx as "1"
  from "c"."jsonb_identity_mutation_plpgsql"(__jsonb_identity_mutation_plpgsql_identifiers__."id0") as __jsonb_identity_mutation_plpgsql__(v)
) as __jsonb_identity_mutation_plpgsql_result__;

select
  __jsonb_identity_mutation_plpgsql_with_default__.v::text as "0"
from "c"."jsonb_identity_mutation_plpgsql_with_default"() as __jsonb_identity_mutation_plpgsql_with_default__(v);

select __jsonb_identity_mutation_plpgsql_with_default_resul__.*
from (select 0 as idx, $1::"jsonb" as "id0") as __jsonb_identity_mutation_plpgsql_with_default_ident__,
lateral (
  select
    __jsonb_identity_mutation_plpgsql_with_default__.v::text as "0",
    __jsonb_identity_mutation_plpgsql_with_default_ident__.idx as "1"
  from "c"."jsonb_identity_mutation_plpgsql_with_default"(__jsonb_identity_mutation_plpgsql_with_default_ident__."id0") as __jsonb_identity_mutation_plpgsql_with_default__(v)
) as __jsonb_identity_mutation_plpgsql_with_default_resul__;

select __add_1_mutation_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_1_mutation_identifiers__,
lateral (
  select
    __add_1_mutation__.v::text as "0",
    __add_1_mutation_identifiers__.idx as "1"
  from "a"."add_1_mutation"(
    __add_1_mutation_identifiers__."id0",
    __add_1_mutation_identifiers__."id1"
  ) as __add_1_mutation__(v)
) as __add_1_mutation_result__;

select __add_2_mutation_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_2_mutation_identifiers__,
lateral (
  select
    __add_2_mutation__.v::text as "0",
    __add_2_mutation_identifiers__.idx as "1"
  from "a"."add_2_mutation"(
    __add_2_mutation_identifiers__."id0",
    __add_2_mutation_identifiers__."id1"
  ) as __add_2_mutation__(v)
) as __add_2_mutation_result__;

select __add_3_mutation_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_3_mutation_identifiers__,
lateral (
  select
    __add_3_mutation__.v::text as "0",
    __add_3_mutation_identifiers__.idx as "1"
  from "a"."add_3_mutation"(
    __add_3_mutation_identifiers__."id0",
    __add_3_mutation_identifiers__."id1"
  ) as __add_3_mutation__(v)
) as __add_3_mutation_result__;

select __add_4_mutation_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_4_mutation_identifiers__,
lateral (
  select
    __add_4_mutation__.v::text as "0",
    __add_4_mutation_identifiers__.idx as "1"
  from "a"."add_4_mutation"(
    __add_4_mutation_identifiers__."id0",
    __add_4_mutation_identifiers__."id1"
  ) as __add_4_mutation__(v)
) as __add_4_mutation_result__;

select __add_4_mutation_error_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_4_mutation_error_identifiers__,
lateral (
  select
    __add_4_mutation_error__.v::text as "0",
    __add_4_mutation_error_identifiers__.idx as "1"
  from "a"."add_4_mutation_error"(
    __add_4_mutation_error_identifiers__."id0",
    __add_4_mutation_error_identifiers__."id1"
  ) as __add_4_mutation_error__(v)
) as __add_4_mutation_error_result__;

select __mult_1_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __mult_1_identifiers__,
lateral (
  select
    __mult_1__.v::text as "0",
    __mult_1_identifiers__.idx as "1"
  from "b"."mult_1"(
    __mult_1_identifiers__."id0",
    __mult_1_identifiers__."id1"
  ) as __mult_1__(v)
) as __mult_1_result__;

select __mult_2_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __mult_2_identifiers__,
lateral (
  select
    __mult_2__.v::text as "0",
    __mult_2_identifiers__.idx as "1"
  from "b"."mult_2"(
    __mult_2_identifiers__."id0",
    __mult_2_identifiers__."id1"
  ) as __mult_2__(v)
) as __mult_2_result__;

select __mult_3_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __mult_3_identifiers__,
lateral (
  select
    __mult_3__.v::text as "0",
    __mult_3_identifiers__.idx as "1"
  from "b"."mult_3"(
    __mult_3_identifiers__."id0",
    __mult_3_identifiers__."id1"
  ) as __mult_3__(v)
) as __mult_3_result__;

select __mult_4_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __mult_4_identifiers__,
lateral (
  select
    __mult_4__.v::text as "0",
    __mult_4_identifiers__.idx as "1"
  from "b"."mult_4"(
    __mult_4_identifiers__."id0",
    __mult_4_identifiers__."id1"
  ) as __mult_4__(v)
) as __mult_4_result__;

select __types_mutation_result__.*
from (select 0 as idx, $1::"int8" as "id0", $2::"bool" as "id1", $3::"varchar" as "id2", $4::"int4"[] as "id3", $5::"json" as "id4", $6::"c"."floatrange" as "id5") as __types_mutation_identifiers__,
lateral (
  select
    __types_mutation__.v::text as "0",
    __types_mutation_identifiers__.idx as "1"
  from "c"."types_mutation"(
    __types_mutation_identifiers__."id0",
    __types_mutation_identifiers__."id1",
    __types_mutation_identifiers__."id2",
    __types_mutation_identifiers__."id3",
    __types_mutation_identifiers__."id4",
    __types_mutation_identifiers__."id5"
  ) as __types_mutation__(v)
) as __types_mutation_result__;

select __compound_type_mutation_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __compound_type_mutation_identifiers__,
lateral (
  select
    __compound_type_mutation__."a"::text as "0",
    __compound_type_mutation__."b" as "1",
    __compound_type_mutation__."c"::text as "2",
    __compound_type_mutation__."d" as "3",
    __compound_type_mutation__."e"::text as "4",
    __compound_type_mutation__."f"::text as "5",
    to_char(__compound_type_mutation__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
    __compound_type_mutation__."foo_bar"::text as "7",
    (not (__compound_type_mutation__ is null))::text as "8",
    __compound_type_mutation_identifiers__.idx as "9"
  from "b"."compound_type_mutation"(__compound_type_mutation_identifiers__."id0") as __compound_type_mutation__
) as __compound_type_mutation_result__;

select __compound_type_set_mutation_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __compound_type_set_mutation_identifiers__,
lateral (
  select
    __compound_type_set_mutation__."a"::text as "0",
    __compound_type_set_mutation__."b" as "1",
    __compound_type_set_mutation__."c"::text as "2",
    __compound_type_set_mutation__."d" as "3",
    __compound_type_set_mutation__."e"::text as "4",
    __compound_type_set_mutation__."f"::text as "5",
    to_char(__compound_type_set_mutation__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
    __compound_type_set_mutation__."foo_bar"::text as "7",
    (not (__compound_type_set_mutation__ is null))::text as "8",
    __compound_type_set_mutation_identifiers__.idx as "9"
  from "b"."compound_type_set_mutation"(__compound_type_set_mutation_identifiers__."id0") as __compound_type_set_mutation__
) as __compound_type_set_mutation_result__;

select __compound_type_array_mutation_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __compound_type_array_mutation_identifiers__,
lateral (
  select
    __compound_type_array_mutation__."a"::text as "0",
    __compound_type_array_mutation__."b" as "1",
    __compound_type_array_mutation__."c"::text as "2",
    __compound_type_array_mutation__."d" as "3",
    __compound_type_array_mutation__."e"::text as "4",
    __compound_type_array_mutation__."f"::text as "5",
    to_char(__compound_type_array_mutation__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
    __compound_type_array_mutation__."foo_bar"::text as "7",
    (not (__compound_type_array_mutation__ is null))::text as "8",
    __compound_type_array_mutation_identifiers__.idx as "9"
  from unnest("b"."compound_type_array_mutation"(__compound_type_array_mutation_identifiers__."id0")) as __compound_type_array_mutation__
) as __compound_type_array_mutation_result__;

select __table_mutation_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __table_mutation_identifiers__,
lateral (
  select
    __table_mutation__."headline" as "0",
    __table_mutation__."author_id"::text as "1",
    __table_mutation__."id"::text as "2",
    __table_mutation_identifiers__.idx as "3"
  from "c"."table_mutation"(__table_mutation_identifiers__."id0") as __table_mutation__
) as __table_mutation_result__;

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

select __post_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."id" = __post_identifiers__."id0"
  )
  order by __post__."id" asc
) as __post_result__;

select __table_mutation_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __table_mutation_identifiers__,
lateral (
  select
    __table_mutation__."headline" as "0",
    __table_mutation__."author_id"::text as "1",
    __table_mutation__."id"::text as "2",
    __table_mutation_identifiers__.idx as "3"
  from "c"."table_mutation"(__table_mutation_identifiers__."id0") as __table_mutation__
) as __table_mutation_result__;

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

select __post_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."id" = __post_identifiers__."id0"
  )
  order by __post__."id" asc
) as __post_result__;

select
  __table_set_mutation__."person_full_name" as "0"
from "c"."table_set_mutation"() as __table_set_mutation__;

select __int_set_mutation_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2") as __int_set_mutation_identifiers__,
lateral (
  select
    __int_set_mutation__.v::text as "0",
    __int_set_mutation_identifiers__.idx as "1"
  from "c"."int_set_mutation"(
    __int_set_mutation_identifiers__."id0",
    __int_set_mutation_identifiers__."id1",
    __int_set_mutation_identifiers__."id2"
  ) as __int_set_mutation__(v)
) as __int_set_mutation_result__;

select
  __no_args_mutation__.v::text as "0"
from "c"."no_args_mutation"() as __no_args_mutation__(v);

select
  __return_void_mutation__.v::text as "0"
from "a"."return_void_mutation"() as __return_void_mutation__(v);

select __guid_fn_result__.*
from (select 0 as idx, $1::"b"."guid" as "id0") as __guid_fn_identifiers__,
lateral (
  select
    __guid_fn__.v as "0",
    __guid_fn_identifiers__.idx as "1"
  from "b"."guid_fn"(__guid_fn_identifiers__."id0") as __guid_fn__(v)
) as __guid_fn_result__;

select __guid_fn_result__.*
from (select 0 as idx, $1::"b"."guid" as "id0") as __guid_fn_identifiers__,
lateral (
  select
    __guid_fn__.v as "0",
    __guid_fn_identifiers__.idx as "1"
  from "b"."guid_fn"(__guid_fn_identifiers__."id0") as __guid_fn__(v)
) as __guid_fn_result__;

select __post_many_result__.*
from (select 0 as idx, $1::"a"."post"[] as "id0") as __post_many_identifiers__,
lateral (
  select
    __post_many__."id"::text as "0",
    __post_many__."headline" as "1",
    (
      select array_agg(case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end)
      from unnest(__post_many__."comptypes") __comptype__
    )::text as "2",
    __post_many_identifiers__.idx as "3"
  from "a"."post_many"(__post_many_identifiers__."id0") as __post_many__
) as __post_many_result__;

select __frmcdc_comptype_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"a"."comptype"[] as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_comptype_identifiers__,
lateral (
  select
    to_char(__frmcdc_comptype__."schedule", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
    __frmcdc_comptype__."is_optimised"::text as "1",
    (not (__frmcdc_comptype__ is null))::text as "2",
    __frmcdc_comptype_identifiers__.idx as "3"
  from unnest(__frmcdc_comptype_identifiers__."id0") as __frmcdc_comptype__
) as __frmcdc_comptype_result__;

select __post_with_suffix_result__.*
from (select 0 as idx, $1::"a"."post" as "id0", $2::"text" as "id1") as __post_with_suffix_identifiers__,
lateral (
  select
    __post_with_suffix__."id"::text as "0",
    __post_with_suffix__."headline" as "1",
    __post_with_suffix_identifiers__.idx as "2"
  from "a"."post_with_suffix"(
    __post_with_suffix_identifiers__."id0",
    __post_with_suffix_identifiers__."id1"
  ) as __post_with_suffix__
) as __post_with_suffix_result__;

select
  __issue756_mutation__."id"::text as "0",
  to_char(__issue756_mutation__."ts", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "1"
from "c"."issue756_mutation"() as __issue756_mutation__;

select
  __issue756_set_mutation__."id"::text as "0",
  to_char(__issue756_set_mutation__."ts", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "1"
from "c"."issue756_set_mutation"() as __issue756_set_mutation__;

select __mutation_compound_type_array_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __mutation_compound_type_array_identifiers__,
lateral (
  select
    __mutation_compound_type_array__."a"::text as "0",
    __mutation_compound_type_array__."b" as "1",
    __mutation_compound_type_array__."c"::text as "2",
    __mutation_compound_type_array__."d" as "3",
    __mutation_compound_type_array__."e"::text as "4",
    __mutation_compound_type_array__."f"::text as "5",
    to_char(__mutation_compound_type_array__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
    __mutation_compound_type_array__."foo_bar"::text as "7",
    (not (__mutation_compound_type_array__ is null))::text as "8",
    __mutation_compound_type_array_identifiers__.idx as "9"
  from unnest("a"."mutation_compound_type_array"(__mutation_compound_type_array_identifiers__."id0")) as __mutation_compound_type_array__
) as __mutation_compound_type_array_result__;

select
  __mutation_text_array__.v::text as "0"
from "a"."mutation_text_array"() as __mutation_text_array__(v);

select
  (
    select array_agg(to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
    from unnest(__mutation_interval_array__.v) __entry__
  )::text as "0"
from "a"."mutation_interval_array"() as __mutation_interval_array__(v);

select
  to_char(__mutation_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
from "a"."mutation_interval_set"() as __mutation_interval_set__(v);