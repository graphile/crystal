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
    __authenticate__."role" as "0",
    __authenticate__."exp"::text as "1",
    __authenticate__."a"::text as "2",
    __authenticate__."b"::text as "3",
    __authenticate__."c"::text as "4",
    (not (__authenticate__ is null))::text as "5",
    __authenticate_identifiers__.idx as "6"
  from "b"."authenticate"(
    __authenticate_identifiers__."id0",
    __authenticate_identifiers__."id1",
    __authenticate_identifiers__."id2"
  ) as __authenticate__
) as __authenticate_result__