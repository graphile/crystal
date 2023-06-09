select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
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
  order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
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
  order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
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
  order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
) as __compound_key_result__;

select __similar_table_1_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __similar_table_1_identifiers__,
lateral (
  select
    __similar_table_1__."id"::text as "0",
    __similar_table_1__."col1"::text as "1",
    __similar_table_1__."col2"::text as "2",
    __similar_table_1__."col3"::text as "3",
    __similar_table_1_identifiers__.idx as "4"
  from "a"."similar_table_1" as __similar_table_1__
  where (
    __similar_table_1__."id" = __similar_table_1_identifiers__."id0"
  )
  order by __similar_table_1__."id" asc
) as __similar_table_1_result__;

select __similar_table_2_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __similar_table_2_identifiers__,
lateral (
  select
    __similar_table_2__."id"::text as "0",
    __similar_table_2__."col3"::text as "1",
    __similar_table_2__."col4"::text as "2",
    __similar_table_2__."col5"::text as "3",
    __similar_table_2_identifiers__.idx as "4"
  from "a"."similar_table_2" as __similar_table_2__
  where (
    __similar_table_2__."id" = __similar_table_2_identifiers__."id0"
  )
  order by __similar_table_2__."id" asc
) as __similar_table_2_result__;

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