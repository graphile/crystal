select
  __collections__."recommendations"::text as "0",
  (not (__collections__."id" is null))::text as "1"
from "polymorphic"."collections" as __collections__
where (
  __collections__."id" = $1::"text"
);

select
  (__collections__)."type" as "0",
  __collections__."id" as "1"
from "polymorphic"."collections" as __collections__
where (
  __collections__.id = ANY($1::"text"[])
)
order by __collections__."id" asc
limit 10;