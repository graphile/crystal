select __post_result__.*
from (select 0 as idx) as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."id" = $1::"int4"
  )
  order by __post__."id" asc
) as __post_result__;

select __edge_case_result__.*
from (select 0 as idx) as __edge_case_identifiers__,
lateral (
  select
    __edge_case__."row_id"::text as "0",
    __edge_case__."not_null_has_default"::text as "1",
    __edge_case_identifiers__.idx as "2"
  from "c"."edge_case" as __edge_case__
  where (
    __edge_case__."row_id" = $1::"int4"
  )
) as __edge_case_result__;