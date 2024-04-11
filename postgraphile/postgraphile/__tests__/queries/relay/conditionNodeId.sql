select
  __person__."id"::text as "0",
  __post__."body" as "1",
  __post__."id"::text as "2"
from "d"."post" as __post__
left outer join "d"."person" as __person__
on (__post__."author_id"::"int4" = __person__."id")
order by __post__."id" asc;

select __post_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __post_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __post__."body" as "1",
    __post__."id"::text as "2",
    __post_identifiers__.idx as "3"
  from "d"."post" as __post__
  left outer join "d"."person" as __person__
  on (__post__."author_id"::"int4" = __person__."id")
  where (
    ((__post_identifiers__."id0" is null and __post__."author_id" is null) or (__post_identifiers__."id0" is not null and __post__."author_id" = __post_identifiers__."id0"))
  )
  order by __post__."id" asc
) as __post_result__;

select __post_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __post_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __post__."body" as "1",
    __post__."id"::text as "2",
    __post_identifiers__.idx as "3"
  from "d"."post" as __post__
  left outer join "d"."person" as __person__
  on (__post__."author_id"::"int4" = __person__."id")
  where (
    ((__post_identifiers__."id0" is null and __post__."author_id" is null) or (__post_identifiers__."id0" is not null and __post__."author_id" = __post_identifiers__."id0"))
  )
  order by __post__."id" asc
) as __post_result__;