select
  "c"."edge_case_computed"(__edge_case__) as "0",
  __edge_case__."wont_cast_easy"::text as "1",
  __edge_case__."row_id"::text as "2",
  __edge_case__."not_null_has_default"::text as "3"
from "c"."edge_case" as __edge_case__
order by "c"."edge_case_computed"(__edge_case__) asc, __edge_case__."row_id" asc;