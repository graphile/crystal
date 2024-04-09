select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."person_full_name" as "0",
    __person_identifiers__.idx as "1"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"varchar" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."person_full_name" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __post_result__.*
from (select 0 as idx, $1::"text" as "id0") as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."headline" = __post_identifiers__."id0"
  )
  order by __post__."id" asc
) as __post_result__;