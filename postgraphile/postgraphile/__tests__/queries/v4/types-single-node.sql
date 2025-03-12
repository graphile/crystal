select
  __types__."id"::text as "0"
from "b"."types" as __types__
where (
  __types__."id" = $1::"int4"
);