select
  __person__."id"::text as "0",
  __person__."first_name" as "1",
  __person__."last_name" as "2"
from "d"."person" as __person__
where (
  __person__."id" = $1::"int4"
);