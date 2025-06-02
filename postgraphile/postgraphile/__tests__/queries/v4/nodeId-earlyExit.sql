select
  __person__."person_full_name" as "0"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."person_full_name" = $1::"varchar"
)
order by __person__."id" asc;

select
  __post__."id"::text as "0",
  __post__."headline" as "1"
from "a"."post" as __post__
where (
  __post__."headline" = $1::"text"
)
order by __post__."id" asc;