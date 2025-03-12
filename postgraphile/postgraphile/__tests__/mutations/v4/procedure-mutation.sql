select
  __json_identity_mutation__.v::text as "0"
from "c"."json_identity_mutation"($1::"json") as __json_identity_mutation__(v);

select
  __jsonb_identity_mutation__.v::text as "0"
from "c"."jsonb_identity_mutation"($1::"jsonb") as __jsonb_identity_mutation__(v);

select
  __json_identity_mutation__.v::text as "0"
from "c"."json_identity_mutation"($1::"json") as __json_identity_mutation__(v);

select
  __jsonb_identity_mutation__.v::text as "0"
from "c"."jsonb_identity_mutation"($1::"jsonb") as __jsonb_identity_mutation__(v);

select
  __jsonb_identity_mutation_plpgsql__.v::text as "0"
from "c"."jsonb_identity_mutation_plpgsql"($1::"jsonb") as __jsonb_identity_mutation_plpgsql__(v);

select
  __jsonb_identity_mutation_plpgsql_with_default__.v::text as "0"
from "c"."jsonb_identity_mutation_plpgsql_with_default"() as __jsonb_identity_mutation_plpgsql_with_default__(v);

select
  __jsonb_identity_mutation_plpgsql_with_default__.v::text as "0"
from "c"."jsonb_identity_mutation_plpgsql_with_default"($1::"jsonb") as __jsonb_identity_mutation_plpgsql_with_default__(v);

select
  __add_1_mutation__.v::text as "0"
from "a"."add_1_mutation"(
  $1::"int4",
  $2::"int4"
) as __add_1_mutation__(v);

select
  __add_2_mutation__.v::text as "0"
from "a"."add_2_mutation"(
  $1::"int4",
  $2::"int4"
) as __add_2_mutation__(v);

select
  __add_3_mutation__.v::text as "0"
from "a"."add_3_mutation"(
  $1::"int4",
  $2::"int4"
) as __add_3_mutation__(v);

select
  __add_4_mutation__.v::text as "0"
from "a"."add_4_mutation"(
  $1::"int4",
  $2::"int4"
) as __add_4_mutation__(v);

select
  __add_4_mutation_error__.v::text as "0"
from "a"."add_4_mutation_error"(
  $1::"int4",
  $2::"int4"
) as __add_4_mutation_error__(v);

select
  __mult_1__.v::text as "0"
from "b"."mult_1"(
  $1::"int4",
  $2::"int4"
) as __mult_1__(v);

select
  __mult_2__.v::text as "0"
from "b"."mult_2"(
  $1::"int4",
  $2::"int4"
) as __mult_2__(v);

select
  __mult_3__.v::text as "0"
from "b"."mult_3"(
  $1::"int4",
  $2::"int4"
) as __mult_3__(v);

select
  __mult_4__.v::text as "0"
from "b"."mult_4"(
  $1::"int4",
  $2::"int4"
) as __mult_4__(v);

select
  __types_mutation__.v::text as "0"
from "c"."types_mutation"(
  $1::"int8",
  $2::"bool",
  $3::"varchar",
  $4::"int4"[],
  $5::"json",
  $6::"c"."floatrange"
) as __types_mutation__(v);

