select
  __t__."k"::text as "0",
  __t__."v"::text as "1"
from "nested_arrays"."t" as __t__
order by __t__."k" asc;

with __frmcdc_work_hour_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, ids.id0 from rows from (json_to_recordset($1::json) as (id0 "nested_arrays"."work_hour"[])) with ordinality as ids
)
select __frmcdc_work_hour_result__.*
from __frmcdc_work_hour_identifiers__,
lateral (
  select
    __frmcdc_work_hour__."from_hours"::text as "0",
    __frmcdc_work_hour__."from_minutes"::text as "1",
    __frmcdc_work_hour__."to_hours"::text as "2",
    __frmcdc_work_hour__."to_minutes"::text as "3",
    (not (__frmcdc_work_hour__ is null))::text as "4",
    __frmcdc_work_hour_identifiers__.idx as "5"
  from unnest(__frmcdc_work_hour_identifiers__."id0") as __frmcdc_work_hour__
) as __frmcdc_work_hour_result__;