select
  __type_function_mutation__."id"::text as "0",
  __type_function_mutation__."smallint"::text as "1",
  __type_function_mutation__."bigint"::text as "2",
  __type_function_mutation__."numeric"::text as "3",
  __type_function_mutation__."decimal"::text as "4",
  __type_function_mutation__."boolean"::text as "5",
  __type_function_mutation__."varchar" as "6",
  __type_function_mutation__."enum"::text as "7",
  __type_function_mutation__."enum_array"::text as "8",
  __type_function_mutation__."domain"::text as "9",
  __type_function_mutation__."domain2"::text as "10",
  __type_function_mutation__."text_array"::text as "11",
  __type_function_mutation__."json"::text as "12",
  __type_function_mutation__."jsonb"::text as "13",
  __type_function_mutation__."nullable_range"::text as "14",
  __type_function_mutation__."numrange"::text as "15",
  json_build_array(
    lower_inc(__type_function_mutation__."daterange"),
    to_char(lower(__type_function_mutation__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_mutation__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_mutation__."daterange")
  )::text as "16",
  __type_function_mutation__."an_int_range"::text as "17",
  to_char(__type_function_mutation__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__type_function_mutation__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__type_function_mutation__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __type_function_mutation__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __type_function_mutation__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__type_function_mutation__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_mutation__."interval_array") __entry__
  )::text as "24",
  __type_function_mutation__."money"::numeric::text as "25",
  case when (__type_function_mutation__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function_mutation__."compound_type")."a"))::text, ((__type_function_mutation__."compound_type")."b"), (((__type_function_mutation__."compound_type")."c"))::text, ((__type_function_mutation__."compound_type")."d"), (((__type_function_mutation__."compound_type")."e"))::text, (((__type_function_mutation__."compound_type")."f"))::text, to_char(((__type_function_mutation__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_mutation__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__type_function_mutation__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_mutation__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_mutation__."nested_compound_type")."a"))."a"))::text, ((((__type_function_mutation__."nested_compound_type")."a"))."b"), (((((__type_function_mutation__."nested_compound_type")."a"))."c"))::text, ((((__type_function_mutation__."nested_compound_type")."a"))."d"), (((((__type_function_mutation__."nested_compound_type")."a"))."e"))::text, (((((__type_function_mutation__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_mutation__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_mutation__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_mutation__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_mutation__."nested_compound_type")."b"))."a"))::text, ((((__type_function_mutation__."nested_compound_type")."b"))."b"), (((((__type_function_mutation__."nested_compound_type")."b"))."c"))::text, ((((__type_function_mutation__."nested_compound_type")."b"))."d"), (((((__type_function_mutation__."nested_compound_type")."b"))."e"))::text, (((((__type_function_mutation__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_mutation__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_mutation__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_mutation__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__type_function_mutation__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function_mutation__."nullable_compound_type")."a"))::text, ((__type_function_mutation__."nullable_compound_type")."b"), (((__type_function_mutation__."nullable_compound_type")."c"))::text, ((__type_function_mutation__."nullable_compound_type")."d"), (((__type_function_mutation__."nullable_compound_type")."e"))::text, (((__type_function_mutation__."nullable_compound_type")."f"))::text, to_char(((__type_function_mutation__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_mutation__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__type_function_mutation__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_mutation__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_mutation__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_mutation__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_mutation__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_mutation__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_mutation__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_mutation__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_mutation__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_mutation__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_mutation__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_mutation__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_mutation__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_mutation__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_mutation__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_mutation__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_mutation__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_mutation__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_mutation__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_mutation__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __type_function_mutation__."point"::text as "30",
  __type_function_mutation__."nullablePoint"::text as "31",
  __type_function_mutation__."inet"::text as "32",
  __type_function_mutation__."cidr"::text as "33",
  __type_function_mutation__."macaddr"::text as "34",
  __type_function_mutation__."regproc"::text as "35",
  __type_function_mutation__."regprocedure"::text as "36",
  __type_function_mutation__."regoper"::text as "37",
  __type_function_mutation__."regoperator"::text as "38",
  __type_function_mutation__."regclass"::text as "39",
  __type_function_mutation__."regtype"::text as "40",
  __type_function_mutation__."regconfig"::text as "41",
  __type_function_mutation__."regdictionary"::text as "42",
  __type_function_mutation__."text_array_domain"::text as "43",
  __type_function_mutation__."int8_array_domain"::text as "44",
  __type_function_mutation__."bytea"::text as "45",
  __type_function_mutation__."bytea_array"::text as "46",
  __type_function_mutation__."ltree"::text as "47",
  __type_function_mutation__."ltree_array"::text as "48"
from "b"."type_function_mutation"($1::"int4") as __type_function_mutation__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
  case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
  __frmcdc_nested_compound_type__."baz_buz"::text as "2",
  (not (__frmcdc_nested_compound_type__ is null))::text as "3"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
  case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
  __frmcdc_nested_compound_type__."baz_buz"::text as "2",
  (not (__frmcdc_nested_compound_type__ is null))::text as "3"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__;

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
);

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
);

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  __type_function_list_mutation__."id"::text as "0",
  __type_function_list_mutation__."smallint"::text as "1",
  __type_function_list_mutation__."bigint"::text as "2",
  __type_function_list_mutation__."numeric"::text as "3",
  __type_function_list_mutation__."decimal"::text as "4",
  __type_function_list_mutation__."boolean"::text as "5",
  __type_function_list_mutation__."varchar" as "6",
  __type_function_list_mutation__."enum"::text as "7",
  __type_function_list_mutation__."enum_array"::text as "8",
  __type_function_list_mutation__."domain"::text as "9",
  __type_function_list_mutation__."domain2"::text as "10",
  __type_function_list_mutation__."text_array"::text as "11",
  __type_function_list_mutation__."json"::text as "12",
  __type_function_list_mutation__."jsonb"::text as "13",
  __type_function_list_mutation__."nullable_range"::text as "14",
  __type_function_list_mutation__."numrange"::text as "15",
  json_build_array(
    lower_inc(__type_function_list_mutation__."daterange"),
    to_char(lower(__type_function_list_mutation__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_list_mutation__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_list_mutation__."daterange")
  )::text as "16",
  __type_function_list_mutation__."an_int_range"::text as "17",
  to_char(__type_function_list_mutation__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__type_function_list_mutation__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__type_function_list_mutation__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __type_function_list_mutation__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __type_function_list_mutation__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__type_function_list_mutation__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_list_mutation__."interval_array") __entry__
  )::text as "24",
  __type_function_list_mutation__."money"::numeric::text as "25",
  case when (__type_function_list_mutation__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function_list_mutation__."compound_type")."a"))::text, ((__type_function_list_mutation__."compound_type")."b"), (((__type_function_list_mutation__."compound_type")."c"))::text, ((__type_function_list_mutation__."compound_type")."d"), (((__type_function_list_mutation__."compound_type")."e"))::text, (((__type_function_list_mutation__."compound_type")."f"))::text, to_char(((__type_function_list_mutation__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_list_mutation__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__type_function_list_mutation__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_list_mutation__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_list_mutation__."nested_compound_type")."a"))."a"))::text, ((((__type_function_list_mutation__."nested_compound_type")."a"))."b"), (((((__type_function_list_mutation__."nested_compound_type")."a"))."c"))::text, ((((__type_function_list_mutation__."nested_compound_type")."a"))."d"), (((((__type_function_list_mutation__."nested_compound_type")."a"))."e"))::text, (((((__type_function_list_mutation__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_list_mutation__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list_mutation__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_list_mutation__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_list_mutation__."nested_compound_type")."b"))."a"))::text, ((((__type_function_list_mutation__."nested_compound_type")."b"))."b"), (((((__type_function_list_mutation__."nested_compound_type")."b"))."c"))::text, ((((__type_function_list_mutation__."nested_compound_type")."b"))."d"), (((((__type_function_list_mutation__."nested_compound_type")."b"))."e"))::text, (((((__type_function_list_mutation__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_list_mutation__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list_mutation__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_list_mutation__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__type_function_list_mutation__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function_list_mutation__."nullable_compound_type")."a"))::text, ((__type_function_list_mutation__."nullable_compound_type")."b"), (((__type_function_list_mutation__."nullable_compound_type")."c"))::text, ((__type_function_list_mutation__."nullable_compound_type")."d"), (((__type_function_list_mutation__."nullable_compound_type")."e"))::text, (((__type_function_list_mutation__."nullable_compound_type")."f"))::text, to_char(((__type_function_list_mutation__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_list_mutation__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__type_function_list_mutation__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_list_mutation__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_list_mutation__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_list_mutation__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __type_function_list_mutation__."point"::text as "30",
  __type_function_list_mutation__."nullablePoint"::text as "31",
  __type_function_list_mutation__."inet"::text as "32",
  __type_function_list_mutation__."cidr"::text as "33",
  __type_function_list_mutation__."macaddr"::text as "34",
  __type_function_list_mutation__."regproc"::text as "35",
  __type_function_list_mutation__."regprocedure"::text as "36",
  __type_function_list_mutation__."regoper"::text as "37",
  __type_function_list_mutation__."regoperator"::text as "38",
  __type_function_list_mutation__."regclass"::text as "39",
  __type_function_list_mutation__."regtype"::text as "40",
  __type_function_list_mutation__."regconfig"::text as "41",
  __type_function_list_mutation__."regdictionary"::text as "42",
  __type_function_list_mutation__."text_array_domain"::text as "43",
  __type_function_list_mutation__."int8_array_domain"::text as "44",
  __type_function_list_mutation__."bytea"::text as "45",
  __type_function_list_mutation__."bytea_array"::text as "46",
  __type_function_list_mutation__."ltree"::text as "47",
  __type_function_list_mutation__."ltree_array"::text as "48"
from unnest("b"."type_function_list_mutation"()) as __type_function_list_mutation__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    __frmcdc_compound_type__."d" as "3",
    __frmcdc_compound_type__."e"::text as "4",
    __frmcdc_compound_type__."f"::text as "5",
    __frmcdc_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_compound_type__ is null))::text as "7",
    __frmcdc_compound_type_identifiers__.idx as "8"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_nested_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."nested_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_nested_compound_type_identifiers__,
lateral (
  select
    case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
    case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
    __frmcdc_nested_compound_type__."baz_buz"::text as "2",
    (not (__frmcdc_nested_compound_type__ is null))::text as "3",
    __frmcdc_nested_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
) as __frmcdc_nested_compound_type_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    __frmcdc_compound_type__."d" as "3",
    __frmcdc_compound_type__."e"::text as "4",
    __frmcdc_compound_type__."f"::text as "5",
    __frmcdc_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_compound_type__ is null))::text as "7",
    __frmcdc_compound_type_identifiers__.idx as "8"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_nested_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."nested_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_nested_compound_type_identifiers__,
lateral (
  select
    case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
    case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
    __frmcdc_nested_compound_type__."baz_buz"::text as "2",
    (not (__frmcdc_nested_compound_type__ is null))::text as "3",
    __frmcdc_nested_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
) as __frmcdc_nested_compound_type_result__;

select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."id" = __post_identifiers__."id0"
  )
) as __post_result__;

