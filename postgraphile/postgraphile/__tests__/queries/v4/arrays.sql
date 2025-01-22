select
  __lists__."id"::text as "0",
  __lists__."int_array"::text as "1",
  __lists__."int_array_nn"::text as "2",
  __lists__."enum_array"::text as "3",
  __lists__."enum_array_nn"::text as "4",
  (case when (__lists__."date_array") is not distinct from null then null::text else array(
    select to_char(__entry__, 'YYYY-MM-DD'::text)
    from unnest(__lists__."date_array") __entry__
  )::text end) as "5",
  array(
    select to_char(__entry_2, 'YYYY-MM-DD'::text)
    from unnest(__lists__."date_array_nn") __entry_2
  )::text as "6",
  (case when (__lists__."timestamptz_array") is not distinct from null then null::text else array(
    select to_char(__entry_3, 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text)
    from unnest(__lists__."timestamptz_array") __entry_3
  )::text end) as "7",
  array(
    select to_char(__entry_4, 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text)
    from unnest(__lists__."timestamptz_array_nn") __entry_4
  )::text as "8",
  (case when (__lists__."compound_type_array") is not distinct from null then null::text else array(
    select case when (__compound_type__) is not distinct from null then null::text else json_build_array((((__compound_type__)."a"))::text, ((__compound_type__)."b"), (((__compound_type__)."c"))::text, ((__compound_type__)."d"), (((__compound_type__)."e"))::text, (((__compound_type__)."f"))::text, to_char(((__compound_type__)."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__compound_type__)."foo_bar"))::text)::text end
    from unnest(__lists__."compound_type_array") __compound_type__
  )::text end) as "9",
  array(
    select case when (__compound_type_2) is not distinct from null then null::text else json_build_array((((__compound_type_2)."a"))::text, ((__compound_type_2)."b"), (((__compound_type_2)."c"))::text, ((__compound_type_2)."d"), (((__compound_type_2)."e"))::text, (((__compound_type_2)."f"))::text, to_char(((__compound_type_2)."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__compound_type_2)."foo_bar"))::text)::text end
    from unnest(__lists__."compound_type_array_nn") __compound_type_2
  )::text as "10",
  __lists__."bytea_array"::text as "11",
  __lists__."bytea_array_nn"::text as "12"
from "b"."lists" as __lists__
order by __lists__."id" asc;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type"[] as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
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
  from unnest(__frmcdc_compound_type_identifiers__."id0") as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;