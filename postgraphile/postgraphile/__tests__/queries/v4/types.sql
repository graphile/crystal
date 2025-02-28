select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __types__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __types__."smallint"::text as "5",
  __types__."bigint"::text as "6",
  __types__."numeric"::text as "7",
  __types__."decimal"::text as "8",
  __types__."boolean"::text as "9",
  __types__."varchar" as "10",
  __types__."enum"::text as "11",
  __types__."enum_array"::text as "12",
  __types__."domain"::text as "13",
  __types__."domain2"::text as "14",
  __types__."text_array"::text as "15",
  __types__."json"::text as "16",
  __types__."jsonb"::text as "17",
  __types__."nullable_range"::text as "18",
  __types__."numrange"::text as "19",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "20",
  __types__."an_int_range"::text as "21",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "28",
  __types__."money"::numeric::text as "29",
  __frmcdc_compound_type__."a"::text as "30",
  __frmcdc_compound_type__."b" as "31",
  __frmcdc_compound_type__."c"::text as "32",
  __frmcdc_compound_type__."d" as "33",
  __frmcdc_compound_type__."e"::text as "34",
  __frmcdc_compound_type__."f"::text as "35",
  __frmcdc_compound_type__."foo_bar"::text as "36",
  (not (__frmcdc_compound_type__ is null))::text as "37",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "38",
  __frmcdc_compound_type_2."a"::text as "39",
  __frmcdc_compound_type_2."b" as "40",
  __frmcdc_compound_type_2."c"::text as "41",
  __frmcdc_compound_type_2."d" as "42",
  __frmcdc_compound_type_2."e"::text as "43",
  __frmcdc_compound_type_2."f"::text as "44",
  __frmcdc_compound_type_2."foo_bar"::text as "45",
  (not (__frmcdc_compound_type_2 is null))::text as "46",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "47",
  __types__."point"::text as "48",
  __types__."nullablePoint"::text as "49",
  __types__."inet"::text as "50",
  __types__."cidr"::text as "51",
  __types__."macaddr"::text as "52",
  __types__."regproc"::text as "53",
  __types__."regprocedure"::text as "54",
  __types__."regoper"::text as "55",
  __types__."regoperator"::text as "56",
  __types__."regclass"::text as "57",
  __types__."regtype"::text as "58",
  __types__."regconfig"::text as "59",
  __types__."regdictionary"::text as "60",
  __types__."text_array_domain"::text as "61",
  __types__."int8_array_domain"::text as "62",
  __types__."bytea"::text as "63",
  __types__."bytea_array"::text as "64",
  __types__."ltree"::text as "65",
  __types__."ltree_array"::text as "66"
from "b"."types" as __types__
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __types__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __types__."smallint"
))
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_2
on TRUE
order by __types__."id" asc;

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __types__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __types__."smallint"::text as "5",
  __types__."bigint"::text as "6",
  __types__."numeric"::text as "7",
  __types__."decimal"::text as "8",
  __types__."boolean"::text as "9",
  __types__."varchar" as "10",
  __types__."enum"::text as "11",
  __types__."enum_array"::text as "12",
  __types__."domain"::text as "13",
  __types__."domain2"::text as "14",
  __types__."text_array"::text as "15",
  __types__."json"::text as "16",
  __types__."jsonb"::text as "17",
  __types__."nullable_range"::text as "18",
  __types__."numrange"::text as "19",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "20",
  __types__."an_int_range"::text as "21",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "28",
  __types__."money"::numeric::text as "29",
  case when (__types__."compound_type") is not distinct from null then null::text else json_build_array((((__types__."compound_type")."a"))::text, ((__types__."compound_type")."b"), (((__types__."compound_type")."c"))::text, ((__types__."compound_type")."d"), (((__types__."compound_type")."e"))::text, (((__types__."compound_type")."f"))::text, to_char(((__types__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."compound_type")."foo_bar"))::text)::text end as "30",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "31",
  case when (__types__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__types__."nullable_compound_type")."a"))::text, ((__types__."nullable_compound_type")."b"), (((__types__."nullable_compound_type")."c"))::text, ((__types__."nullable_compound_type")."d"), (((__types__."nullable_compound_type")."e"))::text, (((__types__."nullable_compound_type")."f"))::text, to_char(((__types__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."nullable_compound_type")."foo_bar"))::text)::text end as "32",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "33",
  __types__."point"::text as "34",
  __types__."nullablePoint"::text as "35",
  __types__."inet"::text as "36",
  __types__."cidr"::text as "37",
  __types__."macaddr"::text as "38",
  __types__."regproc"::text as "39",
  __types__."regprocedure"::text as "40",
  __types__."regoper"::text as "41",
  __types__."regoperator"::text as "42",
  __types__."regclass"::text as "43",
  __types__."regtype"::text as "44",
  __types__."regconfig"::text as "45",
  __types__."regdictionary"::text as "46",
  __types__."text_array_domain"::text as "47",
  __types__."int8_array_domain"::text as "48",
  __types__."bytea"::text as "49",
  __types__."bytea_array"::text as "50",
  __types__."ltree"::text as "51",
  __types__."ltree_array"::text as "52"