select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."id" = __post_identifiers__."id0"
  )
) as __post_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    __frmcdc_compound_type__."d" as "3",
    __frmcdc_compound_type__."e"::text as "4",
    __frmcdc_compound_type__."f"::text as "5",
    __frmcdc_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_compound_type__ is null))::text as "7",
    __frmcdc_compound_type_identifiers__.idx as "8"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    __frmcdc_compound_type__."d" as "3",
    __frmcdc_compound_type__."e"::text as "4",
    __frmcdc_compound_type__."f"::text as "5",
    __frmcdc_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_compound_type__ is null))::text as "7",
    __frmcdc_compound_type_identifiers__.idx as "8"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select
  __type_function_connection_mutation__."id"::text as "0",
  __type_function_connection_mutation__."smallint"::text as "1",
  __type_function_connection_mutation__."bigint"::text as "2",
  __type_function_connection_mutation__."numeric"::text as "3",
  __type_function_connection_mutation__."decimal"::text as "4",
  __type_function_connection_mutation__."boolean"::text as "5",
  __type_function_connection_mutation__."varchar" as "6",
  __type_function_connection_mutation__."enum"::text as "7",
  __type_function_connection_mutation__."enum_array"::text as "8",
  __type_function_connection_mutation__."domain"::text as "9",
  __type_function_connection_mutation__."domain2"::text as "10",
  __type_function_connection_mutation__."text_array"::text as "11",
  __type_function_connection_mutation__."json"::text as "12",
  __type_function_connection_mutation__."jsonb"::text as "13",
  __type_function_connection_mutation__."nullable_range"::text as "14",
  __type_function_connection_mutation__."numrange"::text as "15",
  json_build_array(
    lower_inc(__type_function_connection_mutation__."daterange"),
    to_char(lower(__type_function_connection_mutation__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_connection_mutation__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_connection_mutation__."daterange")
  )::text as "16",
  __type_function_connection_mutation__."an_int_range"::text as "17",
  to_char(__type_function_connection_mutation__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__type_function_connection_mutation__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__type_function_connection_mutation__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __type_function_connection_mutation__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __type_function_connection_mutation__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__type_function_connection_mutation__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_connection_mutation__."interval_array") __entry__
  )::text as "24",
  __type_function_connection_mutation__."money"::numeric::text as "25",
  case when (__type_function_connection_mutation__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function_connection_mutation__."compound_type")."a"))::text, ((__type_function_connection_mutation__."compound_type")."b"), (((__type_function_connection_mutation__."compound_type")."c"))::text, ((__type_function_connection_mutation__."compound_type")."d"), (((__type_function_connection_mutation__."compound_type")."e"))::text, (((__type_function_connection_mutation__."compound_type")."f"))::text, to_char(((__type_function_connection_mutation__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_connection_mutation__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__type_function_connection_mutation__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_connection_mutation__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_connection_mutation__."nested_compound_type")."a"))."a"))::text, ((((__type_function_connection_mutation__."nested_compound_type")."a"))."b"), (((((__type_function_connection_mutation__."nested_compound_type")."a"))."c"))::text, ((((__type_function_connection_mutation__."nested_compound_type")."a"))."d"), (((((__type_function_connection_mutation__."nested_compound_type")."a"))."e"))::text, (((((__type_function_connection_mutation__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_connection_mutation__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection_mutation__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_connection_mutation__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_connection_mutation__."nested_compound_type")."b"))."a"))::text, ((((__type_function_connection_mutation__."nested_compound_type")."b"))."b"), (((((__type_function_connection_mutation__."nested_compound_type")."b"))."c"))::text, ((((__type_function_connection_mutation__."nested_compound_type")."b"))."d"), (((((__type_function_connection_mutation__."nested_compound_type")."b"))."e"))::text, (((((__type_function_connection_mutation__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_connection_mutation__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection_mutation__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_connection_mutation__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__type_function_connection_mutation__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function_connection_mutation__."nullable_compound_type")."a"))::text, ((__type_function_connection_mutation__."nullable_compound_type")."b"), (((__type_function_connection_mutation__."nullable_compound_type")."c"))::text, ((__type_function_connection_mutation__."nullable_compound_type")."d"), (((__type_function_connection_mutation__."nullable_compound_type")."e"))::text, (((__type_function_connection_mutation__."nullable_compound_type")."f"))::text, to_char(((__type_function_connection_mutation__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_connection_mutation__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__type_function_connection_mutation__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_connection_mutation__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_connection_mutation__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_connection_mutation__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __type_function_connection_mutation__."point"::text as "30",
  __type_function_connection_mutation__."nullablePoint"::text as "31",
  __type_function_connection_mutation__."inet"::text as "32",
  __type_function_connection_mutation__."cidr"::text as "33",
  __type_function_connection_mutation__."macaddr"::text as "34",
  __type_function_connection_mutation__."regproc"::text as "35",
  __type_function_connection_mutation__."regprocedure"::text as "36",
  __type_function_connection_mutation__."regoper"::text as "37",
  __type_function_connection_mutation__."regoperator"::text as "38",
  __type_function_connection_mutation__."regclass"::text as "39",
  __type_function_connection_mutation__."regtype"::text as "40",
  __type_function_connection_mutation__."regconfig"::text as "41",
  __type_function_connection_mutation__."regdictionary"::text as "42",
  __type_function_connection_mutation__."text_array_domain"::text as "43",
  __type_function_connection_mutation__."int8_array_domain"::text as "44",
  __type_function_connection_mutation__."bytea"::text as "45",
  __type_function_connection_mutation__."bytea_array"::text as "46",
  __type_function_connection_mutation__."ltree"::text as "47",
  __type_function_connection_mutation__."ltree_array"::text as "48"
from "b"."type_function_connection_mutation"() as __type_function_connection_mutation__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    __frmcdc_compound_type__."d" as "3",
    __frmcdc_compound_type__."e"::text as "4",
    __frmcdc_compound_type__."f"::text as "5",
    __frmcdc_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_compound_type__ is null))::text as "7",
    __frmcdc_compound_type_identifiers__.idx as "8"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_nested_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."nested_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_nested_compound_type_identifiers__,
lateral (
  select
    case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
    case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
    __frmcdc_nested_compound_type__."baz_buz"::text as "2",
    (not (__frmcdc_nested_compound_type__ is null))::text as "3",
    __frmcdc_nested_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
) as __frmcdc_nested_compound_type_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    __frmcdc_compound_type__."d" as "3",
    __frmcdc_compound_type__."e"::text as "4",
    __frmcdc_compound_type__."f"::text as "5",
    __frmcdc_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_compound_type__ is null))::text as "7",
    __frmcdc_compound_type_identifiers__.idx as "8"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_nested_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."nested_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_nested_compound_type_identifiers__,
lateral (
  select
    case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
    case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
    __frmcdc_nested_compound_type__."baz_buz"::text as "2",
    (not (__frmcdc_nested_compound_type__ is null))::text as "3",
    __frmcdc_nested_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
) as __frmcdc_nested_compound_type_result__;

select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."id" = __post_identifiers__."id0"
  )
) as __post_result__;

