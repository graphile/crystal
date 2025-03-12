select
  __json_identity__.v::text as "0"
from "c"."json_identity"($1::"json") as __json_identity__(v);