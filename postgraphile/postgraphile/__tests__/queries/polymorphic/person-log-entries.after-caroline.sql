select
  (select json_agg(s) from (
    select
      __log_entries__."text" as "0",
      __log_entries__."id"::text as "1"
    from "polymorphic"."log_entries" as __log_entries__
    where (
      __people__."person_id"::"int4" = __log_entries__."person_id"
    )
    order by __log_entries__."id" asc
    limit 1
  ) s) as "0",
  __people__."person_id"::text as "1",
  __people__."username" as "2"
from "polymorphic"."people" as __people__
where (
  __people__."person_id" > $1::"int4"
)
order by __people__."person_id" asc
limit 2;