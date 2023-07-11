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
  (
    select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
    from unnest(__types__."interval_array") t
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
  __frmcdc_compound_type_3."a"::text as "46",
  __frmcdc_compound_type_3."b" as "47",
  __frmcdc_compound_type_3."c"::text as "48",
  __frmcdc_compound_type_3."d" as "49",
  __frmcdc_compound_type_3."e"::text as "50",
  __frmcdc_compound_type_3."f"::text as "51",
  __frmcdc_compound_type_3."foo_bar"::text as "52",
  (not (__frmcdc_compound_type_3 is null))::text as "53",
  __frmcdc_nested_compound_type__."baz_buz"::text as "54",
  (not (__frmcdc_nested_compound_type__ is null))::text as "55",
  __frmcdc_compound_type_4."a"::text as "56",
  __frmcdc_compound_type_4."b" as "57",
  __frmcdc_compound_type_4."c"::text as "58",
  __frmcdc_compound_type_4."d" as "59",
  __frmcdc_compound_type_4."e"::text as "60",
  __frmcdc_compound_type_4."f"::text as "61",
  __frmcdc_compound_type_4."foo_bar"::text as "62",
  (not (__frmcdc_compound_type_4 is null))::text as "63",
  __frmcdc_compound_type_5."a"::text as "64",
  __frmcdc_compound_type_5."b" as "65",
  __frmcdc_compound_type_5."c"::text as "66",
  __frmcdc_compound_type_5."d" as "67",
  __frmcdc_compound_type_5."e"::text as "68",
  __frmcdc_compound_type_5."f"::text as "69",
  __frmcdc_compound_type_5."foo_bar"::text as "70",
  (not (__frmcdc_compound_type_5 is null))::text as "71",
  __frmcdc_compound_type_6."a"::text as "72",
  __frmcdc_compound_type_6."b" as "73",
  __frmcdc_compound_type_6."c"::text as "74",
  __frmcdc_compound_type_6."d" as "75",
  __frmcdc_compound_type_6."e"::text as "76",
  __frmcdc_compound_type_6."f"::text as "77",
  __frmcdc_compound_type_6."foo_bar"::text as "78",
  (not (__frmcdc_compound_type_6 is null))::text as "79",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
  __types__."point"::text as "82",
  __types__."nullablePoint"::text as "83",
  __types__."inet"::text as "84",
  __types__."cidr"::text as "85",
  __types__."macaddr"::text as "86",
  __types__."regproc"::text as "87",
  __types__."regprocedure"::text as "88",
  __types__."regoper"::text as "89",
  __types__."regoperator"::text as "90",
  __types__."regclass"::text as "91",
  __types__."regtype"::text as "92",
  __types__."regconfig"::text as "93",
  __types__."regdictionary"::text as "94",
  __types__."text_array_domain"::text as "95",
  __types__."int8_array_domain"::text as "96",
  __types__."bytea"::text as "97",
  __types__."bytea_array"::text as "98"
from "b"."types" as __types__
left outer join "a"."post" as __post__
on (__types__."id"::"int4" = __post__."id")
left outer join "a"."post" as __post_2
on (__types__."smallint"::"int4" = __post_2."id")
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

select __types_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __types_identifiers__,
lateral (
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
    (
      select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
      from unnest(__types__."interval_array") t
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
    __frmcdc_compound_type_3."a"::text as "46",
    __frmcdc_compound_type_3."b" as "47",
    __frmcdc_compound_type_3."c"::text as "48",
    __frmcdc_compound_type_3."d" as "49",
    __frmcdc_compound_type_3."e"::text as "50",
    __frmcdc_compound_type_3."f"::text as "51",
    __frmcdc_compound_type_3."foo_bar"::text as "52",
    (not (__frmcdc_compound_type_3 is null))::text as "53",
    __frmcdc_nested_compound_type__."baz_buz"::text as "54",
    (not (__frmcdc_nested_compound_type__ is null))::text as "55",
    __frmcdc_compound_type_4."a"::text as "56",
    __frmcdc_compound_type_4."b" as "57",
    __frmcdc_compound_type_4."c"::text as "58",
    __frmcdc_compound_type_4."d" as "59",
    __frmcdc_compound_type_4."e"::text as "60",
    __frmcdc_compound_type_4."f"::text as "61",
    __frmcdc_compound_type_4."foo_bar"::text as "62",
    (not (__frmcdc_compound_type_4 is null))::text as "63",
    __frmcdc_compound_type_5."a"::text as "64",
    __frmcdc_compound_type_5."b" as "65",
    __frmcdc_compound_type_5."c"::text as "66",
    __frmcdc_compound_type_5."d" as "67",
    __frmcdc_compound_type_5."e"::text as "68",
    __frmcdc_compound_type_5."f"::text as "69",
    __frmcdc_compound_type_5."foo_bar"::text as "70",
    (not (__frmcdc_compound_type_5 is null))::text as "71",
    __frmcdc_compound_type_6."a"::text as "72",
    __frmcdc_compound_type_6."b" as "73",
    __frmcdc_compound_type_6."c"::text as "74",
    __frmcdc_compound_type_6."d" as "75",
    __frmcdc_compound_type_6."e"::text as "76",
    __frmcdc_compound_type_6."f"::text as "77",
    __frmcdc_compound_type_6."foo_bar"::text as "78",
    (not (__frmcdc_compound_type_6 is null))::text as "79",
    __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
    (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
    __types__."point"::text as "82",
    __types__."nullablePoint"::text as "83",
    __types__."inet"::text as "84",
    __types__."cidr"::text as "85",
    __types__."macaddr"::text as "86",
    __types__."regproc"::text as "87",
    __types__."regprocedure"::text as "88",
    __types__."regoper"::text as "89",
    __types__."regoperator"::text as "90",
    __types__."regclass"::text as "91",
    __types__."regtype"::text as "92",
    __types__."regconfig"::text as "93",
    __types__."regdictionary"::text as "94",
    __types__."text_array_domain"::text as "95",
    __types__."int8_array_domain"::text as "96",
    __types__."bytea"::text as "97",
    __types__."bytea_array"::text as "98",
    __types_identifiers__.idx as "99"
  from "b"."types" as __types__
  left outer join "a"."post" as __post__
  on (__types__."id"::"int4" = __post__."id")
  left outer join "a"."post" as __post_2
  on (__types__."smallint"::"int4" = __post_2."id")
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
    __types__."id" = __types_identifiers__."id0"
  )
) as __types_result__;

select __type_function_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __type_function_identifiers__,
lateral (
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
    (
      select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
      from unnest(__type_function__."interval_array") t
    )::text as "28",
    __type_function__."money"::numeric::text as "29",
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
    __frmcdc_compound_type_3."a"::text as "46",
    __frmcdc_compound_type_3."b" as "47",
    __frmcdc_compound_type_3."c"::text as "48",
    __frmcdc_compound_type_3."d" as "49",
    __frmcdc_compound_type_3."e"::text as "50",
    __frmcdc_compound_type_3."f"::text as "51",
    __frmcdc_compound_type_3."foo_bar"::text as "52",
    (not (__frmcdc_compound_type_3 is null))::text as "53",
    __frmcdc_nested_compound_type__."baz_buz"::text as "54",
    (not (__frmcdc_nested_compound_type__ is null))::text as "55",
    __frmcdc_compound_type_4."a"::text as "56",
    __frmcdc_compound_type_4."b" as "57",
    __frmcdc_compound_type_4."c"::text as "58",
    __frmcdc_compound_type_4."d" as "59",
    __frmcdc_compound_type_4."e"::text as "60",
    __frmcdc_compound_type_4."f"::text as "61",
    __frmcdc_compound_type_4."foo_bar"::text as "62",
    (not (__frmcdc_compound_type_4 is null))::text as "63",
    __frmcdc_compound_type_5."a"::text as "64",
    __frmcdc_compound_type_5."b" as "65",
    __frmcdc_compound_type_5."c"::text as "66",
    __frmcdc_compound_type_5."d" as "67",
    __frmcdc_compound_type_5."e"::text as "68",
    __frmcdc_compound_type_5."f"::text as "69",
    __frmcdc_compound_type_5."foo_bar"::text as "70",
    (not (__frmcdc_compound_type_5 is null))::text as "71",
    __frmcdc_compound_type_6."a"::text as "72",
    __frmcdc_compound_type_6."b" as "73",
    __frmcdc_compound_type_6."c"::text as "74",
    __frmcdc_compound_type_6."d" as "75",
    __frmcdc_compound_type_6."e"::text as "76",
    __frmcdc_compound_type_6."f"::text as "77",
    __frmcdc_compound_type_6."foo_bar"::text as "78",
    (not (__frmcdc_compound_type_6 is null))::text as "79",
    __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
    (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
    __type_function__."point"::text as "82",
    __type_function__."nullablePoint"::text as "83",
    __type_function__."inet"::text as "84",
    __type_function__."cidr"::text as "85",
    __type_function__."macaddr"::text as "86",
    __type_function__."regproc"::text as "87",
    __type_function__."regprocedure"::text as "88",
    __type_function__."regoper"::text as "89",
    __type_function__."regoperator"::text as "90",
    __type_function__."regclass"::text as "91",
    __type_function__."regtype"::text as "92",
    __type_function__."regconfig"::text as "93",
    __type_function__."regdictionary"::text as "94",
    __type_function__."text_array_domain"::text as "95",
    __type_function__."int8_array_domain"::text as "96",
    __type_function__."bytea"::text as "97",
    __type_function__."bytea_array"::text as "98",
    __type_function_identifiers__.idx as "99"
  from "b"."type_function"(__type_function_identifiers__."id0") as __type_function__
  left outer join "a"."post" as __post__
  on (__type_function__."id"::"int4" = __post__."id")
  left outer join "a"."post" as __post_2
  on (__type_function__."smallint"::"int4" = __post_2."id")
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
  on TRUE
) as __type_function_result__;

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
  (
    select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
    from unnest(__type_function_list__."interval_array") t
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
  __frmcdc_compound_type_2."a"::text as "38",
  __frmcdc_compound_type_2."b" as "39",
  __frmcdc_compound_type_2."c"::text as "40",
  __frmcdc_compound_type_2."d" as "41",
  __frmcdc_compound_type_2."e"::text as "42",
  __frmcdc_compound_type_2."f"::text as "43",
  __frmcdc_compound_type_2."foo_bar"::text as "44",
  (not (__frmcdc_compound_type_2 is null))::text as "45",
  __frmcdc_compound_type_3."a"::text as "46",
  __frmcdc_compound_type_3."b" as "47",
  __frmcdc_compound_type_3."c"::text as "48",
  __frmcdc_compound_type_3."d" as "49",
  __frmcdc_compound_type_3."e"::text as "50",
  __frmcdc_compound_type_3."f"::text as "51",
  __frmcdc_compound_type_3."foo_bar"::text as "52",
  (not (__frmcdc_compound_type_3 is null))::text as "53",
  __frmcdc_nested_compound_type__."baz_buz"::text as "54",
  (not (__frmcdc_nested_compound_type__ is null))::text as "55",
  __frmcdc_compound_type_4."a"::text as "56",
  __frmcdc_compound_type_4."b" as "57",
  __frmcdc_compound_type_4."c"::text as "58",
  __frmcdc_compound_type_4."d" as "59",
  __frmcdc_compound_type_4."e"::text as "60",
  __frmcdc_compound_type_4."f"::text as "61",
  __frmcdc_compound_type_4."foo_bar"::text as "62",
  (not (__frmcdc_compound_type_4 is null))::text as "63",
  __frmcdc_compound_type_5."a"::text as "64",
  __frmcdc_compound_type_5."b" as "65",
  __frmcdc_compound_type_5."c"::text as "66",
  __frmcdc_compound_type_5."d" as "67",
  __frmcdc_compound_type_5."e"::text as "68",
  __frmcdc_compound_type_5."f"::text as "69",
  __frmcdc_compound_type_5."foo_bar"::text as "70",
  (not (__frmcdc_compound_type_5 is null))::text as "71",
  __frmcdc_compound_type_6."a"::text as "72",
  __frmcdc_compound_type_6."b" as "73",
  __frmcdc_compound_type_6."c"::text as "74",
  __frmcdc_compound_type_6."d" as "75",
  __frmcdc_compound_type_6."e"::text as "76",
  __frmcdc_compound_type_6."f"::text as "77",
  __frmcdc_compound_type_6."foo_bar"::text as "78",
  (not (__frmcdc_compound_type_6 is null))::text as "79",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
  __type_function_list__."point"::text as "82",
  __type_function_list__."nullablePoint"::text as "83",
  __type_function_list__."inet"::text as "84",
  __type_function_list__."cidr"::text as "85",
  __type_function_list__."macaddr"::text as "86",
  __type_function_list__."regproc"::text as "87",
  __type_function_list__."regprocedure"::text as "88",
  __type_function_list__."regoper"::text as "89",
  __type_function_list__."regoperator"::text as "90",
  __type_function_list__."regclass"::text as "91",
  __type_function_list__."regtype"::text as "92",
  __type_function_list__."regconfig"::text as "93",
  __type_function_list__."regdictionary"::text as "94",
  __type_function_list__."text_array_domain"::text as "95",
  __type_function_list__."int8_array_domain"::text as "96",
  __type_function_list__."bytea"::text as "97",
  __type_function_list__."bytea_array"::text as "98"
from unnest("b"."type_function_list"()) as __type_function_list__
left outer join "a"."post" as __post__
on (__type_function_list__."id"::"int4" = __post__."id")
left outer join "a"."post" as __post_2
on (__type_function_list__."smallint"::"int4" = __post_2."id")
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

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __person_identifiers__,
lateral (
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
    (
      select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
      from unnest(__person_type_function__."interval_array") t
    )::text as "28",
    __person_type_function__."money"::numeric::text as "29",
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
    __frmcdc_compound_type_3."a"::text as "46",
    __frmcdc_compound_type_3."b" as "47",
    __frmcdc_compound_type_3."c"::text as "48",
    __frmcdc_compound_type_3."d" as "49",
    __frmcdc_compound_type_3."e"::text as "50",
    __frmcdc_compound_type_3."f"::text as "51",
    __frmcdc_compound_type_3."foo_bar"::text as "52",
    (not (__frmcdc_compound_type_3 is null))::text as "53",
    __frmcdc_nested_compound_type__."baz_buz"::text as "54",
    (not (__frmcdc_nested_compound_type__ is null))::text as "55",
    __frmcdc_compound_type_4."a"::text as "56",
    __frmcdc_compound_type_4."b" as "57",
    __frmcdc_compound_type_4."c"::text as "58",
    __frmcdc_compound_type_4."d" as "59",
    __frmcdc_compound_type_4."e"::text as "60",
    __frmcdc_compound_type_4."f"::text as "61",
    __frmcdc_compound_type_4."foo_bar"::text as "62",
    (not (__frmcdc_compound_type_4 is null))::text as "63",
    __frmcdc_compound_type_5."a"::text as "64",
    __frmcdc_compound_type_5."b" as "65",
    __frmcdc_compound_type_5."c"::text as "66",
    __frmcdc_compound_type_5."d" as "67",
    __frmcdc_compound_type_5."e"::text as "68",
    __frmcdc_compound_type_5."f"::text as "69",
    __frmcdc_compound_type_5."foo_bar"::text as "70",
    (not (__frmcdc_compound_type_5 is null))::text as "71",
    __frmcdc_compound_type_6."a"::text as "72",
    __frmcdc_compound_type_6."b" as "73",
    __frmcdc_compound_type_6."c"::text as "74",
    __frmcdc_compound_type_6."d" as "75",
    __frmcdc_compound_type_6."e"::text as "76",
    __frmcdc_compound_type_6."f"::text as "77",
    __frmcdc_compound_type_6."foo_bar"::text as "78",
    (not (__frmcdc_compound_type_6 is null))::text as "79",
    __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
    (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
    __person_type_function__."point"::text as "82",
    __person_type_function__."nullablePoint"::text as "83",
    __person_type_function__."inet"::text as "84",
    __person_type_function__."cidr"::text as "85",
    __person_type_function__."macaddr"::text as "86",
    __person_type_function__."regproc"::text as "87",
    __person_type_function__."regprocedure"::text as "88",
    __person_type_function__."regoper"::text as "89",
    __person_type_function__."regoperator"::text as "90",
    __person_type_function__."regclass"::text as "91",
    __person_type_function__."regtype"::text as "92",
    __person_type_function__."regconfig"::text as "93",
    __person_type_function__."regdictionary"::text as "94",
    __person_type_function__."text_array_domain"::text as "95",
    __person_type_function__."int8_array_domain"::text as "96",
    __person_type_function__."bytea"::text as "97",
    __person_type_function__."bytea_array"::text as "98",
    (select json_agg(s) from (
      select
        __post_3."id"::text as "0",
        __post_3."headline" as "1",
        __person_type_function_list__."id"::text as "2",
        __post_4."id"::text as "3",
        __post_4."headline" as "4",
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
        (
          select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
          from unnest(__person_type_function_list__."interval_array") t
        )::text as "28",
        __person_type_function_list__."money"::numeric::text as "29",
        __frmcdc_compound_type_7."a"::text as "30",
        __frmcdc_compound_type_7."b" as "31",
        __frmcdc_compound_type_7."c"::text as "32",
        __frmcdc_compound_type_7."d" as "33",
        __frmcdc_compound_type_7."e"::text as "34",
        __frmcdc_compound_type_7."f"::text as "35",
        __frmcdc_compound_type_7."foo_bar"::text as "36",
        (not (__frmcdc_compound_type_7 is null))::text as "37",
        __frmcdc_compound_type_8."a"::text as "38",
        __frmcdc_compound_type_8."b" as "39",
        __frmcdc_compound_type_8."c"::text as "40",
        __frmcdc_compound_type_8."d" as "41",
        __frmcdc_compound_type_8."e"::text as "42",
        __frmcdc_compound_type_8."f"::text as "43",
        __frmcdc_compound_type_8."foo_bar"::text as "44",
        (not (__frmcdc_compound_type_8 is null))::text as "45",
        __frmcdc_compound_type_9."a"::text as "46",
        __frmcdc_compound_type_9."b" as "47",
        __frmcdc_compound_type_9."c"::text as "48",
        __frmcdc_compound_type_9."d" as "49",
        __frmcdc_compound_type_9."e"::text as "50",
        __frmcdc_compound_type_9."f"::text as "51",
        __frmcdc_compound_type_9."foo_bar"::text as "52",
        (not (__frmcdc_compound_type_9 is null))::text as "53",
        __frmcdc_nested_compound_type_3."baz_buz"::text as "54",
        (not (__frmcdc_nested_compound_type_3 is null))::text as "55",
        __frmcdc_compound_type_10."a"::text as "56",
        __frmcdc_compound_type_10."b" as "57",
        __frmcdc_compound_type_10."c"::text as "58",
        __frmcdc_compound_type_10."d" as "59",
        __frmcdc_compound_type_10."e"::text as "60",
        __frmcdc_compound_type_10."f"::text as "61",
        __frmcdc_compound_type_10."foo_bar"::text as "62",
        (not (__frmcdc_compound_type_10 is null))::text as "63",
        __frmcdc_compound_type_11."a"::text as "64",
        __frmcdc_compound_type_11."b" as "65",
        __frmcdc_compound_type_11."c"::text as "66",
        __frmcdc_compound_type_11."d" as "67",
        __frmcdc_compound_type_11."e"::text as "68",
        __frmcdc_compound_type_11."f"::text as "69",
        __frmcdc_compound_type_11."foo_bar"::text as "70",
        (not (__frmcdc_compound_type_11 is null))::text as "71",
        __frmcdc_compound_type_12."a"::text as "72",
        __frmcdc_compound_type_12."b" as "73",
        __frmcdc_compound_type_12."c"::text as "74",
        __frmcdc_compound_type_12."d" as "75",
        __frmcdc_compound_type_12."e"::text as "76",
        __frmcdc_compound_type_12."f"::text as "77",
        __frmcdc_compound_type_12."foo_bar"::text as "78",
        (not (__frmcdc_compound_type_12 is null))::text as "79",
        __frmcdc_nested_compound_type_4."baz_buz"::text as "80",
        (not (__frmcdc_nested_compound_type_4 is null))::text as "81",
        __person_type_function_list__."point"::text as "82",
        __person_type_function_list__."nullablePoint"::text as "83",
        __person_type_function_list__."inet"::text as "84",
        __person_type_function_list__."cidr"::text as "85",
        __person_type_function_list__."macaddr"::text as "86",
        __person_type_function_list__."regproc"::text as "87",
        __person_type_function_list__."regprocedure"::text as "88",
        __person_type_function_list__."regoper"::text as "89",
        __person_type_function_list__."regoperator"::text as "90",
        __person_type_function_list__."regclass"::text as "91",
        __person_type_function_list__."regtype"::text as "92",
        __person_type_function_list__."regconfig"::text as "93",
        __person_type_function_list__."regdictionary"::text as "94",
        __person_type_function_list__."text_array_domain"::text as "95",
        __person_type_function_list__."int8_array_domain"::text as "96",
        __person_type_function_list__."bytea"::text as "97",
        __person_type_function_list__."bytea_array"::text as "98"
      from unnest("c"."person_type_function_list"(__person__)) as __person_type_function_list__
      left outer join "a"."post" as __post_3
      on (__person_type_function_list__."id"::"int4" = __post_3."id")
      left outer join "a"."post" as __post_4
      on (__person_type_function_list__."smallint"::"int4" = __post_4."id")
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
    ) s) as "99",
    (select json_agg(s) from (
      select
        __post_5."id"::text as "0",
        __post_5."headline" as "1",
        __person_type_function_connection__."id"::text as "2",
        __post_6."id"::text as "3",
        __post_6."headline" as "4",
        __person_type_function_connection__."smallint"::text as "5",
        __person_type_function_connection__."bigint"::text as "6",
        __person_type_function_connection__."numeric"::text as "7",
        __person_type_function_connection__."decimal"::text as "8",
        __person_type_function_connection__."boolean"::text as "9",
        __person_type_function_connection__."varchar" as "10",
        __person_type_function_connection__."enum"::text as "11",
        __person_type_function_connection__."enum_array"::text as "12",
        __person_type_function_connection__."domain"::text as "13",
        __person_type_function_connection__."domain2"::text as "14",
        __person_type_function_connection__."text_array"::text as "15",
        __person_type_function_connection__."json"::text as "16",
        __person_type_function_connection__."jsonb"::text as "17",
        __person_type_function_connection__."nullable_range"::text as "18",
        __person_type_function_connection__."numrange"::text as "19",
        json_build_array(
          lower_inc(__person_type_function_connection__."daterange"),
          to_char(lower(__person_type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
          to_char(upper(__person_type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
          upper_inc(__person_type_function_connection__."daterange")
        )::text as "20",
        __person_type_function_connection__."an_int_range"::text as "21",
        to_char(__person_type_function_connection__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
        to_char(__person_type_function_connection__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
        to_char(__person_type_function_connection__."date", 'YYYY-MM-DD'::text) as "24",
        to_char(date '1970-01-01' + __person_type_function_connection__."time", 'HH24:MI:SS.US'::text) as "25",
        to_char(date '1970-01-01' + __person_type_function_connection__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
        to_char(__person_type_function_connection__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
        (
          select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
          from unnest(__person_type_function_connection__."interval_array") t
        )::text as "28",
        __person_type_function_connection__."money"::numeric::text as "29",
        __frmcdc_compound_type_13."a"::text as "30",
        __frmcdc_compound_type_13."b" as "31",
        __frmcdc_compound_type_13."c"::text as "32",
        __frmcdc_compound_type_13."d" as "33",
        __frmcdc_compound_type_13."e"::text as "34",
        __frmcdc_compound_type_13."f"::text as "35",
        __frmcdc_compound_type_13."foo_bar"::text as "36",
        (not (__frmcdc_compound_type_13 is null))::text as "37",
        __frmcdc_compound_type_14."a"::text as "38",
        __frmcdc_compound_type_14."b" as "39",
        __frmcdc_compound_type_14."c"::text as "40",
        __frmcdc_compound_type_14."d" as "41",
        __frmcdc_compound_type_14."e"::text as "42",
        __frmcdc_compound_type_14."f"::text as "43",
        __frmcdc_compound_type_14."foo_bar"::text as "44",
        (not (__frmcdc_compound_type_14 is null))::text as "45",
        __frmcdc_compound_type_15."a"::text as "46",
        __frmcdc_compound_type_15."b" as "47",
        __frmcdc_compound_type_15."c"::text as "48",
        __frmcdc_compound_type_15."d" as "49",
        __frmcdc_compound_type_15."e"::text as "50",
        __frmcdc_compound_type_15."f"::text as "51",
        __frmcdc_compound_type_15."foo_bar"::text as "52",
        (not (__frmcdc_compound_type_15 is null))::text as "53",
        __frmcdc_nested_compound_type_5."baz_buz"::text as "54",
        (not (__frmcdc_nested_compound_type_5 is null))::text as "55",
        __frmcdc_compound_type_16."a"::text as "56",
        __frmcdc_compound_type_16."b" as "57",
        __frmcdc_compound_type_16."c"::text as "58",
        __frmcdc_compound_type_16."d" as "59",
        __frmcdc_compound_type_16."e"::text as "60",
        __frmcdc_compound_type_16."f"::text as "61",
        __frmcdc_compound_type_16."foo_bar"::text as "62",
        (not (__frmcdc_compound_type_16 is null))::text as "63",
        __frmcdc_compound_type_17."a"::text as "64",
        __frmcdc_compound_type_17."b" as "65",
        __frmcdc_compound_type_17."c"::text as "66",
        __frmcdc_compound_type_17."d" as "67",
        __frmcdc_compound_type_17."e"::text as "68",
        __frmcdc_compound_type_17."f"::text as "69",
        __frmcdc_compound_type_17."foo_bar"::text as "70",
        (not (__frmcdc_compound_type_17 is null))::text as "71",
        __frmcdc_compound_type_18."a"::text as "72",
        __frmcdc_compound_type_18."b" as "73",
        __frmcdc_compound_type_18."c"::text as "74",
        __frmcdc_compound_type_18."d" as "75",
        __frmcdc_compound_type_18."e"::text as "76",
        __frmcdc_compound_type_18."f"::text as "77",
        __frmcdc_compound_type_18."foo_bar"::text as "78",
        (not (__frmcdc_compound_type_18 is null))::text as "79",
        __frmcdc_nested_compound_type_6."baz_buz"::text as "80",
        (not (__frmcdc_nested_compound_type_6 is null))::text as "81",
        __person_type_function_connection__."point"::text as "82",
        __person_type_function_connection__."nullablePoint"::text as "83",
        __person_type_function_connection__."inet"::text as "84",
        __person_type_function_connection__."cidr"::text as "85",
        __person_type_function_connection__."macaddr"::text as "86",
        __person_type_function_connection__."regproc"::text as "87",
        __person_type_function_connection__."regprocedure"::text as "88",
        __person_type_function_connection__."regoper"::text as "89",
        __person_type_function_connection__."regoperator"::text as "90",
        __person_type_function_connection__."regclass"::text as "91",
        __person_type_function_connection__."regtype"::text as "92",
        __person_type_function_connection__."regconfig"::text as "93",
        __person_type_function_connection__."regdictionary"::text as "94",
        __person_type_function_connection__."text_array_domain"::text as "95",
        __person_type_function_connection__."int8_array_domain"::text as "96",
        __person_type_function_connection__."bytea"::text as "97",
        __person_type_function_connection__."bytea_array"::text as "98",
        __post_7."id"::text as "99",
        __post_7."headline" as "100",
        __post_8."id"::text as "101",
        __post_8."headline" as "102",
        __frmcdc_compound_type_19."a"::text as "103",
        __frmcdc_compound_type_19."b" as "104",
        __frmcdc_compound_type_19."c"::text as "105",
        __frmcdc_compound_type_19."d" as "106",
        __frmcdc_compound_type_19."e"::text as "107",
        __frmcdc_compound_type_19."f"::text as "108",
        __frmcdc_compound_type_19."foo_bar"::text as "109",
        (not (__frmcdc_compound_type_19 is null))::text as "110",
        __frmcdc_compound_type_20."a"::text as "111",
        __frmcdc_compound_type_20."b" as "112",
        __frmcdc_compound_type_20."c"::text as "113",
        __frmcdc_compound_type_20."d" as "114",
        __frmcdc_compound_type_20."e"::text as "115",
        __frmcdc_compound_type_20."f"::text as "116",
        __frmcdc_compound_type_20."foo_bar"::text as "117",
        (not (__frmcdc_compound_type_20 is null))::text as "118",
        __frmcdc_compound_type_21."a"::text as "119",
        __frmcdc_compound_type_21."b" as "120",
        __frmcdc_compound_type_21."c"::text as "121",
        __frmcdc_compound_type_21."d" as "122",
        __frmcdc_compound_type_21."e"::text as "123",
        __frmcdc_compound_type_21."f"::text as "124",
        __frmcdc_compound_type_21."foo_bar"::text as "125",
        (not (__frmcdc_compound_type_21 is null))::text as "126",
        __frmcdc_nested_compound_type_7."baz_buz"::text as "127",
        (not (__frmcdc_nested_compound_type_7 is null))::text as "128",
        __frmcdc_compound_type_22."a"::text as "129",
        __frmcdc_compound_type_22."b" as "130",
        __frmcdc_compound_type_22."c"::text as "131",
        __frmcdc_compound_type_22."d" as "132",
        __frmcdc_compound_type_22."e"::text as "133",
        __frmcdc_compound_type_22."f"::text as "134",
        __frmcdc_compound_type_22."foo_bar"::text as "135",
        (not (__frmcdc_compound_type_22 is null))::text as "136",
        __frmcdc_compound_type_23."a"::text as "137",
        __frmcdc_compound_type_23."b" as "138",
        __frmcdc_compound_type_23."c"::text as "139",
        __frmcdc_compound_type_23."d" as "140",
        __frmcdc_compound_type_23."e"::text as "141",
        __frmcdc_compound_type_23."f"::text as "142",
        __frmcdc_compound_type_23."foo_bar"::text as "143",
        (not (__frmcdc_compound_type_23 is null))::text as "144",
        __frmcdc_compound_type_24."a"::text as "145",
        __frmcdc_compound_type_24."b" as "146",
        __frmcdc_compound_type_24."c"::text as "147",
        __frmcdc_compound_type_24."d" as "148",
        __frmcdc_compound_type_24."e"::text as "149",
        __frmcdc_compound_type_24."f"::text as "150",
        __frmcdc_compound_type_24."foo_bar"::text as "151",
        (not (__frmcdc_compound_type_24 is null))::text as "152",
        __frmcdc_nested_compound_type_8."baz_buz"::text as "153",
        (not (__frmcdc_nested_compound_type_8 is null))::text as "154",
        (row_number() over (partition by 1))::text as "155"
      from "c"."person_type_function_connection"(__person__) as __person_type_function_connection__
      left outer join "a"."post" as __post_5
      on (__person_type_function_connection__."id"::"int4" = __post_5."id")
      left outer join "a"."post" as __post_6
      on (__person_type_function_connection__."smallint"::"int4" = __post_6."id")
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
      left outer join "a"."post" as __post_7
      on (__person_type_function_connection__."id"::"int4" = __post_7."id")
      left outer join "a"."post" as __post_8
      on (__person_type_function_connection__."smallint"::"int4" = __post_8."id")
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
    ) s) as "100",
    (select json_agg(s) from (
      select
        (count(*))::text as "0"
      from "c"."person_type_function_connection"(__person__) as __person_type_function_connection__
    ) s) as "101",
    __person__."id"::text as "102",
    __person_identifiers__.idx as "103"
  from "c"."person" as __person__
  left outer join "c"."person_type_function"(
    __person__,
    __person_identifiers__."id1"
  ) as __person_type_function__
  on TRUE
  left outer join "a"."post" as __post__
  on (__person_type_function__."id"::"int4" = __post__."id")
  left outer join "a"."post" as __post_2
  on (__person_type_function__."smallint"::"int4" = __post_2."id")
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
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __post_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __post_identifiers__,
lateral (
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
    (
      select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
      from unnest(__types__."interval_array") t
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
    __frmcdc_compound_type_3."a"::text as "46",
    __frmcdc_compound_type_3."b" as "47",
    __frmcdc_compound_type_3."c"::text as "48",
    __frmcdc_compound_type_3."d" as "49",
    __frmcdc_compound_type_3."e"::text as "50",
    __frmcdc_compound_type_3."f"::text as "51",
    __frmcdc_compound_type_3."foo_bar"::text as "52",
    (not (__frmcdc_compound_type_3 is null))::text as "53",
    __frmcdc_nested_compound_type__."baz_buz"::text as "54",
    (not (__frmcdc_nested_compound_type__ is null))::text as "55",
    __frmcdc_compound_type_4."a"::text as "56",
    __frmcdc_compound_type_4."b" as "57",
    __frmcdc_compound_type_4."c"::text as "58",
    __frmcdc_compound_type_4."d" as "59",
    __frmcdc_compound_type_4."e"::text as "60",
    __frmcdc_compound_type_4."f"::text as "61",
    __frmcdc_compound_type_4."foo_bar"::text as "62",
    (not (__frmcdc_compound_type_4 is null))::text as "63",
    __frmcdc_compound_type_5."a"::text as "64",
    __frmcdc_compound_type_5."b" as "65",
    __frmcdc_compound_type_5."c"::text as "66",
    __frmcdc_compound_type_5."d" as "67",
    __frmcdc_compound_type_5."e"::text as "68",
    __frmcdc_compound_type_5."f"::text as "69",
    __frmcdc_compound_type_5."foo_bar"::text as "70",
    (not (__frmcdc_compound_type_5 is null))::text as "71",
    __frmcdc_compound_type_6."a"::text as "72",
    __frmcdc_compound_type_6."b" as "73",
    __frmcdc_compound_type_6."c"::text as "74",
    __frmcdc_compound_type_6."d" as "75",
    __frmcdc_compound_type_6."e"::text as "76",
    __frmcdc_compound_type_6."f"::text as "77",
    __frmcdc_compound_type_6."foo_bar"::text as "78",
    (not (__frmcdc_compound_type_6 is null))::text as "79",
    __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
    (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
    __types__."point"::text as "82",
    __types__."nullablePoint"::text as "83",
    __types__."inet"::text as "84",
    __types__."cidr"::text as "85",
    __types__."macaddr"::text as "86",
    __types__."regproc"::text as "87",
    __types__."regprocedure"::text as "88",
    __types__."regoper"::text as "89",
    __types__."regoperator"::text as "90",
    __types__."regclass"::text as "91",
    __types__."regtype"::text as "92",
    __types__."regconfig"::text as "93",
    __types__."regdictionary"::text as "94",
    __types__."text_array_domain"::text as "95",
    __types__."int8_array_domain"::text as "96",
    __types__."bytea"::text as "97",
    __types__."bytea_array"::text as "98",
    (select json_agg(s) from (
      select
        __post_3."id"::text as "0",
        __post_3."headline" as "1",
        __types_2."id"::text as "2",
        __post_4."id"::text as "3",
        __post_4."headline" as "4",
        __types_2."smallint"::text as "5",
        __types_2."bigint"::text as "6",
        __types_2."numeric"::text as "7",
        __types_2."decimal"::text as "8",
        __types_2."boolean"::text as "9",
        __types_2."varchar" as "10",
        __types_2."enum"::text as "11",
        __types_2."enum_array"::text as "12",
        __types_2."domain"::text as "13",
        __types_2."domain2"::text as "14",
        __types_2."text_array"::text as "15",
        __types_2."json"::text as "16",
        __types_2."jsonb"::text as "17",
        __types_2."nullable_range"::text as "18",
        __types_2."numrange"::text as "19",
        json_build_array(
          lower_inc(__types_2."daterange"),
          to_char(lower(__types_2."daterange"), 'YYYY-MM-DD'::text),
          to_char(upper(__types_2."daterange"), 'YYYY-MM-DD'::text),
          upper_inc(__types_2."daterange")
        )::text as "20",
        __types_2."an_int_range"::text as "21",
        to_char(__types_2."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
        to_char(__types_2."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
        to_char(__types_2."date", 'YYYY-MM-DD'::text) as "24",
        to_char(date '1970-01-01' + __types_2."time", 'HH24:MI:SS.US'::text) as "25",
        to_char(date '1970-01-01' + __types_2."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
        to_char(__types_2."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
        (
          select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
          from unnest(__types_2."interval_array") t
        )::text as "28",
        __types_2."money"::numeric::text as "29",
        __frmcdc_compound_type_7."a"::text as "30",
        __frmcdc_compound_type_7."b" as "31",
        __frmcdc_compound_type_7."c"::text as "32",
        __frmcdc_compound_type_7."d" as "33",
        __frmcdc_compound_type_7."e"::text as "34",
        __frmcdc_compound_type_7."f"::text as "35",
        __frmcdc_compound_type_7."foo_bar"::text as "36",
        (not (__frmcdc_compound_type_7 is null))::text as "37",
        __frmcdc_compound_type_8."a"::text as "38",
        __frmcdc_compound_type_8."b" as "39",
        __frmcdc_compound_type_8."c"::text as "40",
        __frmcdc_compound_type_8."d" as "41",
        __frmcdc_compound_type_8."e"::text as "42",
        __frmcdc_compound_type_8."f"::text as "43",
        __frmcdc_compound_type_8."foo_bar"::text as "44",
        (not (__frmcdc_compound_type_8 is null))::text as "45",
        __frmcdc_compound_type_9."a"::text as "46",
        __frmcdc_compound_type_9."b" as "47",
        __frmcdc_compound_type_9."c"::text as "48",
        __frmcdc_compound_type_9."d" as "49",
        __frmcdc_compound_type_9."e"::text as "50",
        __frmcdc_compound_type_9."f"::text as "51",
        __frmcdc_compound_type_9."foo_bar"::text as "52",
        (not (__frmcdc_compound_type_9 is null))::text as "53",
        __frmcdc_nested_compound_type_3."baz_buz"::text as "54",
        (not (__frmcdc_nested_compound_type_3 is null))::text as "55",
        __frmcdc_compound_type_10."a"::text as "56",
        __frmcdc_compound_type_10."b" as "57",
        __frmcdc_compound_type_10."c"::text as "58",
        __frmcdc_compound_type_10."d" as "59",
        __frmcdc_compound_type_10."e"::text as "60",
        __frmcdc_compound_type_10."f"::text as "61",
        __frmcdc_compound_type_10."foo_bar"::text as "62",
        (not (__frmcdc_compound_type_10 is null))::text as "63",
        __frmcdc_compound_type_11."a"::text as "64",
        __frmcdc_compound_type_11."b" as "65",
        __frmcdc_compound_type_11."c"::text as "66",
        __frmcdc_compound_type_11."d" as "67",
        __frmcdc_compound_type_11."e"::text as "68",
        __frmcdc_compound_type_11."f"::text as "69",
        __frmcdc_compound_type_11."foo_bar"::text as "70",
        (not (__frmcdc_compound_type_11 is null))::text as "71",
        __frmcdc_compound_type_12."a"::text as "72",
        __frmcdc_compound_type_12."b" as "73",
        __frmcdc_compound_type_12."c"::text as "74",
        __frmcdc_compound_type_12."d" as "75",
        __frmcdc_compound_type_12."e"::text as "76",
        __frmcdc_compound_type_12."f"::text as "77",
        __frmcdc_compound_type_12."foo_bar"::text as "78",
        (not (__frmcdc_compound_type_12 is null))::text as "79",
        __frmcdc_nested_compound_type_4."baz_buz"::text as "80",
        (not (__frmcdc_nested_compound_type_4 is null))::text as "81",
        __types_2."point"::text as "82",
        __types_2."nullablePoint"::text as "83",
        __types_2."inet"::text as "84",
        __types_2."cidr"::text as "85",
        __types_2."macaddr"::text as "86",
        __types_2."regproc"::text as "87",
        __types_2."regprocedure"::text as "88",
        __types_2."regoper"::text as "89",
        __types_2."regoperator"::text as "90",
        __types_2."regclass"::text as "91",
        __types_2."regtype"::text as "92",
        __types_2."regconfig"::text as "93",
        __types_2."regdictionary"::text as "94",
        __types_2."text_array_domain"::text as "95",
        __types_2."int8_array_domain"::text as "96",
        __types_2."bytea"::text as "97",
        __types_2."bytea_array"::text as "98",
        __post_5."id"::text as "99",
        __post_5."headline" as "100",
        __post_6."id"::text as "101",
        __post_6."headline" as "102",
        __frmcdc_compound_type_13."a"::text as "103",
        __frmcdc_compound_type_13."b" as "104",
        __frmcdc_compound_type_13."c"::text as "105",
        __frmcdc_compound_type_13."d" as "106",
        __frmcdc_compound_type_13."e"::text as "107",
        __frmcdc_compound_type_13."f"::text as "108",
        __frmcdc_compound_type_13."foo_bar"::text as "109",
        (not (__frmcdc_compound_type_13 is null))::text as "110",
        __frmcdc_compound_type_14."a"::text as "111",
        __frmcdc_compound_type_14."b" as "112",
        __frmcdc_compound_type_14."c"::text as "113",
        __frmcdc_compound_type_14."d" as "114",
        __frmcdc_compound_type_14."e"::text as "115",
        __frmcdc_compound_type_14."f"::text as "116",
        __frmcdc_compound_type_14."foo_bar"::text as "117",
        (not (__frmcdc_compound_type_14 is null))::text as "118",
        __frmcdc_compound_type_15."a"::text as "119",
        __frmcdc_compound_type_15."b" as "120",
        __frmcdc_compound_type_15."c"::text as "121",
        __frmcdc_compound_type_15."d" as "122",
        __frmcdc_compound_type_15."e"::text as "123",
        __frmcdc_compound_type_15."f"::text as "124",
        __frmcdc_compound_type_15."foo_bar"::text as "125",
        (not (__frmcdc_compound_type_15 is null))::text as "126",
        __frmcdc_nested_compound_type_5."baz_buz"::text as "127",
        (not (__frmcdc_nested_compound_type_5 is null))::text as "128",
        __frmcdc_compound_type_16."a"::text as "129",
        __frmcdc_compound_type_16."b" as "130",
        __frmcdc_compound_type_16."c"::text as "131",
        __frmcdc_compound_type_16."d" as "132",
        __frmcdc_compound_type_16."e"::text as "133",
        __frmcdc_compound_type_16."f"::text as "134",
        __frmcdc_compound_type_16."foo_bar"::text as "135",
        (not (__frmcdc_compound_type_16 is null))::text as "136",
        __frmcdc_compound_type_17."a"::text as "137",
        __frmcdc_compound_type_17."b" as "138",
        __frmcdc_compound_type_17."c"::text as "139",
        __frmcdc_compound_type_17."d" as "140",
        __frmcdc_compound_type_17."e"::text as "141",
        __frmcdc_compound_type_17."f"::text as "142",
        __frmcdc_compound_type_17."foo_bar"::text as "143",
        (not (__frmcdc_compound_type_17 is null))::text as "144",
        __frmcdc_compound_type_18."a"::text as "145",
        __frmcdc_compound_type_18."b" as "146",
        __frmcdc_compound_type_18."c"::text as "147",
        __frmcdc_compound_type_18."d" as "148",
        __frmcdc_compound_type_18."e"::text as "149",
        __frmcdc_compound_type_18."f"::text as "150",
        __frmcdc_compound_type_18."foo_bar"::text as "151",
        (not (__frmcdc_compound_type_18 is null))::text as "152",
        __frmcdc_nested_compound_type_6."baz_buz"::text as "153",
        (not (__frmcdc_nested_compound_type_6 is null))::text as "154"
      from "b"."types" as __types_2
      left outer join "a"."post" as __post_3
      on (__types_2."id"::"int4" = __post_3."id")
      left outer join "a"."post" as __post_4
      on (__types_2."smallint"::"int4" = __post_4."id")
      left outer join lateral (select (__types_2."compound_type").*) as __frmcdc_compound_type_7
      on TRUE
      left outer join lateral (select (__types_2."nested_compound_type").*) as __frmcdc_nested_compound_type_3
      on TRUE
      left outer join lateral (select (__frmcdc_nested_compound_type_3."a").*) as __frmcdc_compound_type_8
      on TRUE
      left outer join lateral (select (__frmcdc_nested_compound_type_3."b").*) as __frmcdc_compound_type_9
      on TRUE
      left outer join lateral (select (__types_2."nullable_compound_type").*) as __frmcdc_compound_type_10
      on TRUE
      left outer join lateral (select (__types_2."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_4
      on TRUE
      left outer join lateral (select (__frmcdc_nested_compound_type_4."a").*) as __frmcdc_compound_type_11
      on TRUE
      left outer join lateral (select (__frmcdc_nested_compound_type_4."b").*) as __frmcdc_compound_type_12
      on TRUE
      left outer join "a"."post" as __post_5
      on (__types_2."id"::"int4" = __post_5."id")
      left outer join "a"."post" as __post_6
      on (__types_2."smallint"::"int4" = __post_6."id")
      left outer join lateral (select (__types_2."compound_type").*) as __frmcdc_compound_type_13
      on TRUE
      left outer join lateral (select (__types_2."nested_compound_type").*) as __frmcdc_nested_compound_type_5
      on TRUE
      left outer join lateral (select (__frmcdc_nested_compound_type_5."a").*) as __frmcdc_compound_type_14
      on TRUE
      left outer join lateral (select (__frmcdc_nested_compound_type_5."b").*) as __frmcdc_compound_type_15
      on TRUE
      left outer join lateral (select (__types_2."nullable_compound_type").*) as __frmcdc_compound_type_16
      on TRUE
      left outer join lateral (select (__types_2."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_6
      on TRUE
      left outer join lateral (select (__frmcdc_nested_compound_type_6."a").*) as __frmcdc_compound_type_17
      on TRUE
      left outer join lateral (select (__frmcdc_nested_compound_type_6."b").*) as __frmcdc_compound_type_18
      on TRUE
      where (
        __post_7."id"::"int2" = __types_2."smallint"
      )
      order by __types_2."id" asc
    ) s) as "99",
    (select json_agg(s) from (
      select
        (count(*))::text as "0"
      from "b"."types" as __types_2
      where (
        __post_7."id"::"int2" = __types_2."smallint"
      )
    ) s) as "100",
    __post_7."id"::text as "101",
    __post_7."headline" as "102",
    __post_identifiers__.idx as "103"
  from "a"."post" as __post_7
  left outer join "b"."types" as __types__
  on (__post_7."id"::"int4" = __types__."id")
  left outer join "a"."post" as __post__
  on (__types__."id"::"int4" = __post__."id")
  left outer join "a"."post" as __post_2
  on (__types__."smallint"::"int4" = __post_2."id")
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
    __post_7."id" = __post_identifiers__."id0"
  )
) as __post_result__;

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
  (
    select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
    from unnest(__types__."interval_array") t
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
  __frmcdc_compound_type_3."a"::text as "46",
  __frmcdc_compound_type_3."b" as "47",
  __frmcdc_compound_type_3."c"::text as "48",
  __frmcdc_compound_type_3."d" as "49",
  __frmcdc_compound_type_3."e"::text as "50",
  __frmcdc_compound_type_3."f"::text as "51",
  __frmcdc_compound_type_3."foo_bar"::text as "52",
  (not (__frmcdc_compound_type_3 is null))::text as "53",
  __frmcdc_nested_compound_type__."baz_buz"::text as "54",
  (not (__frmcdc_nested_compound_type__ is null))::text as "55",
  __frmcdc_compound_type_4."a"::text as "56",
  __frmcdc_compound_type_4."b" as "57",
  __frmcdc_compound_type_4."c"::text as "58",
  __frmcdc_compound_type_4."d" as "59",
  __frmcdc_compound_type_4."e"::text as "60",
  __frmcdc_compound_type_4."f"::text as "61",
  __frmcdc_compound_type_4."foo_bar"::text as "62",
  (not (__frmcdc_compound_type_4 is null))::text as "63",
  __frmcdc_compound_type_5."a"::text as "64",
  __frmcdc_compound_type_5."b" as "65",
  __frmcdc_compound_type_5."c"::text as "66",
  __frmcdc_compound_type_5."d" as "67",
  __frmcdc_compound_type_5."e"::text as "68",
  __frmcdc_compound_type_5."f"::text as "69",
  __frmcdc_compound_type_5."foo_bar"::text as "70",
  (not (__frmcdc_compound_type_5 is null))::text as "71",
  __frmcdc_compound_type_6."a"::text as "72",
  __frmcdc_compound_type_6."b" as "73",
  __frmcdc_compound_type_6."c"::text as "74",
  __frmcdc_compound_type_6."d" as "75",
  __frmcdc_compound_type_6."e"::text as "76",
  __frmcdc_compound_type_6."f"::text as "77",
  __frmcdc_compound_type_6."foo_bar"::text as "78",
  (not (__frmcdc_compound_type_6 is null))::text as "79",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
  __types__."point"::text as "82",
  __types__."nullablePoint"::text as "83",
  __types__."inet"::text as "84",
  __types__."cidr"::text as "85",
  __types__."macaddr"::text as "86",
  __types__."regproc"::text as "87",
  __types__."regprocedure"::text as "88",
  __types__."regoper"::text as "89",
  __types__."regoperator"::text as "90",
  __types__."regclass"::text as "91",
  __types__."regtype"::text as "92",
  __types__."regconfig"::text as "93",
  __types__."regdictionary"::text as "94",
  __types__."text_array_domain"::text as "95",
  __types__."int8_array_domain"::text as "96",
  __types__."bytea"::text as "97",
  __types__."bytea_array"::text as "98",
  __post_3."id"::text as "99",
  __post_3."headline" as "100",
  __post_4."id"::text as "101",
  __post_4."headline" as "102",
  __frmcdc_compound_type_7."a"::text as "103",
  __frmcdc_compound_type_7."b" as "104",
  __frmcdc_compound_type_7."c"::text as "105",
  __frmcdc_compound_type_7."d" as "106",
  __frmcdc_compound_type_7."e"::text as "107",
  __frmcdc_compound_type_7."f"::text as "108",
  __frmcdc_compound_type_7."foo_bar"::text as "109",
  (not (__frmcdc_compound_type_7 is null))::text as "110",
  __frmcdc_compound_type_8."a"::text as "111",
  __frmcdc_compound_type_8."b" as "112",
  __frmcdc_compound_type_8."c"::text as "113",
  __frmcdc_compound_type_8."d" as "114",
  __frmcdc_compound_type_8."e"::text as "115",
  __frmcdc_compound_type_8."f"::text as "116",
  __frmcdc_compound_type_8."foo_bar"::text as "117",
  (not (__frmcdc_compound_type_8 is null))::text as "118",
  __frmcdc_compound_type_9."a"::text as "119",
  __frmcdc_compound_type_9."b" as "120",
  __frmcdc_compound_type_9."c"::text as "121",
  __frmcdc_compound_type_9."d" as "122",
  __frmcdc_compound_type_9."e"::text as "123",
  __frmcdc_compound_type_9."f"::text as "124",
  __frmcdc_compound_type_9."foo_bar"::text as "125",
  (not (__frmcdc_compound_type_9 is null))::text as "126",
  __frmcdc_nested_compound_type_3."baz_buz"::text as "127",
  (not (__frmcdc_nested_compound_type_3 is null))::text as "128",
  __frmcdc_compound_type_10."a"::text as "129",
  __frmcdc_compound_type_10."b" as "130",
  __frmcdc_compound_type_10."c"::text as "131",
  __frmcdc_compound_type_10."d" as "132",
  __frmcdc_compound_type_10."e"::text as "133",
  __frmcdc_compound_type_10."f"::text as "134",
  __frmcdc_compound_type_10."foo_bar"::text as "135",
  (not (__frmcdc_compound_type_10 is null))::text as "136",
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
  (not (__frmcdc_compound_type_12 is null))::text as "152",
  __frmcdc_nested_compound_type_4."baz_buz"::text as "153",
  (not (__frmcdc_nested_compound_type_4 is null))::text as "154"
from "b"."types" as __types__
left outer join "a"."post" as __post__
on (__types__."id"::"int4" = __post__."id")
left outer join "a"."post" as __post_2
on (__types__."smallint"::"int4" = __post_2."id")
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
left outer join "a"."post" as __post_3
on (__types__."id"::"int4" = __post_3."id")
left outer join "a"."post" as __post_4
on (__types__."smallint"::"int4" = __post_4."id")
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type_7
on TRUE
left outer join lateral (select (__types__."nested_compound_type").*) as __frmcdc_nested_compound_type_3
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_3."a").*) as __frmcdc_compound_type_8
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_3."b").*) as __frmcdc_compound_type_9
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_10
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
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __type_function_connection__."id"::text as "2",
  __post_2."id"::text as "3",
  __post_2."headline" as "4",
  __type_function_connection__."smallint"::text as "5",
  __type_function_connection__."bigint"::text as "6",
  __type_function_connection__."numeric"::text as "7",
  __type_function_connection__."decimal"::text as "8",
  __type_function_connection__."boolean"::text as "9",
  __type_function_connection__."varchar" as "10",
  __type_function_connection__."enum"::text as "11",
  __type_function_connection__."enum_array"::text as "12",
  __type_function_connection__."domain"::text as "13",
  __type_function_connection__."domain2"::text as "14",
  __type_function_connection__."text_array"::text as "15",
  __type_function_connection__."json"::text as "16",
  __type_function_connection__."jsonb"::text as "17",
  __type_function_connection__."nullable_range"::text as "18",
  __type_function_connection__."numrange"::text as "19",
  json_build_array(
    lower_inc(__type_function_connection__."daterange"),
    to_char(lower(__type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__type_function_connection__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__type_function_connection__."daterange")
  )::text as "20",
  __type_function_connection__."an_int_range"::text as "21",
  to_char(__type_function_connection__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "22",
  to_char(__type_function_connection__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "23",
  to_char(__type_function_connection__."date", 'YYYY-MM-DD'::text) as "24",
  to_char(date '1970-01-01' + __type_function_connection__."time", 'HH24:MI:SS.US'::text) as "25",
  to_char(date '1970-01-01' + __type_function_connection__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "26",
  to_char(__type_function_connection__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "27",
  (
    select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
    from unnest(__type_function_connection__."interval_array") t
  )::text as "28",
  __type_function_connection__."money"::numeric::text as "29",
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
  __frmcdc_compound_type_3."a"::text as "46",
  __frmcdc_compound_type_3."b" as "47",
  __frmcdc_compound_type_3."c"::text as "48",
  __frmcdc_compound_type_3."d" as "49",
  __frmcdc_compound_type_3."e"::text as "50",
  __frmcdc_compound_type_3."f"::text as "51",
  __frmcdc_compound_type_3."foo_bar"::text as "52",
  (not (__frmcdc_compound_type_3 is null))::text as "53",
  __frmcdc_nested_compound_type__."baz_buz"::text as "54",
  (not (__frmcdc_nested_compound_type__ is null))::text as "55",
  __frmcdc_compound_type_4."a"::text as "56",
  __frmcdc_compound_type_4."b" as "57",
  __frmcdc_compound_type_4."c"::text as "58",
  __frmcdc_compound_type_4."d" as "59",
  __frmcdc_compound_type_4."e"::text as "60",
  __frmcdc_compound_type_4."f"::text as "61",
  __frmcdc_compound_type_4."foo_bar"::text as "62",
  (not (__frmcdc_compound_type_4 is null))::text as "63",
  __frmcdc_compound_type_5."a"::text as "64",
  __frmcdc_compound_type_5."b" as "65",
  __frmcdc_compound_type_5."c"::text as "66",
  __frmcdc_compound_type_5."d" as "67",
  __frmcdc_compound_type_5."e"::text as "68",
  __frmcdc_compound_type_5."f"::text as "69",
  __frmcdc_compound_type_5."foo_bar"::text as "70",
  (not (__frmcdc_compound_type_5 is null))::text as "71",
  __frmcdc_compound_type_6."a"::text as "72",
  __frmcdc_compound_type_6."b" as "73",
  __frmcdc_compound_type_6."c"::text as "74",
  __frmcdc_compound_type_6."d" as "75",
  __frmcdc_compound_type_6."e"::text as "76",
  __frmcdc_compound_type_6."f"::text as "77",
  __frmcdc_compound_type_6."foo_bar"::text as "78",
  (not (__frmcdc_compound_type_6 is null))::text as "79",
  __frmcdc_nested_compound_type_2."baz_buz"::text as "80",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "81",
  __type_function_connection__."point"::text as "82",
  __type_function_connection__."nullablePoint"::text as "83",
  __type_function_connection__."inet"::text as "84",
  __type_function_connection__."cidr"::text as "85",
  __type_function_connection__."macaddr"::text as "86",
  __type_function_connection__."regproc"::text as "87",
  __type_function_connection__."regprocedure"::text as "88",
  __type_function_connection__."regoper"::text as "89",
  __type_function_connection__."regoperator"::text as "90",
  __type_function_connection__."regclass"::text as "91",
  __type_function_connection__."regtype"::text as "92",
  __type_function_connection__."regconfig"::text as "93",
  __type_function_connection__."regdictionary"::text as "94",
  __type_function_connection__."text_array_domain"::text as "95",
  __type_function_connection__."int8_array_domain"::text as "96",
  __type_function_connection__."bytea"::text as "97",
  __type_function_connection__."bytea_array"::text as "98",
  __post_3."id"::text as "99",
  __post_3."headline" as "100",
  __post_4."id"::text as "101",
  __post_4."headline" as "102",
  __frmcdc_compound_type_7."a"::text as "103",
  __frmcdc_compound_type_7."b" as "104",
  __frmcdc_compound_type_7."c"::text as "105",
  __frmcdc_compound_type_7."d" as "106",
  __frmcdc_compound_type_7."e"::text as "107",
  __frmcdc_compound_type_7."f"::text as "108",
  __frmcdc_compound_type_7."foo_bar"::text as "109",
  (not (__frmcdc_compound_type_7 is null))::text as "110",
  __frmcdc_compound_type_8."a"::text as "111",
  __frmcdc_compound_type_8."b" as "112",
  __frmcdc_compound_type_8."c"::text as "113",
  __frmcdc_compound_type_8."d" as "114",
  __frmcdc_compound_type_8."e"::text as "115",
  __frmcdc_compound_type_8."f"::text as "116",
  __frmcdc_compound_type_8."foo_bar"::text as "117",
  (not (__frmcdc_compound_type_8 is null))::text as "118",
  __frmcdc_compound_type_9."a"::text as "119",
  __frmcdc_compound_type_9."b" as "120",
  __frmcdc_compound_type_9."c"::text as "121",
  __frmcdc_compound_type_9."d" as "122",
  __frmcdc_compound_type_9."e"::text as "123",
  __frmcdc_compound_type_9."f"::text as "124",
  __frmcdc_compound_type_9."foo_bar"::text as "125",
  (not (__frmcdc_compound_type_9 is null))::text as "126",
  __frmcdc_nested_compound_type_3."baz_buz"::text as "127",
  (not (__frmcdc_nested_compound_type_3 is null))::text as "128",
  __frmcdc_compound_type_10."a"::text as "129",
  __frmcdc_compound_type_10."b" as "130",
  __frmcdc_compound_type_10."c"::text as "131",
  __frmcdc_compound_type_10."d" as "132",
  __frmcdc_compound_type_10."e"::text as "133",
  __frmcdc_compound_type_10."f"::text as "134",
  __frmcdc_compound_type_10."foo_bar"::text as "135",
  (not (__frmcdc_compound_type_10 is null))::text as "136",
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
  (not (__frmcdc_compound_type_12 is null))::text as "152",
  __frmcdc_nested_compound_type_4."baz_buz"::text as "153",
  (not (__frmcdc_nested_compound_type_4 is null))::text as "154",
  (row_number() over (partition by 1))::text as "155"
from "b"."type_function_connection"() as __type_function_connection__
left outer join "a"."post" as __post__
on (__type_function_connection__."id"::"int4" = __post__."id")
left outer join "a"."post" as __post_2
on (__type_function_connection__."smallint"::"int4" = __post_2."id")
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
left outer join "a"."post" as __post_3
on (__type_function_connection__."id"::"int4" = __post_3."id")
left outer join "a"."post" as __post_4
on (__type_function_connection__."smallint"::"int4" = __post_4."id")
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