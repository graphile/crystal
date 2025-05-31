select
  __person__."person_full_name" as "0",
  "c"."person_first_name"(__person__) as "1",
  __person__."id"::text as "2",
  array(
    select array[
      __person_friends__."person_full_name",
      "c"."person_first_name"(__person_friends__),
      array(
        select array[
          __person_friends_2."person_full_name",
          "c"."person_first_name"(__person_friends_2)
        ]::text[]
        from "c"."person_friends"(__person_friends__) as __person_friends_2
        limit 1
      )::text
    ]::text[]
    from "c"."person_friends"(__person__) as __person_friends__
  )::text as "3",
  array(
    select array[
      __post__."headline",
      "a"."post_headline_trimmed"(__post__),
      __post__."author_id"::text,
      array(
        select array[
          to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set__(v)
        limit 1
      )::text,
      array(
        select array[
          to_char(__post_computed_interval_set_2.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set_2(v)
        limit 1
      )::text
    ]::text[]
    from "a"."post" as __post__
    where (
      __post__."author_id" = __person__."id"
    )
    order by __post__."id" asc
    limit 2
  )::text as "4",
  array(
    select array[
      __post_2."headline",
      "a"."post_headline_trimmed"(__post_2),
      __post_2."author_id"::text,
      array(
        select array[
          to_char(__post_computed_interval_set_3.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_2) as __post_computed_interval_set_3(v)
        limit 1
      )::text,
      array(
        select array[
          to_char(__post_computed_interval_set_4.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_2) as __post_computed_interval_set_4(v)
        limit 1
      )::text
    ]::text[]
    from "a"."post" as __post_2
    where
      (
        __post_2."author_id" = __person__."id"
      ) and (
        __post_2."headline" = $1::"text"
      )
    order by __post_2."id" asc
  )::text as "5",
  array(
    select array[
      __compound_key__."person_id_1"::text,
      __compound_key__."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key__
    where (
      __compound_key__."person_id_1" = __person__."id"
    )
    order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
  )::text as "6",
  array(
    select array[
      __compound_key_2."person_id_1"::text,
      __compound_key_2."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key_2
    where (
      __compound_key_2."person_id_2" = __person__."id"
    )
    order by __compound_key_2."person_id_1" asc, __compound_key_2."person_id_2" asc
  )::text as "7",
  array(
    select array[
      __post_3."headline",
      "a"."post_headline_trimmed"(__post_3),
      __post_3."author_id"::text,
      array(
        select array[
          to_char(__post_computed_interval_set_5.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_3) as __post_computed_interval_set_5(v)
        limit 1
      )::text,
      array(
        select array[
          to_char(__post_computed_interval_set_6.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_3) as __post_computed_interval_set_6(v)
        limit 1
      )::text
    ]::text[]
    from "a"."post" as __post_3
    where (
      __post_3."author_id" = __person__."id"
    )
    order by __post_3."id" desc
    limit 2
  )::text as "8",
  array(
    select array[
      __post_4."headline",
      "a"."post_headline_trimmed"(__post_4),
      __post_4."author_id"::text,
      array(
        select array[
          to_char(__post_computed_interval_set_7.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_4) as __post_computed_interval_set_7(v)
        limit 1
      )::text,
      array(
        select array[
          to_char(__post_computed_interval_set_8.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_4) as __post_computed_interval_set_8(v)
        limit 1
      )::text
    ]::text[]
    from "a"."post" as __post_4
    where
      (
        __post_4."author_id" = __person__."id"
      ) and (
        __post_4."headline" = $2::"text"
      )
    order by __post_4."id" asc
  )::text as "9",
  array(
    select array[
      __compound_key_3."person_id_1"::text,
      __compound_key_3."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key_3
    where (
      __compound_key_3."person_id_1" = __person__."id"
    )
    order by __compound_key_3."person_id_1" asc, __compound_key_3."person_id_2" asc
  )::text as "10",
  array(
    select array[
      __compound_key_4."person_id_1"::text,
      __compound_key_4."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key_4
    where (
      __compound_key_4."person_id_2" = __person__."id"
    )
    order by __compound_key_4."person_id_1" asc, __compound_key_4."person_id_2" asc
  )::text as "11"
from "c"."person" as __person__
order by __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  array(
    select array[
      __post__."headline",
      "a"."post_headline_trimmed"(__post__),
      __post__."author_id"::text,
      array(
        select array[
          to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set__(v)
        limit 1
      )::text,
      array(
        select array[
          to_char(__post_computed_interval_set_2.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set_2(v)
        limit 1
      )::text
    ]::text[]
    from "a"."post" as __post__
    where (
      __post__."author_id" = __person__."id"
    )
    order by __post__."id" asc
    limit 2
  )::text as "2",
  array(
    select array[
      __post_2."headline",
      "a"."post_headline_trimmed"(__post_2),
      __post_2."author_id"::text,
      array(
        select array[
          to_char(__post_computed_interval_set_3.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_2) as __post_computed_interval_set_3(v)
        limit 1
      )::text,
      array(
        select array[
          to_char(__post_computed_interval_set_4.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_2) as __post_computed_interval_set_4(v)
        limit 1
      )::text
    ]::text[]
    from "a"."post" as __post_2
    where
      (
        __post_2."author_id" = __person__."id"
      ) and (
        __post_2."headline" = $1::"text"
      )
    order by __post_2."id" asc
  )::text as "3",
  array(
    select array[
      __compound_key__."person_id_1"::text,
      __compound_key__."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key__
    where (
      __compound_key__."person_id_1" = __person__."id"
    )
    order by __compound_key__."person_id_1" asc, __compound_key__."person_id_2" asc
  )::text as "4",
  array(
    select array[
      __compound_key_2."person_id_1"::text,
      __compound_key_2."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key_2
    where (
      __compound_key_2."person_id_2" = __person__."id"
    )
    order by __compound_key_2."person_id_1" asc, __compound_key_2."person_id_2" asc
  )::text as "5",
  array(
    select array[
      __post_3."headline",
      "a"."post_headline_trimmed"(__post_3),
      __post_3."author_id"::text,
      array(
        select array[
          to_char(__post_computed_interval_set_5.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_3) as __post_computed_interval_set_5(v)
        limit 1
      )::text,
      array(
        select array[
          to_char(__post_computed_interval_set_6.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_3) as __post_computed_interval_set_6(v)
        limit 1
      )::text
    ]::text[]
    from "a"."post" as __post_3
    where (
      __post_3."author_id" = __person__."id"
    )
    order by __post_3."id" desc
    limit 2
  )::text as "6",
  array(
    select array[
      __post_4."headline",
      "a"."post_headline_trimmed"(__post_4),
      __post_4."author_id"::text,
      array(
        select array[
          to_char(__post_computed_interval_set_7.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_4) as __post_computed_interval_set_7(v)
        limit 1
      )::text,
      array(
        select array[
          to_char(__post_computed_interval_set_8.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
        ]::text[]
        from "a"."post_computed_interval_set"(__post_4) as __post_computed_interval_set_8(v)
        limit 1
      )::text
    ]::text[]
    from "a"."post" as __post_4
    where
      (
        __post_4."author_id" = __person__."id"
      ) and (
        __post_4."headline" = $2::"text"
      )
    order by __post_4."id" asc
  )::text as "7",
  array(
    select array[
      __compound_key_3."person_id_1"::text,
      __compound_key_3."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key_3
    where (
      __compound_key_3."person_id_1" = __person__."id"
    )
    order by __compound_key_3."person_id_1" asc, __compound_key_3."person_id_2" asc
  )::text as "8",
  array(
    select array[
      __compound_key_4."person_id_1"::text,
      __compound_key_4."person_id_2"::text
    ]::text[]
    from "c"."compound_key" as __compound_key_4
    where (
      __compound_key_4."person_id_2" = __person__."id"
    )
    order by __compound_key_4."person_id_1" asc, __compound_key_4."person_id_2" asc
  )::text as "9"
from "c"."person" as __person__
order by __person__."id" asc;