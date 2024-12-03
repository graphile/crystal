select __person_result__.*
from (select 0 as idx, $1::"text" as "id0", $2::"text" as "id1") as __person_identifiers__,
lateral (
  select
    __person__."person_full_name" as "0",
    (select json_agg(s) from (
      select
        __person_friends__."person_full_name" as "0",
        (select json_agg(s) from (
          select
            __person_friends_2."person_full_name" as "0",
            "c"."person_first_name"(__person_friends_2) as "1"
          from "c"."person_friends"(__person_friends__) as __person_friends_2
          limit 1
        ) s) as "1",
        "c"."person_first_name"(__person_friends__) as "2"
      from "c"."person_friends"(__person__) as __person_friends__
    ) s) as "1",
    "c"."person_first_name"(__person__) as "2",
    (select json_agg(s) from (
      select
        __post__."headline" as "0",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set__(v)
          limit 1
        ) s) as "1",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_2.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set_2(v)
          limit 1
        ) s) as "2",
        "a"."post_headline_trimmed"(__post__) as "3",
        __post__."author_id"::text as "4"
      from "a"."post" as __post__
      where (
        __person__."id"::"int4" = __post__."author_id"
      )
      order by __post__."id" desc
      limit 2
    ) s) as "3",
    (select json_agg(s) from (
      select
        __post_2."headline" as "0",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_3.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_2) as __post_computed_interval_set_3(v)
          limit 1
        ) s) as "1",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_4.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_2) as __post_computed_interval_set_4(v)
          limit 1
        ) s) as "2",
        "a"."post_headline_trimmed"(__post_2) as "3",
        __post_2."author_id"::text as "4"
      from "a"."post" as __post_2
      where (
        __person__."id"::"int4" = __post_2."author_id"
      )
      order by __post_2."id" asc
      limit 2
    ) s) as "4",
    (select json_agg(s) from (
      select
        __post_3."headline" as "0",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_5.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_3) as __post_computed_interval_set_5(v)
          limit 1
        ) s) as "1",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_6.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_3) as __post_computed_interval_set_6(v)
          limit 1
        ) s) as "2",
        "a"."post_headline_trimmed"(__post_3) as "3",
        __post_3."author_id"::text as "4"
      from "a"."post" as __post_3
      where
        (
          __post_3."headline" = __person_identifiers__."id0"
        ) and (
          __person__."id"::"int4" = __post_3."author_id"
        )
      order by __post_3."id" asc
    ) s) as "5",
    (select json_agg(s) from (
      select
        __post_4."headline" as "0",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_7.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_4) as __post_computed_interval_set_7(v)
          limit 1
        ) s) as "1",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_8.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_4) as __post_computed_interval_set_8(v)
          limit 1
        ) s) as "2",
        "a"."post_headline_trimmed"(__post_4) as "3",
        __post_4."author_id"::text as "4"
      from "a"."post" as __post_4
      where
        (
          __post_4."headline" = __person_identifiers__."id1"
        ) and (
          __person__."id"::"int4" = __post_4."author_id"
        )
      order by __post_4."id" asc
    ) s) as "6",
    (select json_agg(s) from (
      select
        __compound_key__."person_id_1"::text as "0",
        __compound_key__."person_id_2"::text as "1"
      from "c"."compound_key" as __compound_key__
      where (
        __person__."id"::"int4" = __compound_key__."person_id_1"
      )
      order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
    ) s) as "7",
    (select json_agg(s) from (
      select
        __compound_key__."person_id_1"::text as "0",
        __compound_key__."person_id_2"::text as "1"
      from "c"."compound_key" as __compound_key__
      where (
        __person__."id"::"int4" = __compound_key__."person_id_1"
      )
      order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
    ) s) as "8",
    (select json_agg(s) from (
      select
        __compound_key_2."person_id_1"::text as "0",
        __compound_key_2."person_id_2"::text as "1"
      from "c"."compound_key" as __compound_key_2
      where (
        __person__."id"::"int4" = __compound_key_2."person_id_2"
      )
      order by __compound_key_2."person_id_1" asc, __compound_key_2."person_id_2" asc
    ) s) as "9",
    (select json_agg(s) from (
      select
        __compound_key_2."person_id_1"::text as "0",
        __compound_key_2."person_id_2"::text as "1"
      from "c"."compound_key" as __compound_key_2
      where (
        __person__."id"::"int4" = __compound_key_2."person_id_2"
      )
      order by __compound_key_2."person_id_1" asc, __compound_key_2."person_id_2" asc
    ) s) as "10",
    __person__."id"::text as "11",
    __person_identifiers__.idx as "12"
  from "c"."person" as __person__
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"text" as "id0", $2::"text" as "id1") as __person_identifiers__,
lateral (
  select
    (select json_agg(s) from (
      select
        __post__."headline" as "0",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set__(v)
          limit 1
        ) s) as "1",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_2.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set_2(v)
          limit 1
        ) s) as "2",
        "a"."post_headline_trimmed"(__post__) as "3",
        __post__."author_id"::text as "4"
      from "a"."post" as __post__
      where (
        __person__."id"::"int4" = __post__."author_id"
      )
      order by __post__."id" desc
      limit 2
    ) s) as "0",
    (select json_agg(s) from (
      select
        __post_2."headline" as "0",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_3.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_2) as __post_computed_interval_set_3(v)
          limit 1
        ) s) as "1",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_4.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_2) as __post_computed_interval_set_4(v)
          limit 1
        ) s) as "2",
        "a"."post_headline_trimmed"(__post_2) as "3",
        __post_2."author_id"::text as "4"
      from "a"."post" as __post_2
      where (
        __person__."id"::"int4" = __post_2."author_id"
      )
      order by __post_2."id" asc
      limit 2
    ) s) as "1",
    (select json_agg(s) from (
      select
        __post_3."headline" as "0",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_5.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_3) as __post_computed_interval_set_5(v)
          limit 1
        ) s) as "1",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_6.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_3) as __post_computed_interval_set_6(v)
          limit 1
        ) s) as "2",
        "a"."post_headline_trimmed"(__post_3) as "3",
        __post_3."author_id"::text as "4"
      from "a"."post" as __post_3
      where
        (
          __post_3."headline" = __person_identifiers__."id0"
        ) and (
          __person__."id"::"int4" = __post_3."author_id"
        )
      order by __post_3."id" asc
    ) s) as "2",
    (select json_agg(s) from (
      select
        __post_4."headline" as "0",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_7.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_4) as __post_computed_interval_set_7(v)
          limit 1
        ) s) as "1",
        (select json_agg(s) from (
          select
            to_char(__post_computed_interval_set_8.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
          from "a"."post_computed_interval_set"(__post_4) as __post_computed_interval_set_8(v)
          limit 1
        ) s) as "2",
        "a"."post_headline_trimmed"(__post_4) as "3",
        __post_4."author_id"::text as "4"
      from "a"."post" as __post_4
      where
        (
          __post_4."headline" = __person_identifiers__."id1"
        ) and (
          __person__."id"::"int4" = __post_4."author_id"
        )
      order by __post_4."id" asc
    ) s) as "3",
    (select json_agg(s) from (
      select
        __compound_key__."person_id_1"::text as "0",
        __compound_key__."person_id_2"::text as "1"
      from "c"."compound_key" as __compound_key__
      where (
        __person__."id"::"int4" = __compound_key__."person_id_1"
      )
      order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
    ) s) as "4",
    (select json_agg(s) from (
      select
        __compound_key__."person_id_1"::text as "0",
        __compound_key__."person_id_2"::text as "1"
      from "c"."compound_key" as __compound_key__
      where (
        __person__."id"::"int4" = __compound_key__."person_id_1"
      )
      order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
    ) s) as "5",
    (select json_agg(s) from (
      select
        __compound_key_2."person_id_1"::text as "0",
        __compound_key_2."person_id_2"::text as "1"
      from "c"."compound_key" as __compound_key_2
      where (
        __person__."id"::"int4" = __compound_key_2."person_id_2"
      )
      order by __compound_key_2."person_id_1" asc, __compound_key_2."person_id_2" asc
    ) s) as "6",
    (select json_agg(s) from (
      select
        __compound_key_2."person_id_1"::text as "0",
        __compound_key_2."person_id_2"::text as "1"
      from "c"."compound_key" as __compound_key_2
      where (
        __person__."id"::"int4" = __compound_key_2."person_id_2"
      )
      order by __compound_key_2."person_id_1" asc, __compound_key_2."person_id_2" asc
    ) s) as "7",
    __person__."id"::text as "8",
    __person__."person_full_name" as "9",
    __person_identifiers__.idx as "10"
  from "c"."person" as __person__
  order by __person__."id" asc
) as __person_result__;