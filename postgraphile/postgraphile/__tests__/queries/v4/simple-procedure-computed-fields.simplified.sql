select
  __person__."person_full_name" as "0",
  (select json_agg(s) from (
    select
      __post__."headline" as "0",
      "a"."post_headline_trimmed"(__post__) as "1"
    from "a"."post" as __post__
    where (
      __person__."id"::"int4" = __post__."author_id"
    )
    order by __post__."id" desc
    limit 2
  ) s) as "1"
from "c"."person" as __person__
order by __person__."id" asc;