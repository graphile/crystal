select
  __person__."id"::text as "0",
  __person__."about" as "1"
from "c"."person" as __person__
order by __person__."about" asc, __person__."id" asc
limit 1;

select
  __person__."id"::text as "0",
  __person__."about" as "1"
from "c"."person" as __person__
where (
  (((__person__."about" < $1::"text") or (__person__."about" is not null and $1::"text" is null)))
  or (
    __person__."about" is not distinct from $1::"text"
    and 
      (__person__."id" < $2::"int4")
  )
)
order by __person__."about" desc, __person__."id" desc;

select
  __person__."id"::text as "0",
  __person__."about" as "1"
from "c"."person" as __person__
where (
  (((__person__."about" > $1::"text") or (__person__."about" is null and $1::"text" is not null)))
  or (
    __person__."about" is not distinct from $1::"text"
    and 
      (__person__."id" > $2::"int4")
  )
)
order by __person__."about" asc, __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."about" as "1"
from "c"."person" as __person__
order by __person__."about" desc, __person__."id" desc
limit 5;