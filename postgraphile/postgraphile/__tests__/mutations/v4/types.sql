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
  __type_function_mutation__."jsonpath"::text as "14",
  __type_function_mutation__."nullable_range"::text as "15",
  __type_function_mutation__."numrange"::text as "16",
  json_build_array(
    lower_inc(__type_function_mutation__."daterange"),
    to_char(lower(__type_function_mutation__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_mutation__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_mutation__."daterange")
  )::text as "17",
  __type_function_mutation__."an_int_range"::text as "18",
  to_char(__type_function_mutation__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "19",
  to_char(__type_function_mutation__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "20",
  to_char(__type_function_mutation__."date", 'YYYY-MM-DD'::text) as "21",
  to_char(date '1970-01-01' + __type_function_mutation__."time", 'HH24:MI:SS.US'::text) as "22",
  to_char(date '1970-01-01' + __type_function_mutation__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__type_function_mutation__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "24",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_mutation__."interval_array") __entry__
  )::text as "25",
  __type_function_mutation__."money"::numeric::text as "26",
  case when (__type_function_mutation__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function_mutation__."compound_type")."a"))::text, ((__type_function_mutation__."compound_type")."b"), (((__type_function_mutation__."compound_type")."c"))::text, ((__type_function_mutation__."compound_type")."d"), (((__type_function_mutation__."compound_type")."e"))::text, (((__type_function_mutation__."compound_type")."f"))::text, to_char(((__type_function_mutation__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_mutation__."compound_type")."foo_bar"))::text)::text end as "27",
  case when (__type_function_mutation__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_mutation__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_mutation__."nested_compound_type")."a"))."a"))::text, ((((__type_function_mutation__."nested_compound_type")."a"))."b"), (((((__type_function_mutation__."nested_compound_type")."a"))."c"))::text, ((((__type_function_mutation__."nested_compound_type")."a"))."d"), (((((__type_function_mutation__."nested_compound_type")."a"))."e"))::text, (((((__type_function_mutation__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_mutation__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_mutation__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_mutation__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_mutation__."nested_compound_type")."b"))."a"))::text, ((((__type_function_mutation__."nested_compound_type")."b"))."b"), (((((__type_function_mutation__."nested_compound_type")."b"))."c"))::text, ((((__type_function_mutation__."nested_compound_type")."b"))."d"), (((((__type_function_mutation__."nested_compound_type")."b"))."e"))::text, (((((__type_function_mutation__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_mutation__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_mutation__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_mutation__."nested_compound_type")."baz_buz"))::text)::text end as "28",
  case when (__type_function_mutation__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function_mutation__."nullable_compound_type")."a"))::text, ((__type_function_mutation__."nullable_compound_type")."b"), (((__type_function_mutation__."nullable_compound_type")."c"))::text, ((__type_function_mutation__."nullable_compound_type")."d"), (((__type_function_mutation__."nullable_compound_type")."e"))::text, (((__type_function_mutation__."nullable_compound_type")."f"))::text, to_char(((__type_function_mutation__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_mutation__."nullable_compound_type")."foo_bar"))::text)::text end as "29",
  case when (__type_function_mutation__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_mutation__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_mutation__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_mutation__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_mutation__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_mutation__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_mutation__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_mutation__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_mutation__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_mutation__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_mutation__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_mutation__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_mutation__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_mutation__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_mutation__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_mutation__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_mutation__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_mutation__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_mutation__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_mutation__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "30",
  __type_function_mutation__."point"::text as "31",
  __type_function_mutation__."nullablePoint"::text as "32",
  __type_function_mutation__."inet"::text as "33",
  __type_function_mutation__."cidr"::text as "34",
  __type_function_mutation__."macaddr"::text as "35",
  __type_function_mutation__."regproc"::text as "36",
  __type_function_mutation__."regprocedure"::text as "37",
  __type_function_mutation__."regoper"::text as "38",
  __type_function_mutation__."regoperator"::text as "39",
  __type_function_mutation__."regclass"::text as "40",
  __type_function_mutation__."regtype"::text as "41",
  __type_function_mutation__."regconfig"::text as "42",
  __type_function_mutation__."regdictionary"::text as "43",
  __type_function_mutation__."text_array_domain"::text as "44",
  __type_function_mutation__."int8_array_domain"::text as "45",
  __type_function_mutation__."bytea"::text as "46",
  __type_function_mutation__."bytea_array"::text as "47",
  __type_function_mutation__."ltree"::text as "48",
  __type_function_mutation__."ltree_array"::text as "49"
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
  __frmcdc_nested_compound_type__."baz_buz"::text as "0",
  (not (__frmcdc_nested_compound_type__ is null))::text as "1",
  __frmcdc_compound_type__."a"::text as "2",
  __frmcdc_compound_type__."b" as "3",
  __frmcdc_compound_type__."c"::text as "4",
  __frmcdc_compound_type__."d" as "5",
  __frmcdc_compound_type__."e"::text as "6",
  __frmcdc_compound_type__."f"::text as "7",
  __frmcdc_compound_type__."foo_bar"::text as "8",
  (not (__frmcdc_compound_type__ is null))::text as "9",
  __frmcdc_compound_type_2."a"::text as "10",
  __frmcdc_compound_type_2."b" as "11",
  __frmcdc_compound_type_2."c"::text as "12",
  __frmcdc_compound_type_2."d" as "13",
  __frmcdc_compound_type_2."e"::text as "14",
  __frmcdc_compound_type_2."f"::text as "15",
  __frmcdc_compound_type_2."foo_bar"::text as "16",
  (not (__frmcdc_compound_type_2 is null))::text as "17"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
on TRUE;

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
  __frmcdc_nested_compound_type__."baz_buz"::text as "0",
  (not (__frmcdc_nested_compound_type__ is null))::text as "1",
  __frmcdc_compound_type__."a"::text as "2",
  __frmcdc_compound_type__."b" as "3",
  __frmcdc_compound_type__."c"::text as "4",
  __frmcdc_compound_type__."d" as "5",
  __frmcdc_compound_type__."e"::text as "6",
  __frmcdc_compound_type__."f"::text as "7",
  __frmcdc_compound_type__."foo_bar"::text as "8",
  (not (__frmcdc_compound_type__ is null))::text as "9",
  __frmcdc_compound_type_2."a"::text as "10",
  __frmcdc_compound_type_2."b" as "11",
  __frmcdc_compound_type_2."c"::text as "12",
  __frmcdc_compound_type_2."d" as "13",
  __frmcdc_compound_type_2."e"::text as "14",
  __frmcdc_compound_type_2."f"::text as "15",
  __frmcdc_compound_type_2."foo_bar"::text as "16",
  (not (__frmcdc_compound_type_2 is null))::text as "17"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
on TRUE;

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
  __type_function_list_mutation__."jsonpath"::text as "14",
  __type_function_list_mutation__."nullable_range"::text as "15",
  __type_function_list_mutation__."numrange"::text as "16",
  json_build_array(
    lower_inc(__type_function_list_mutation__."daterange"),
    to_char(lower(__type_function_list_mutation__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_list_mutation__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_list_mutation__."daterange")
  )::text as "17",
  __type_function_list_mutation__."an_int_range"::text as "18",
  to_char(__type_function_list_mutation__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "19",
  to_char(__type_function_list_mutation__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "20",
  to_char(__type_function_list_mutation__."date", 'YYYY-MM-DD'::text) as "21",
  to_char(date '1970-01-01' + __type_function_list_mutation__."time", 'HH24:MI:SS.US'::text) as "22",
  to_char(date '1970-01-01' + __type_function_list_mutation__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__type_function_list_mutation__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "24",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_list_mutation__."interval_array") __entry__
  )::text as "25",
  __type_function_list_mutation__."money"::numeric::text as "26",
  case when (__type_function_list_mutation__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function_list_mutation__."compound_type")."a"))::text, ((__type_function_list_mutation__."compound_type")."b"), (((__type_function_list_mutation__."compound_type")."c"))::text, ((__type_function_list_mutation__."compound_type")."d"), (((__type_function_list_mutation__."compound_type")."e"))::text, (((__type_function_list_mutation__."compound_type")."f"))::text, to_char(((__type_function_list_mutation__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_list_mutation__."compound_type")."foo_bar"))::text)::text end as "27",
  case when (__type_function_list_mutation__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_list_mutation__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_list_mutation__."nested_compound_type")."a"))."a"))::text, ((((__type_function_list_mutation__."nested_compound_type")."a"))."b"), (((((__type_function_list_mutation__."nested_compound_type")."a"))."c"))::text, ((((__type_function_list_mutation__."nested_compound_type")."a"))."d"), (((((__type_function_list_mutation__."nested_compound_type")."a"))."e"))::text, (((((__type_function_list_mutation__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_list_mutation__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list_mutation__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_list_mutation__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_list_mutation__."nested_compound_type")."b"))."a"))::text, ((((__type_function_list_mutation__."nested_compound_type")."b"))."b"), (((((__type_function_list_mutation__."nested_compound_type")."b"))."c"))::text, ((((__type_function_list_mutation__."nested_compound_type")."b"))."d"), (((((__type_function_list_mutation__."nested_compound_type")."b"))."e"))::text, (((((__type_function_list_mutation__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_list_mutation__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list_mutation__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_list_mutation__."nested_compound_type")."baz_buz"))::text)::text end as "28",
  case when (__type_function_list_mutation__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function_list_mutation__."nullable_compound_type")."a"))::text, ((__type_function_list_mutation__."nullable_compound_type")."b"), (((__type_function_list_mutation__."nullable_compound_type")."c"))::text, ((__type_function_list_mutation__."nullable_compound_type")."d"), (((__type_function_list_mutation__."nullable_compound_type")."e"))::text, (((__type_function_list_mutation__."nullable_compound_type")."f"))::text, to_char(((__type_function_list_mutation__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_list_mutation__."nullable_compound_type")."foo_bar"))::text)::text end as "29",
  case when (__type_function_list_mutation__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_list_mutation__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list_mutation__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_list_mutation__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list_mutation__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_list_mutation__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "30",
  __type_function_list_mutation__."point"::text as "31",
  __type_function_list_mutation__."nullablePoint"::text as "32",
  __type_function_list_mutation__."inet"::text as "33",
  __type_function_list_mutation__."cidr"::text as "34",
  __type_function_list_mutation__."macaddr"::text as "35",
  __type_function_list_mutation__."regproc"::text as "36",
  __type_function_list_mutation__."regprocedure"::text as "37",
  __type_function_list_mutation__."regoper"::text as "38",
  __type_function_list_mutation__."regoperator"::text as "39",
  __type_function_list_mutation__."regclass"::text as "40",
  __type_function_list_mutation__."regtype"::text as "41",
  __type_function_list_mutation__."regconfig"::text as "42",
  __type_function_list_mutation__."regdictionary"::text as "43",
  __type_function_list_mutation__."text_array_domain"::text as "44",
  __type_function_list_mutation__."int8_array_domain"::text as "45",
  __type_function_list_mutation__."bytea"::text as "46",
  __type_function_list_mutation__."bytea_array"::text as "47",
  __type_function_list_mutation__."ltree"::text as "48",
  __type_function_list_mutation__."ltree_array"::text as "49"
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
    __frmcdc_nested_compound_type__."baz_buz"::text as "0",
    (not (__frmcdc_nested_compound_type__ is null))::text as "1",
    __frmcdc_compound_type__."a"::text as "2",
    __frmcdc_compound_type__."b" as "3",
    __frmcdc_compound_type__."c"::text as "4",
    __frmcdc_compound_type__."d" as "5",
    __frmcdc_compound_type__."e"::text as "6",
    __frmcdc_compound_type__."f"::text as "7",
    __frmcdc_compound_type__."foo_bar"::text as "8",
    (not (__frmcdc_compound_type__ is null))::text as "9",
    __frmcdc_compound_type_2."a"::text as "10",
    __frmcdc_compound_type_2."b" as "11",
    __frmcdc_compound_type_2."c"::text as "12",
    __frmcdc_compound_type_2."d" as "13",
    __frmcdc_compound_type_2."e"::text as "14",
    __frmcdc_compound_type_2."f"::text as "15",
    __frmcdc_compound_type_2."foo_bar"::text as "16",
    (not (__frmcdc_compound_type_2 is null))::text as "17",
    __frmcdc_nested_compound_type_identifiers__.idx as "18"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
  left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
  on TRUE
  left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
  on TRUE
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
    __frmcdc_nested_compound_type__."baz_buz"::text as "0",
    (not (__frmcdc_nested_compound_type__ is null))::text as "1",
    __frmcdc_compound_type__."a"::text as "2",
    __frmcdc_compound_type__."b" as "3",
    __frmcdc_compound_type__."c"::text as "4",
    __frmcdc_compound_type__."d" as "5",
    __frmcdc_compound_type__."e"::text as "6",
    __frmcdc_compound_type__."f"::text as "7",
    __frmcdc_compound_type__."foo_bar"::text as "8",
    (not (__frmcdc_compound_type__ is null))::text as "9",
    __frmcdc_compound_type_2."a"::text as "10",
    __frmcdc_compound_type_2."b" as "11",
    __frmcdc_compound_type_2."c"::text as "12",
    __frmcdc_compound_type_2."d" as "13",
    __frmcdc_compound_type_2."e"::text as "14",
    __frmcdc_compound_type_2."f"::text as "15",
    __frmcdc_compound_type_2."foo_bar"::text as "16",
    (not (__frmcdc_compound_type_2 is null))::text as "17",
    __frmcdc_nested_compound_type_identifiers__.idx as "18"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
  left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
  on TRUE
  left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
  on TRUE
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
  __type_function_connection_mutation__."jsonpath"::text as "14",
  __type_function_connection_mutation__."nullable_range"::text as "15",
  __type_function_connection_mutation__."numrange"::text as "16",
  json_build_array(
    lower_inc(__type_function_connection_mutation__."daterange"),
    to_char(lower(__type_function_connection_mutation__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_connection_mutation__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_connection_mutation__."daterange")
  )::text as "17",
  __type_function_connection_mutation__."an_int_range"::text as "18",
  to_char(__type_function_connection_mutation__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "19",
  to_char(__type_function_connection_mutation__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "20",
  to_char(__type_function_connection_mutation__."date", 'YYYY-MM-DD'::text) as "21",
  to_char(date '1970-01-01' + __type_function_connection_mutation__."time", 'HH24:MI:SS.US'::text) as "22",
  to_char(date '1970-01-01' + __type_function_connection_mutation__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__type_function_connection_mutation__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "24",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_connection_mutation__."interval_array") __entry__
  )::text as "25",
  __type_function_connection_mutation__."money"::numeric::text as "26",
  case when (__type_function_connection_mutation__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function_connection_mutation__."compound_type")."a"))::text, ((__type_function_connection_mutation__."compound_type")."b"), (((__type_function_connection_mutation__."compound_type")."c"))::text, ((__type_function_connection_mutation__."compound_type")."d"), (((__type_function_connection_mutation__."compound_type")."e"))::text, (((__type_function_connection_mutation__."compound_type")."f"))::text, to_char(((__type_function_connection_mutation__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_connection_mutation__."compound_type")."foo_bar"))::text)::text end as "27",
  case when (__type_function_connection_mutation__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_connection_mutation__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_connection_mutation__."nested_compound_type")."a"))."a"))::text, ((((__type_function_connection_mutation__."nested_compound_type")."a"))."b"), (((((__type_function_connection_mutation__."nested_compound_type")."a"))."c"))::text, ((((__type_function_connection_mutation__."nested_compound_type")."a"))."d"), (((((__type_function_connection_mutation__."nested_compound_type")."a"))."e"))::text, (((((__type_function_connection_mutation__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_connection_mutation__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection_mutation__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_connection_mutation__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_connection_mutation__."nested_compound_type")."b"))."a"))::text, ((((__type_function_connection_mutation__."nested_compound_type")."b"))."b"), (((((__type_function_connection_mutation__."nested_compound_type")."b"))."c"))::text, ((((__type_function_connection_mutation__."nested_compound_type")."b"))."d"), (((((__type_function_connection_mutation__."nested_compound_type")."b"))."e"))::text, (((((__type_function_connection_mutation__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_connection_mutation__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection_mutation__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_connection_mutation__."nested_compound_type")."baz_buz"))::text)::text end as "28",
  case when (__type_function_connection_mutation__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function_connection_mutation__."nullable_compound_type")."a"))::text, ((__type_function_connection_mutation__."nullable_compound_type")."b"), (((__type_function_connection_mutation__."nullable_compound_type")."c"))::text, ((__type_function_connection_mutation__."nullable_compound_type")."d"), (((__type_function_connection_mutation__."nullable_compound_type")."e"))::text, (((__type_function_connection_mutation__."nullable_compound_type")."f"))::text, to_char(((__type_function_connection_mutation__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_connection_mutation__."nullable_compound_type")."foo_bar"))::text)::text end as "29",
  case when (__type_function_connection_mutation__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_connection_mutation__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_connection_mutation__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection_mutation__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_connection_mutation__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "30",
  __type_function_connection_mutation__."point"::text as "31",
  __type_function_connection_mutation__."nullablePoint"::text as "32",
  __type_function_connection_mutation__."inet"::text as "33",
  __type_function_connection_mutation__."cidr"::text as "34",
  __type_function_connection_mutation__."macaddr"::text as "35",
  __type_function_connection_mutation__."regproc"::text as "36",
  __type_function_connection_mutation__."regprocedure"::text as "37",
  __type_function_connection_mutation__."regoper"::text as "38",
  __type_function_connection_mutation__."regoperator"::text as "39",
  __type_function_connection_mutation__."regclass"::text as "40",
  __type_function_connection_mutation__."regtype"::text as "41",
  __type_function_connection_mutation__."regconfig"::text as "42",
  __type_function_connection_mutation__."regdictionary"::text as "43",
  __type_function_connection_mutation__."text_array_domain"::text as "44",
  __type_function_connection_mutation__."int8_array_domain"::text as "45",
  __type_function_connection_mutation__."bytea"::text as "46",
  __type_function_connection_mutation__."bytea_array"::text as "47",
  __type_function_connection_mutation__."ltree"::text as "48",
  __type_function_connection_mutation__."ltree_array"::text as "49"
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
    __frmcdc_nested_compound_type__."baz_buz"::text as "0",
    (not (__frmcdc_nested_compound_type__ is null))::text as "1",
    __frmcdc_compound_type__."a"::text as "2",
    __frmcdc_compound_type__."b" as "3",
    __frmcdc_compound_type__."c"::text as "4",
    __frmcdc_compound_type__."d" as "5",
    __frmcdc_compound_type__."e"::text as "6",
    __frmcdc_compound_type__."f"::text as "7",
    __frmcdc_compound_type__."foo_bar"::text as "8",
    (not (__frmcdc_compound_type__ is null))::text as "9",
    __frmcdc_compound_type_2."a"::text as "10",
    __frmcdc_compound_type_2."b" as "11",
    __frmcdc_compound_type_2."c"::text as "12",
    __frmcdc_compound_type_2."d" as "13",
    __frmcdc_compound_type_2."e"::text as "14",
    __frmcdc_compound_type_2."f"::text as "15",
    __frmcdc_compound_type_2."foo_bar"::text as "16",
    (not (__frmcdc_compound_type_2 is null))::text as "17",
    __frmcdc_nested_compound_type_identifiers__.idx as "18"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
  left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
  on TRUE
  left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
  on TRUE
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
    __frmcdc_nested_compound_type__."baz_buz"::text as "0",
    (not (__frmcdc_nested_compound_type__ is null))::text as "1",
    __frmcdc_compound_type__."a"::text as "2",
    __frmcdc_compound_type__."b" as "3",
    __frmcdc_compound_type__."c"::text as "4",
    __frmcdc_compound_type__."d" as "5",
    __frmcdc_compound_type__."e"::text as "6",
    __frmcdc_compound_type__."f"::text as "7",
    __frmcdc_compound_type__."foo_bar"::text as "8",
    (not (__frmcdc_compound_type__ is null))::text as "9",
    __frmcdc_compound_type_2."a"::text as "10",
    __frmcdc_compound_type_2."b" as "11",
    __frmcdc_compound_type_2."c"::text as "12",
    __frmcdc_compound_type_2."d" as "13",
    __frmcdc_compound_type_2."e"::text as "14",
    __frmcdc_compound_type_2."f"::text as "15",
    __frmcdc_compound_type_2."foo_bar"::text as "16",
    (not (__frmcdc_compound_type_2 is null))::text as "17",
    __frmcdc_nested_compound_type_identifiers__.idx as "18"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
  left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
  on TRUE
  left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
  on TRUE
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

update "b"."types" as __types__ set "smallint" = $1::"int2", "bigint" = $2::"int8", "numeric" = $3::"numeric", "decimal" = $4::"numeric", "boolean" = $5::"bool", "varchar" = $6::"varchar", "enum" = $7::"b"."color", "enum_array" = $8::"b"."color"[], "domain" = $9::"a"."an_int", "domain2" = $10::"b"."another_int", "text_array" = $11::"text"[], "json" = $12::"json", "jsonb" = $13::"jsonb", "jsonpath" = $14::"jsonpath", "numrange" = $15::"pg_catalog"."numrange", "daterange" = $16::"pg_catalog"."daterange", "an_int_range" = $17::"a"."an_int_range", "timestamp" = $18::"timestamp", "timestamptz" = $19::"timestamptz", "date" = $20::"date", "time" = $21::"time", "timetz" = $22::"timetz", "interval" = $23::"interval", "interval_array" = $24::"interval"[], "money" = $25::"money", "compound_type" = $26::"c"."compound_type", "nested_compound_type" = $27::"b"."nested_compound_type", "point" = $28::"point", "nullablePoint" = $29::"point", "inet" = $30::"inet", "cidr" = $31::"cidr", "macaddr" = $32::"macaddr", "regproc" = $33::"regproc", "regprocedure" = $34::"regprocedure", "regoper" = $35::"regoper", "regoperator" = $36::"regoperator", "regclass" = $37::"regclass", "regtype" = $38::"regtype", "regconfig" = $39::"regconfig", "regdictionary" = $40::"regdictionary", "text_array_domain" = $41::"c"."text_array_domain", "int8_array_domain" = $42::"c"."int8_array_domain", "bytea" = $43::"bytea", "bytea_array" = $44::"bytea"[], "ltree" = $45::ltree, "ltree_array" = $46::ltree[] where (__types__."id" = $47::"int4") returning
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
  __types__."jsonpath"::text as "14",
  __types__."nullable_range"::text as "15",
  __types__."numrange"::text as "16",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "17",
  __types__."an_int_range"::text as "18",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "19",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "20",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "21",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "22",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "24",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "25",
  __types__."money"::numeric::text as "26",
  case when (__types__."compound_type") is not distinct from null then null::text else json_build_array((((__types__."compound_type")."a"))::text, ((__types__."compound_type")."b"), (((__types__."compound_type")."c"))::text, ((__types__."compound_type")."d"), (((__types__."compound_type")."e"))::text, (((__types__."compound_type")."f"))::text, to_char(((__types__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."compound_type")."foo_bar"))::text)::text end as "27",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "28",
  case when (__types__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__types__."nullable_compound_type")."a"))::text, ((__types__."nullable_compound_type")."b"), (((__types__."nullable_compound_type")."c"))::text, ((__types__."nullable_compound_type")."d"), (((__types__."nullable_compound_type")."e"))::text, (((__types__."nullable_compound_type")."f"))::text, to_char(((__types__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."nullable_compound_type")."foo_bar"))::text)::text end as "29",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "30",
  __types__."point"::text as "31",
  __types__."nullablePoint"::text as "32",
  __types__."inet"::text as "33",
  __types__."cidr"::text as "34",
  __types__."macaddr"::text as "35",
  __types__."regproc"::text as "36",
  __types__."regprocedure"::text as "37",
  __types__."regoper"::text as "38",
  __types__."regoperator"::text as "39",
  __types__."regclass"::text as "40",
  __types__."regtype"::text as "41",
  __types__."regconfig"::text as "42",
  __types__."regdictionary"::text as "43",
  __types__."text_array_domain"::text as "44",
  __types__."int8_array_domain"::text as "45",
  __types__."bytea"::text as "46",
  __types__."bytea_array"::text as "47",
  __types__."ltree"::text as "48",
  __types__."ltree_array"::text as "49";

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
  __frmcdc_nested_compound_type__."baz_buz"::text as "0",
  (not (__frmcdc_nested_compound_type__ is null))::text as "1",
  __frmcdc_compound_type__."a"::text as "2",
  __frmcdc_compound_type__."b" as "3",
  __frmcdc_compound_type__."c"::text as "4",
  __frmcdc_compound_type__."d" as "5",
  __frmcdc_compound_type__."e"::text as "6",
  __frmcdc_compound_type__."f"::text as "7",
  __frmcdc_compound_type__."foo_bar"::text as "8",
  (not (__frmcdc_compound_type__ is null))::text as "9",
  __frmcdc_compound_type_2."a"::text as "10",
  __frmcdc_compound_type_2."b" as "11",
  __frmcdc_compound_type_2."c"::text as "12",
  __frmcdc_compound_type_2."d" as "13",
  __frmcdc_compound_type_2."e"::text as "14",
  __frmcdc_compound_type_2."f"::text as "15",
  __frmcdc_compound_type_2."foo_bar"::text as "16",
  (not (__frmcdc_compound_type_2 is null))::text as "17"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
