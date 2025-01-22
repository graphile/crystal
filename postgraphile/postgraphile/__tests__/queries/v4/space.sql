select
  __spacecraft__."id"::text as "0",
  __spacecraft__."name" as "1",
  case when (__spacecraft__) is not distinct from null then null::text else json_build_array((((__spacecraft__)."id"))::text, ((__spacecraft__)."name"), json_build_array(
    lower_inc(((__spacecraft__)."return_to_earth")),
    to_char(lower(((__spacecraft__)."return_to_earth")), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
    to_char(upper(((__spacecraft__)."return_to_earth")), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
    upper_inc(((__spacecraft__)."return_to_earth"))
  )::text)::text end as "2"
from "space"."spacecraft" as __spacecraft__
order by __spacecraft__."id" asc;

select __spacecraft_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"space"."spacecraft" as "id0" from json_array_elements($2::json) with ordinality as ids) as __spacecraft_identifiers__,
lateral (
  select
    json_build_array(
      lower_inc("space"."spacecraft_eta"(
        __spacecraft__,
        $1::"space"."launch_pad"
      )),
      to_char(lower("space"."spacecraft_eta"(
        __spacecraft__,
        $1::"space"."launch_pad"
      )), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
      to_char(upper("space"."spacecraft_eta"(
        __spacecraft__,
        $1::"space"."launch_pad"
      )), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
      upper_inc("space"."spacecraft_eta"(
        __spacecraft__,
        $1::"space"."launch_pad"
      ))
    )::text as "0",
    __spacecraft__."id"::text as "1",
    __spacecraft_identifiers__.idx as "2"
  from (select (__spacecraft_identifiers__."id0").*) as __spacecraft__
) as __spacecraft_result__;