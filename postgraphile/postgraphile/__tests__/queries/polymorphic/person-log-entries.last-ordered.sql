select
  __people__."person_id"::text as "0",
  __people__."username" as "1"
from "polymorphic"."people" as __people__
order by __people__."person_id" desc
limit 5;

select __log_entries_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __log_entries_identifiers__,
lateral (
  select
    __log_entries__."text" as "0",
    __log_entries__."id"::text as "1",
    __log_entries_identifiers__.idx as "2"
  from "polymorphic"."log_entries" as __log_entries__
  where (
    __log_entries__."person_id" = __log_entries_identifiers__."id0"
  )
  order by __log_entries__."text" desc, __log_entries__."id" asc
  limit 1
) as __log_entries_result__;