select
  __compound_type_mutation__."a"::text as "0",
  __compound_type_mutation__."b" as "1",
  __compound_type_mutation__."c"::text as "2",
  __compound_type_mutation__."d" as "3",
  __compound_type_mutation__."e"::text as "4",
  __compound_type_mutation__."f"::text as "5",
  to_char(__compound_type_mutation__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
  __compound_type_mutation__."foo_bar"::text as "7",
  (not (__compound_type_mutation__ is null))::text as "8"
from "b"."compound_type_mutation"($1::"c"."compound_type") as __compound_type_mutation__;

select
  __compound_type_set_mutation__."a"::text as "0",
  __compound_type_set_mutation__."b" as "1",
  __compound_type_set_mutation__."c"::text as "2",
  __compound_type_set_mutation__."d" as "3",
  __compound_type_set_mutation__."e"::text as "4",
  __compound_type_set_mutation__."f"::text as "5",
  to_char(__compound_type_set_mutation__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
  __compound_type_set_mutation__."foo_bar"::text as "7",
  (not (__compound_type_set_mutation__ is null))::text as "8"
from "b"."compound_type_set_mutation"($1::"c"."compound_type") as __compound_type_set_mutation__;

select
  __compound_type_array_mutation__."a"::text as "0",
  __compound_type_array_mutation__."b" as "1",
  __compound_type_array_mutation__."c"::text as "2",
  __compound_type_array_mutation__."d" as "3",
  __compound_type_array_mutation__."e"::text as "4",
  __compound_type_array_mutation__."f"::text as "5",
  to_char(__compound_type_array_mutation__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
  __compound_type_array_mutation__."foo_bar"::text as "7",
  (not (__compound_type_array_mutation__ is null))::text as "8"
from unnest("b"."compound_type_array_mutation"($1::"c"."compound_type")) as __compound_type_array_mutation__;

select
  __table_mutation__."headline" as "0",
  __table_mutation__."author_id"::text as "1",
  __table_mutation__."id"::text as "2"
from "c"."table_mutation"($1::"int4") as __table_mutation__;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
)
order by __post__."id" asc;

select
  __table_mutation__."headline" as "0",
  __table_mutation__."author_id"::text as "1",
  __table_mutation__."id"::text as "2"
from "c"."table_mutation"($1::"int4") as __table_mutation__;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
)
order by __post__."id" asc;

select
  __table_set_mutation__."person_full_name" as "0"
from "c"."table_set_mutation"() as __table_set_mutation__;

select
  __int_set_mutation__.v::text as "0"
from "c"."int_set_mutation"(
  $1::"int4",
  $2::"int4",
  $3::"int4"
) as __int_set_mutation__(v);

select
  __no_args_mutation__.v::text as "0"
from "c"."no_args_mutation"() as __no_args_mutation__(v);

select
  __return_void_mutation__.v::text as "0"
from "a"."return_void_mutation"() as __return_void_mutation__(v);

select
  __guid_fn__.v as "0"
from "b"."guid_fn"($1::"b"."guid") as __guid_fn__(v);

select
  __guid_fn__.v as "0"
from "b"."guid_fn"($1::"b"."guid") as __guid_fn__(v);

select
  __post_many__."id"::text as "0",
  __post_many__."headline" as "1",
  (case when (__post_many__."comptypes") is not distinct from null then null::text else array(
    select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
    from unnest(__post_many__."comptypes") __comptype__
  )::text end) as "2"
from "a"."post_many"($1::"a"."post"[]) as __post_many__;

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

select
  __post_with_suffix__."id"::text as "0",
  __post_with_suffix__."headline" as "1"
from "a"."post_with_suffix"(
  $1::"a"."post",
  $2::"text"
) as __post_with_suffix__;

select
  __issue756_mutation__."id"::text as "0",
  to_char(__issue756_mutation__."ts", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "1"
from "c"."issue756_mutation"() as __issue756_mutation__;

select
  __issue756_set_mutation__."id"::text as "0",
  to_char(__issue756_set_mutation__."ts", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "1"
from "c"."issue756_set_mutation"() as __issue756_set_mutation__;

select
  __mutation_compound_type_array__."a"::text as "0",
  __mutation_compound_type_array__."b" as "1",
  __mutation_compound_type_array__."c"::text as "2",
  __mutation_compound_type_array__."d" as "3",
  __mutation_compound_type_array__."e"::text as "4",
  __mutation_compound_type_array__."f"::text as "5",
  to_char(__mutation_compound_type_array__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
  __mutation_compound_type_array__."foo_bar"::text as "7",
  (not (__mutation_compound_type_array__ is null))::text as "8"
from unnest("a"."mutation_compound_type_array"($1::"c"."compound_type")) as __mutation_compound_type_array__;

select
  __mutation_text_array__.v::text as "0"
from "a"."mutation_text_array"() as __mutation_text_array__(v);

select
  (case when (__mutation_interval_array__.v) is not distinct from null then null::text else array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__mutation_interval_array__.v) __entry__
  )::text end) as "0"
from "a"."mutation_interval_array"() as __mutation_interval_array__(v);

select
  to_char(__mutation_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
from "a"."mutation_interval_set"() as __mutation_interval_set__(v);