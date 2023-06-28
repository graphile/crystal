select __range_test_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __range_test_identifiers__,
lateral (
  select
    __range_test__."int8"::text as "0",
    __range_test__."id"::text as "1",
    __range_test_identifiers__.idx as "2"
  from "ranges"."range_test" as __range_test__
  where (
    __range_test__."id" = __range_test_identifiers__."id0"
  )
) as __range_test_result__;