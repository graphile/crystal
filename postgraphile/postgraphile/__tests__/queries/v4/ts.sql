select
  json_build_array(
    lower_inc(__range_test__."ts"),
    to_char(lower(__range_test__."ts"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
    to_char(upper(__range_test__."ts"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text),
    upper_inc(__range_test__."ts")
  )::text as "0",
  __range_test__."id"::text as "1"
from "ranges"."range_test" as __range_test__
where (
  __range_test__."id" = $1::"int4"
);