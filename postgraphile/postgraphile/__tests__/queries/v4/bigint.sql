select
  __range_test__."int8"::text as "0",
  __range_test__."id"::text as "1"
from "ranges"."range_test" as __range_test__
where (
  __range_test__."id" = $1::"int4"
);