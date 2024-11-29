select __json_identity_result__.*
from (select 0 as idx, $1::"json" as "id0") as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__(v)
) as __json_identity_result__;

select __jsonb_identity_result__.*
from (select 0 as idx, $1::"jsonb" as "id0") as __jsonb_identity_identifiers__,
lateral (
  select
    __jsonb_identity__.v::text as "0",
    __jsonb_identity_identifiers__.idx as "1"
  from "c"."jsonb_identity"(__jsonb_identity_identifiers__."id0") as __jsonb_identity__(v)
) as __jsonb_identity_result__;

select __json_identity_result__.*
from (select 0 as idx, $1::"json" as "id0") as __json_identity_identifiers__,
lateral (
  select
    __json_identity__.v::text as "0",
    __json_identity_identifiers__.idx as "1"
  from "c"."json_identity"(__json_identity_identifiers__."id0") as __json_identity__(v)
) as __json_identity_result__;

select __jsonb_identity_result__.*
from (select 0 as idx, $1::"jsonb" as "id0") as __jsonb_identity_identifiers__,
lateral (
  select
    __jsonb_identity__.v::text as "0",
    __jsonb_identity_identifiers__.idx as "1"
  from "c"."jsonb_identity"(__jsonb_identity_identifiers__."id0") as __jsonb_identity__(v)
) as __jsonb_identity_result__;

select __add_1_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_1_query_identifiers__,
lateral (
  select
    __add_1_query__.v::text as "0",
    __add_1_query_identifiers__.idx as "1"
  from "a"."add_1_query"(
    __add_1_query_identifiers__."id0",
    __add_1_query_identifiers__."id1"
  ) as __add_1_query__(v)
) as __add_1_query_result__;

select __add_2_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_2_query_identifiers__,
lateral (
  select
    __add_2_query__.v::text as "0",
    __add_2_query_identifiers__.idx as "1"
  from "a"."add_2_query"(
    __add_2_query_identifiers__."id0",
    __add_2_query_identifiers__."id1"
  ) as __add_2_query__(v)
) as __add_2_query_result__;

select __add_3_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_3_query_identifiers__,
lateral (
  select
    __add_3_query__.v::text as "0",
    __add_3_query_identifiers__.idx as "1"
  from "a"."add_3_query"(
    __add_3_query_identifiers__."id0",
    __add_3_query_identifiers__."id1"
  ) as __add_3_query__(v)
) as __add_3_query_result__;

select __add_4_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __add_4_query_identifiers__,
lateral (
  select
    __add_4_query__.v::text as "0",
    __add_4_query_identifiers__.idx as "1"
  from "a"."add_4_query"(
    __add_4_query_identifiers__."id0",
    __add_4_query_identifiers__."id1"
  ) as __add_4_query__(v)
) as __add_4_query_result__;

select __optional_missing_middle_1_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __optional_missing_middle_1_identifiers__,
lateral (
  select
    __optional_missing_middle_1__.v::text as "0",
    __optional_missing_middle_1_identifiers__.idx as "1"
  from "a"."optional_missing_middle_1"(
    __optional_missing_middle_1_identifiers__."id0",
    "c" := __optional_missing_middle_1_identifiers__."id1"
  ) as __optional_missing_middle_1__(v)
) as __optional_missing_middle_1_result__;

select __optional_missing_middle_1_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2") as __optional_missing_middle_1_identifiers__,
lateral (
  select
    __optional_missing_middle_1__.v::text as "0",
    __optional_missing_middle_1_identifiers__.idx as "1"
  from "a"."optional_missing_middle_1"(
    __optional_missing_middle_1_identifiers__."id0",
    __optional_missing_middle_1_identifiers__."id1",
    __optional_missing_middle_1_identifiers__."id2"
  ) as __optional_missing_middle_1__(v)
) as __optional_missing_middle_1_result__;

select __optional_missing_middle_2_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __optional_missing_middle_2_identifiers__,
lateral (
  select
    __optional_missing_middle_2__.v::text as "0",
    __optional_missing_middle_2_identifiers__.idx as "1"
  from "a"."optional_missing_middle_2"(
    __optional_missing_middle_2_identifiers__."id0",
    "c" := __optional_missing_middle_2_identifiers__."id1"
  ) as __optional_missing_middle_2__(v)
) as __optional_missing_middle_2_result__;

