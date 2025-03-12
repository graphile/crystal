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
  __types__."point"::text as "26",
  __types__."nullablePoint"::text as "27",
  __types__."inet"::text as "28",
  __types__."cidr"::text as "29",
  __types__."macaddr"::text as "30",
  __types__."regproc"::text as "31",
  __types__."regprocedure"::text as "32",
  __types__."regoper"::text as "33",
  __types__."regoperator"::text as "34",
  __types__."regclass"::text as "35",
  __types__."regtype"::text as "36",
  __types__."regconfig"::text as "37",
  __types__."regdictionary"::text as "38",
  __types__."text_array_domain"::text as "39",
  __types__."int8_array_domain"::text as "40",
  __types__."bytea"::text as "41",
  __types__."bytea_array"::text as "42",
  __types__."ltree"::text as "43",
  __types__."ltree_array"::text as "44",
  __post__."id"::text as "45",
  __post__."headline" as "46",
  __post_2."id"::text as "47",
  __post_2."headline" as "48",
  __frmcdc_compound_type__."a"::text as "49",
  __frmcdc_compound_type__."b" as "50",
  __frmcdc_compound_type__."c"::text as "51",
  __frmcdc_compound_type__."d" as "52",
  __frmcdc_compound_type__."e"::text as "53",
  __frmcdc_compound_type__."f"::text as "54",
  __frmcdc_compound_type__."foo_bar"::text as "55",
  (not (__frmcdc_compound_type__ is null))::text as "56",
  __frmcdc_nested_compound_type__."baz_buz"::text as "57",
  (not (__frmcdc_nested_compound_type__ is null))::text as "58",
  __frmcdc_compound_type_2."a"::text as "59",
  __frmcdc_compound_type_2."b" as "60",
  __frmcdc_compound_type_2."c"::text as "61",
  __frmcdc_compound_type_2."d" as "62",
  __frmcdc_compound_type_2."e"::text as "63",
  __frmcdc_compound_type_2."f"::text as "64",
  __frmcdc_compound_type_2."foo_bar"::text as "65",
  (not (__frmcdc_compound_type_2 is null))::text as "66",
  __frmcdc_compound_type_3."a"::text as "67",
  __frmcdc_compound_type_3."b" as "68",
  __frmcdc_compound_type_3."c"::text as "69",
  __frmcdc_compound_type_3."d" as "70",
  __frmcdc_compound_type_3."e"::text as "71",
  __frmcdc_compound_type_3."f"::text as "72",
  __frmcdc_compound_type_3."foo_bar"::text as "73",
  (not (__frmcdc_compound_type_3 is null))::text as "74",
  __frmcdc_compound_type_4."a"::text as "75",
  __frmcdc_compound_type_4."b" as "76",
  __frmcdc_compound_type_4."c"::text as "77",
  __frmcdc_compound_type_4."d" as "78",
  __frmcdc_compound_type_4."e"::text as "79",
  __frmcdc_compound_type_4."f"::text as "80",
  __frmcdc_compound_type_4."foo_bar"::text as "81",
  (not (__frmcdc_compound_type_4 is null))::text as "82",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "83",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "84",
  __frmcdc_compound_type_5."a"::text as "85",
  __frmcdc_compound_type_5."b" as "86",
  __frmcdc_compound_type_5."c"::text as "87",
  __frmcdc_compound_type_5."d" as "88",
  __frmcdc_compound_type_5."e"::text as "89",
  __frmcdc_compound_type_5."f"::text as "90",
  __frmcdc_compound_type_5."foo_bar"::text as "91",
  (not (__frmcdc_compound_type_5 is null))::text as "92",
  __frmcdc_compound_type_6."a"::text as "93",
  __frmcdc_compound_type_6."b" as "94",
  __frmcdc_compound_type_6."c"::text as "95",
  __frmcdc_compound_type_6."d" as "96",
  __frmcdc_compound_type_6."e"::text as "97",
  __frmcdc_compound_type_6."f"::text as "98",
  __frmcdc_compound_type_6."foo_bar"::text as "99",
  (not (__frmcdc_compound_type_6 is null))::text as "100"
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
left outer join lateral (select (__types__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__types__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE
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
  __types__."point"::text as "26",
  __types__."nullablePoint"::text as "27",
  __types__."inet"::text as "28",
  __types__."cidr"::text as "29",
  __types__."macaddr"::text as "30",
  __types__."regproc"::text as "31",
  __types__."regprocedure"::text as "32",
  __types__."regoper"::text as "33",
  __types__."regoperator"::text as "34",
  __types__."regclass"::text as "35",
  __types__."regtype"::text as "36",
  __types__."regconfig"::text as "37",
  __types__."regdictionary"::text as "38",
  __types__."text_array_domain"::text as "39",
  __types__."int8_array_domain"::text as "40",
  __types__."bytea"::text as "41",
  __types__."bytea_array"::text as "42",
  __types__."ltree"::text as "43",
  __types__."ltree_array"::text as "44",
  __post__."id"::text as "45",
  __post__."headline" as "46",
  __post_2."id"::text as "47",
  __post_2."headline" as "48",
  __frmcdc_compound_type__."a"::text as "49",
  __frmcdc_compound_type__."b" as "50",
  __frmcdc_compound_type__."c"::text as "51",
  __frmcdc_compound_type__."d" as "52",
  __frmcdc_compound_type__."e"::text as "53",
  __frmcdc_compound_type__."f"::text as "54",
  __frmcdc_compound_type__."foo_bar"::text as "55",
  (not (__frmcdc_compound_type__ is null))::text as "56",
  __frmcdc_nested_compound_type__."baz_buz"::text as "57",
  (not (__frmcdc_nested_compound_type__ is null))::text as "58",
  __frmcdc_compound_type_2."a"::text as "59",
  __frmcdc_compound_type_2."b" as "60",
  __frmcdc_compound_type_2."c"::text as "61",
  __frmcdc_compound_type_2."d" as "62",
  __frmcdc_compound_type_2."e"::text as "63",
  __frmcdc_compound_type_2."f"::text as "64",
  __frmcdc_compound_type_2."foo_bar"::text as "65",
  (not (__frmcdc_compound_type_2 is null))::text as "66",
  __frmcdc_compound_type_3."a"::text as "67",
  __frmcdc_compound_type_3."b" as "68",
  __frmcdc_compound_type_3."c"::text as "69",
  __frmcdc_compound_type_3."d" as "70",
  __frmcdc_compound_type_3."e"::text as "71",
  __frmcdc_compound_type_3."f"::text as "72",
  __frmcdc_compound_type_3."foo_bar"::text as "73",
  (not (__frmcdc_compound_type_3 is null))::text as "74",
  __frmcdc_compound_type_4."a"::text as "75",
  __frmcdc_compound_type_4."b" as "76",
  __frmcdc_compound_type_4."c"::text as "77",
  __frmcdc_compound_type_4."d" as "78",
  __frmcdc_compound_type_4."e"::text as "79",
  __frmcdc_compound_type_4."f"::text as "80",
  __frmcdc_compound_type_4."foo_bar"::text as "81",
  (not (__frmcdc_compound_type_4 is null))::text as "82",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "83",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "84",
  __frmcdc_compound_type_5."a"::text as "85",
  __frmcdc_compound_type_5."b" as "86",
  __frmcdc_compound_type_5."c"::text as "87",
  __frmcdc_compound_type_5."d" as "88",
  __frmcdc_compound_type_5."e"::text as "89",
  __frmcdc_compound_type_5."f"::text as "90",
  __frmcdc_compound_type_5."foo_bar"::text as "91",
  (not (__frmcdc_compound_type_5 is null))::text as "92",
  __frmcdc_compound_type_6."a"::text as "93",
  __frmcdc_compound_type_6."b" as "94",
  __frmcdc_compound_type_6."c"::text as "95",
  __frmcdc_compound_type_6."d" as "96",
  __frmcdc_compound_type_6."e"::text as "97",
  __frmcdc_compound_type_6."f"::text as "98",
  __frmcdc_compound_type_6."foo_bar"::text as "99",
  (not (__frmcdc_compound_type_6 is null))::text as "100"
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
left outer join lateral (select (__types__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__types__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE
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
  __type_function__."point"::text as "26",
  __type_function__."nullablePoint"::text as "27",
  __type_function__."inet"::text as "28",
  __type_function__."cidr"::text as "29",
  __type_function__."macaddr"::text as "30",
  __type_function__."regproc"::text as "31",
  __type_function__."regprocedure"::text as "32",
  __type_function__."regoper"::text as "33",
  __type_function__."regoperator"::text as "34",
  __type_function__."regclass"::text as "35",
  __type_function__."regtype"::text as "36",
  __type_function__."regconfig"::text as "37",
  __type_function__."regdictionary"::text as "38",
  __type_function__."text_array_domain"::text as "39",
  __type_function__."int8_array_domain"::text as "40",
  __type_function__."bytea"::text as "41",
  __type_function__."bytea_array"::text as "42",
  __type_function__."ltree"::text as "43",
  __type_function__."ltree_array"::text as "44",
  __post__."id"::text as "45",
  __post__."headline" as "46",
  __post_2."id"::text as "47",
  __post_2."headline" as "48",
  __frmcdc_compound_type__."a"::text as "49",
  __frmcdc_compound_type__."b" as "50",
  __frmcdc_compound_type__."c"::text as "51",
  __frmcdc_compound_type__."d" as "52",
  __frmcdc_compound_type__."e"::text as "53",
  __frmcdc_compound_type__."f"::text as "54",
  __frmcdc_compound_type__."foo_bar"::text as "55",
  (not (__frmcdc_compound_type__ is null))::text as "56",
  __frmcdc_nested_compound_type__."baz_buz"::text as "57",
  (not (__frmcdc_nested_compound_type__ is null))::text as "58",
  __frmcdc_compound_type_2."a"::text as "59",
  __frmcdc_compound_type_2."b" as "60",
  __frmcdc_compound_type_2."c"::text as "61",
  __frmcdc_compound_type_2."d" as "62",
  __frmcdc_compound_type_2."e"::text as "63",
  __frmcdc_compound_type_2."f"::text as "64",
  __frmcdc_compound_type_2."foo_bar"::text as "65",
  (not (__frmcdc_compound_type_2 is null))::text as "66",
  __frmcdc_compound_type_3."a"::text as "67",
  __frmcdc_compound_type_3."b" as "68",
  __frmcdc_compound_type_3."c"::text as "69",
  __frmcdc_compound_type_3."d" as "70",
  __frmcdc_compound_type_3."e"::text as "71",
  __frmcdc_compound_type_3."f"::text as "72",
  __frmcdc_compound_type_3."foo_bar"::text as "73",
  (not (__frmcdc_compound_type_3 is null))::text as "74",
  __frmcdc_compound_type_4."a"::text as "75",
  __frmcdc_compound_type_4."b" as "76",
  __frmcdc_compound_type_4."c"::text as "77",
  __frmcdc_compound_type_4."d" as "78",
  __frmcdc_compound_type_4."e"::text as "79",
  __frmcdc_compound_type_4."f"::text as "80",
  __frmcdc_compound_type_4."foo_bar"::text as "81",
  (not (__frmcdc_compound_type_4 is null))::text as "82",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "83",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "84",
  __frmcdc_compound_type_5."a"::text as "85",
  __frmcdc_compound_type_5."b" as "86",
  __frmcdc_compound_type_5."c"::text as "87",
  __frmcdc_compound_type_5."d" as "88",
  __frmcdc_compound_type_5."e"::text as "89",
  __frmcdc_compound_type_5."f"::text as "90",
  __frmcdc_compound_type_5."foo_bar"::text as "91",
  (not (__frmcdc_compound_type_5 is null))::text as "92",
  __frmcdc_compound_type_6."a"::text as "93",
  __frmcdc_compound_type_6."b" as "94",
  __frmcdc_compound_type_6."c"::text as "95",
  __frmcdc_compound_type_6."d" as "96",
  __frmcdc_compound_type_6."e"::text as "97",
  __frmcdc_compound_type_6."f"::text as "98",
  __frmcdc_compound_type_6."foo_bar"::text as "99",
  (not (__frmcdc_compound_type_6 is null))::text as "100"
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
))
left outer join lateral (select (__type_function__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__type_function__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__type_function__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__type_function__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE;

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
  __type_function_list__."point"::text as "26",
  __type_function_list__."nullablePoint"::text as "27",
  __type_function_list__."inet"::text as "28",
  __type_function_list__."cidr"::text as "29",
  __type_function_list__."macaddr"::text as "30",
  __type_function_list__."regproc"::text as "31",
  __type_function_list__."regprocedure"::text as "32",
  __type_function_list__."regoper"::text as "33",
  __type_function_list__."regoperator"::text as "34",
  __type_function_list__."regclass"::text as "35",
  __type_function_list__."regtype"::text as "36",
  __type_function_list__."regconfig"::text as "37",
  __type_function_list__."regdictionary"::text as "38",
  __type_function_list__."text_array_domain"::text as "39",
  __type_function_list__."int8_array_domain"::text as "40",
  __type_function_list__."bytea"::text as "41",
  __type_function_list__."bytea_array"::text as "42",
  __type_function_list__."ltree"::text as "43",
  __type_function_list__."ltree_array"::text as "44",
  __post__."id"::text as "45",
  __post__."headline" as "46",
  __post_2."id"::text as "47",
  __post_2."headline" as "48",
  __frmcdc_compound_type__."a"::text as "49",
  __frmcdc_compound_type__."b" as "50",
  __frmcdc_compound_type__."c"::text as "51",
  __frmcdc_compound_type__."d" as "52",
  __frmcdc_compound_type__."e"::text as "53",
  __frmcdc_compound_type__."f"::text as "54",
  __frmcdc_compound_type__."foo_bar"::text as "55",
  (not (__frmcdc_compound_type__ is null))::text as "56",
  __frmcdc_nested_compound_type__."baz_buz"::text as "57",
  (not (__frmcdc_nested_compound_type__ is null))::text as "58",
  __frmcdc_compound_type_2."a"::text as "59",
  __frmcdc_compound_type_2."b" as "60",
  __frmcdc_compound_type_2."c"::text as "61",
  __frmcdc_compound_type_2."d" as "62",
  __frmcdc_compound_type_2."e"::text as "63",
  __frmcdc_compound_type_2."f"::text as "64",
  __frmcdc_compound_type_2."foo_bar"::text as "65",
  (not (__frmcdc_compound_type_2 is null))::text as "66",
  __frmcdc_compound_type_3."a"::text as "67",
  __frmcdc_compound_type_3."b" as "68",
  __frmcdc_compound_type_3."c"::text as "69",
  __frmcdc_compound_type_3."d" as "70",
  __frmcdc_compound_type_3."e"::text as "71",
  __frmcdc_compound_type_3."f"::text as "72",
  __frmcdc_compound_type_3."foo_bar"::text as "73",
  (not (__frmcdc_compound_type_3 is null))::text as "74",
  __frmcdc_compound_type_4."a"::text as "75",
  __frmcdc_compound_type_4."b" as "76",
  __frmcdc_compound_type_4."c"::text as "77",
  __frmcdc_compound_type_4."d" as "78",
  __frmcdc_compound_type_4."e"::text as "79",
  __frmcdc_compound_type_4."f"::text as "80",
  __frmcdc_compound_type_4."foo_bar"::text as "81",
  (not (__frmcdc_compound_type_4 is null))::text as "82",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "83",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "84",
  __frmcdc_compound_type_5."a"::text as "85",
  __frmcdc_compound_type_5."b" as "86",
  __frmcdc_compound_type_5."c"::text as "87",
  __frmcdc_compound_type_5."d" as "88",
  __frmcdc_compound_type_5."e"::text as "89",
  __frmcdc_compound_type_5."f"::text as "90",
  __frmcdc_compound_type_5."foo_bar"::text as "91",
  (not (__frmcdc_compound_type_5 is null))::text as "92",
  __frmcdc_compound_type_6."a"::text as "93",
  __frmcdc_compound_type_6."b" as "94",
  __frmcdc_compound_type_6."c"::text as "95",
  __frmcdc_compound_type_6."d" as "96",
  __frmcdc_compound_type_6."e"::text as "97",
  __frmcdc_compound_type_6."f"::text as "98",
  __frmcdc_compound_type_6."foo_bar"::text as "99",
  (not (__frmcdc_compound_type_6 is null))::text as "100"
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
left outer join lateral (select (__type_function_list__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__type_function_list__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__type_function_list__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE;

select
  __person__."id"::text as "0",
  __person_type_function__."id"::text as "1",
  __person_type_function__."smallint"::text as "2",
  __person_type_function__."bigint"::text as "3",
  __person_type_function__."numeric"::text as "4",
  __person_type_function__."decimal"::text as "5",
  __person_type_function__."boolean"::text as "6",
  __person_type_function__."varchar" as "7",
  __person_type_function__."enum"::text as "8",
  __person_type_function__."enum_array"::text as "9",
  __person_type_function__."domain"::text as "10",
  __person_type_function__."domain2"::text as "11",
  __person_type_function__."text_array"::text as "12",
  __person_type_function__."json"::text as "13",
  __person_type_function__."jsonb"::text as "14",
  __person_type_function__."nullable_range"::text as "15",
  __person_type_function__."numrange"::text as "16",
  json_build_array(
    lower_inc(__person_type_function__."daterange"),
    to_char(lower(__person_type_function__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__person_type_function__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__person_type_function__."daterange")
  )::text as "17",
  __person_type_function__."an_int_range"::text as "18",
  to_char(__person_type_function__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "19",
  to_char(__person_type_function__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "20",
  to_char(__person_type_function__."date", 'YYYY-MM-DD'::text) as "21",
  to_char(date '1970-01-01' + __person_type_function__."time", 'HH24:MI:SS.US'::text) as "22",
  to_char(date '1970-01-01' + __person_type_function__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__person_type_function__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "24",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__person_type_function__."interval_array") __entry__
  )::text as "25",
  __person_type_function__."money"::numeric::text as "26",
  __person_type_function__."point"::text as "27",
  __person_type_function__."nullablePoint"::text as "28",
  __person_type_function__."inet"::text as "29",
  __person_type_function__."cidr"::text as "30",
  __person_type_function__."macaddr"::text as "31",
  __person_type_function__."regproc"::text as "32",
  __person_type_function__."regprocedure"::text as "33",
  __person_type_function__."regoper"::text as "34",
  __person_type_function__."regoperator"::text as "35",
  __person_type_function__."regclass"::text as "36",
  __person_type_function__."regtype"::text as "37",
  __person_type_function__."regconfig"::text as "38",
  __person_type_function__."regdictionary"::text as "39",
  __person_type_function__."text_array_domain"::text as "40",
  __person_type_function__."int8_array_domain"::text as "41",
  __person_type_function__."bytea"::text as "42",
  __person_type_function__."bytea_array"::text as "43",
  __person_type_function__."ltree"::text as "44",
  __person_type_function__."ltree_array"::text as "45",
  __post__."id"::text as "46",
  __post__."headline" as "47",
  __post_2."id"::text as "48",
  __post_2."headline" as "49",
  __frmcdc_compound_type__."a"::text as "50",
  __frmcdc_compound_type__."b" as "51",
  __frmcdc_compound_type__."c"::text as "52",
  __frmcdc_compound_type__."d" as "53",
  __frmcdc_compound_type__."e"::text as "54",
  __frmcdc_compound_type__."f"::text as "55",
  __frmcdc_compound_type__."foo_bar"::text as "56",
  (not (__frmcdc_compound_type__ is null))::text as "57",
  __frmcdc_nested_compound_type__."baz_buz"::text as "58",
  (not (__frmcdc_nested_compound_type__ is null))::text as "59",
  __frmcdc_compound_type_2."a"::text as "60",
  __frmcdc_compound_type_2."b" as "61",
  __frmcdc_compound_type_2."c"::text as "62",
  __frmcdc_compound_type_2."d" as "63",
  __frmcdc_compound_type_2."e"::text as "64",
  __frmcdc_compound_type_2."f"::text as "65",
  __frmcdc_compound_type_2."foo_bar"::text as "66",
  (not (__frmcdc_compound_type_2 is null))::text as "67",
  __frmcdc_compound_type_3."a"::text as "68",
  __frmcdc_compound_type_3."b" as "69",
  __frmcdc_compound_type_3."c"::text as "70",
  __frmcdc_compound_type_3."d" as "71",
  __frmcdc_compound_type_3."e"::text as "72",
  __frmcdc_compound_type_3."f"::text as "73",
  __frmcdc_compound_type_3."foo_bar"::text as "74",
  (not (__frmcdc_compound_type_3 is null))::text as "75",
  __frmcdc_compound_type_4."a"::text as "76",
  __frmcdc_compound_type_4."b" as "77",
  __frmcdc_compound_type_4."c"::text as "78",
  __frmcdc_compound_type_4."d" as "79",
  __frmcdc_compound_type_4."e"::text as "80",
  __frmcdc_compound_type_4."f"::text as "81",
  __frmcdc_compound_type_4."foo_bar"::text as "82",
  (not (__frmcdc_compound_type_4 is null))::text as "83",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "84",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "85",
  __frmcdc_compound_type_5."a"::text as "86",
  __frmcdc_compound_type_5."b" as "87",
  __frmcdc_compound_type_5."c"::text as "88",
  __frmcdc_compound_type_5."d" as "89",
  __frmcdc_compound_type_5."e"::text as "90",
  __frmcdc_compound_type_5."f"::text as "91",
  __frmcdc_compound_type_5."foo_bar"::text as "92",
  (not (__frmcdc_compound_type_5 is null))::text as "93",
  __frmcdc_compound_type_6."a"::text as "94",
  __frmcdc_compound_type_6."b" as "95",
  __frmcdc_compound_type_6."c"::text as "96",
  __frmcdc_compound_type_6."d" as "97",
  __frmcdc_compound_type_6."e"::text as "98",
  __frmcdc_compound_type_6."f"::text as "99",
  __frmcdc_compound_type_6."foo_bar"::text as "100",
  (not (__frmcdc_compound_type_6 is null))::text as "101",
  array(
    select array[
      __person_type_function_list__."id"::text,
      __person_type_function_list__."smallint"::text,
      __person_type_function_list__."bigint"::text,
      __person_type_function_list__."numeric"::text,
      __person_type_function_list__."decimal"::text,
      __person_type_function_list__."boolean"::text,
      __person_type_function_list__."varchar",
      __person_type_function_list__."enum"::text,
      __person_type_function_list__."enum_array"::text,
      __person_type_function_list__."domain"::text,
      __person_type_function_list__."domain2"::text,
      __person_type_function_list__."text_array"::text,
      __person_type_function_list__."json"::text,
      __person_type_function_list__."jsonb"::text,
      __person_type_function_list__."nullable_range"::text,
      __person_type_function_list__."numrange"::text,
      json_build_array(
        lower_inc(__person_type_function_list__."daterange"),
        to_char(lower(__person_type_function_list__."daterange"), 'YYYY-MM-DD'::text),
        to_char(upper(__person_type_function_list__."daterange"), 'YYYY-MM-DD'::text),
        upper_inc(__person_type_function_list__."daterange")
      )::text,
      __person_type_function_list__."an_int_range"::text,
      to_char(__person_type_function_list__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
      to_char(__person_type_function_list__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      to_char(__person_type_function_list__."date", 'YYYY-MM-DD'::text),
      to_char(date '1970-01-01' + __person_type_function_list__."time", 'HH24:MI:SS.US'::text),
      to_char(date '1970-01-01' + __person_type_function_list__."timetz", 'HH24:MI:SS.USTZH:TZM'::text),
      to_char(__person_type_function_list__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text),
      array(
        select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        from unnest(__person_type_function_list__."interval_array") __entry_2
      )::text,
      __person_type_function_list__."money"::numeric::text,
      __person_type_function_list__."point"::text,
      __person_type_function_list__."nullablePoint"::text,
      __person_type_function_list__."inet"::text,
      __person_type_function_list__."cidr"::text,
      __person_type_function_list__."macaddr"::text,
      __person_type_function_list__."regproc"::text,
      __person_type_function_list__."regprocedure"::text,
      __person_type_function_list__."regoper"::text,
      __person_type_function_list__."regoperator"::text,
      __person_type_function_list__."regclass"::text,
      __person_type_function_list__."regtype"::text,
      __person_type_function_list__."regconfig"::text,
      __person_type_function_list__."regdictionary"::text,
      __person_type_function_list__."text_array_domain"::text,
      __person_type_function_list__."int8_array_domain"::text,
      __person_type_function_list__."bytea"::text,
      __person_type_function_list__."bytea_array"::text,
      __person_type_function_list__."ltree"::text,
      __person_type_function_list__."ltree_array"::text,
      __post_3."id"::text,
      __post_3."headline",
      __post_4."id"::text,
      __post_4."headline",
      __frmcdc_compound_type_7."a"::text,
      __frmcdc_compound_type_7."b",
      __frmcdc_compound_type_7."c"::text,
      __frmcdc_compound_type_7."d",
      __frmcdc_compound_type_7."e"::text,
      __frmcdc_compound_type_7."f"::text,
      __frmcdc_compound_type_7."foo_bar"::text,
      (not (__frmcdc_compound_type_7 is null))::text,
      __frmcdc_nested_compound_type_3."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_3 is null))::text,
      __frmcdc_compound_type_8."a"::text,
      __frmcdc_compound_type_8."b",
      __frmcdc_compound_type_8."c"::text,
      __frmcdc_compound_type_8."d",
      __frmcdc_compound_type_8."e"::text,
      __frmcdc_compound_type_8."f"::text,
      __frmcdc_compound_type_8."foo_bar"::text,
      (not (__frmcdc_compound_type_8 is null))::text,
      __frmcdc_compound_type_9."a"::text,
      __frmcdc_compound_type_9."b",
      __frmcdc_compound_type_9."c"::text,
      __frmcdc_compound_type_9."d",
      __frmcdc_compound_type_9."e"::text,
      __frmcdc_compound_type_9."f"::text,
      __frmcdc_compound_type_9."foo_bar"::text,
      (not (__frmcdc_compound_type_9 is null))::text,
      __frmcdc_compound_type_10."a"::text,
      __frmcdc_compound_type_10."b",
      __frmcdc_compound_type_10."c"::text,
      __frmcdc_compound_type_10."d",
      __frmcdc_compound_type_10."e"::text,
      __frmcdc_compound_type_10."f"::text,
      __frmcdc_compound_type_10."foo_bar"::text,
      (not (__frmcdc_compound_type_10 is null))::text,
      __frmcdc_nested_compound_type_4."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_4 is null))::text,
      __frmcdc_compound_type_11."a"::text,
      __frmcdc_compound_type_11."b",
      __frmcdc_compound_type_11."c"::text,
      __frmcdc_compound_type_11."d",
      __frmcdc_compound_type_11."e"::text,
      __frmcdc_compound_type_11."f"::text,
      __frmcdc_compound_type_11."foo_bar"::text,
      (not (__frmcdc_compound_type_11 is null))::text,
      __frmcdc_compound_type_12."a"::text,
      __frmcdc_compound_type_12."b",
      __frmcdc_compound_type_12."c"::text,
      __frmcdc_compound_type_12."d",
      __frmcdc_compound_type_12."e"::text,
      __frmcdc_compound_type_12."f"::text,
      __frmcdc_compound_type_12."foo_bar"::text,
      (not (__frmcdc_compound_type_12 is null))::text
    ]::text[]
    from unnest("c"."person_type_function_list"(__person__)) as __person_type_function_list__
    left outer join "a"."post" as __post_3
    on (
    /* WHERE becoming ON */ (
      __post_3."id" = __person_type_function_list__."id"
    ))
    left outer join "a"."post" as __post_4
    on (
    /* WHERE becoming ON */ (
      __post_4."id" = __person_type_function_list__."smallint"
    ))
    left outer join lateral (select (__person_type_function_list__."compound_type").*) as __frmcdc_compound_type_7
    on TRUE
    left outer join lateral (select (__person_type_function_list__."nested_compound_type").*) as __frmcdc_nested_compound_type_3
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_3."a").*) as __frmcdc_compound_type_8
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_3."b").*) as __frmcdc_compound_type_9
    on TRUE
    left outer join lateral (select (__person_type_function_list__."nullable_compound_type").*) as __frmcdc_compound_type_10
    on TRUE
    left outer join lateral (select (__person_type_function_list__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_4
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_4."a").*) as __frmcdc_compound_type_11
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_4."b").*) as __frmcdc_compound_type_12
    on TRUE
  )::text as "102",
  array(
    select array[
      __person_type_function_connection__."id"::text,
      __person_type_function_connection__."smallint"::text,
      __person_type_function_connection__."bigint"::text,
      __person_type_function_connection__."numeric"::text,
      __person_type_function_connection__."decimal"::text,
      __person_type_function_connection__."boolean"::text,
      __person_type_function_connection__."varchar",
      __person_type_function_connection__."enum"::text,
      __person_type_function_connection__."enum_array"::text,
      __person_type_function_connection__."domain"::text,
      __person_type_function_connection__."domain2"::text,
      __person_type_function_connection__."text_array"::text,
      __person_type_function_connection__."json"::text,
      __person_type_function_connection__."jsonb"::text,
      __person_type_function_connection__."nullable_range"::text,
      __person_type_function_connection__."numrange"::text,
      json_build_array(
        lower_inc(__person_type_function_connection__."daterange"),
        to_char(lower(__person_type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
        to_char(upper(__person_type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
        upper_inc(__person_type_function_connection__."daterange")
      )::text,
      __person_type_function_connection__."an_int_range"::text,
      to_char(__person_type_function_connection__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
      to_char(__person_type_function_connection__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      to_char(__person_type_function_connection__."date", 'YYYY-MM-DD'::text),
      to_char(date '1970-01-01' + __person_type_function_connection__."time", 'HH24:MI:SS.US'::text),
      to_char(date '1970-01-01' + __person_type_function_connection__."timetz", 'HH24:MI:SS.USTZH:TZM'::text),
      to_char(__person_type_function_connection__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text),
      array(
        select to_char(__entry_3, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        from unnest(__person_type_function_connection__."interval_array") __entry_3
      )::text,
      __person_type_function_connection__."money"::numeric::text,
      __person_type_function_connection__."point"::text,
      __person_type_function_connection__."nullablePoint"::text,
      __person_type_function_connection__."inet"::text,
      __person_type_function_connection__."cidr"::text,
      __person_type_function_connection__."macaddr"::text,
      __person_type_function_connection__."regproc"::text,
      __person_type_function_connection__."regprocedure"::text,
      __person_type_function_connection__."regoper"::text,
      __person_type_function_connection__."regoperator"::text,
      __person_type_function_connection__."regclass"::text,
      __person_type_function_connection__."regtype"::text,
      __person_type_function_connection__."regconfig"::text,
      __person_type_function_connection__."regdictionary"::text,
      __person_type_function_connection__."text_array_domain"::text,
      __person_type_function_connection__."int8_array_domain"::text,
      __person_type_function_connection__."bytea"::text,
      __person_type_function_connection__."bytea_array"::text,
      __person_type_function_connection__."ltree"::text,
      __person_type_function_connection__."ltree_array"::text,
      array(
        select to_char(__entry_4, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        from unnest(__person_type_function_connection__."interval_array") __entry_4
      )::text,
      __frmcdc_compound_type_13."a"::text,
      __frmcdc_compound_type_13."b",
      __frmcdc_compound_type_13."c"::text,
      __frmcdc_compound_type_13."d",
      __frmcdc_compound_type_13."e"::text,
      __frmcdc_compound_type_13."f"::text,
      __frmcdc_compound_type_13."foo_bar"::text,
      (not (__frmcdc_compound_type_13 is null))::text,
      __frmcdc_nested_compound_type_5."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_5 is null))::text,
      __frmcdc_compound_type_14."a"::text,
      __frmcdc_compound_type_14."b",
      __frmcdc_compound_type_14."c"::text,
      __frmcdc_compound_type_14."d",
      __frmcdc_compound_type_14."e"::text,
      __frmcdc_compound_type_14."f"::text,
      __frmcdc_compound_type_14."foo_bar"::text,
      (not (__frmcdc_compound_type_14 is null))::text,
      __frmcdc_compound_type_15."a"::text,
      __frmcdc_compound_type_15."b",
      __frmcdc_compound_type_15."c"::text,
      __frmcdc_compound_type_15."d",
      __frmcdc_compound_type_15."e"::text,
      __frmcdc_compound_type_15."f"::text,
      __frmcdc_compound_type_15."foo_bar"::text,
      (not (__frmcdc_compound_type_15 is null))::text,
      __frmcdc_compound_type_16."a"::text,
      __frmcdc_compound_type_16."b",
      __frmcdc_compound_type_16."c"::text,
      __frmcdc_compound_type_16."d",
      __frmcdc_compound_type_16."e"::text,
      __frmcdc_compound_type_16."f"::text,
      __frmcdc_compound_type_16."foo_bar"::text,
      (not (__frmcdc_compound_type_16 is null))::text,
      __frmcdc_nested_compound_type_6."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_6 is null))::text,
      __frmcdc_compound_type_17."a"::text,
      __frmcdc_compound_type_17."b",
      __frmcdc_compound_type_17."c"::text,
      __frmcdc_compound_type_17."d",
      __frmcdc_compound_type_17."e"::text,
      __frmcdc_compound_type_17."f"::text,
      __frmcdc_compound_type_17."foo_bar"::text,
      (not (__frmcdc_compound_type_17 is null))::text,
      __frmcdc_compound_type_18."a"::text,
      __frmcdc_compound_type_18."b",
      __frmcdc_compound_type_18."c"::text,
      __frmcdc_compound_type_18."d",
      __frmcdc_compound_type_18."e"::text,
      __frmcdc_compound_type_18."f"::text,
      __frmcdc_compound_type_18."foo_bar"::text,
      (not (__frmcdc_compound_type_18 is null))::text,
      __frmcdc_compound_type_19."a"::text,
      __frmcdc_compound_type_19."b",
      __frmcdc_compound_type_19."c"::text,
      __frmcdc_compound_type_19."d",
      __frmcdc_compound_type_19."e"::text,
      __frmcdc_compound_type_19."f"::text,
      __frmcdc_compound_type_19."foo_bar"::text,
      (not (__frmcdc_compound_type_19 is null))::text,
      __frmcdc_nested_compound_type_7."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_7 is null))::text,
      __frmcdc_compound_type_20."a"::text,
      __frmcdc_compound_type_20."b",
      __frmcdc_compound_type_20."c"::text,
      __frmcdc_compound_type_20."d",
      __frmcdc_compound_type_20."e"::text,
      __frmcdc_compound_type_20."f"::text,
      __frmcdc_compound_type_20."foo_bar"::text,
      (not (__frmcdc_compound_type_20 is null))::text,
      __frmcdc_compound_type_21."a"::text,
      __frmcdc_compound_type_21."b",
      __frmcdc_compound_type_21."c"::text,
      __frmcdc_compound_type_21."d",
      __frmcdc_compound_type_21."e"::text,
      __frmcdc_compound_type_21."f"::text,
      __frmcdc_compound_type_21."foo_bar"::text,
      (not (__frmcdc_compound_type_21 is null))::text,
      __frmcdc_compound_type_22."a"::text,
      __frmcdc_compound_type_22."b",
      __frmcdc_compound_type_22."c"::text,
      __frmcdc_compound_type_22."d",
      __frmcdc_compound_type_22."e"::text,
      __frmcdc_compound_type_22."f"::text,
      __frmcdc_compound_type_22."foo_bar"::text,
      (not (__frmcdc_compound_type_22 is null))::text,
      __frmcdc_nested_compound_type_8."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_8 is null))::text,
      __frmcdc_compound_type_23."a"::text,
      __frmcdc_compound_type_23."b",
      __frmcdc_compound_type_23."c"::text,
      __frmcdc_compound_type_23."d",
      __frmcdc_compound_type_23."e"::text,
      __frmcdc_compound_type_23."f"::text,
      __frmcdc_compound_type_23."foo_bar"::text,
      (not (__frmcdc_compound_type_23 is null))::text,
      __frmcdc_compound_type_24."a"::text,
      __frmcdc_compound_type_24."b",
      __frmcdc_compound_type_24."c"::text,
      __frmcdc_compound_type_24."d",
      __frmcdc_compound_type_24."e"::text,
      __frmcdc_compound_type_24."f"::text,
      __frmcdc_compound_type_24."foo_bar"::text,
      (not (__frmcdc_compound_type_24 is null))::text,
      (row_number() over (partition by 1))::text
    ]::text[]
    from "c"."person_type_function_connection"(__person__) as __person_type_function_connection__
    left outer join lateral (select (__person_type_function_connection__."compound_type").*) as __frmcdc_compound_type_13
    on TRUE
    left outer join lateral (select (__person_type_function_connection__."nested_compound_type").*) as __frmcdc_nested_compound_type_5
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_5."a").*) as __frmcdc_compound_type_14
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_5."b").*) as __frmcdc_compound_type_15
    on TRUE
    left outer join lateral (select (__person_type_function_connection__."nullable_compound_type").*) as __frmcdc_compound_type_16
    on TRUE
    left outer join lateral (select (__person_type_function_connection__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_6
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_6."a").*) as __frmcdc_compound_type_17
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_6."b").*) as __frmcdc_compound_type_18
    on TRUE
    left outer join lateral (select (__person_type_function_connection__."compound_type").*) as __frmcdc_compound_type_19
    on TRUE
    left outer join lateral (select (__person_type_function_connection__."nested_compound_type").*) as __frmcdc_nested_compound_type_7
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_7."a").*) as __frmcdc_compound_type_20
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_7."b").*) as __frmcdc_compound_type_21
    on TRUE
    left outer join lateral (select (__person_type_function_connection__."nullable_compound_type").*) as __frmcdc_compound_type_22
    on TRUE
    left outer join lateral (select (__person_type_function_connection__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_8
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_8."a").*) as __frmcdc_compound_type_23
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_8."b").*) as __frmcdc_compound_type_24
    on TRUE
  )::text as "103",
  array(
    select array[
      (count(*))::text
    ]::text[]
    from "c"."person_type_function_connection"(__person__) as __person_type_function_connection__
  )::text as "104"
