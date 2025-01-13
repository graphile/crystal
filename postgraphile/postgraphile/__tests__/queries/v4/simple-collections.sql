select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2"
from "c"."person" as __person__
order by __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2"
from "c"."person" as __person__
order by __person__."id" asc
limit 2;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2"
from "c"."person" as __person__
order by __person__."person_full_name" asc, __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2"
from "c"."person" as __person__
order by __person__."person_full_name" desc, __person__."id" asc;

select __post_result__.*
from (select 0 as idx) as __post_identifiers__,
lateral (
  select
    __post__."headline" as "0",
    __post__."author_id"::text as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."author_id" = $1::"int4"
  )
  order by __post__."id" asc
) as __post_result__;

select __post_result__.*
from (select 0 as idx) as __post_identifiers__,
lateral (
  select
    __post__."headline" as "0",
    __post__."author_id"::text as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."author_id" = $1::"int4"
  )
  order by __post__."id" asc
  limit 2
) as __post_result__;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2"
from "c"."person" as __person__
order by __person__."id" asc
limit 3
offset 1;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2"
from "c"."person" as __person__
where (
  __person__."about" is null
)
order by __person__."id" asc;

select
  __post__."headline" as "0",
  __post__."author_id"::text as "1"
from "a"."post" as __post__
order by __post__."author_id" desc, __post__."headline" desc, __post__."id" asc
limit 3;