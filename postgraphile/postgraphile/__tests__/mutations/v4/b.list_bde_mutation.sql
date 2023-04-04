select __list_bde_mutation_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text"[] as "id0",
    (ids.value->>1)::"text" as "id1",
    (ids.value->>2)::"text" as "id2"
  from json_array_elements($1::json) with ordinality as ids
) as __list_bde_mutation_identifiers__,
lateral (
  select
    __list_bde_mutation__.v::text as "0",
    __list_bde_mutation_identifiers__.idx as "1"
  from "b"."list_bde_mutation"(
    __list_bde_mutation_identifiers__."id0",
    __list_bde_mutation_identifiers__."id1",
    __list_bde_mutation_identifiers__."id2"
  ) as __list_bde_mutation__(v)
) as __list_bde_mutation_result__;

select __list_bde_mutation_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text"[] as "id0",
    (ids.value->>1)::"text" as "id1",
    (ids.value->>2)::"text" as "id2"
  from json_array_elements($1::json) with ordinality as ids
) as __list_bde_mutation_identifiers__,
lateral (
  select
    __list_bde_mutation__.v::text as "0",
    __list_bde_mutation_identifiers__.idx as "1"
  from "b"."list_bde_mutation"(
    __list_bde_mutation_identifiers__."id0",
    __list_bde_mutation_identifiers__."id1",
    __list_bde_mutation_identifiers__."id2"
  ) as __list_bde_mutation__(v)
) as __list_bde_mutation_result__;

select __list_bde_mutation_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text"[] as "id0",
    (ids.value->>1)::"text" as "id1",
    (ids.value->>2)::"text" as "id2"
  from json_array_elements($1::json) with ordinality as ids
) as __list_bde_mutation_identifiers__,
lateral (
  select
    __list_bde_mutation__.v::text as "0",
    __list_bde_mutation_identifiers__.idx as "1"
  from "b"."list_bde_mutation"(
    __list_bde_mutation_identifiers__."id0",
    __list_bde_mutation_identifiers__."id1",
    __list_bde_mutation_identifiers__."id2"
  ) as __list_bde_mutation__(v)
) as __list_bde_mutation_result__;

select __list_bde_mutation_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text"[] as "id0",
    (ids.value->>1)::"text" as "id1",
    (ids.value->>2)::"text" as "id2"
  from json_array_elements($1::json) with ordinality as ids
) as __list_bde_mutation_identifiers__,
lateral (
  select
    __list_bde_mutation__.v::text as "0",
    __list_bde_mutation_identifiers__.idx as "1"
  from "b"."list_bde_mutation"(
    __list_bde_mutation_identifiers__."id0",
    __list_bde_mutation_identifiers__."id1",
    __list_bde_mutation_identifiers__."id2"
  ) as __list_bde_mutation__(v)
) as __list_bde_mutation_result__;