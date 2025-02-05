select
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
  __types__."ltree_array"::text as "48"
from "b"."types" as __types__
order by __types__."id" asc;

select
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
  __types__."ltree_array"::text as "48"
from "b"."types" as __types__
where (
  __types__."id" = $1::"int4"
);

select
  __type_function__."id"::text as "0",
  __type_function__."smallint"::text as "1",
  __type_function__."bigint"::text as "2",
  __type_function__."numeric"::text as "3",
  __type_function__."decimal"::text as "4",
  __type_function__."boolean"::text as "5",
  __type_function__."varchar" as "6",
  __type_function__."enum"::text as "7",
  __type_function__."enum_array"::text as "8",
  __type_function__."domain"::text as "9",
  __type_function__."domain2"::text as "10",
  __type_function__."text_array"::text as "11",
  __type_function__."json"::text as "12",
  __type_function__."jsonb"::text as "13",
  __type_function__."nullable_range"::text as "14",
  __type_function__."numrange"::text as "15",
  json_build_array(
    lower_inc(__type_function__."daterange"),
    to_char(lower(__type_function__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function__."daterange")
  )::text as "16",
  __type_function__."an_int_range"::text as "17",
  to_char(__type_function__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__type_function__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__type_function__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __type_function__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __type_function__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__type_function__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function__."interval_array") __entry__
  )::text as "24",
  __type_function__."money"::numeric::text as "25",
  case when (__type_function__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function__."compound_type")."a"))::text, ((__type_function__."compound_type")."b"), (((__type_function__."compound_type")."c"))::text, ((__type_function__."compound_type")."d"), (((__type_function__."compound_type")."e"))::text, (((__type_function__."compound_type")."f"))::text, to_char(((__type_function__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__type_function__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function__."nested_compound_type")."a"))."a"))::text, ((((__type_function__."nested_compound_type")."a"))."b"), (((((__type_function__."nested_compound_type")."a"))."c"))::text, ((((__type_function__."nested_compound_type")."a"))."d"), (((((__type_function__."nested_compound_type")."a"))."e"))::text, (((((__type_function__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function__."nested_compound_type")."b"))."a"))::text, ((((__type_function__."nested_compound_type")."b"))."b"), (((((__type_function__."nested_compound_type")."b"))."c"))::text, ((((__type_function__."nested_compound_type")."b"))."d"), (((((__type_function__."nested_compound_type")."b"))."e"))::text, (((((__type_function__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__type_function__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function__."nullable_compound_type")."a"))::text, ((__type_function__."nullable_compound_type")."b"), (((__type_function__."nullable_compound_type")."c"))::text, ((__type_function__."nullable_compound_type")."d"), (((__type_function__."nullable_compound_type")."e"))::text, (((__type_function__."nullable_compound_type")."f"))::text, to_char(((__type_function__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__type_function__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function__."nullable_nested_compound_type")."a"))."b"), (((((__type_function__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function__."nullable_nested_compound_type")."a"))."d"), (((((__type_function__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function__."nullable_nested_compound_type")."b"))."b"), (((((__type_function__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function__."nullable_nested_compound_type")."b"))."d"), (((((__type_function__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __type_function__."point"::text as "30",
  __type_function__."nullablePoint"::text as "31",
  __type_function__."inet"::text as "32",
  __type_function__."cidr"::text as "33",
  __type_function__."macaddr"::text as "34",
  __type_function__."regproc"::text as "35",
  __type_function__."regprocedure"::text as "36",
  __type_function__."regoper"::text as "37",
  __type_function__."regoperator"::text as "38",
  __type_function__."regclass"::text as "39",
  __type_function__."regtype"::text as "40",
  __type_function__."regconfig"::text as "41",
  __type_function__."regdictionary"::text as "42",
  __type_function__."text_array_domain"::text as "43",
  __type_function__."int8_array_domain"::text as "44",
  __type_function__."bytea"::text as "45",
  __type_function__."bytea_array"::text as "46",
  __type_function__."ltree"::text as "47",
  __type_function__."ltree_array"::text as "48"
from "b"."type_function"($1::"int4") as __type_function__;

select
  __type_function_list__."id"::text as "0",
  __type_function_list__."smallint"::text as "1",
  __type_function_list__."bigint"::text as "2",
  __type_function_list__."numeric"::text as "3",
  __type_function_list__."decimal"::text as "4",
  __type_function_list__."boolean"::text as "5",
  __type_function_list__."varchar" as "6",
  __type_function_list__."enum"::text as "7",
  __type_function_list__."enum_array"::text as "8",
  __type_function_list__."domain"::text as "9",
  __type_function_list__."domain2"::text as "10",
  __type_function_list__."text_array"::text as "11",
  __type_function_list__."json"::text as "12",
  __type_function_list__."jsonb"::text as "13",
  __type_function_list__."nullable_range"::text as "14",
  __type_function_list__."numrange"::text as "15",
  json_build_array(
    lower_inc(__type_function_list__."daterange"),
    to_char(lower(__type_function_list__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_list__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_list__."daterange")
  )::text as "16",
  __type_function_list__."an_int_range"::text as "17",
  to_char(__type_function_list__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__type_function_list__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__type_function_list__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __type_function_list__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __type_function_list__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__type_function_list__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_list__."interval_array") __entry__
  )::text as "24",
  __type_function_list__."money"::numeric::text as "25",
  case when (__type_function_list__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function_list__."compound_type")."a"))::text, ((__type_function_list__."compound_type")."b"), (((__type_function_list__."compound_type")."c"))::text, ((__type_function_list__."compound_type")."d"), (((__type_function_list__."compound_type")."e"))::text, (((__type_function_list__."compound_type")."f"))::text, to_char(((__type_function_list__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_list__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__type_function_list__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_list__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_list__."nested_compound_type")."a"))."a"))::text, ((((__type_function_list__."nested_compound_type")."a"))."b"), (((((__type_function_list__."nested_compound_type")."a"))."c"))::text, ((((__type_function_list__."nested_compound_type")."a"))."d"), (((((__type_function_list__."nested_compound_type")."a"))."e"))::text, (((((__type_function_list__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_list__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_list__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_list__."nested_compound_type")."b"))."a"))::text, ((((__type_function_list__."nested_compound_type")."b"))."b"), (((((__type_function_list__."nested_compound_type")."b"))."c"))::text, ((((__type_function_list__."nested_compound_type")."b"))."d"), (((((__type_function_list__."nested_compound_type")."b"))."e"))::text, (((((__type_function_list__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_list__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_list__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__type_function_list__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function_list__."nullable_compound_type")."a"))::text, ((__type_function_list__."nullable_compound_type")."b"), (((__type_function_list__."nullable_compound_type")."c"))::text, ((__type_function_list__."nullable_compound_type")."d"), (((__type_function_list__."nullable_compound_type")."e"))::text, (((__type_function_list__."nullable_compound_type")."f"))::text, to_char(((__type_function_list__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_list__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__type_function_list__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_list__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_list__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_list__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_list__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_list__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_list__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_list__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_list__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_list__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_list__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_list__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_list__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_list__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_list__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_list__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_list__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_list__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_list__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __type_function_list__."point"::text as "30",
  __type_function_list__."nullablePoint"::text as "31",
  __type_function_list__."inet"::text as "32",
  __type_function_list__."cidr"::text as "33",
  __type_function_list__."macaddr"::text as "34",
  __type_function_list__."regproc"::text as "35",
  __type_function_list__."regprocedure"::text as "36",
  __type_function_list__."regoper"::text as "37",
  __type_function_list__."regoperator"::text as "38",
  __type_function_list__."regclass"::text as "39",
  __type_function_list__."regtype"::text as "40",
  __type_function_list__."regconfig"::text as "41",
  __type_function_list__."regdictionary"::text as "42",
  __type_function_list__."text_array_domain"::text as "43",
  __type_function_list__."int8_array_domain"::text as "44",
  __type_function_list__."bytea"::text as "45",
  __type_function_list__."bytea_array"::text as "46",
  __type_function_list__."ltree"::text as "47",
  __type_function_list__."ltree_array"::text as "48"
from unnest("b"."type_function_list"()) as __type_function_list__;

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
  __types__."ltree_array"::text as "48",
  array(
    select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry_2
  )::text as "49"
from "b"."types" as __types__
order by __types__."id" asc;

select
  (count(*))::text as "0"
from "b"."types" as __types__;

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
  case when (__type_function_connection__."compound_type") is not distinct from null then null::text else json_build_array((((__type_function_connection__."compound_type")."a"))::text, ((__type_function_connection__."compound_type")."b"), (((__type_function_connection__."compound_type")."c"))::text, ((__type_function_connection__."compound_type")."d"), (((__type_function_connection__."compound_type")."e"))::text, (((__type_function_connection__."compound_type")."f"))::text, to_char(((__type_function_connection__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_connection__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__type_function_connection__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_connection__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_connection__."nested_compound_type")."a"))."a"))::text, ((((__type_function_connection__."nested_compound_type")."a"))."b"), (((((__type_function_connection__."nested_compound_type")."a"))."c"))::text, ((((__type_function_connection__."nested_compound_type")."a"))."d"), (((((__type_function_connection__."nested_compound_type")."a"))."e"))::text, (((((__type_function_connection__."nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_connection__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_connection__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_connection__."nested_compound_type")."b"))."a"))::text, ((((__type_function_connection__."nested_compound_type")."b"))."b"), (((((__type_function_connection__."nested_compound_type")."b"))."c"))::text, ((((__type_function_connection__."nested_compound_type")."b"))."d"), (((((__type_function_connection__."nested_compound_type")."b"))."e"))::text, (((((__type_function_connection__."nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_connection__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_connection__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__type_function_connection__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__type_function_connection__."nullable_compound_type")."a"))::text, ((__type_function_connection__."nullable_compound_type")."b"), (((__type_function_connection__."nullable_compound_type")."c"))::text, ((__type_function_connection__."nullable_compound_type")."d"), (((__type_function_connection__."nullable_compound_type")."e"))::text, (((__type_function_connection__."nullable_compound_type")."f"))::text, to_char(((__type_function_connection__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__type_function_connection__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__type_function_connection__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__type_function_connection__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__type_function_connection__."nullable_nested_compound_type")."a"))."a"))::text, ((((__type_function_connection__."nullable_nested_compound_type")."a"))."b"), (((((__type_function_connection__."nullable_nested_compound_type")."a"))."c"))::text, ((((__type_function_connection__."nullable_nested_compound_type")."a"))."d"), (((((__type_function_connection__."nullable_nested_compound_type")."a"))."e"))::text, (((((__type_function_connection__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__type_function_connection__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__type_function_connection__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__type_function_connection__."nullable_nested_compound_type")."b"))."a"))::text, ((((__type_function_connection__."nullable_nested_compound_type")."b"))."b"), (((((__type_function_connection__."nullable_nested_compound_type")."b"))."c"))::text, ((((__type_function_connection__."nullable_nested_compound_type")."b"))."d"), (((((__type_function_connection__."nullable_nested_compound_type")."b"))."e"))::text, (((((__type_function_connection__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__type_function_connection__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__type_function_connection__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__type_function_connection__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __type_function_connection__."point"::text as "30",
  __type_function_connection__."nullablePoint"::text as "31",
  __type_function_connection__."inet"::text as "32",
  __type_function_connection__."cidr"::text as "33",
  __type_function_connection__."macaddr"::text as "34",
  __type_function_connection__."regproc"::text as "35",
  __type_function_connection__."regprocedure"::text as "36",
  __type_function_connection__."regoper"::text as "37",
  __type_function_connection__."regoperator"::text as "38",
  __type_function_connection__."regclass"::text as "39",
  __type_function_connection__."regtype"::text as "40",
  __type_function_connection__."regconfig"::text as "41",
  __type_function_connection__."regdictionary"::text as "42",
  __type_function_connection__."text_array_domain"::text as "43",
  __type_function_connection__."int8_array_domain"::text as "44",
  __type_function_connection__."bytea"::text as "45",
  __type_function_connection__."bytea_array"::text as "46",
  __type_function_connection__."ltree"::text as "47",
  __type_function_connection__."ltree_array"::text as "48",
  array(
    select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_connection__."interval_array") __entry_2
  )::text as "49",
  (row_number() over (partition by 1))::text as "50"
from "b"."type_function_connection"() as __type_function_connection__;

select
  (count(*))::text as "0"
from "b"."type_function_connection"() as __type_function_connection__;

select
  __person_type_function__."id"::text as "0",
  __person_type_function__."smallint"::text as "1",
  __person_type_function__."bigint"::text as "2",
  __person_type_function__."numeric"::text as "3",
  __person_type_function__."decimal"::text as "4",
  __person_type_function__."boolean"::text as "5",
  __person_type_function__."varchar" as "6",
  __person_type_function__."enum"::text as "7",
  __person_type_function__."enum_array"::text as "8",
  __person_type_function__."domain"::text as "9",
  __person_type_function__."domain2"::text as "10",
  __person_type_function__."text_array"::text as "11",
  __person_type_function__."json"::text as "12",
  __person_type_function__."jsonb"::text as "13",
  __person_type_function__."nullable_range"::text as "14",
  __person_type_function__."numrange"::text as "15",
  json_build_array(
    lower_inc(__person_type_function__."daterange"),
    to_char(lower(__person_type_function__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__person_type_function__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__person_type_function__."daterange")
  )::text as "16",
  __person_type_function__."an_int_range"::text as "17",
  to_char(__person_type_function__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__person_type_function__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__person_type_function__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __person_type_function__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __person_type_function__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__person_type_function__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__person_type_function__."interval_array") __entry__
  )::text as "24",
  __person_type_function__."money"::numeric::text as "25",
  case when (__person_type_function__."compound_type") is not distinct from null then null::text else json_build_array((((__person_type_function__."compound_type")."a"))::text, ((__person_type_function__."compound_type")."b"), (((__person_type_function__."compound_type")."c"))::text, ((__person_type_function__."compound_type")."d"), (((__person_type_function__."compound_type")."e"))::text, (((__person_type_function__."compound_type")."f"))::text, to_char(((__person_type_function__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_type_function__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__person_type_function__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function__."nested_compound_type")."a"))."a"))::text, ((((__person_type_function__."nested_compound_type")."a"))."b"), (((((__person_type_function__."nested_compound_type")."a"))."c"))::text, ((((__person_type_function__."nested_compound_type")."a"))."d"), (((((__person_type_function__."nested_compound_type")."a"))."e"))::text, (((((__person_type_function__."nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function__."nested_compound_type")."b"))."a"))::text, ((((__person_type_function__."nested_compound_type")."b"))."b"), (((((__person_type_function__."nested_compound_type")."b"))."c"))::text, ((((__person_type_function__."nested_compound_type")."b"))."d"), (((((__person_type_function__."nested_compound_type")."b"))."e"))::text, (((((__person_type_function__."nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__person_type_function__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__person_type_function__."nullable_compound_type")."a"))::text, ((__person_type_function__."nullable_compound_type")."b"), (((__person_type_function__."nullable_compound_type")."c"))::text, ((__person_type_function__."nullable_compound_type")."d"), (((__person_type_function__."nullable_compound_type")."e"))::text, (((__person_type_function__."nullable_compound_type")."f"))::text, to_char(((__person_type_function__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_type_function__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__person_type_function__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function__."nullable_nested_compound_type")."a"))."a"))::text, ((((__person_type_function__."nullable_nested_compound_type")."a"))."b"), (((((__person_type_function__."nullable_nested_compound_type")."a"))."c"))::text, ((((__person_type_function__."nullable_nested_compound_type")."a"))."d"), (((((__person_type_function__."nullable_nested_compound_type")."a"))."e"))::text, (((((__person_type_function__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function__."nullable_nested_compound_type")."b"))."a"))::text, ((((__person_type_function__."nullable_nested_compound_type")."b"))."b"), (((((__person_type_function__."nullable_nested_compound_type")."b"))."c"))::text, ((((__person_type_function__."nullable_nested_compound_type")."b"))."d"), (((((__person_type_function__."nullable_nested_compound_type")."b"))."e"))::text, (((((__person_type_function__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __person_type_function__."point"::text as "30",
  __person_type_function__."nullablePoint"::text as "31",
  __person_type_function__."inet"::text as "32",
  __person_type_function__."cidr"::text as "33",
  __person_type_function__."macaddr"::text as "34",
  __person_type_function__."regproc"::text as "35",
  __person_type_function__."regprocedure"::text as "36",
  __person_type_function__."regoper"::text as "37",
  __person_type_function__."regoperator"::text as "38",
  __person_type_function__."regclass"::text as "39",
  __person_type_function__."regtype"::text as "40",
  __person_type_function__."regconfig"::text as "41",
  __person_type_function__."regdictionary"::text as "42",
  __person_type_function__."text_array_domain"::text as "43",
  __person_type_function__."int8_array_domain"::text as "44",
  __person_type_function__."bytea"::text as "45",
  __person_type_function__."bytea_array"::text as "46",
  __person_type_function__."ltree"::text as "47",
  __person_type_function__."ltree_array"::text as "48"
from "c"."person_type_function"(
  $1::"c"."person",
  $2::"int4"
) as __person_type_function__;

select
  __person_type_function_list__."id"::text as "0",
  __person_type_function_list__."smallint"::text as "1",
  __person_type_function_list__."bigint"::text as "2",
  __person_type_function_list__."numeric"::text as "3",
  __person_type_function_list__."decimal"::text as "4",
  __person_type_function_list__."boolean"::text as "5",
  __person_type_function_list__."varchar" as "6",
  __person_type_function_list__."enum"::text as "7",
  __person_type_function_list__."enum_array"::text as "8",
  __person_type_function_list__."domain"::text as "9",
  __person_type_function_list__."domain2"::text as "10",
  __person_type_function_list__."text_array"::text as "11",
  __person_type_function_list__."json"::text as "12",
  __person_type_function_list__."jsonb"::text as "13",
  __person_type_function_list__."nullable_range"::text as "14",
  __person_type_function_list__."numrange"::text as "15",
  json_build_array(
    lower_inc(__person_type_function_list__."daterange"),
    to_char(lower(__person_type_function_list__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__person_type_function_list__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__person_type_function_list__."daterange")
  )::text as "16",
  __person_type_function_list__."an_int_range"::text as "17",
  to_char(__person_type_function_list__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "18",
  to_char(__person_type_function_list__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "19",
  to_char(__person_type_function_list__."date", 'YYYY-MM-DD'::text) as "20",
  to_char(date '1970-01-01' + __person_type_function_list__."time", 'HH24:MI:SS.US'::text) as "21",
  to_char(date '1970-01-01' + __person_type_function_list__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "22",
  to_char(__person_type_function_list__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "23",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__person_type_function_list__."interval_array") __entry__
  )::text as "24",
  __person_type_function_list__."money"::numeric::text as "25",
  case when (__person_type_function_list__."compound_type") is not distinct from null then null::text else json_build_array((((__person_type_function_list__."compound_type")."a"))::text, ((__person_type_function_list__."compound_type")."b"), (((__person_type_function_list__."compound_type")."c"))::text, ((__person_type_function_list__."compound_type")."d"), (((__person_type_function_list__."compound_type")."e"))::text, (((__person_type_function_list__."compound_type")."f"))::text, to_char(((__person_type_function_list__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_type_function_list__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__person_type_function_list__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function_list__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function_list__."nested_compound_type")."a"))."a"))::text, ((((__person_type_function_list__."nested_compound_type")."a"))."b"), (((((__person_type_function_list__."nested_compound_type")."a"))."c"))::text, ((((__person_type_function_list__."nested_compound_type")."a"))."d"), (((((__person_type_function_list__."nested_compound_type")."a"))."e"))::text, (((((__person_type_function_list__."nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function_list__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_list__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function_list__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function_list__."nested_compound_type")."b"))."a"))::text, ((((__person_type_function_list__."nested_compound_type")."b"))."b"), (((((__person_type_function_list__."nested_compound_type")."b"))."c"))::text, ((((__person_type_function_list__."nested_compound_type")."b"))."d"), (((((__person_type_function_list__."nested_compound_type")."b"))."e"))::text, (((((__person_type_function_list__."nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function_list__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_list__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function_list__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__person_type_function_list__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__person_type_function_list__."nullable_compound_type")."a"))::text, ((__person_type_function_list__."nullable_compound_type")."b"), (((__person_type_function_list__."nullable_compound_type")."c"))::text, ((__person_type_function_list__."nullable_compound_type")."d"), (((__person_type_function_list__."nullable_compound_type")."e"))::text, (((__person_type_function_list__."nullable_compound_type")."f"))::text, to_char(((__person_type_function_list__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_type_function_list__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__person_type_function_list__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function_list__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function_list__."nullable_nested_compound_type")."a"))."a"))::text, ((((__person_type_function_list__."nullable_nested_compound_type")."a"))."b"), (((((__person_type_function_list__."nullable_nested_compound_type")."a"))."c"))::text, ((((__person_type_function_list__."nullable_nested_compound_type")."a"))."d"), (((((__person_type_function_list__."nullable_nested_compound_type")."a"))."e"))::text, (((((__person_type_function_list__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function_list__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_list__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function_list__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function_list__."nullable_nested_compound_type")."b"))."a"))::text, ((((__person_type_function_list__."nullable_nested_compound_type")."b"))."b"), (((((__person_type_function_list__."nullable_nested_compound_type")."b"))."c"))::text, ((((__person_type_function_list__."nullable_nested_compound_type")."b"))."d"), (((((__person_type_function_list__."nullable_nested_compound_type")."b"))."e"))::text, (((((__person_type_function_list__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function_list__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_list__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function_list__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __person_type_function_list__."point"::text as "30",
  __person_type_function_list__."nullablePoint"::text as "31",
  __person_type_function_list__."inet"::text as "32",
  __person_type_function_list__."cidr"::text as "33",
  __person_type_function_list__."macaddr"::text as "34",
  __person_type_function_list__."regproc"::text as "35",
  __person_type_function_list__."regprocedure"::text as "36",
  __person_type_function_list__."regoper"::text as "37",
  __person_type_function_list__."regoperator"::text as "38",
  __person_type_function_list__."regclass"::text as "39",
  __person_type_function_list__."regtype"::text as "40",
  __person_type_function_list__."regconfig"::text as "41",
  __person_type_function_list__."regdictionary"::text as "42",
  __person_type_function_list__."text_array_domain"::text as "43",
  __person_type_function_list__."int8_array_domain"::text as "44",
  __person_type_function_list__."bytea"::text as "45",
  __person_type_function_list__."bytea_array"::text as "46",
  __person_type_function_list__."ltree"::text as "47",
  __person_type_function_list__."ltree_array"::text as "48"
from unnest("c"."person_type_function_list"($1::"c"."person")) as __person_type_function_list__;

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
  case when (__person_type_function_connection__."compound_type") is not distinct from null then null::text else json_build_array((((__person_type_function_connection__."compound_type")."a"))::text, ((__person_type_function_connection__."compound_type")."b"), (((__person_type_function_connection__."compound_type")."c"))::text, ((__person_type_function_connection__."compound_type")."d"), (((__person_type_function_connection__."compound_type")."e"))::text, (((__person_type_function_connection__."compound_type")."f"))::text, to_char(((__person_type_function_connection__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_type_function_connection__."compound_type")."foo_bar"))::text)::text end as "26",
  case when (__person_type_function_connection__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function_connection__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function_connection__."nested_compound_type")."a"))."a"))::text, ((((__person_type_function_connection__."nested_compound_type")."a"))."b"), (((((__person_type_function_connection__."nested_compound_type")."a"))."c"))::text, ((((__person_type_function_connection__."nested_compound_type")."a"))."d"), (((((__person_type_function_connection__."nested_compound_type")."a"))."e"))::text, (((((__person_type_function_connection__."nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function_connection__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_connection__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function_connection__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function_connection__."nested_compound_type")."b"))."a"))::text, ((((__person_type_function_connection__."nested_compound_type")."b"))."b"), (((((__person_type_function_connection__."nested_compound_type")."b"))."c"))::text, ((((__person_type_function_connection__."nested_compound_type")."b"))."d"), (((((__person_type_function_connection__."nested_compound_type")."b"))."e"))::text, (((((__person_type_function_connection__."nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function_connection__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_connection__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function_connection__."nested_compound_type")."baz_buz"))::text)::text end as "27",
  case when (__person_type_function_connection__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__person_type_function_connection__."nullable_compound_type")."a"))::text, ((__person_type_function_connection__."nullable_compound_type")."b"), (((__person_type_function_connection__."nullable_compound_type")."c"))::text, ((__person_type_function_connection__."nullable_compound_type")."d"), (((__person_type_function_connection__."nullable_compound_type")."e"))::text, (((__person_type_function_connection__."nullable_compound_type")."f"))::text, to_char(((__person_type_function_connection__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__person_type_function_connection__."nullable_compound_type")."foo_bar"))::text)::text end as "28",
  case when (__person_type_function_connection__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__person_type_function_connection__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."a"))::text, ((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."b"), (((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."c"))::text, ((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."d"), (((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."e"))::text, (((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_connection__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__person_type_function_connection__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."a"))::text, ((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."b"), (((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."c"))::text, ((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."d"), (((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."e"))::text, (((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__person_type_function_connection__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__person_type_function_connection__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "29",
  __person_type_function_connection__."point"::text as "30",
  __person_type_function_connection__."nullablePoint"::text as "31",
  __person_type_function_connection__."inet"::text as "32",
  __person_type_function_connection__."cidr"::text as "33",
  __person_type_function_connection__."macaddr"::text as "34",
  __person_type_function_connection__."regproc"::text as "35",
  __person_type_function_connection__."regprocedure"::text as "36",
  __person_type_function_connection__."regoper"::text as "37",
  __person_type_function_connection__."regoperator"::text as "38",
  __person_type_function_connection__."regclass"::text as "39",
  __person_type_function_connection__."regtype"::text as "40",
  __person_type_function_connection__."regconfig"::text as "41",
  __person_type_function_connection__."regdictionary"::text as "42",
  __person_type_function_connection__."text_array_domain"::text as "43",
  __person_type_function_connection__."int8_array_domain"::text as "44",
  __person_type_function_connection__."bytea"::text as "45",
  __person_type_function_connection__."bytea_array"::text as "46",
  __person_type_function_connection__."ltree"::text as "47",
  __person_type_function_connection__."ltree_array"::text as "48",
  array(
    select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__person_type_function_connection__."interval_array") __entry_2
  )::text as "49",
  (row_number() over (partition by 1))::text as "50"
from "c"."person_type_function_connection"($1::"c"."person") as __person_type_function_connection__;

select
  (count(*))::text as "0"
from "c"."person_type_function_connection"($1::"c"."person") as __person_type_function_connection__;

select
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
  __types__."ltree_array"::text as "48",
  array(
    select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry_2
  )::text as "49"
from "b"."types" as __types__
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