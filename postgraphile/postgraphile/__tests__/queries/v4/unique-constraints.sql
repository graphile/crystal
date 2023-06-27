select __person_result__.*
from (select 0 as idx, $1::"b"."email" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."person_full_name" as "0",
    __person__."email" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."email" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"b"."email" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."person_full_name" as "0",
    __person__."email" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."email" = __person_identifiers__."id0"
  )
) as __person_result__;

select __compound_key_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __compound_key_identifiers__,
lateral (
  select
    __compound_key__."person_id_1"::text as "0",
    __compound_key__."person_id_2"::text as "1",
    __compound_key_identifiers__.idx as "2"
  from "c"."compound_key" as __compound_key__
  where
    (
      __compound_key__."person_id_1" = __compound_key_identifiers__."id0"
    ) and (
      __compound_key__."person_id_2" = __compound_key_identifiers__."id1"
    )
) as __compound_key_result__;

select __compound_key_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __compound_key_identifiers__,
lateral (
  select
    __compound_key__."person_id_1"::text as "0",
    __compound_key__."person_id_2"::text as "1",
    __compound_key_identifiers__.idx as "2"
  from "c"."compound_key" as __compound_key__
  where
    (
      __compound_key__."person_id_1" = __compound_key_identifiers__."id0"
    ) and (
      __compound_key__."person_id_2" = __compound_key_identifiers__."id1"
    )
) as __compound_key_result__;

select __compound_key_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __compound_key_identifiers__,
lateral (
  select
    __compound_key__."person_id_1"::text as "0",
    __compound_key__."person_id_2"::text as "1",
    __compound_key_identifiers__.idx as "2"
  from "c"."compound_key" as __compound_key__
  where
    (
      __compound_key__."person_id_1" = __compound_key_identifiers__."id0"
    ) and (
      __compound_key__."person_id_2" = __compound_key_identifiers__."id1"
    )
) as __compound_key_result__;