select __optional_missing_middle_3_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __optional_missing_middle_3_identifiers__,
lateral (
  select
    __optional_missing_middle_3__.v::text as "0",
    __optional_missing_middle_3_identifiers__.idx as "1"
  from "a"."optional_missing_middle_3"(
    __optional_missing_middle_3_identifiers__."id0",
    "c" := __optional_missing_middle_3_identifiers__."id1"
  ) as __optional_missing_middle_3__(v)
) as __optional_missing_middle_3_result__;

select __optional_missing_middle_4_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2") as __optional_missing_middle_4_identifiers__,
lateral (
  select
    __optional_missing_middle_4__.v::text as "0",
    __optional_missing_middle_4_identifiers__.idx as "1"
  from "a"."optional_missing_middle_4"(
    __optional_missing_middle_4_identifiers__."id0",
    __optional_missing_middle_4_identifiers__."id1",
    __optional_missing_middle_4_identifiers__."id2"
  ) as __optional_missing_middle_4__(v)
) as __optional_missing_middle_4_result__;

select __optional_missing_middle_5_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2") as __optional_missing_middle_5_identifiers__,
lateral (
  select
    __optional_missing_middle_5__.v::text as "0",
    __optional_missing_middle_5_identifiers__.idx as "1"
  from "a"."optional_missing_middle_5"(
    __optional_missing_middle_5_identifiers__."id0",
    __optional_missing_middle_5_identifiers__."id1",
    __optional_missing_middle_5_identifiers__."id2"
  ) as __optional_missing_middle_5__(v)
) as __optional_missing_middle_5_result__;

select __types_query_result__.*
from (select 0 as idx, $1::"int8" as "id0", $2::"bool" as "id1", $3::"varchar" as "id2", $4::"int4"[] as "id3", $5::"json" as "id4", $6::"c"."floatrange" as "id5") as __types_query_identifiers__,
lateral (
  select
    __types_query__.v::text as "0",
    __types_query_identifiers__.idx as "1"
  from "c"."types_query"(
    __types_query_identifiers__."id0",
    __types_query_identifiers__."id1",
    __types_query_identifiers__."id2",
    __types_query_identifiers__."id3",
    __types_query_identifiers__."id4",
    __types_query_identifiers__."id5"
  ) as __types_query__(v)
) as __types_query_result__;

select __types_query_result__.*
from (select 0 as idx, $1::"int8" as "id0", $2::"bool" as "id1", $3::"varchar" as "id2", $4::"int4"[] as "id3", $5::"json" as "id4", $6::"c"."floatrange" as "id5") as __types_query_identifiers__,
lateral (
  select
    __types_query__.v::text as "0",
    __types_query_identifiers__.idx as "1"
  from "c"."types_query"(
    __types_query_identifiers__."id0",
    __types_query_identifiers__."id1",
    __types_query_identifiers__."id2",
    __types_query_identifiers__."id3",
    __types_query_identifiers__."id4",
    __types_query_identifiers__."id5"
  ) as __types_query__(v)
) as __types_query_result__;

