select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __json_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"json" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.__json_identity__::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__
) as __json_identity_result__

select __jsonb_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"jsonb" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __jsonb_identity_identifiers__,
lateral (
  select
    __jsonb_identity__.__jsonb_identity__::text as "0",
    __jsonb_identity_identifiers__.idx as "1"
  from "c"."jsonb_identity"(__jsonb_identity_identifiers__."id0") as __jsonb_identity__
) as __jsonb_identity_result__

select __jsonb_identity_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"jsonb" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __jsonb_identity_identifiers__,
lateral (
  select
    __jsonb_identity__.__jsonb_identity__::text as "0",
    __jsonb_identity_identifiers__.idx as "1"
  from "c"."jsonb_identity"(__jsonb_identity_identifiers__."id0") as __jsonb_identity__
) as __jsonb_identity_result__

select
  __types__."json"::text as "0",
  __types__."jsonb"::text as "1"
from "b"."types" as __types__
order by __types__."id" asc