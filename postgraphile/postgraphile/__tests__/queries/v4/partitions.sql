select
  to_char(__measurements__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
  __measurements__."key" as "1",
  __measurements__."value"::text as "2",
  __measurements__."user_id"::text as "3"
from "partitions"."measurements" as __measurements__
order by __measurements__."timestamp" asc, __measurements__."key" asc;

select
  (count(*))::text as "0"
from "partitions"."measurements" as __measurements__;

select __users_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __users_identifiers__,
lateral (
  select
    __users__."id"::text as "0",
    __users__."name" as "1",
    __users_identifiers__.idx as "2"
  from "partitions"."users" as __users__
  where (
    __users__."id" = __users_identifiers__."id0"
  )
) as __users_result__;