select __compound_type_query_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __compound_type_query_identifiers__,
lateral (
  select
    __compound_type_query__."a"::text as "0",
    __compound_type_query__."b" as "1",
    __compound_type_query__."c"::text as "2",
    __compound_type_query__."d" as "3",
    __compound_type_query__."e"::text as "4",
    __compound_type_query__."f"::text as "5",
    to_char(__compound_type_query__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
    __compound_type_query__."foo_bar"::text as "7",
    (not (__compound_type_query__ is null))::text as "8",
    __compound_type_query_identifiers__.idx as "9"
  from "b"."compound_type_query"(__compound_type_query_identifiers__."id0") as __compound_type_query__
) as __compound_type_query_result__;

select __compound_type_array_query_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __compound_type_array_query_identifiers__,
lateral (
  select
    __compound_type_array_query__."a"::text as "0",
    __compound_type_array_query__."b" as "1",
    __compound_type_array_query__."c"::text as "2",
    __compound_type_array_query__."d" as "3",
    __compound_type_array_query__."e"::text as "4",
    __compound_type_array_query__."f"::text as "5",
    to_char(__compound_type_array_query__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
    __compound_type_array_query__."foo_bar"::text as "7",
    (not (__compound_type_array_query__ is null))::text as "8",
    __compound_type_array_query_identifiers__.idx as "9"
  from unnest("b"."compound_type_array_query"(__compound_type_array_query_identifiers__."id0")) as __compound_type_array_query__
) as __compound_type_array_query_result__;

select __table_query_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __table_query_identifiers__,
lateral (
  select
    __table_query__."id"::text as "0",
    __table_query__."headline" as "1",
    __table_query__."author_id"::text as "2",
    __table_query_identifiers__.idx as "3"
  from "c"."table_query"(__table_query_identifiers__."id0") as __table_query__
) as __table_query_result__;

select
  __no_args_query__.v::text as "0"
from "c"."no_args_query"() as __no_args_query__(v);

select __query_compound_type_array_result__.*
from (select 0 as idx, $1::"c"."compound_type" as "id0") as __query_compound_type_array_identifiers__,
lateral (
  select
    __query_compound_type_array__."a"::text as "0",
    __query_compound_type_array__."b" as "1",
    __query_compound_type_array__."c"::text as "2",
    __query_compound_type_array__."d" as "3",
    __query_compound_type_array__."e"::text as "4",
    __query_compound_type_array__."f"::text as "5",
    to_char(__query_compound_type_array__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
    __query_compound_type_array__."foo_bar"::text as "7",
    (not (__query_compound_type_array__ is null))::text as "8",
    __query_compound_type_array_identifiers__.idx as "9"
  from unnest("a"."query_compound_type_array"(__query_compound_type_array_identifiers__."id0")) as __query_compound_type_array__
) as __query_compound_type_array_result__;

select
  __query_text_array__.v::text as "0"
from "a"."query_text_array"() as __query_text_array__(v);

select
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__query_interval_array__.v) __entry__
  )::text as "0"
from "a"."query_interval_array"() as __query_interval_array__(v);

select
  (row_number() over (partition by 1))::text as "0",
  __compound_type_set_query__."a"::text as "1",
  __compound_type_set_query__."b" as "2",
  __compound_type_set_query__."c"::text as "3",
  __compound_type_set_query__."d" as "4",
  __compound_type_set_query__."e"::text as "5",
  __compound_type_set_query__."f"::text as "6",
  to_char(__compound_type_set_query__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "7",
  __compound_type_set_query__."foo_bar"::text as "8",
  (not (__compound_type_set_query__ is null))::text as "9"
from "c"."compound_type_set_query"() as __compound_type_set_query__
limit 6;

select
  (row_number() over (partition by 1))::text as "0",
  __table_set_query__."person_full_name" as "1",
  __table_set_query__."id"::text as "2"
from "c"."table_set_query"() as __table_set_query__;

select
  __table_set_query__."person_full_name" as "0",
  __table_set_query__."id"::text as "1"
from "c"."table_set_query"() as __table_set_query__
order by __table_set_query__."person_full_name" asc;

select __table_set_query_result__.*
from (select 0 as idx, $1::"varchar" as "id0") as __table_set_query_identifiers__,
lateral (
  select
    (row_number() over (partition by 1))::text as "0",
    __table_set_query__."person_full_name" as "1",
    __table_set_query__."id"::text as "2",
    __table_set_query_identifiers__.idx as "3"
  from "c"."table_set_query"() as __table_set_query__
  where (
    __table_set_query__."person_full_name" = __table_set_query_identifiers__."id0"
  )
) as __table_set_query_result__;

select __table_set_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __table_set_query_identifiers__,
lateral (
  select
    (row_number() over (partition by 1))::text as "0",
    __table_set_query__."person_full_name" as "1",
    __table_set_query__."id"::text as "2",
    __table_set_query_identifiers__.idx as "3"
  from "c"."table_set_query"() as __table_set_query__
  limit __table_set_query_identifiers__."id0"
  offset __table_set_query_identifiers__."id1"
) as __table_set_query_result__;

select __table_set_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __table_set_query_identifiers__,
lateral (
  select
    (row_number() over (partition by 1))::text as "0",
    __table_set_query__."person_full_name" as "1",
    __table_set_query__."id"::text as "2",
    __table_set_query_identifiers__.idx as "3"
  from "c"."table_set_query"() as __table_set_query__
  limit __table_set_query_identifiers__."id0"
  offset __table_set_query_identifiers__."id1"
) as __table_set_query_result__;

select __table_set_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __table_set_query_identifiers__,
lateral (
  select
    (row_number() over (partition by 1))::text as "0",
    __table_set_query__."person_full_name" as "1",
    __table_set_query__."id"::text as "2",
    __table_set_query_identifiers__.idx as "3"
  from "c"."table_set_query"() as __table_set_query__
  limit __table_set_query_identifiers__."id0"
  offset __table_set_query_identifiers__."id1"
) as __table_set_query_result__;

select __table_set_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __table_set_query_identifiers__,
lateral (
  select
    (row_number() over (partition by 1))::text as "0",
    __table_set_query__."person_full_name" as "1",
    __table_set_query__."id"::text as "2",
    __table_set_query_identifiers__.idx as "3"
  from "c"."table_set_query"() as __table_set_query__
  limit __table_set_query_identifiers__."id0"
  offset __table_set_query_identifiers__."id1"
) as __table_set_query_result__;

select
  (row_number() over (partition by 1))::text as "0",
  __table_set_query__."person_full_name" as "1",
  __table_set_query__."id"::text as "2"
from "c"."table_set_query"() as __table_set_query__
limit 3
offset 2;

select
  (row_number() over (partition by 1))::text as "0",
  __table_set_query__."person_full_name" as "1",
  __table_set_query__."id"::text as "2"
from "c"."table_set_query"() as __table_set_query__
limit 3
offset 4;

select
  (row_number() over (partition by 1))::text as "0",
  __table_set_query__."person_full_name" as "1",
  __table_set_query__."id"::text as "2"
from "c"."table_set_query"() as __table_set_query__
limit 3
offset 0;

select
  (row_number() over (partition by 1))::text as "0",
  __table_set_query__."person_full_name" as "1",
  __table_set_query__."id"::text as "2"
from "c"."table_set_query"() as __table_set_query__
limit 7
offset 0;

select __table_set_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __table_set_query_identifiers__,
lateral (
  select
    (row_number() over (partition by 1))::text as "0",
    __table_set_query__."person_full_name" as "1",
    __table_set_query__."id"::text as "2",
    __table_set_query_identifiers__.idx as "3"
  from "c"."table_set_query"() as __table_set_query__
  limit __table_set_query_identifiers__."id0"
  offset __table_set_query_identifiers__."id1"
) as __table_set_query_result__;

select __table_set_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __table_set_query_identifiers__,
lateral (
  select
    (row_number() over (partition by 1))::text as "0",
    __table_set_query__."person_full_name" as "1",
    __table_set_query__."id"::text as "2",
    __table_set_query_identifiers__.idx as "3"
  from "c"."table_set_query"() as __table_set_query__
  limit __table_set_query_identifiers__."id0"
  offset __table_set_query_identifiers__."id1"
) as __table_set_query_result__;

select
  (row_number() over (partition by 1))::text as "0",
  __table_set_query_plpgsql__."person_full_name" as "1",
  __table_set_query_plpgsql__."id"::text as "2"
from "c"."table_set_query_plpgsql"() as __table_set_query_plpgsql__
limit 3;

select __table_set_query_plpgsql_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1") as __table_set_query_plpgsql_identifiers__,
lateral (
  select
    (row_number() over (partition by 1))::text as "0",
    __table_set_query_plpgsql__."person_full_name" as "1",
    __table_set_query_plpgsql__."id"::text as "2",
    __table_set_query_plpgsql_identifiers__.idx as "3"
  from "c"."table_set_query_plpgsql"() as __table_set_query_plpgsql__
  limit __table_set_query_plpgsql_identifiers__."id0"
  offset __table_set_query_plpgsql_identifiers__."id1"
) as __table_set_query_plpgsql_result__;

select __int_set_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2") as __int_set_query_identifiers__,
lateral (
  select
    __int_set_query__.v::text as "0",
    (row_number() over (partition by 1))::text as "1",
    __int_set_query_identifiers__.idx as "2"
  from "c"."int_set_query"(
    __int_set_query_identifiers__."id0",
    __int_set_query_identifiers__."id1",
    __int_set_query_identifiers__."id2"
  ) as __int_set_query__(v)
) as __int_set_query_result__;

select __int_set_query_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2") as __int_set_query_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __int_set_query_identifiers__.idx as "1"
  from "c"."int_set_query"(
    __int_set_query_identifiers__."id0",
    __int_set_query_identifiers__."id1",
    __int_set_query_identifiers__."id2"
  ) as __int_set_query__(v)
) as __int_set_query_result__;

select
  __static_big_integer__.v::text as "0"
from "a"."static_big_integer"() as __static_big_integer__(v);

select
  (count(*))::text as "0"
from "a"."static_big_integer"() as __static_big_integer__(v);

select
  to_char(__query_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0",
  (row_number() over (partition by 1))::text as "1"
from "a"."query_interval_set"() as __query_interval_set__(v);

select
  (count(*))::text as "0"
from "a"."query_interval_set"() as __query_interval_set__(v);