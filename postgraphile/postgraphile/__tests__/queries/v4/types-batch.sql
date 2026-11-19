with __type_identity_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."types" as "id0" from json_array_elements($1::json) with ordinality as ids
)
select __type_identity_result__.*
from __type_identity_identifiers__,
lateral (
  select
    __type_identity__."smallint"::text as "0",
    __type_identity__."bigint"::text as "1",
    __type_identity__."numeric"::text as "2",
    __type_identity__."decimal"::text as "3",
    __type_identity__."boolean"::text as "4",
    __type_identity__."varchar" as "5",
    __type_identity__."enum"::text as "6",
    __type_identity__."enum_array"::text as "7",
    __type_identity__."domain"::text as "8",
    __type_identity__."domain2"::text as "9",
    __type_identity__."text_array"::text as "10",
    __type_identity__."json"::text as "11",
    __type_identity__."jsonb"::text as "12",
    __type_identity__."jsonpath"::text as "13",
    __type_identity__."numrange"::text as "14",
    json_build_array(
      lower_inc(__type_identity__."daterange"),
      to_char(lower(__type_identity__."daterange"), 'YYYY-MM-DD'::text),
      to_char(upper(__type_identity__."daterange"), 'YYYY-MM-DD'::text),
      upper_inc(__type_identity__."daterange"),
      isempty(__type_identity__."daterange")
    )::text as "15",
    __type_identity__."an_int_range"::text as "16",
    to_char(__type_identity__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "17",
    to_char(__type_identity__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "18",
    to_char(__type_identity__."date", 'YYYY-MM-DD'::text) as "19",
    to_char(date '1970-01-01' + __type_identity__."time", 'HH24:MI:SS.US'::text) as "20",
    to_char(date '1970-01-01' + __type_identity__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "21",
    to_char(__type_identity__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "22",
    array(
      select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
      from unnest(__type_identity__."interval_array") __entry__
    )::text as "23",
    __type_identity__."money"::numeric::text as "24",
    __type_identity__."point"::text as "25",
    __type_identity__."nullablePoint"::text as "26",
    __type_identity__."inet"::text as "27",
    __type_identity__."cidr"::text as "28",
    __type_identity__."macaddr"::text as "29",
    __type_identity__."regproc"::text as "30",
    __type_identity__."regprocedure"::text as "31",
    __type_identity__."regoper"::text as "32",
    __type_identity__."regoperator"::text as "33",
    __type_identity__."regclass"::text as "34",
    __type_identity__."regtype"::text as "35",
    __type_identity__."regconfig"::text as "36",
    __type_identity__."regdictionary"::text as "37",
    __type_identity__."text_array_domain"::text as "38",
    __type_identity__."int8_array_domain"::text as "39",
    __type_identity__."bytea"::text as "40",
    __type_identity__."bytea_array"::text as "41",
    __type_identity__."ltree"::text as "42",
    __type_identity__."ltree_array"::text as "43",
    __frmcdc_compound_type__."a"::text as "44",
    (not (__frmcdc_compound_type__ is null))::text as "45",
    (
      select array[
        (not (__frmcdc_nested_compound_type__ is null))::text,
        __frmcdc_compound_type_2."a"::text,
        (not (__frmcdc_compound_type_2 is null))::text
      ]::text[]
      from (select (__type_identity__."nested_compound_type").*) as __frmcdc_nested_compound_type__
      left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
      on TRUE
    )::text as "46",
    __type_identity_identifiers__.idx as "47"
  from "b"."type_identity"(__type_identity_identifiers__."id0") as __type_identity__
  left outer join lateral (select (__type_identity__."compound_type").*) as __frmcdc_compound_type__
  on TRUE
) as __type_identity_result__;