from "c"."person" as __person__
left outer join "c"."person_type_function"(
  __person__,
  $1::"int4"
) as __person_type_function__
on TRUE
left outer join "a"."post" as __post__
on (
/* WHERE becoming ON */ (
  __post__."id" = __person_type_function__."id"
))
left outer join "a"."post" as __post_2
on (
/* WHERE becoming ON */ (
  __post_2."id" = __person_type_function__."smallint"
))
left outer join lateral (select (__person_type_function__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__person_type_function__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__person_type_function__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__person_type_function__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE
where (
  __person__."id" = $2::"int4"
);

select
  __post_3."id"::text as "0",
  __post_3."headline" as "1",
  __types__."id"::text as "2",
  __types__."smallint"::text as "3",
  __types__."bigint"::text as "4",
  __types__."numeric"::text as "5",
  __types__."decimal"::text as "6",
  __types__."boolean"::text as "7",
  __types__."varchar" as "8",
  __types__."enum"::text as "9",
  __types__."enum_array"::text as "10",
  __types__."domain"::text as "11",
  __types__."domain2"::text as "12",
  __types__."text_array"::text as "13",
  __types__."json"::text as "14",
  __types__."jsonb"::text as "15",
  __types__."nullable_range"::text as "16",
  __types__."numrange"::text as "17",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "18",
  __types__."an_int_range"::text as "19",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "20",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "21",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "22",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "23",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "24",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "25",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "26",
  __types__."money"::numeric::text as "27",
  __types__."point"::text as "28",
  __types__."nullablePoint"::text as "29",
  __types__."inet"::text as "30",
  __types__."cidr"::text as "31",
  __types__."macaddr"::text as "32",
  __types__."regproc"::text as "33",
  __types__."regprocedure"::text as "34",
  __types__."regoper"::text as "35",
  __types__."regoperator"::text as "36",
  __types__."regclass"::text as "37",
  __types__."regtype"::text as "38",
  __types__."regconfig"::text as "39",
  __types__."regdictionary"::text as "40",
  __types__."text_array_domain"::text as "41",
  __types__."int8_array_domain"::text as "42",
  __types__."bytea"::text as "43",
  __types__."bytea_array"::text as "44",
  __types__."ltree"::text as "45",
  __types__."ltree_array"::text as "46",
  __post_4."id"::text as "47",
  __post_4."headline" as "48",
  __post_5."id"::text as "49",
  __post_5."headline" as "50",
  __frmcdc_compound_type__."a"::text as "51",
  __frmcdc_compound_type__."b" as "52",
  __frmcdc_compound_type__."c"::text as "53",
  __frmcdc_compound_type__."d" as "54",
  __frmcdc_compound_type__."e"::text as "55",
  __frmcdc_compound_type__."f"::text as "56",
  __frmcdc_compound_type__."foo_bar"::text as "57",
  (not (__frmcdc_compound_type__ is null))::text as "58",
  __frmcdc_nested_compound_type__."baz_buz"::text as "59",
  (not (__frmcdc_nested_compound_type__ is null))::text as "60",
  __frmcdc_compound_type_2."a"::text as "61",
  __frmcdc_compound_type_2."b" as "62",
  __frmcdc_compound_type_2."c"::text as "63",
  __frmcdc_compound_type_2."d" as "64",
  __frmcdc_compound_type_2."e"::text as "65",
  __frmcdc_compound_type_2."f"::text as "66",
  __frmcdc_compound_type_2."foo_bar"::text as "67",
  (not (__frmcdc_compound_type_2 is null))::text as "68",
  __frmcdc_compound_type_3."a"::text as "69",
  __frmcdc_compound_type_3."b" as "70",
  __frmcdc_compound_type_3."c"::text as "71",
  __frmcdc_compound_type_3."d" as "72",
  __frmcdc_compound_type_3."e"::text as "73",
  __frmcdc_compound_type_3."f"::text as "74",
  __frmcdc_compound_type_3."foo_bar"::text as "75",
  (not (__frmcdc_compound_type_3 is null))::text as "76",
  __frmcdc_compound_type_4."a"::text as "77",
  __frmcdc_compound_type_4."b" as "78",
  __frmcdc_compound_type_4."c"::text as "79",
  __frmcdc_compound_type_4."d" as "80",
  __frmcdc_compound_type_4."e"::text as "81",
  __frmcdc_compound_type_4."f"::text as "82",
  __frmcdc_compound_type_4."foo_bar"::text as "83",
  (not (__frmcdc_compound_type_4 is null))::text as "84",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "85",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "86",
  __frmcdc_compound_type_5."a"::text as "87",
  __frmcdc_compound_type_5."b" as "88",
  __frmcdc_compound_type_5."c"::text as "89",
  __frmcdc_compound_type_5."d" as "90",
  __frmcdc_compound_type_5."e"::text as "91",
  __frmcdc_compound_type_5."f"::text as "92",
  __frmcdc_compound_type_5."foo_bar"::text as "93",
  (not (__frmcdc_compound_type_5 is null))::text as "94",
  __frmcdc_compound_type_6."a"::text as "95",
  __frmcdc_compound_type_6."b" as "96",
  __frmcdc_compound_type_6."c"::text as "97",
  __frmcdc_compound_type_6."d" as "98",
  __frmcdc_compound_type_6."e"::text as "99",
  __frmcdc_compound_type_6."f"::text as "100",
  __frmcdc_compound_type_6."foo_bar"::text as "101",
  (not (__frmcdc_compound_type_6 is null))::text as "102",
  array(
    select array[
      __types_2."id"::text,
      __types_2."smallint"::text,
      __types_2."bigint"::text,
      __types_2."numeric"::text,
      __types_2."decimal"::text,
      __types_2."boolean"::text,
      __types_2."varchar",
      __types_2."enum"::text,
      __types_2."enum_array"::text,
      __types_2."domain"::text,
      __types_2."domain2"::text,
      __types_2."text_array"::text,
      __types_2."json"::text,
      __types_2."jsonb"::text,
      __types_2."nullable_range"::text,
      __types_2."numrange"::text,
      json_build_array(
        lower_inc(__types_2."daterange"),
        to_char(lower(__types_2."daterange"), 'YYYY-MM-DD'::text),
        to_char(upper(__types_2."daterange"), 'YYYY-MM-DD'::text),
        upper_inc(__types_2."daterange")
      )::text,
      __types_2."an_int_range"::text,
      to_char(__types_2."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
      to_char(__types_2."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
      to_char(__types_2."date", 'YYYY-MM-DD'::text),
      to_char(date '1970-01-01' + __types_2."time", 'HH24:MI:SS.US'::text),
      to_char(date '1970-01-01' + __types_2."timetz", 'HH24:MI:SS.USTZH:TZM'::text),
      to_char(__types_2."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text),
      array(
        select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        from unnest(__types_2."interval_array") __entry_2
      )::text,
      __types_2."money"::numeric::text,
      __types_2."point"::text,
      __types_2."nullablePoint"::text,
      __types_2."inet"::text,
      __types_2."cidr"::text,
      __types_2."macaddr"::text,
      __types_2."regproc"::text,
      __types_2."regprocedure"::text,
      __types_2."regoper"::text,
      __types_2."regoperator"::text,
      __types_2."regclass"::text,
      __types_2."regtype"::text,
      __types_2."regconfig"::text,
      __types_2."regdictionary"::text,
      __types_2."text_array_domain"::text,
      __types_2."int8_array_domain"::text,
      __types_2."bytea"::text,
      __types_2."bytea_array"::text,
      __types_2."ltree"::text,
      __types_2."ltree_array"::text,
      __post__."id"::text,
      __post__."headline",
      __post_2."id"::text,
      __post_2."headline",
      __frmcdc_compound_type_7."a"::text,
      __frmcdc_compound_type_7."b",
      __frmcdc_compound_type_7."c"::text,
      __frmcdc_compound_type_7."d",
      __frmcdc_compound_type_7."e"::text,
      __frmcdc_compound_type_7."f"::text,
      __frmcdc_compound_type_7."foo_bar"::text,
      (not (__frmcdc_compound_type_7 is null))::text,
      __frmcdc_compound_type_8."a"::text,
      __frmcdc_compound_type_8."b",
      __frmcdc_compound_type_8."c"::text,
      __frmcdc_compound_type_8."d",
      __frmcdc_compound_type_8."e"::text,
      __frmcdc_compound_type_8."f"::text,
      __frmcdc_compound_type_8."foo_bar"::text,
      (not (__frmcdc_compound_type_8 is null))::text,
      __frmcdc_nested_compound_type_3."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_3 is null))::text,
      __frmcdc_compound_type_9."a"::text,
      __frmcdc_compound_type_9."b",
      __frmcdc_compound_type_9."c"::text,
      __frmcdc_compound_type_9."d",
      __frmcdc_compound_type_9."e"::text,
      __frmcdc_compound_type_9."f"::text,
      __frmcdc_compound_type_9."foo_bar"::text,
      (not (__frmcdc_compound_type_9 is null))::text,
      __frmcdc_compound_type_10."a"::text,
      __frmcdc_compound_type_10."b",
      __frmcdc_compound_type_10."c"::text,
      __frmcdc_compound_type_10."d",
      __frmcdc_compound_type_10."e"::text,
      __frmcdc_compound_type_10."f"::text,
      __frmcdc_compound_type_10."foo_bar"::text,
      (not (__frmcdc_compound_type_10 is null))::text,
      __frmcdc_nested_compound_type_4."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_4 is null))::text,
      __frmcdc_compound_type_11."a"::text,
      __frmcdc_compound_type_11."b",
      __frmcdc_compound_type_11."c"::text,
      __frmcdc_compound_type_11."d",
      __frmcdc_compound_type_11."e"::text,
      __frmcdc_compound_type_11."f"::text,
      __frmcdc_compound_type_11."foo_bar"::text,
      (not (__frmcdc_compound_type_11 is null))::text,
      __frmcdc_compound_type_12."a"::text,
      __frmcdc_compound_type_12."b",
      __frmcdc_compound_type_12."c"::text,
      __frmcdc_compound_type_12."d",
      __frmcdc_compound_type_12."e"::text,
      __frmcdc_compound_type_12."f"::text,
      __frmcdc_compound_type_12."foo_bar"::text,
      (not (__frmcdc_compound_type_12 is null))::text,
      __frmcdc_compound_type_13."a"::text,
      __frmcdc_compound_type_13."b",
      __frmcdc_compound_type_13."c"::text,
      __frmcdc_compound_type_13."d",
      __frmcdc_compound_type_13."e"::text,
      __frmcdc_compound_type_13."f"::text,
      __frmcdc_compound_type_13."foo_bar"::text,
      (not (__frmcdc_compound_type_13 is null))::text,
      __frmcdc_compound_type_14."a"::text,
      __frmcdc_compound_type_14."b",
      __frmcdc_compound_type_14."c"::text,
      __frmcdc_compound_type_14."d",
      __frmcdc_compound_type_14."e"::text,
      __frmcdc_compound_type_14."f"::text,
      __frmcdc_compound_type_14."foo_bar"::text,
      (not (__frmcdc_compound_type_14 is null))::text,
      __frmcdc_nested_compound_type_5."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_5 is null))::text,
      __frmcdc_compound_type_15."a"::text,
      __frmcdc_compound_type_15."b",
      __frmcdc_compound_type_15."c"::text,
      __frmcdc_compound_type_15."d",
      __frmcdc_compound_type_15."e"::text,
      __frmcdc_compound_type_15."f"::text,
      __frmcdc_compound_type_15."foo_bar"::text,
      (not (__frmcdc_compound_type_15 is null))::text,
      __frmcdc_compound_type_16."a"::text,
      __frmcdc_compound_type_16."b",
      __frmcdc_compound_type_16."c"::text,
      __frmcdc_compound_type_16."d",
      __frmcdc_compound_type_16."e"::text,
      __frmcdc_compound_type_16."f"::text,
      __frmcdc_compound_type_16."foo_bar"::text,
      (not (__frmcdc_compound_type_16 is null))::text,
      __frmcdc_nested_compound_type_6."baz_buz"::text,
      (not (__frmcdc_nested_compound_type_6 is null))::text,
      __frmcdc_compound_type_17."a"::text,
      __frmcdc_compound_type_17."b",
      __frmcdc_compound_type_17."c"::text,
      __frmcdc_compound_type_17."d",
      __frmcdc_compound_type_17."e"::text,
      __frmcdc_compound_type_17."f"::text,
      __frmcdc_compound_type_17."foo_bar"::text,
      (not (__frmcdc_compound_type_17 is null))::text,
      __frmcdc_compound_type_18."a"::text,
      __frmcdc_compound_type_18."b",
      __frmcdc_compound_type_18."c"::text,
      __frmcdc_compound_type_18."d",
      __frmcdc_compound_type_18."e"::text,
      __frmcdc_compound_type_18."f"::text,
      __frmcdc_compound_type_18."foo_bar"::text,
      (not (__frmcdc_compound_type_18 is null))::text
    ]::text[]
    from "b"."types" as __types_2
    left outer join "a"."post" as __post__
    on (
    /* WHERE becoming ON */ (
      __post__."id" = __types_2."id"
    ))
    left outer join "a"."post" as __post_2
    on (
    /* WHERE becoming ON */ (
      __post_2."id" = __types_2."smallint"
    ))
    left outer join lateral (select (__types_2."compound_type").*) as __frmcdc_compound_type_7
    on TRUE
    left outer join lateral (select (__types_2."compound_type").*) as __frmcdc_compound_type_8
    on TRUE
    left outer join lateral (select (__types_2."nested_compound_type").*) as __frmcdc_nested_compound_type_3
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_3."a").*) as __frmcdc_compound_type_9
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_3."b").*) as __frmcdc_compound_type_10
    on TRUE
    left outer join lateral (select (__types_2."nested_compound_type").*) as __frmcdc_nested_compound_type_4
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_4."a").*) as __frmcdc_compound_type_11
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_4."b").*) as __frmcdc_compound_type_12
    on TRUE
    left outer join lateral (select (__types_2."nullable_compound_type").*) as __frmcdc_compound_type_13
    on TRUE
    left outer join lateral (select (__types_2."nullable_compound_type").*) as __frmcdc_compound_type_14
    on TRUE
    left outer join lateral (select (__types_2."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_5
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_5."a").*) as __frmcdc_compound_type_15
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_5."b").*) as __frmcdc_compound_type_16
    on TRUE
    left outer join lateral (select (__types_2."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_6
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_6."a").*) as __frmcdc_compound_type_17
    on TRUE
    left outer join lateral (select (__frmcdc_nested_compound_type_6."b").*) as __frmcdc_compound_type_18
    on TRUE
    where (
      __types_2."smallint" = __post_3."id"
    )
    order by __types_2."id" asc
  )::text as "103",
  array(
    select array[
      (count(*))::text
    ]::text[]
    from "b"."types" as __types_2
    where (
      __types_2."smallint" = __post_3."id"
    )
  )::text as "104"
