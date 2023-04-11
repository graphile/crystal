select __authenticate_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"numeric" as "id1", $3::"int8" as "id2") as __authenticate_identifiers__,
lateral (
  select
    __authenticate__::text as "0",
    (not (__authenticate__ is null))::text as "1",
    __authenticate_identifiers__.idx as "2"
  from "b"."authenticate"(
    __authenticate_identifiers__."id0",
    __authenticate_identifiers__."id1",
    __authenticate_identifiers__."id2"
  ) as __authenticate__
) as __authenticate_result__;