from "b"."types" as __types__
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __types__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __types__."smallint"
))
where (
  __types__."id" = $1::"int4"
);

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __type_function__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __type_function__."smallint"::text as "5",
  __type_function__."bigint"::text as "6",
  __type_function__."numeric"::text as "7",
  __type_function__."decimal"::text as "8",
  __type_function__."boolean"::text as "9",
  __type_function__."varchar" as "10",
  __type_function__."enum"::text as "11",
  __type_function__."enum_array"::text as "12",
  __type_function__."domain"::text as "13",
  __type_function__."domain2"::text as "14",
  __type_function__."text_array"::text as "15",
  __type_function__."json"::text as "16",
  __type_function__."jsonb"::text as "17",
  __type_function__."nullable_range"::text as "18",
  __type_function__."numrange"::text as "19",
  json_build_array(
    lower_inc(__type_function__."daterange"),
    to_char(lower(__type_function__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function__."daterange")
  )::text as "20",
  __type_function__."an_int_range"::text as "21",
  to_char(__type_function__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__type_function__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__type_function__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __type_function__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __type_function__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__type_function__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function__."interval_array") __entry__
  )::text as "28",
  __type_function__."money"::numeric::text as "29",
  case when (__type_function__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function__."compound_type")."a"))::text, ((__type_function__."compound_type")."b"), (((__type_function__."compound_type")."c"))::text, ((__type_function__."compound_type")."d"), (((__type_function__."compound_type")."e"))::text, (((__type_function__."compound_type")."f"))::text, to_char(((__type_function__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function__."compound_type")."foo_bar"))::text)::text end as "30",
  case when (__type_function__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function__."nested_compound_type")."a"))."a"))::text, ((((__type_function__."nested_compound_type")."a"))."b"), (((((__type_function__."nested_compound_type")."a"))."c"))::text, ((((__type_function__."nested_compound_type")."a"))."d"), (((((__type_function__."nested_compound_type")."a"))."e"))::text, (((((__type_function__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function__."nested_compound_type")."b"))."a"))::text, ((((__type_function__."nested_compound_type")."b"))."b"), (((((__type_function__."nested_compound_type")."b"))."c"))::text, ((((__type_function__."nested_compound_type")."b"))."d"), (((((__type_function__."nested_compound_type")."b"))."e"))::text, (((((__type_function__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function__."nested_compound_type")."baz_buz"))::text)::text end as "31",
  case when (__type_function__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function__."nullable_compound_type")."a"))::text, ((__type_function__."nullable_compound_type")."b"), (((__type_function__."nullable_compound_type")."c"))::text, ((__type_function__."nullable_compound_type")."d"), (((__type_function__."nullable_compound_type")."e"))::text, (((__type_function__."nullable_compound_type")."f"))::text, to_char(((__type_function__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function__."nullable_compound_type")."foo_bar"))::text)::text end as "32",
  case when (__type_function__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function__."nullable_nested_compound_type")."a"))."b"), (((((__type_function__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function__."nullable_nested_compound_type")."a"))."d"), (((((__type_function__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function__."nullable_nested_compound_type")."b"))."b"), (((((__type_function__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function__."nullable_nested_compound_type")."b"))."d"), (((((__type_function__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "33",
  __type_function__."point"::text as "34",
  __type_function__."nullablePoint"::text as "35",
  __type_function__."inet"::text as "36",
  __type_function__."cidr"::text as "37",
  __type_function__."macaddr"::text as "38",
  __type_function__."regproc"::text as "39",
  __type_function__."regprocedure"::text as "40",
  __type_function__."regoper"::text as "41",
  __type_function__."regoperator"::text as "42",
  __type_function__."regclass"::text as "43",
  __type_function__."regtype"::text as "44",
  __type_function__."regconfig"::text as "45",
  __type_function__."regdictionary"::text as "46",
  __type_function__."text_array_domain"::text as "47",
  __type_function__."int8_array_domain"::text as "48",
  __type_function__."bytea"::text as "49",
  __type_function__."bytea_array"::text as "50",
  __type_function__."ltree"::text as "51",
  __type_function__."ltree_array"::text as "52"
from "b"."type_function"($1::"int4") as __type_function__
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __type_function__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __type_function__."smallint"
));

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __type_function_list__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __type_function_list__."smallint"::text as "5",
  __type_function_list__."bigint"::text as "6",
  __type_function_list__."numeric"::text as "7",
  __type_function_list__."decimal"::text as "8",
  __type_function_list__."boolean"::text as "9",
  __type_function_list__."varchar" as "10",
  __type_function_list__."enum"::text as "11",
  __type_function_list__."enum_array"::text as "12",
  __type_function_list__."domain"::text as "13",
  __type_function_list__."domain2"::text as "14",
  __type_function_list__."text_array"::text as "15",
  __type_function_list__."json"::text as "16",
  __type_function_list__."jsonb"::text as "17",
  __type_function_list__."nullable_range"::text as "18",
  __type_function_list__."numrange"::text as "19",
  json_build_array(
    lower_inc(__type_function_list__."daterange"),
    to_char(lower(__type_function_list__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_list__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_list__."daterange")
  )::text as "20",
  __type_function_list__."an_int_range"::text as "21",
  to_char(__type_function_list__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__type_function_list__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__type_function_list__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __type_function_list__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __type_function_list__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__type_function_list__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_list__."interval_array") __entry__
  )::text as "28",
  __type_function_list__."money"::numeric::text as "29",
  __frmcdc_compound_type__."a"::text as "30",
  __frmcdc_compound_type__."b" as "31",
  __frmcdc_compound_type__."c"::text as "32",
  __frmcdc_compound_type__."d" as "33",
  __frmcdc_compound_type__."e"::text as "34",
  __frmcdc_compound_type__."f"::text as "35",
  __frmcdc_compound_type__."foo_bar"::text as "36",
  (not (__frmcdc_compound_type__ is null))::text as "37",
  case when (__type_function_list__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_list__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_list__."nested_compound_type")."a"))."a"))::text, ((((__type_function_list__."nested_compound_type")."a"))."b"), (((((__type_function_list__."nested_compound_type")."a"))."c"))::text, ((((__type_function_list__."nested_compound_type")."a"))."d"), (((((__type_function_list__."nested_compound_type")."a"))."e"))::text, (((((__type_function_list__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_list__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_list__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_list__."nested_compound_type")."b"))."a"))::text, ((((__type_function_list__."nested_compound_type")."b"))."b"), (((((__type_function_list__."nested_compound_type")."b"))."c"))::text, ((((__type_function_list__."nested_compound_type")."b"))."d"), (((((__type_function_list__."nested_compound_type")."b"))."e"))::text, (((((__type_function_list__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_list__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_list__."nested_compound_type")."baz_buz"))::text)::text end as "38",
  __frmcdc_compound_type_2."a"::text as "39",
  __frmcdc_compound_type_2."b" as "40",
  __frmcdc_compound_type_2."c"::text as "41",
  __frmcdc_compound_type_2."d" as "42",
  __frmcdc_compound_type_2."e"::text as "43",
  __frmcdc_compound_type_2."f"::text as "44",
  __frmcdc_compound_type_2."foo_bar"::text as "45",
  (not (__frmcdc_compound_type_2 is null))::text as "46",
  case when (__type_function_list__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_list__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_list__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_list__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_list__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_list__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_list__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_list__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_list__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_list__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_list__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_list__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_list__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_list__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_list__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_list__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_list__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_list__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "47",
  __type_function_list__."point"::text as "48",
  __type_function_list__."nullablePoint"::text as "49",
  __type_function_list__."inet"::text as "50",
  __type_function_list__."cidr"::text as "51",
  __type_function_list__."macaddr"::text as "52",
  __type_function_list__."regproc"::text as "53",
  __type_function_list__."regprocedure"::text as "54",
  __type_function_list__."regoper"::text as "55",
  __type_function_list__."regoperator"::text as "56",
  __type_function_list__."regclass"::text as "57",
  __type_function_list__."regtype"::text as "58",
  __type_function_list__."regconfig"::text as "59",
  __type_function_list__."regdictionary"::text as "60",
  __type_function_list__."text_array_domain"::text as "61",
  __type_function_list__."int8_array_domain"::text as "62",
  __type_function_list__."bytea"::text as "63",
  __type_function_list__."bytea_array"::text as "64",
  __type_function_list__."ltree"::text as "65",
  __type_function_list__."ltree_array"::text as "66"
from unnest("b"."type_function_list"()) as __type_function_list__
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __type_function_list__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __type_function_list__."smallint"
))
left outer join lateral (select (__type_function_list__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__type_function_list__."nullable_compound_type").*) as __frmcdc_compound_type_2
on TRUE;

select
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "0",
  __person__."id"::text as "1"
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
);

select
  (count(*))::text as "0"
from "b"."types" as __types__;

select __frmcdc_nested_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."nested_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_nested_compound_type_identifiers__,
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
    __frmcdc_compound_type_2."a"::text as "8",
    __frmcdc_compound_type_2."b" as "9",
    __frmcdc_compound_type_2."c"::text as "10",
    __frmcdc_compound_type_2."d" as "11",
    __frmcdc_compound_type_2."e"::text as "12",
    __frmcdc_compound_type_2."f"::text as "13",
    __frmcdc_compound_type_2."foo_bar"::text as "14",
    (not (__frmcdc_compound_type_2 is null))::text as "15",
    __frmcdc_nested_compound_type__."baz_buz"::text as "16",
    (not (__frmcdc_nested_compound_type__ is null))::text as "17",
    __frmcdc_nested_compound_type_identifiers__.idx as "18"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
  left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
  on TRUE
  left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
  on TRUE
) as __frmcdc_nested_compound_type_result__;

