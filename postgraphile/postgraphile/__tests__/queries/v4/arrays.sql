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
  (select json_agg(s) from (
    select
      __frmcdc_compound_type__."a"::text as "0",
      __frmcdc_compound_type__."b" as "1",
      __frmcdc_compound_type__."c"::text as "2",
      __frmcdc_compound_type__."d" as "3",
      __frmcdc_compound_type__."e"::text as "4",
      __frmcdc_compound_type__."f"::text as "5",
      __frmcdc_compound_type__."foo_bar"::text as "6",
      (not (__frmcdc_compound_type__ is null))::text as "7"
    from unnest(__lists__."compound_type_array") as __frmcdc_compound_type__
  ) s) as "9",
  (select json_agg(s) from (
    select
      __frmcdc_compound_type_2."a"::text as "0",
      __frmcdc_compound_type_2."b" as "1",
      __frmcdc_compound_type_2."c"::text as "2",
      __frmcdc_compound_type_2."d" as "3",
      __frmcdc_compound_type_2."e"::text as "4",
      __frmcdc_compound_type_2."f"::text as "5",
      __frmcdc_compound_type_2."foo_bar"::text as "6",
      (not (__frmcdc_compound_type_2 is null))::text as "7"
    from unnest(__lists__."compound_type_array_nn") as __frmcdc_compound_type_2
  ) s) as "10",
  __lists__."bytea_array"::text as "11",
  __lists__."bytea_array_nn"::text as "12"
from "b"."lists" as __lists__
order by __lists__."id" asc;