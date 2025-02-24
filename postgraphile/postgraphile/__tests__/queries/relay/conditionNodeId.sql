select
  __post__."author_id"::text as "0",
  __post__."body" as "1",
  __post__."id"::text as "2"
from "d"."post" as __post__
order by __post__."id" asc;

select
  __post__."author_id"::text as "0",
  __post__."body" as "1",
  __post__."id"::text as "2"
from "d"."post" as __post__
where (
  __post__."author_id" = $1::"int4"
)
order by __post__."id" asc;

select
  __post__."author_id"::text as "0",
  __post__."body" as "1",
  __post__."id"::text as "2"
from "d"."post" as __post__
where (
  __post__."author_id" is null
)
order by __post__."id" asc;

select __person_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person_identifiers__.idx as "1"
  from "d"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select
  __person__."id"::text as "0"
from "d"."person" as __person__
where (
  __person__."id" = $1::"int4"
);