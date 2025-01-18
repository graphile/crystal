select
  __person__."id"::text as "0",
  __post__."body" as "1",
  __post__."id"::text as "2"
from "d"."post" as __post__
left outer join "d"."person" as __person__
on (__post__."author_id"::"int4" = __person__."id")
order by __post__."id" asc;

select
  __person__."id"::text as "0",
  __post__."body" as "1",
  __post__."id"::text as "2"
from "d"."post" as __post__
left outer join "d"."person" as __person__
on (__post__."author_id"::"int4" = __person__."id")
where (
  (($1::"int4" is null and __post__."author_id" is null) or ($1::"int4" is not null and __post__."author_id" = $1::"int4"))
)
order by __post__."id" asc;

select
  __person__."id"::text as "0",
  __post__."body" as "1",
  __post__."id"::text as "2"
from "d"."post" as __post__
left outer join "d"."person" as __person__
on (__post__."author_id"::"int4" = __person__."id")
where (
  (($1::"int4" is null and __post__."author_id" is null) or ($1::"int4" is not null and __post__."author_id" = $1::"int4"))
)
order by __post__."id" asc;