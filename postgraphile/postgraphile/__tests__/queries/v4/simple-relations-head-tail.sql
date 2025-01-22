select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
order by __person__."id" asc;

select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc;

select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select
    __post__."headline" as "0",
    __post__."author_id"::text as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where (
    __post__."author_id" = __post_identifiers__."id0"
  )
  order by __post__."id" asc
  limit 2
) as __post_result__;

select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($2::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select
    __post__."headline" as "0",
    __post__."author_id"::text as "1",
    __post_identifiers__.idx as "2"
  from "a"."post" as __post__
  where
    (
      __post__."headline" = $1::"text"
    ) and (
      __post__."author_id" = __post_identifiers__."id0"
    )
  order by __post__."id" asc
) as __post_result__;

select __compound_key_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __compound_key_identifiers__,
lateral (
  select
    __compound_key__."person_id_1"::text as "0",
    __compound_key__."person_id_2"::text as "1",
    __compound_key_identifiers__.idx as "2"
  from "c"."compound_key" as __compound_key__
  where (
    __compound_key__."person_id_1" = __compound_key_identifiers__."id0"
  )
  order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
) as __compound_key_result__;

select __compound_key_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __compound_key_identifiers__,
lateral (
  select
    __compound_key__."person_id_1"::text as "0",
    __compound_key__."person_id_2"::text as "1",
    __compound_key_identifiers__.idx as "2"
  from "c"."compound_key" as __compound_key__
  where (
    __compound_key__."person_id_2" = __compound_key_identifiers__."id0"
  )
  order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
) as __compound_key_result__;