select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."id" = __post_identifiers__."id0"
  )
) as __post_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    __frmcdc_compound_type__."d" as "3",
    __frmcdc_compound_type__."e"::text as "4",
    __frmcdc_compound_type__."f"::text as "5",
    __frmcdc_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_compound_type__ is null))::text as "7",
    __frmcdc_compound_type_identifiers__.idx as "8"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."b" as "1",
    __frmcdc_compound_type__."c"::text as "2",
    __frmcdc_compound_type__."d" as "3",
    __frmcdc_compound_type__."e"::text as "4",
    __frmcdc_compound_type__."f"::text as "5",
    __frmcdc_compound_type__."foo_bar"::text as "6",
    (not (__frmcdc_compound_type__ is null))::text as "7",
    __frmcdc_compound_type_identifiers__.idx as "8"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

update "b"."types" as __types__ set "smallint" = $1::"int2", "bigint" = $2::"int8", "numeric" = $3::"numeric", "decimal" = $4::"numeric", "boolean" = $5::"bool", "varchar" = $6::"varchar", "enum" = $7::"b"."color", "enum_array" = $8::"b"."color"[], "domain" = $9::"a"."an_int", "domain2" = $10::"b"."another_int", "text_array" = $11::"text"[], "json" = $12::"json", "jsonb" = $13::"jsonb", "numrange" = $14::"pg_catalog"."numrange", "daterange" = $15::"pg_catalog"."daterange", "an_int_range" = $16::"a"."an_int_range", "timestamp" = $17::"timestamp", "timestamptz" = $18::"timestamptz", "date" = $19::"date", "time" = $20::"time", "timetz" = $21::"timetz", "interval" = $22::"interval", "interval_array" = $23::"interval"[], "money" = $24::"money", "compound_type" = $25::"c"."compound_type", "nested_compound_type" = $26::"b"."nested_compound_type", "point" = $27::"point", "nullablePoint" = $28::"point", "inet" = $29::"inet", "cidr" = $30::"cidr", "macaddr" = $31::"macaddr", "regproc" = $32::"regproc", "regprocedure" = $33::"regprocedure", "regoper" = $34::"regoper", "regoperator" = $35::"regoperator", "regclass" = $36::"regclass", "regtype" = $37::"regtype", "regconfig" = $38::"regconfig", "regdictionary" = $39::"regdictionary", "text_array_domain" = $40::"c"."text_array_domain", "int8_array_domain" = $41::"c"."int8_array_domain", "bytea" = $42::"bytea", "bytea_array" = $43::"bytea"[], "ltree" = $44::ltree, "ltree_array" = $45::ltree[] where (__types__."id" = $46::"int4") returning
  __types__."id"::text as "0",
  __types__."smallint"::text as "1",
  __types__."bigint"::text as "2",
  __types__."numeric"::text as "3",
  __types__."decimal"::text as "4",
  __types__."boolean"::text as "5",
  __types__."varchar" as "6",
  __types__."enum"::text as "7",
  __types__."enum_array"::text as "8",
  __types__."domain"::text as "9",
  __types__."domain2"::text as "10",
  __types__."text_array"::text as "11",
  __types__."json"::text as "12",
  __types__."jsonb"::text as "13",
  __types__."nullable_range"::text as "14",
  __types__."numrange"::text as "15",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "16",
  __types__."an_int_range"::text as "17",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "24",
  __types__."money"::numeric::text as "25",
  case when (__types__."compound_type") is not distinct from null then null::text else json_build_array((((__types__."compound_type")."a"))::text, ((__types__."compound_type")."b"), (((__types__."compound_type")."c"))::text, ((__types__."compound_type")."d"), (((__types__."compound_type")."e"))::text, (((__types__."compound_type")."f"))::text, to_char(((__types__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__types__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__types__."nullable_compound_type")."a"))::text, ((__types__."nullable_compound_type")."b"), (((__types__."nullable_compound_type")."c"))::text, ((__types__."nullable_compound_type")."d"), (((__types__."nullable_compound_type")."e"))::text, (((__types__."nullable_compound_type")."f"))::text, to_char(((__types__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __types__."point"::text as "30",
  __types__."nullablePoint"::text as "31",
  __types__."inet"::text as "32",
  __types__."cidr"::text as "33",
  __types__."macaddr"::text as "34",
  __types__."regproc"::text as "35",
  __types__."regprocedure"::text as "36",
  __types__."regoper"::text as "37",
  __types__."regoperator"::text as "38",
  __types__."regclass"::text as "39",
  __types__."regtype"::text as "40",
  __types__."regconfig"::text as "41",
  __types__."regdictionary"::text as "42",
  __types__."text_array_domain"::text as "43",
  __types__."int8_array_domain"::text as "44",
  __types__."bytea"::text as "45",
  __types__."bytea_array"::text as "46",
  __types__."ltree"::text as "47",
  __types__."ltree_array"::text as "48";

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
  case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
  __frmcdc_nested_compound_type__."baz_buz"::text as "2",
  (not (__frmcdc_nested_compound_type__ is null))::text as "3"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
  case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
  __frmcdc_nested_compound_type__."baz_buz"::text as "2",
  (not (__frmcdc_nested_compound_type__ is null))::text as "3"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__;

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
);

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
);

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

insert into "b"."types" as __types__ ("smallint", "bigint", "numeric", "decimal", "boolean", "varchar", "enum", "enum_array", "domain", "domain2", "text_array", "json", "jsonb", "numrange", "daterange", "an_int_range", "timestamp", "timestamptz", "date", "time", "timetz", "interval", "interval_array", "money", "compound_type", "nested_compound_type", "point", "regproc", "regprocedure", "regoper", "regoperator", "regclass", "regtype", "regconfig", "regdictionary", "ltree", "ltree_array") values ($1::"int2", $2::"int8", $3::"numeric", $4::"numeric", $5::"bool", $6::"varchar", $7::"b"."color", $8::"b"."color"[], $9::"a"."an_int", $10::"b"."another_int", $11::"text"[], $12::"json", $13::"jsonb", $14::"pg_catalog"."numrange", $15::"pg_catalog"."daterange", $16::"a"."an_int_range", $17::"timestamp", $18::"timestamptz", $19::"date", $20::"time", $21::"timetz", $22::"interval", $23::"interval"[], $24::"money", $25::"c"."compound_type", $26::"b"."nested_compound_type", $27::"point", $28::"regproc", $29::"regprocedure", $30::"regoper", $31::"regoperator", $32::"regclass", $33::"regtype", $34::"regconfig", $35::"regdictionary", $36::ltree, $37::ltree[]) returning
  __types__."id"::text as "0",
  __types__."smallint"::text as "1",
  __types__."bigint"::text as "2",
  __types__."numeric"::text as "3",
  __types__."decimal"::text as "4",
  __types__."boolean"::text as "5",
  __types__."varchar" as "6",
  __types__."enum"::text as "7",
  __types__."enum_array"::text as "8",
  __types__."domain"::text as "9",
  __types__."domain2"::text as "10",
  __types__."text_array"::text as "11",
  __types__."json"::text as "12",
  __types__."jsonb"::text as "13",
  __types__."nullable_range"::text as "14",
  __types__."numrange"::text as "15",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "16",
  __types__."an_int_range"::text as "17",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "24",
  __types__."money"::numeric::text as "25",
  case when (__types__."compound_type") is not distinct from null then null::text else json_build_array((((__types__."compound_type")."a"))::text, ((__types__."compound_type")."b"), (((__types__."compound_type")."c"))::text, ((__types__."compound_type")."d"), (((__types__."compound_type")."e"))::text, (((__types__."compound_type")."f"))::text, to_char(((__types__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__types__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__types__."nullable_compound_type")."a"))::text, ((__types__."nullable_compound_type")."b"), (((__types__."nullable_compound_type")."c"))::text, ((__types__."nullable_compound_type")."d"), (((__types__."nullable_compound_type")."e"))::text, (((__types__."nullable_compound_type")."f"))::text, to_char(((__types__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __types__."point"::text as "30",
  __types__."nullablePoint"::text as "31",
  __types__."inet"::text as "32",
  __types__."cidr"::text as "33",
  __types__."macaddr"::text as "34",
  __types__."regproc"::text as "35",
  __types__."regprocedure"::text as "36",
  __types__."regoper"::text as "37",
  __types__."regoperator"::text as "38",
  __types__."regclass"::text as "39",
  __types__."regtype"::text as "40",
  __types__."regconfig"::text as "41",
  __types__."regdictionary"::text as "42",
  __types__."text_array_domain"::text as "43",
  __types__."int8_array_domain"::text as "44",
  __types__."bytea"::text as "45",
  __types__."bytea_array"::text as "46",
  __types__."ltree"::text as "47",
  __types__."ltree_array"::text as "48";

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
  case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
  __frmcdc_nested_compound_type__."baz_buz"::text as "2",
  (not (__frmcdc_nested_compound_type__ is null))::text as "3"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
  case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
  __frmcdc_nested_compound_type__."baz_buz"::text as "2",
  (not (__frmcdc_nested_compound_type__ is null))::text as "3"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__;

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
);

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
);

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;