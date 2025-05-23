select
  __post__."headline" as "0",
  __post__."author_id"::text as "1",
  __post__."id"::text as "2"
from "a"."post" as __post__
order by __post__."author_id" desc, __post__."headline" desc, __post__."id" asc
limit 4;

select
  (count(*))::text as "0"
from "a"."post" as __post__;