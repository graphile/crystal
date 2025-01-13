select __post_result__.*
from (select 0 as idx, $2::"int4" as "id0") as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    (select json_agg(s) from (
      select
        (not (__post_computed_compound_type_array__ is null))::text as "0"
      from unnest("a"."post_computed_compound_type_array"(
        __post_2,
        $1::"c"."compound_type"
      )) as __post_computed_compound_type_array__
    ) s) as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  left outer join lateral (select (__post__).*) as __post_2
  on TRUE
  where (
    __post__."id" = __post_identifiers__."id0"
  )
) as __post_result__;