from "a"."post" as __post_3
left outer join "b"."types" as __types__
on (
/* WHERE becoming ON */ (
  __types__."id" = __post_3."id"
))
left outer join "a"."post" as __post_4
on (
/* WHERE becoming ON */ (
  __post_4."id" = __types__."id"
))
left outer join "a"."post" as __post_5
on (
/* WHERE becoming ON */ (
  __post_5."id" = __types__."smallint"
))
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__types__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__types__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE
where (
  __post_3."id" = $1::"int4"
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
  __types__."point"::text as "26",
  __types__."nullablePoint"::text as "27",
  __types__."inet"::text as "28",
  __types__."cidr"::text as "29",
  __types__."macaddr"::text as "30",
  __types__."regproc"::text as "31",
  __types__."regprocedure"::text as "32",
  __types__."regoper"::text as "33",
  __types__."regoperator"::text as "34",
  __types__."regclass"::text as "35",
  __types__."regtype"::text as "36",
  __types__."regconfig"::text as "37",
  __types__."regdictionary"::text as "38",
  __types__."text_array_domain"::text as "39",
  __types__."int8_array_domain"::text as "40",
  __types__."bytea"::text as "41",
  __types__."bytea_array"::text as "42",
  __types__."ltree"::text as "43",
  __types__."ltree_array"::text as "44",
  __post__."id"::text as "45",
  __post__."headline" as "46",
  __post_2."id"::text as "47",
  __post_2."headline" as "48",
  __frmcdc_compound_type__."a"::text as "49",
  __frmcdc_compound_type__."b" as "50",
  __frmcdc_compound_type__."c"::text as "51",
  __frmcdc_compound_type__."d" as "52",
  __frmcdc_compound_type__."e"::text as "53",
  __frmcdc_compound_type__."f"::text as "54",
  __frmcdc_compound_type__."foo_bar"::text as "55",
  (not (__frmcdc_compound_type__ is null))::text as "56",
  __frmcdc_compound_type_2."a"::text as "57",
  __frmcdc_compound_type_2."b" as "58",
  __frmcdc_compound_type_2."c"::text as "59",
  __frmcdc_compound_type_2."d" as "60",
  __frmcdc_compound_type_2."e"::text as "61",
  __frmcdc_compound_type_2."f"::text as "62",
  __frmcdc_compound_type_2."foo_bar"::text as "63",
  (not (__frmcdc_compound_type_2 is null))::text as "64",
  __frmcdc_nested_compound_type__."baz_buz"::text as "65",
  (not (__frmcdc_nested_compound_type__ is null))::text as "66",
  __frmcdc_compound_type_3."a"::text as "67",
  __frmcdc_compound_type_3."b" as "68",
  __frmcdc_compound_type_3."c"::text as "69",
  __frmcdc_compound_type_3."d" as "70",
  __frmcdc_compound_type_3."e"::text as "71",
  __frmcdc_compound_type_3."f"::text as "72",
  __frmcdc_compound_type_3."foo_bar"::text as "73",
  (not (__frmcdc_compound_type_3 is null))::text as "74",
  __frmcdc_compound_type_4."a"::text as "75",
  __frmcdc_compound_type_4."b" as "76",
  __frmcdc_compound_type_4."c"::text as "77",
  __frmcdc_compound_type_4."d" as "78",
  __frmcdc_compound_type_4."e"::text as "79",
  __frmcdc_compound_type_4."f"::text as "80",
  __frmcdc_compound_type_4."foo_bar"::text as "81",
  (not (__frmcdc_compound_type_4 is null))::text as "82",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "83",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "84",
  __frmcdc_compound_type_5."a"::text as "85",
  __frmcdc_compound_type_5."b" as "86",
  __frmcdc_compound_type_5."c"::text as "87",
  __frmcdc_compound_type_5."d" as "88",
  __frmcdc_compound_type_5."e"::text as "89",
  __frmcdc_compound_type_5."f"::text as "90",
  __frmcdc_compound_type_5."foo_bar"::text as "91",
  (not (__frmcdc_compound_type_5 is null))::text as "92",
  __frmcdc_compound_type_6."a"::text as "93",
  __frmcdc_compound_type_6."b" as "94",
  __frmcdc_compound_type_6."c"::text as "95",
  __frmcdc_compound_type_6."d" as "96",
  __frmcdc_compound_type_6."e"::text as "97",
  __frmcdc_compound_type_6."f"::text as "98",
  __frmcdc_compound_type_6."foo_bar"::text as "99",
  (not (__frmcdc_compound_type_6 is null))::text as "100",
  __frmcdc_compound_type_7."a"::text as "101",
  __frmcdc_compound_type_7."b" as "102",
  __frmcdc_compound_type_7."c"::text as "103",
  __frmcdc_compound_type_7."d" as "104",
  __frmcdc_compound_type_7."e"::text as "105",
  __frmcdc_compound_type_7."f"::text as "106",
  __frmcdc_compound_type_7."foo_bar"::text as "107",
  (not (__frmcdc_compound_type_7 is null))::text as "108",
  __frmcdc_compound_type_8."a"::text as "109",
  __frmcdc_compound_type_8."b" as "110",
  __frmcdc_compound_type_8."c"::text as "111",
  __frmcdc_compound_type_8."d" as "112",
  __frmcdc_compound_type_8."e"::text as "113",
  __frmcdc_compound_type_8."f"::text as "114",
  __frmcdc_compound_type_8."foo_bar"::text as "115",
  (not (__frmcdc_compound_type_8 is null))::text as "116",
  __frmcdc_nested_compound_type_3."baz_buz"::text as "117",
  (not (__frmcdc_nested_compound_type_3 is null))::text as "118",
  __frmcdc_compound_type_9."a"::text as "119",
  __frmcdc_compound_type_9."b" as "120",
  __frmcdc_compound_type_9."c"::text as "121",
  __frmcdc_compound_type_9."d" as "122",
  __frmcdc_compound_type_9."e"::text as "123",
  __frmcdc_compound_type_9."f"::text as "124",
  __frmcdc_compound_type_9."foo_bar"::text as "125",
  (not (__frmcdc_compound_type_9 is null))::text as "126",
  __frmcdc_compound_type_10."a"::text as "127",
  __frmcdc_compound_type_10."b" as "128",
  __frmcdc_compound_type_10."c"::text as "129",
  __frmcdc_compound_type_10."d" as "130",
  __frmcdc_compound_type_10."e"::text as "131",
  __frmcdc_compound_type_10."f"::text as "132",
  __frmcdc_compound_type_10."foo_bar"::text as "133",
  (not (__frmcdc_compound_type_10 is null))::text as "134",
  __frmcdc_nested_compound_type_4."baz_buz"::text as "135",
  (not (__frmcdc_nested_compound_type_4 is null))::text as "136",
  __frmcdc_compound_type_11."a"::text as "137",
  __frmcdc_compound_type_11."b" as "138",
  __frmcdc_compound_type_11."c"::text as "139",
  __frmcdc_compound_type_11."d" as "140",
  __frmcdc_compound_type_11."e"::text as "141",
  __frmcdc_compound_type_11."f"::text as "142",
  __frmcdc_compound_type_11."foo_bar"::text as "143",
  (not (__frmcdc_compound_type_11 is null))::text as "144",
  __frmcdc_compound_type_12."a"::text as "145",
  __frmcdc_compound_type_12."b" as "146",
  __frmcdc_compound_type_12."c"::text as "147",
  __frmcdc_compound_type_12."d" as "148",
  __frmcdc_compound_type_12."e"::text as "149",
  __frmcdc_compound_type_12."f"::text as "150",
  __frmcdc_compound_type_12."foo_bar"::text as "151",
  (not (__frmcdc_compound_type_12 is null))::text as "152"
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
left outer join lateral (select (__types__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__types__."nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_7
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_8
on TRUE
left outer join lateral (select (__types__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_3
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_3."a").*) as __frmcdc_compound_type_9
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_3."b").*) as __frmcdc_compound_type_10
on TRUE
left outer join lateral (select (__types__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_4
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_4."a").*) as __frmcdc_compound_type_11
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_4."b").*) as __frmcdc_compound_type_12
on TRUE
order by __types__."id" asc;

