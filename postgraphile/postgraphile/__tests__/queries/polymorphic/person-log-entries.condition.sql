select
  __people__."person_id"::text as "0",
  __people__."username" as "1"
from "polymorphic"."people" as __people__
where (
  __people__."username" = $1::"text"
)
order by __people__."person_id" asc;

select
  __log_entries__."text" as "0",
  __log_entries__."id"::text as "1"
from "polymorphic"."log_entries" as __log_entries__
where (
  __log_entries__."person_id" = $1::"int4"
)
order by __log_entries__."text" desc, __log_entries__."id" asc;