select __frmcdc_nested_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."nested_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_nested_compound_type_identifiers__,
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
    __frmcdc_compound_type_2."a"::text as "8",
    __frmcdc_compound_type_2."b" as "9",
    __frmcdc_compound_type_2."c"::text as "10",
    __frmcdc_compound_type_2."d" as "11",
    __frmcdc_compound_type_2."e"::text as "12",
    __frmcdc_compound_type_2."f"::text as "13",
    __frmcdc_compound_type_2."foo_bar"::text as "14",
    (not (__frmcdc_compound_type_2 is null))::text as "15",
    __frmcdc_nested_compound_type__."baz_buz"::text as "16",
    (not (__frmcdc_nested_compound_type__ is null))::text as "17",
    __frmcdc_nested_compound_type_identifiers__.idx as "18"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
  left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
  on TRUE
  left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
  on TRUE
) as __frmcdc_nested_compound_type_result__;

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
  (count(*))::text as "0"
from "b"."type_function_connection"() as __type_function_connection__;

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __person_type_function__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __person_type_function__."smallint"::text as "5",
  __person_type_function__."bigint"::text as "6",
  __person_type_function__."numeric"::text as "7",
  __person_type_function__."decimal"::text as "8",
  __person_type_function__."boolean"::text as "9",
  __person_type_function__."varchar" as "10",
  __person_type_function__."enum"::text as "11",
  __person_type_function__."enum_array"::text as "12",
  __person_type_function__."domain"::text as "13",
  __person_type_function__."domain2"::text as "14",
  __person_type_function__."text_array"::text as "15",
  __person_type_function__."json"::text as "16",
  __person_type_function__."jsonb"::text as "17",
  __person_type_function__."nullable_range"::text as "18",
  __person_type_function__."numrange"::text as "19",
  json_build_array(
    lower_inc(__person_type_function__."daterange"),
    to_char(lower(__person_type_function__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__person_type_function__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__person_type_function__."daterange")
  )::text as "20",
  __person_type_function__."an_int_range"::text as "21",
  to_char(__person_type_function__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__person_type_function__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__person_type_function__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __person_type_function__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __person_type_function__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__person_type_function__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__person_type_function__."interval_array") __entry__
  )::text as "28",
  __person_type_function__."money"::numeric::text as "29",
  case when (__person_type_function__."compound_type") is not distinct from null then null::text else json_build_array((((__person_type_function__."compound_type")."a"))::text, ((__person_type_function__."compound_type")."b"), (((__person_type_function__."compound_type")."c"))::text, ((__person_type_function__."compound_type")."d"), (((__person_type_function__."compound_type")."e"))::text, (((__person_type_function__."compound_type")."f"))::text, to_char(((__person_type_function__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_type_function__."compound_type")."foo_bar"))::text)::text end as "30",
  case when (__person_type_function__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function__."nested_compound_type")."a"))."a"))::text, ((((__person_type_function__."nested_compound_type")."a"))."b"), (((((__person_type_function__."nested_compound_type")."a"))."c"))::text, ((((__person_type_function__."nested_compound_type")."a"))."d"), (((((__person_type_function__."nested_compound_type")."a"))."e"))::text, (((((__person_type_function__."nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function__."nested_compound_type")."b"))."a"))::text, ((((__person_type_function__."nested_compound_type")."b"))."b"), (((((__person_type_function__."nested_compound_type")."b"))."c"))::text, ((((__person_type_function__."nested_compound_type")."b"))."d"), (((((__person_type_function__."nested_compound_type")."b"))."e"))::text, (((((__person_type_function__."nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function__."nested_compound_type")."baz_buz"))::text)::text end as "31",
  case when (__person_type_function__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__person_type_function__."nullable_compound_type")."a"))::text, ((__person_type_function__."nullable_compound_type")."b"), (((__person_type_function__."nullable_compound_type")."c"))::text, ((__person_type_function__."nullable_compound_type")."d"), (((__person_type_function__."nullable_compound_type")."e"))::text, (((__person_type_function__."nullable_compound_type")."f"))::text, to_char(((__person_type_function__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_type_function__."nullable_compound_type")."foo_bar"))::text)::text end as "32",
  case when (__person_type_function__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function__."nullable_nested_compound_type")."a"))."a"))::text, ((((__person_type_function__."nullable_nested_compound_type")."a"))."b"), (((((__person_type_function__."nullable_nested_compound_type")."a"))."c"))::text, ((((__person_type_function__."nullable_nested_compound_type")."a"))."d"), (((((__person_type_function__."nullable_nested_compound_type")."a"))."e"))::text, (((((__person_type_function__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function__."nullable_nested_compound_type")."b"))."a"))::text, ((((__person_type_function__."nullable_nested_compound_type")."b"))."b"), (((((__person_type_function__."nullable_nested_compound_type")."b"))."c"))::text, ((((__person_type_function__."nullable_nested_compound_type")."b"))."d"), (((((__person_type_function__."nullable_nested_compound_type")."b"))."e"))::text, (((((__person_type_function__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "33",
  __person_type_function__."point"::text as "34",
  __person_type_function__."nullablePoint"::text as "35",
  __person_type_function__."inet"::text as "36",
  __person_type_function__."cidr"::text as "37",
  __person_type_function__."macaddr"::text as "38",
  __person_type_function__."regproc"::text as "39",
  __person_type_function__."regprocedure"::text as "40",
  __person_type_function__."regoper"::text as "41",
  __person_type_function__."regoperator"::text as "42",
  __person_type_function__."regclass"::text as "43",
  __person_type_function__."regtype"::text as "44",
  __person_type_function__."regconfig"::text as "45",
  __person_type_function__."regdictionary"::text as "46",
  __person_type_function__."text_array_domain"::text as "47",
  __person_type_function__."int8_array_domain"::text as "48",
  __person_type_function__."bytea"::text as "49",
  __person_type_function__."bytea_array"::text as "50",
  __person_type_function__."ltree"::text as "51",
  __person_type_function__."ltree_array"::text as "52"
from "c"."person_type_function"(
  $1::"c"."person",
  $2::"int4"
) as __person_type_function__
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __person_type_function__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __person_type_function__."smallint"
));

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __person_type_function_list__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __person_type_function_list__."smallint"::text as "5",
  __person_type_function_list__."bigint"::text as "6",
  __person_type_function_list__."numeric"::text as "7",
  __person_type_function_list__."decimal"::text as "8",
  __person_type_function_list__."boolean"::text as "9",
  __person_type_function_list__."varchar" as "10",
  __person_type_function_list__."enum"::text as "11",
  __person_type_function_list__."enum_array"::text as "12",
  __person_type_function_list__."domain"::text as "13",
  __person_type_function_list__."domain2"::text as "14",
  __person_type_function_list__."text_array"::text as "15",
  __person_type_function_list__."json"::text as "16",
  __person_type_function_list__."jsonb"::text as "17",
  __person_type_function_list__."nullable_range"::text as "18",
  __person_type_function_list__."numrange"::text as "19",
  json_build_array(
    lower_inc(__person_type_function_list__."daterange"),
    to_char(lower(__person_type_function_list__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__person_type_function_list__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__person_type_function_list__."daterange")
  )::text as "20",
  __person_type_function_list__."an_int_range"::text as "21",
  to_char(__person_type_function_list__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__person_type_function_list__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__person_type_function_list__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __person_type_function_list__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __person_type_function_list__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__person_type_function_list__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__person_type_function_list__."interval_array") __entry__
  )::text as "28",
  __person_type_function_list__."money"::numeric::text as "29",
  __frmcdc_compound_type__."a"::text as "30",
  __frmcdc_compound_type__."b" as "31",
  __frmcdc_compound_type__."c"::text as "32",
  __frmcdc_compound_type__."d" as "33",
  __frmcdc_compound_type__."e"::text as "34",
  __frmcdc_compound_type__."f"::text as "35",
  __frmcdc_compound_type__."foo_bar"::text as "36",
  (not (__frmcdc_compound_type__ is null))::text as "37",
  case when (__person_type_function_list__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function_list__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function_list__."nested_compound_type")."a"))."a"))::text, ((((__person_type_function_list__."nested_compound_type")."a"))."b"), (((((__person_type_function_list__."nested_compound_type")."a"))."c"))::text, ((((__person_type_function_list__."nested_compound_type")."a"))."d"), (((((__person_type_function_list__."nested_compound_type")."a"))."e"))::text, (((((__person_type_function_list__."nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function_list__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_list__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function_list__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function_list__."nested_compound_type")."b"))."a"))::text, ((((__person_type_function_list__."nested_compound_type")."b"))."b"), (((((__person_type_function_list__."nested_compound_type")."b"))."c"))::text, ((((__person_type_function_list__."nested_compound_type")."b"))."d"), (((((__person_type_function_list__."nested_compound_type")."b"))."e"))::text, (((((__person_type_function_list__."nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function_list__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_list__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function_list__."nested_compound_type")."baz_buz"))::text)::text end as "38",
  __frmcdc_compound_type_2."a"::text as "39",
  __frmcdc_compound_type_2."b" as "40",
  __frmcdc_compound_type_2."c"::text as "41",
  __frmcdc_compound_type_2."d" as "42",
  __frmcdc_compound_type_2."e"::text as "43",
  __frmcdc_compound_type_2."f"::text as "44",
  __frmcdc_compound_type_2."foo_bar"::text as "45",
  (not (__frmcdc_compound_type_2 is null))::text as "46",
  case when (__person_type_function_list__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function_list__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function_list__."nullable_nested_compound_type")."a"))."a"))::text, ((((__person_type_function_list__."nullable_nested_compound_type")."a"))."b"), (((((__person_type_function_list__."nullable_nested_compound_type")."a"))."c"))::text, ((((__person_type_function_list__."nullable_nested_compound_type")."a"))."d"), (((((__person_type_function_list__."nullable_nested_compound_type")."a"))."e"))::text, (((((__person_type_function_list__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function_list__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_list__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function_list__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function_list__."nullable_nested_compound_type")."b"))."a"))::text, ((((__person_type_function_list__."nullable_nested_compound_type")."b"))."b"), (((((__person_type_function_list__."nullable_nested_compound_type")."b"))."c"))::text, ((((__person_type_function_list__."nullable_nested_compound_type")."b"))."d"), (((((__person_type_function_list__."nullable_nested_compound_type")."b"))."e"))::text, (((((__person_type_function_list__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function_list__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_list__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function_list__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "47",
  __person_type_function_list__."point"::text as "48",
  __person_type_function_list__."nullablePoint"::text as "49",
  __person_type_function_list__."inet"::text as "50",
  __person_type_function_list__."cidr"::text as "51",
  __person_type_function_list__."macaddr"::text as "52",
  __person_type_function_list__."regproc"::text as "53",
  __person_type_function_list__."regprocedure"::text as "54",
  __person_type_function_list__."regoper"::text as "55",
  __person_type_function_list__."regoperator"::text as "56",
  __person_type_function_list__."regclass"::text as "57",
  __person_type_function_list__."regtype"::text as "58",
  __person_type_function_list__."regconfig"::text as "59",
  __person_type_function_list__."regdictionary"::text as "60",
  __person_type_function_list__."text_array_domain"::text as "61",
  __person_type_function_list__."int8_array_domain"::text as "62",
  __person_type_function_list__."bytea"::text as "63",
  __person_type_function_list__."bytea_array"::text as "64",
  __person_type_function_list__."ltree"::text as "65",
  __person_type_function_list__."ltree_array"::text as "66"
from unnest("c"."person_type_function_list"($1::"c"."person")) as __person_type_function_list__
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __person_type_function_list__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __person_type_function_list__."smallint"
))
left outer join lateral (select (__person_type_function_list__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__person_type_function_list__."nullable_compound_type").*) as __frmcdc_compound_type_2
on TRUE;

select
  __person_type_function_connection__."id"::text as "0",
  __person_type_function_connection__."smallint"::text as "1",
  __person_type_function_connection__."bigint"::text as "2",
  __person_type_function_connection__."numeric"::text as "3",
  __person_type_function_connection__."decimal"::text as "4",
  __person_type_function_connection__."boolean"::text as "5",
  __person_type_function_connection__."varchar" as "6",
  __person_type_function_connection__."enum"::text as "7",
  __person_type_function_connection__."enum_array"::text as "8",
  __person_type_function_connection__."domain"::text as "9",
  __person_type_function_connection__."domain2"::text as "10",
  __person_type_function_connection__."text_array"::text as "11",
  __person_type_function_connection__."json"::text as "12",
  __person_type_function_connection__."jsonb"::text as "13",
  __person_type_function_connection__."nullable_range"::text as "14",
  __person_type_function_connection__."numrange"::text as "15",
  json_build_array(
    lower_inc(__person_type_function_connection__."daterange"),
    to_char(lower(__person_type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__person_type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__person_type_function_connection__."daterange")
  )::text as "16",
  __person_type_function_connection__."an_int_range"::text as "17",
  to_char(__person_type_function_connection__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__person_type_function_connection__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__person_type_function_connection__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __person_type_function_connection__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __person_type_function_connection__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__person_type_function_connection__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__person_type_function_connection__."interval_array") __entry__
  )::text as "24",
  __person_type_function_connection__."money"::numeric::text as "25",
  __frmcdc_compound_type__."a"::text as "26",
  __frmcdc_compound_type__."b" as "27",
  __frmcdc_compound_type__."c"::text as "28",
  __frmcdc_compound_type__."d" as "29",
  __frmcdc_compound_type__."e"::text as "30",
  __frmcdc_compound_type__."f"::text as "31",
  __frmcdc_compound_type__."foo_bar"::text as "32",
  (not (__frmcdc_compound_type__ is null))::text as "33",
  case when (__person_type_function_connection__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function_connection__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function_connection__."nested_compound_type")."a"))."a"))::text, ((((__person_type_function_connection__."nested_compound_type")."a"))."b"), (((((__person_type_function_connection__."nested_compound_type")."a"))."c"))::text, ((((__person_type_function_connection__."nested_compound_type")."a"))."d"), (((((__person_type_function_connection__."nested_compound_type")."a"))."e"))::text, (((((__person_type_function_connection__."nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function_connection__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_connection__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function_connection__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function_connection__."nested_compound_type")."b"))."a"))::text, ((((__person_type_function_connection__."nested_compound_type")."b"))."b"), (((((__person_type_function_connection__."nested_compound_type")."b"))."c"))::text, ((((__person_type_function_connection__."nested_compound_type")."b"))."d"), (((((__person_type_function_connection__."nested_compound_type")."b"))."e"))::text, (((((__person_type_function_connection__."nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function_connection__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_connection__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function_connection__."nested_compound_type")."baz_buz"))::text)::text end as "34",
  __frmcdc_compound_type_2."a"::text as "35",
  __frmcdc_compound_type_2."b" as "36",
  __frmcdc_compound_type_2."c"::text as "37",
  __frmcdc_compound_type_2."d" as "38",
  __frmcdc_compound_type_2."e"::text as "39",
  __frmcdc_compound_type_2."f"::text as "40",
  __frmcdc_compound_type_2."foo_bar"::text as "41",
  (not (__frmcdc_compound_type_2 is null))::text as "42",
  case when (__person_type_function_connection__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function_connection__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."a"))::text, ((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."b"), (((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."c"))::text, ((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."d"), (((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."e"))::text, (((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function_connection__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."a"))::text, ((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."b"), (((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."c"))::text, ((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."d"), (((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."e"))::text, (((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function_connection__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "43",
  __person_type_function_connection__."point"::text as "44",
  __person_type_function_connection__."nullablePoint"::text as "45",
  __person_type_function_connection__."inet"::text as "46",
  __person_type_function_connection__."cidr"::text as "47",
  __person_type_function_connection__."macaddr"::text as "48",
  __person_type_function_connection__."regproc"::text as "49",
  __person_type_function_connection__."regprocedure"::text as "50",
  __person_type_function_connection__."regoper"::text as "51",
  __person_type_function_connection__."regoperator"::text as "52",
  __person_type_function_connection__."regclass"::text as "53",
  __person_type_function_connection__."regtype"::text as "54",
  __person_type_function_connection__."regconfig"::text as "55",
  __person_type_function_connection__."regdictionary"::text as "56",
  __person_type_function_connection__."text_array_domain"::text as "57",
  __person_type_function_connection__."int8_array_domain"::text as "58",
  __person_type_function_connection__."bytea"::text as "59",
  __person_type_function_connection__."bytea_array"::text as "60",
  __person_type_function_connection__."ltree"::text as "61",
  __person_type_function_connection__."ltree_array"::text as "62",
  array(
    select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__person_type_function_connection__."interval_array") __entry_2
  )::text as "63",
  __frmcdc_compound_type_3."a"::text as "64",
  __frmcdc_compound_type_3."b" as "65",
  __frmcdc_compound_type_3."c"::text as "66",
  __frmcdc_compound_type_3."d" as "67",
  __frmcdc_compound_type_3."e"::text as "68",
  __frmcdc_compound_type_3."f"::text as "69",
  __frmcdc_compound_type_3."foo_bar"::text as "70",
  (not (__frmcdc_compound_type_3 is null))::text as "71",
  __frmcdc_compound_type_4."a"::text as "72",
  __frmcdc_compound_type_4."b" as "73",
  __frmcdc_compound_type_4."c"::text as "74",
  __frmcdc_compound_type_4."d" as "75",
  __frmcdc_compound_type_4."e"::text as "76",
  __frmcdc_compound_type_4."f"::text as "77",
  __frmcdc_compound_type_4."foo_bar"::text as "78",
  (not (__frmcdc_compound_type_4 is null))::text as "79",
  (row_number() over (partition by 1))::text as "80"
from "c"."person_type_function_connection"($1::"c"."person") as __person_type_function_connection__
left outer join lateral (select (__person_type_function_connection__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__person_type_function_connection__."nullable_compound_type").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__person_type_function_connection__."compound_type").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__person_type_function_connection__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE;

select
  (count(*))::text as "0"
from "c"."person_type_function_connection"($1::"c"."person") as __person_type_function_connection__;

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __types__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __types__."smallint"::text as "5",
  __types__."bigint"::text as "6",
  __types__."numeric"::text as "7",
  __types__."decimal"::text as "8",
  __types__."boolean"::text as "9",
  __types__."varchar" as "10",
  __types__."enum"::text as "11",
  __types__."enum_array"::text as "12",
  __types__."domain"::text as "13",
  __types__."domain2"::text as "14",
  __types__."text_array"::text as "15",
  __types__."json"::text as "16",
  __types__."jsonb"::text as "17",
  __types__."nullable_range"::text as "18",
  __types__."numrange"::text as "19",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "20",
  __types__."an_int_range"::text as "21",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "28",
  __types__."money"::numeric::text as "29",
  __frmcdc_compound_type__."a"::text as "30",
  __frmcdc_compound_type__."b" as "31",
  __frmcdc_compound_type__."c"::text as "32",
  __frmcdc_compound_type__."d" as "33",
  __frmcdc_compound_type__."e"::text as "34",
  __frmcdc_compound_type__."f"::text as "35",
  __frmcdc_compound_type__."foo_bar"::text as "36",
  (not (__frmcdc_compound_type__ is null))::text as "37",
  __frmcdc_compound_type_2."a"::text as "38",
  __frmcdc_compound_type_2."b" as "39",
  __frmcdc_compound_type_2."c"::text as "40",
  __frmcdc_compound_type_2."d" as "41",
  __frmcdc_compound_type_2."e"::text as "42",
  __frmcdc_compound_type_2."f"::text as "43",
  __frmcdc_compound_type_2."foo_bar"::text as "44",
  (not (__frmcdc_compound_type_2 is null))::text as "45",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "46",
  __frmcdc_compound_type_3."a"::text as "47",
  __frmcdc_compound_type_3."b" as "48",
  __frmcdc_compound_type_3."c"::text as "49",
  __frmcdc_compound_type_3."d" as "50",
  __frmcdc_compound_type_3."e"::text as "51",
  __frmcdc_compound_type_3."f"::text as "52",
  __frmcdc_compound_type_3."foo_bar"::text as "53",
  (not (__frmcdc_compound_type_3 is null))::text as "54",
  __frmcdc_compound_type_4."a"::text as "55",
  __frmcdc_compound_type_4."b" as "56",
  __frmcdc_compound_type_4."c"::text as "57",
  __frmcdc_compound_type_4."d" as "58",
  __frmcdc_compound_type_4."e"::text as "59",
  __frmcdc_compound_type_4."f"::text as "60",
  __frmcdc_compound_type_4."foo_bar"::text as "61",
  (not (__frmcdc_compound_type_4 is null))::text as "62",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "63",
  __types__."point"::text as "64",
  __types__."nullablePoint"::text as "65",
  __types__."inet"::text as "66",
  __types__."cidr"::text as "67",
  __types__."macaddr"::text as "68",
  __types__."regproc"::text as "69",
  __types__."regprocedure"::text as "70",
  __types__."regoper"::text as "71",
  __types__."regoperator"::text as "72",
  __types__."regclass"::text as "73",
  __types__."regtype"::text as "74",
  __types__."regconfig"::text as "75",
  __types__."regdictionary"::text as "76",
  __types__."text_array_domain"::text as "77",
  __types__."int8_array_domain"::text as "78",
  __types__."bytea"::text as "79",
  __types__."bytea_array"::text as "80",
  __types__."ltree"::text as "81",
  __types__."ltree_array"::text as "82"
from "b"."types" as __types__
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __types__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __types__."smallint"
))
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
where (
  __types__."smallint" = $1::"int2"
)
order by __types__."id" asc;

select
  (count(*))::text as "0"
from "b"."types" as __types__
where (
  __types__."smallint" = $1::"int2"
);

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __types__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __types__."smallint"::text as "5",
  __types__."bigint"::text as "6",
  __types__."numeric"::text as "7",
  __types__."decimal"::text as "8",
  __types__."boolean"::text as "9",
  __types__."varchar" as "10",
  __types__."enum"::text as "11",
  __types__."enum_array"::text as "12",
  __types__."domain"::text as "13",
  __types__."domain2"::text as "14",
  __types__."text_array"::text as "15",
  __types__."json"::text as "16",
  __types__."jsonb"::text as "17",
  __types__."nullable_range"::text as "18",
  __types__."numrange"::text as "19",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "20",
  __types__."an_int_range"::text as "21",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "28",
  __types__."money"::numeric::text as "29",
  __frmcdc_compound_type__."a"::text as "30",
  __frmcdc_compound_type__."b" as "31",
  __frmcdc_compound_type__."c"::text as "32",
  __frmcdc_compound_type__."d" as "33",
  __frmcdc_compound_type__."e"::text as "34",
  __frmcdc_compound_type__."f"::text as "35",
  __frmcdc_compound_type__."foo_bar"::text as "36",
  (not (__frmcdc_compound_type__ is null))::text as "37",
  __frmcdc_compound_type_2."a"::text as "38",
  __frmcdc_compound_type_2."b" as "39",
  __frmcdc_compound_type_2."c"::text as "40",
  __frmcdc_compound_type_2."d" as "41",
  __frmcdc_compound_type_2."e"::text as "42",
  __frmcdc_compound_type_2."f"::text as "43",
  __frmcdc_compound_type_2."foo_bar"::text as "44",
  (not (__frmcdc_compound_type_2 is null))::text as "45",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "46",
  __frmcdc_compound_type_3."a"::text as "47",
  __frmcdc_compound_type_3."b" as "48",
  __frmcdc_compound_type_3."c"::text as "49",
  __frmcdc_compound_type_3."d" as "50",
  __frmcdc_compound_type_3."e"::text as "51",
  __frmcdc_compound_type_3."f"::text as "52",
  __frmcdc_compound_type_3."foo_bar"::text as "53",
  (not (__frmcdc_compound_type_3 is null))::text as "54",
  __frmcdc_compound_type_4."a"::text as "55",
  __frmcdc_compound_type_4."b" as "56",
  __frmcdc_compound_type_4."c"::text as "57",
  __frmcdc_compound_type_4."d" as "58",
  __frmcdc_compound_type_4."e"::text as "59",
  __frmcdc_compound_type_4."f"::text as "60",
  __frmcdc_compound_type_4."foo_bar"::text as "61",
  (not (__frmcdc_compound_type_4 is null))::text as "62",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "63",
  __types__."point"::text as "64",
  __types__."nullablePoint"::text as "65",
  __types__."inet"::text as "66",
  __types__."cidr"::text as "67",
  __types__."macaddr"::text as "68",
  __types__."regproc"::text as "69",
  __types__."regprocedure"::text as "70",
  __types__."regoper"::text as "71",
  __types__."regoperator"::text as "72",
  __types__."regclass"::text as "73",
  __types__."regtype"::text as "74",
  __types__."regconfig"::text as "75",
  __types__."regdictionary"::text as "76",
  __types__."text_array_domain"::text as "77",
  __types__."int8_array_domain"::text as "78",
  __types__."bytea"::text as "79",
  __types__."bytea_array"::text as "80",
  __types__."ltree"::text as "81",
  __types__."ltree_array"::text as "82"
from "b"."types" as __types__
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __types__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __types__."smallint"
))
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
order by __types__."id" asc;

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
  __type_function_connection__."id"::text as "0",
  __type_function_connection__."smallint"::text as "1",
  __type_function_connection__."bigint"::text as "2",
  __type_function_connection__."numeric"::text as "3",
  __type_function_connection__."decimal"::text as "4",
  __type_function_connection__."boolean"::text as "5",
  __type_function_connection__."varchar" as "6",
  __type_function_connection__."enum"::text as "7",
  __type_function_connection__."enum_array"::text as "8",
  __type_function_connection__."domain"::text as "9",
  __type_function_connection__."domain2"::text as "10",
  __type_function_connection__."text_array"::text as "11",
  __type_function_connection__."json"::text as "12",
  __type_function_connection__."jsonb"::text as "13",
  __type_function_connection__."nullable_range"::text as "14",
  __type_function_connection__."numrange"::text as "15",
  json_build_array(
    lower_inc(__type_function_connection__."daterange"),
    to_char(lower(__type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_connection__."daterange")
  )::text as "16",
  __type_function_connection__."an_int_range"::text as "17",
  to_char(__type_function_connection__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__type_function_connection__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__type_function_connection__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __type_function_connection__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __type_function_connection__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__type_function_connection__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_connection__."interval_array") __entry__
  )::text as "24",
  __type_function_connection__."money"::numeric::text as "25",
  __frmcdc_compound_type__."a"::text as "26",
  __frmcdc_compound_type__."b" as "27",
  __frmcdc_compound_type__."c"::text as "28",
  __frmcdc_compound_type__."d" as "29",
  __frmcdc_compound_type__."e"::text as "30",
  __frmcdc_compound_type__."f"::text as "31",
  __frmcdc_compound_type__."foo_bar"::text as "32",
  (not (__frmcdc_compound_type__ is null))::text as "33",
  case when (__type_function_connection__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_connection__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_connection__."nested_compound_type")."a"))."a"))::text, ((((__type_function_connection__."nested_compound_type")."a"))."b"), (((((__type_function_connection__."nested_compound_type")."a"))."c"))::text, ((((__type_function_connection__."nested_compound_type")."a"))."d"), (((((__type_function_connection__."nested_compound_type")."a"))."e"))::text, (((((__type_function_connection__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_connection__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_connection__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_connection__."nested_compound_type")."b"))."a"))::text, ((((__type_function_connection__."nested_compound_type")."b"))."b"), (((((__type_function_connection__."nested_compound_type")."b"))."c"))::text, ((((__type_function_connection__."nested_compound_type")."b"))."d"), (((((__type_function_connection__."nested_compound_type")."b"))."e"))::text, (((((__type_function_connection__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_connection__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_connection__."nested_compound_type")."baz_buz"))::text)::text end as "34",
  __frmcdc_compound_type_2."a"::text as "35",
  __frmcdc_compound_type_2."b" as "36",
  __frmcdc_compound_type_2."c"::text as "37",
  __frmcdc_compound_type_2."d" as "38",
  __frmcdc_compound_type_2."e"::text as "39",
  __frmcdc_compound_type_2."f"::text as "40",
  __frmcdc_compound_type_2."foo_bar"::text as "41",
  (not (__frmcdc_compound_type_2 is null))::text as "42",
  case when (__type_function_connection__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_connection__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_connection__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_connection__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_connection__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_connection__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_connection__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_connection__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_connection__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_connection__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_connection__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_connection__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_connection__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_connection__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_connection__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_connection__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_connection__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_connection__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "43",
  __type_function_connection__."point"::text as "44",
  __type_function_connection__."nullablePoint"::text as "45",
  __type_function_connection__."inet"::text as "46",
  __type_function_connection__."cidr"::text as "47",
  __type_function_connection__."macaddr"::text as "48",
  __type_function_connection__."regproc"::text as "49",
  __type_function_connection__."regprocedure"::text as "50",
  __type_function_connection__."regoper"::text as "51",
  __type_function_connection__."regoperator"::text as "52",
  __type_function_connection__."regclass"::text as "53",
  __type_function_connection__."regtype"::text as "54",
  __type_function_connection__."regconfig"::text as "55",
  __type_function_connection__."regdictionary"::text as "56",
  __type_function_connection__."text_array_domain"::text as "57",
  __type_function_connection__."int8_array_domain"::text as "58",
  __type_function_connection__."bytea"::text as "59",
  __type_function_connection__."bytea_array"::text as "60",
  __type_function_connection__."ltree"::text as "61",
  __type_function_connection__."ltree_array"::text as "62",
  array(
    select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_connection__."interval_array") __entry_2
  )::text as "63",
  __frmcdc_compound_type_3."a"::text as "64",
  __frmcdc_compound_type_3."b" as "65",
  __frmcdc_compound_type_3."c"::text as "66",
  __frmcdc_compound_type_3."d" as "67",
  __frmcdc_compound_type_3."e"::text as "68",
  __frmcdc_compound_type_3."f"::text as "69",
  __frmcdc_compound_type_3."foo_bar"::text as "70",
  (not (__frmcdc_compound_type_3 is null))::text as "71",
  __frmcdc_compound_type_4."a"::text as "72",
  __frmcdc_compound_type_4."b" as "73",
  __frmcdc_compound_type_4."c"::text as "74",
  __frmcdc_compound_type_4."d" as "75",
  __frmcdc_compound_type_4."e"::text as "76",
  __frmcdc_compound_type_4."f"::text as "77",
  __frmcdc_compound_type_4."foo_bar"::text as "78",
  (not (__frmcdc_compound_type_4 is null))::text as "79",
  (row_number() over (partition by 1))::text as "80"
from "b"."type_function_connection"() as __type_function_connection__
left outer join lateral (select (__type_function_connection__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__type_function_connection__."nullable_compound_type").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__type_function_connection__."compound_type").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__type_function_connection__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE;

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