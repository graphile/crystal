select
  __spacecraft__."id"::text as "0",
  __spacecraft__."name" as "1",
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
  )::text as "2"
from "space"."spacecraft" as __spacecraft__
order by __spacecraft__."id" asc;