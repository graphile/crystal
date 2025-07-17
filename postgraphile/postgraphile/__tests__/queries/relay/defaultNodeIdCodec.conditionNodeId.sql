select
  __post__."body" as "0",
  __post__."id"::text as "1",
  __person__."id"::text as "2"
from "d"."post" as __post__
left outer join "d"."person" as __person__
on (
/* WHERE becoming ON */ (
  __person__."id" = __post__."author_id"
))
order by __post__."id" asc;

select
  __post__."body" as "0",
  __post__."id"::text as "1",
  __person__."id"::text as "2"
from "d"."post" as __post__
left outer join "d"."person" as __person__
on (
/* WHERE becoming ON */ (
  __person__."id" = __post__."author_id"
))
where (
  __post__."author_id" = $1::"int4"
)
order by __post__."id" asc;

select
  __post__."body" as "0",
  __post__."id"::text as "1",
  __person__."id"::text as "2"
from "d"."post" as __post__
left outer join "d"."person" as __person__
on (
/* WHERE becoming ON */ (
  __person__."id" = __post__."author_id"
))
where (
  __post__."author_id" is null
)
order by __post__."id" asc;