select
  (count(*))::text as "0"
from "b"."types" as __types__;

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
  __type_function_connection__."point"::text as "26",
  __type_function_connection__."nullablePoint"::text as "27",
  __type_function_connection__."inet"::text as "28",
  __type_function_connection__."cidr"::text as "29",
  __type_function_connection__."macaddr"::text as "30",
  __type_function_connection__."regproc"::text as "31",
  __type_function_connection__."regprocedure"::text as "32",
  __type_function_connection__."regoper"::text as "33",
  __type_function_connection__."regoperator"::text as "34",
  __type_function_connection__."regclass"::text as "35",
  __type_function_connection__."regtype"::text as "36",
  __type_function_connection__."regconfig"::text as "37",
  __type_function_connection__."regdictionary"::text as "38",
  __type_function_connection__."text_array_domain"::text as "39",
  __type_function_connection__."int8_array_domain"::text as "40",
  __type_function_connection__."bytea"::text as "41",
  __type_function_connection__."bytea_array"::text as "42",
  __type_function_connection__."ltree"::text as "43",
  __type_function_connection__."ltree_array"::text as "44",
  array(
    select to_char(__entry_2, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__type_function_connection__."interval_array") __entry_2
  )::text as "45",
  __frmcdc_compound_type__."a"::text as "46",
  __frmcdc_compound_type__."b" as "47",
  __frmcdc_compound_type__."c"::text as "48",
  __frmcdc_compound_type__."d" as "49",
  __frmcdc_compound_type__."e"::text as "50",
  __frmcdc_compound_type__."f"::text as "51",
  __frmcdc_compound_type__."foo_bar"::text as "52",
  (not (__frmcdc_compound_type__ is null))::text as "53",
  __frmcdc_nested_compound_type__."baz_buz"::text as "54",
  (not (__frmcdc_nested_compound_type__ is null))::text as "55",
  __frmcdc_compound_type_2."a"::text as "56",
  __frmcdc_compound_type_2."b" as "57",
  __frmcdc_compound_type_2."c"::text as "58",
  __frmcdc_compound_type_2."d" as "59",
  __frmcdc_compound_type_2."e"::text as "60",
  __frmcdc_compound_type_2."f"::text as "61",
  __frmcdc_compound_type_2."foo_bar"::text as "62",
  (not (__frmcdc_compound_type_2 is null))::text as "63",
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
  __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
  __frmcdc_compound_type_5."a"::text as "82",
  __frmcdc_compound_type_5."b" as "83",
  __frmcdc_compound_type_5."c"::text as "84",
  __frmcdc_compound_type_5."d" as "85",
  __frmcdc_compound_type_5."e"::text as "86",
  __frmcdc_compound_type_5."f"::text as "87",
  __frmcdc_compound_type_5."foo_bar"::text as "88",
  (not (__frmcdc_compound_type_5 is null))::text as "89",
  __frmcdc_compound_type_6."a"::text as "90",
  __frmcdc_compound_type_6."b" as "91",
  __frmcdc_compound_type_6."c"::text as "92",
  __frmcdc_compound_type_6."d" as "93",
  __frmcdc_compound_type_6."e"::text as "94",
  __frmcdc_compound_type_6."f"::text as "95",
  __frmcdc_compound_type_6."foo_bar"::text as "96",
  (not (__frmcdc_compound_type_6 is null))::text as "97",
  __frmcdc_compound_type_7."a"::text as "98",
  __frmcdc_compound_type_7."b" as "99",
  __frmcdc_compound_type_7."c"::text as "100",
  __frmcdc_compound_type_7."d" as "101",
  __frmcdc_compound_type_7."e"::text as "102",
  __frmcdc_compound_type_7."f"::text as "103",
  __frmcdc_compound_type_7."foo_bar"::text as "104",
  (not (__frmcdc_compound_type_7 is null))::text as "105",
  __frmcdc_nested_compound_type_3."baz_buz"::text as "106",
  (not (__frmcdc_nested_compound_type_3 is null))::text as "107",
  __frmcdc_compound_type_8."a"::text as "108",
  __frmcdc_compound_type_8."b" as "109",
  __frmcdc_compound_type_8."c"::text as "110",
  __frmcdc_compound_type_8."d" as "111",
  __frmcdc_compound_type_8."e"::text as "112",
  __frmcdc_compound_type_8."f"::text as "113",
  __frmcdc_compound_type_8."foo_bar"::text as "114",
  (not (__frmcdc_compound_type_8 is null))::text as "115",
  __frmcdc_compound_type_9."a"::text as "116",
  __frmcdc_compound_type_9."b" as "117",
  __frmcdc_compound_type_9."c"::text as "118",
  __frmcdc_compound_type_9."d" as "119",
  __frmcdc_compound_type_9."e"::text as "120",
  __frmcdc_compound_type_9."f"::text as "121",
  __frmcdc_compound_type_9."foo_bar"::text as "122",
  (not (__frmcdc_compound_type_9 is null))::text as "123",
  __frmcdc_compound_type_10."a"::text as "124",
  __frmcdc_compound_type_10."b" as "125",
  __frmcdc_compound_type_10."c"::text as "126",
  __frmcdc_compound_type_10."d" as "127",
  __frmcdc_compound_type_10."e"::text as "128",
  __frmcdc_compound_type_10."f"::text as "129",
  __frmcdc_compound_type_10."foo_bar"::text as "130",
  (not (__frmcdc_compound_type_10 is null))::text as "131",
  __frmcdc_nested_compound_type_4."baz_buz"::text as "132",
  (not (__frmcdc_nested_compound_type_4 is null))::text as "133",
  __frmcdc_compound_type_11."a"::text as "134",
  __frmcdc_compound_type_11."b" as "135",
  __frmcdc_compound_type_11."c"::text as "136",
  __frmcdc_compound_type_11."d" as "137",
  __frmcdc_compound_type_11."e"::text as "138",
  __frmcdc_compound_type_11."f"::text as "139",
  __frmcdc_compound_type_11."foo_bar"::text as "140",
  (not (__frmcdc_compound_type_11 is null))::text as "141",
  __frmcdc_compound_type_12."a"::text as "142",
  __frmcdc_compound_type_12."b" as "143",
  __frmcdc_compound_type_12."c"::text as "144",
  __frmcdc_compound_type_12."d" as "145",
  __frmcdc_compound_type_12."e"::text as "146",
  __frmcdc_compound_type_12."f"::text as "147",
  __frmcdc_compound_type_12."foo_bar"::text as "148",
  (not (__frmcdc_compound_type_12 is null))::text as "149",
  (row_number() over (partition by 1))::text as "150"
from "b"."type_function_connection"() as __type_function_connection__
left outer join lateral (select (__type_function_connection__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__type_function_connection__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__type_function_connection__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__type_function_connection__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE
left outer join lateral (select (__type_function_connection__."compound_type").*) as __frmcdc_compound_type_7
on TRUE
left outer join lateral (select (__type_function_connection__."nested_compound_type").*) as __frmcdc_nested_compound_type_3
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_3."a").*) as __frmcdc_compound_type_8
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_3."b").*) as __frmcdc_compound_type_9
on TRUE
left outer join lateral (select (__type_function_connection__."nullable_compound_type").*) as __frmcdc_compound_type_10
on TRUE
left outer join lateral (select (__type_function_connection__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_4
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_4."a").*) as __frmcdc_compound_type_11
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_4."b").*) as __frmcdc_compound_type_12
on TRUE;

select
  (count(*))::text as "0"
from "b"."type_function_connection"() as __type_function_connection__;

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