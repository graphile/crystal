select __authenticate_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0",
    (ids.value->>1)::"numeric" as "id1",
    (ids.value->>2)::"int8" as "id2"
  from json_array_elements($1::json) with ordinality as ids
) as __authenticate_identifiers__,
lateral (
  select
    (not (__authenticate__ is null))::text as "0",
    __authenticate_identifiers__.idx as "1"
  from "b"."authenticate"(
    __authenticate_identifiers__."id0",
    __authenticate_identifiers__."id1",
    __authenticate_identifiers__."id2"
  ) as __authenticate__
) as __authenticate_result__