on TRUE;

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
  __frmcdc_nested_compound_type__."baz_buz"::text as "0",
  (not (__frmcdc_nested_compound_type__ is null))::text as "1",
  __frmcdc_compound_type__."a"::text as "2",
  __frmcdc_compound_type__."b" as "3",
  __frmcdc_compound_type__."c"::text as "4",
  __frmcdc_compound_type__."d" as "5",
  __frmcdc_compound_type__."e"::text as "6",
  __frmcdc_compound_type__."f"::text as "7",
  __frmcdc_compound_type__."foo_bar"::text as "8",
  (not (__frmcdc_compound_type__ is null))::text as "9",
  __frmcdc_compound_type_2."a"::text as "10",
  __frmcdc_compound_type_2."b" as "11",
  __frmcdc_compound_type_2."c"::text as "12",
  __frmcdc_compound_type_2."d" as "13",
  __frmcdc_compound_type_2."e"::text as "14",
  __frmcdc_compound_type_2."f"::text as "15",
  __frmcdc_compound_type_2."foo_bar"::text as "16",
  (not (__frmcdc_compound_type_2 is null))::text as "17"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
on TRUE;

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

insert into "b"."types" as __types__ ("smallint", "bigint", "numeric", "decimal", "boolean", "varchar", "enum", "enum_array", "domain", "domain2", "text_array", "json", "jsonb", "jsonpath", "numrange", "daterange", "an_int_range", "timestamp", "timestamptz", "date", "time", "timetz", "interval", "interval_array", "money", "compound_type", "nested_compound_type", "point", "regproc", "regprocedure", "regoper", "regoperator", "regclass", "regtype", "regconfig", "regdictionary", "ltree", "ltree_array") values ($1::"int2", $2::"int8", $3::"numeric", $4::"numeric", $5::"bool", $6::"varchar", $7::"b"."color", $8::"b"."color"[], $9::"a"."an_int", $10::"b"."another_int", $11::"text"[], $12::"json", $13::"jsonb", $14::"jsonpath", $15::"pg_catalog"."numrange", $16::"pg_catalog"."daterange", $17::"a"."an_int_range", $18::"timestamp", $19::"timestamptz", $20::"date", $21::"time", $22::"timetz", $23::"interval", $24::"interval"[], $25::"money", $26::"c"."compound_type", $27::"b"."nested_compound_type", $28::"point", $29::"regproc", $30::"regprocedure", $31::"regoper", $32::"regoperator", $33::"regclass", $34::"regtype", $35::"regconfig", $36::"regdictionary", $37::ltree, $38::ltree[]) returning
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
  __types__."jsonpath"::text as "14",
  __types__."nullable_range"::text as "15",
  __types__."numrange"::text as "16",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "17",
  __types__."an_int_range"::text as "18",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "19",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "20",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "21",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "22",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "24",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "25",
  __types__."money"::numeric::text as "26",
  case when (__types__."compound_type") is not distinct from null then null::text else json_build_array((((__types__."compound_type")."a"))::text, ((__types__."compound_type")."b"), (((__types__."compound_type")."c"))::text, ((__types__."compound_type")."d"), (((__types__."compound_type")."e"))::text, (((__types__."compound_type")."f"))::text, to_char(((__types__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."compound_type")."foo_bar"))::text)::text end as "27",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "28",
  case when (__types__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__types__."nullable_compound_type")."a"))::text, ((__types__."nullable_compound_type")."b"), (((__types__."nullable_compound_type")."c"))::text, ((__types__."nullable_compound_type")."d"), (((__types__."nullable_compound_type")."e"))::text, (((__types__."nullable_compound_type")."f"))::text, to_char(((__types__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."nullable_compound_type")."foo_bar"))::text)::text end as "29",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "30",
  __types__."point"::text as "31",
  __types__."nullablePoint"::text as "32",
  __types__."inet"::text as "33",
  __types__."cidr"::text as "34",
  __types__."macaddr"::text as "35",
  __types__."regproc"::text as "36",
  __types__."regprocedure"::text as "37",
  __types__."regoper"::text as "38",
  __types__."regoperator"::text as "39",
  __types__."regclass"::text as "40",
  __types__."regtype"::text as "41",
  __types__."regconfig"::text as "42",
  __types__."regdictionary"::text as "43",
  __types__."text_array_domain"::text as "44",
  __types__."int8_array_domain"::text as "45",
  __types__."bytea"::text as "46",
  __types__."bytea_array"::text as "47",
  __types__."ltree"::text as "48",
  __types__."ltree_array"::text as "49";

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
  __frmcdc_nested_compound_type__."baz_buz"::text as "0",
  (not (__frmcdc_nested_compound_type__ is null))::text as "1",
  __frmcdc_compound_type__."a"::text as "2",
  __frmcdc_compound_type__."b" as "3",
  __frmcdc_compound_type__."c"::text as "4",
  __frmcdc_compound_type__."d" as "5",
  __frmcdc_compound_type__."e"::text as "6",
  __frmcdc_compound_type__."f"::text as "7",
  __frmcdc_compound_type__."foo_bar"::text as "8",
  (not (__frmcdc_compound_type__ is null))::text as "9",
  __frmcdc_compound_type_2."a"::text as "10",
  __frmcdc_compound_type_2."b" as "11",
  __frmcdc_compound_type_2."c"::text as "12",
  __frmcdc_compound_type_2."d" as "13",
  __frmcdc_compound_type_2."e"::text as "14",
  __frmcdc_compound_type_2."f"::text as "15",
  __frmcdc_compound_type_2."foo_bar"::text as "16",
  (not (__frmcdc_compound_type_2 is null))::text as "17"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
on TRUE;

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
  __frmcdc_nested_compound_type__."baz_buz"::text as "0",
  (not (__frmcdc_nested_compound_type__ is null))::text as "1",
  __frmcdc_compound_type__."a"::text as "2",
  __frmcdc_compound_type__."b" as "3",
  __frmcdc_compound_type__."c"::text as "4",
  __frmcdc_compound_type__."d" as "5",
  __frmcdc_compound_type__."e"::text as "6",
  __frmcdc_compound_type__."f"::text as "7",
  __frmcdc_compound_type__."foo_bar"::text as "8",
  (not (__frmcdc_compound_type__ is null))::text as "9",
  __frmcdc_compound_type_2."a"::text as "10",
  __frmcdc_compound_type_2."b" as "11",
  __frmcdc_compound_type_2."c"::text as "12",
  __frmcdc_compound_type_2."d" as "13",
  __frmcdc_compound_type_2."e"::text as "14",
  __frmcdc_compound_type_2."f"::text as "15",
  __frmcdc_compound_type_2."foo_bar"::text as "16",
  (not (__frmcdc_compound_type_2 is null))::text as "17"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
on TRUE;

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