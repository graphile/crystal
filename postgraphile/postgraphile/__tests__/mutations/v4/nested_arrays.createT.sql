insert into "nested_arrays"."t" as __t__ ("v") values ($1::"nested_arrays"."working_hours") returning
  __t__."k"::text as "0",
  __t__."v"::text as "1";

select __frmcdc_work_hour_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"nested_arrays"."work_hour"[] as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_work_hour_identifiers__,
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