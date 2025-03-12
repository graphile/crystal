select
  __post__."id"::text as "0",
  array(
    select array[
      (not (__post_computed_compound_type_array__ is null))::text
    ]::text[]
    from unnest("a"."post_computed_compound_type_array"(
      __post__,
      $1::"c"."compound_type"
    )) as __post_computed_compound_type_array__
  )::text as "1"
from "a"."post" as __post__
where (
  __post__."id" = $2::"int4"
);