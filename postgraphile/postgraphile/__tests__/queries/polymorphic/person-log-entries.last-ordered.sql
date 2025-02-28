select
  __people__."person_id"::text as "0",
  __people__."username" as "1",
  array(
    select array[
      __log_entries__."text",
      __log_entries__."id"::text
    ]::text[]
    from "polymorphic"."log_entries" as __log_entries__
    where (
      __log_entries__."person_id" = __people__."person_id"
    )
    order by __log_entries__."text" desc, __log_entries__."id" asc
    limit 1
  )::text as "2"
from "polymorphic"."people" as __people__
order by __people__."person_id" desc
limit 5;