select
  __posts__."user_id"::text as "0",
  __people__."name" as "1"
from "refs"."posts" as __posts__
left outer join "refs"."people" as __people__
on (
/* WHERE becoming ON */ (
  __people__."id" = __posts__."user_id"
))
order by __posts__."id" asc;