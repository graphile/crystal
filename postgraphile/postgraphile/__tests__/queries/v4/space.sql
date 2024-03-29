select __spacecraft_result__.*
from (select 0 as idx, $1::"space"."launch_pad" as "id0") as __spacecraft_identifiers__,
lateral (
  select
    __spacecraft__."id"::text as "0",
    __spacecraft__."name" as "1",
    json_build_array(
      lower_inc("space"."spacecraft_eta"(
        __spacecraft_2,
        __spacecraft_identifiers__."id0"
      )),
      to_char(lower("space"."spacecraft_eta"(
        __spacecraft_2,
        __spacecraft_identifiers__."id0"
      )), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
      to_char(upper("space"."spacecraft_eta"(
        __spacecraft_2,
        __spacecraft_identifiers__."id0"
      )), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
      upper_inc("space"."spacecraft_eta"(
        __spacecraft_2,
        __spacecraft_identifiers__."id0"
      ))
    )::text as "2",
    __spacecraft_2."id"::text as "3",
    __spacecraft_identifiers__.idx as "4"
  from "space"."spacecraft" as __spacecraft__
  left outer join lateral (select (__spacecraft__).*) as __spacecraft_2
  on TRUE
  order by __spacecraft__."id" asc
) as __spacecraft_result__;