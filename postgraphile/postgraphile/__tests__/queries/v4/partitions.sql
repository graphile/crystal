select
  to_char(__measurements__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
  __measurements__."key" as "1",
  __measurements__."value"::text as "2",
  __users__."id"::text as "3",
  __users__."name" as "4"
from "partitions"."measurements" as __measurements__
left outer join "partitions"."users" as __users__
on (__measurements__."user_id"::"int4" = __users__."id")
order by __measurements__."timestamp" asc, __measurements__."key" asc;

select
  (count(*))::text as "0"
from "partitions"."measurements" as __measurements__;