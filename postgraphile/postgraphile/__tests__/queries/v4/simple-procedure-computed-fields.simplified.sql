select
  __person__."person_full_name" as "0",
  array(
    select array[
      __post__."headline",
      "a"."post_headline_trimmed"(__post__)
    ]::text[]
    from "a"."post" as __post__
    where (
      __post__."author_id" = __person__."id"
    )
    order by __post__."id" desc
    limit 2
  )::text as "1"
from "c"."person" as __person__
order by __person__."id" asc;