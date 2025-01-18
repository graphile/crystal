select
  __post__."id"::text as "0",
  (select json_agg(s) from (
    select
      (not (__post_computed_compound_type_array__ is null))::text as "0"
    from unnest("a"."post_computed_compound_type_array"(
      __post_2,
      $1::"c"."compound_type"
    )) as __post_computed_compound_type_array__
  ) s) as "1"
from "a"."post" as __post__
left outer join lateral (select (__post__).*) as __post_2
on TRUE
where (
  __post__."id" = $2::"int4"
);