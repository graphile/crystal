select
  __frmcdc_compound_type_1__."a"::text as "0",
  __frmcdc_compound_type_1__."foo_bar"::text as "1",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_1__))::text as "2",
  (not (__frmcdc_compound_type_1__ is null))::text as "3",
  __types__."compound_type"::text as "4",
  __frmcdc_compound_type_1_2."a"::text as "5",
  __frmcdc_compound_type_1_2."foo_bar"::text as "6",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_1_2))::text as "7",
  (not (__frmcdc_compound_type_1_2 is null))::text as "8",
  __frmcdc_nested_compound_type_1__."a"::text as "9",
  __frmcdc_compound_type_1_3."a"::text as "10",
  __frmcdc_compound_type_1_3."foo_bar"::text as "11",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_1_3))::text as "12",
  (not (__frmcdc_compound_type_1_3 is null))::text as "13",
  __frmcdc_nested_compound_type_1__."b"::text as "14",
  (not (__frmcdc_nested_compound_type_1__ is null))::text as "15",
  __types__."nested_compound_type"::text as "16",
  __frmcdc_compound_type_1_4."a"::text as "17",
  __frmcdc_compound_type_1_4."foo_bar"::text as "18",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_1_4))::text as "19",
  (not (__frmcdc_compound_type_1_4 is null))::text as "20",
  __types__."nullable_compound_type"::text as "21",
  __frmcdc_compound_type_1_5."a"::text as "22",
  __frmcdc_compound_type_1_5."foo_bar"::text as "23",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_1_5))::text as "24",
  (not (__frmcdc_compound_type_1_5 is null))::text as "25",
  __frmcdc_nested_compound_type_1_2."a"::text as "26",
  __frmcdc_compound_type_1_6."a"::text as "27",
  __frmcdc_compound_type_1_6."foo_bar"::text as "28",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_1_6))::text as "29",
  (not (__frmcdc_compound_type_1_6 is null))::text as "30",
  __frmcdc_nested_compound_type_1_2."b"::text as "31",
  (not (__frmcdc_nested_compound_type_1_2 is null))::text as "32",
  __types__."nullable_nested_compound_type"::text as "33"
from "b"."types" as __types__
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type_1__
on TRUE
left outer join lateral (select (__types__."nested_compound_type").*) as __frmcdc_nested_compound_type_1__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_1__."a").*) as __frmcdc_compound_type_1_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_1__."b").*) as __frmcdc_compound_type_1_3
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_1_4
on TRUE
left outer join lateral (select (__types__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_1_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_1_2."a").*) as __frmcdc_compound_type_1_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_1_2."b").*) as __frmcdc_compound_type_1_6
on TRUE
order by __types__."id" asc;

select __post_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0",
    (ids.value->>1)::"int4" as "id1",
    (ids.value->>2)::"text" as "id2",
    (ids.value->>3)::"int4" as "id3",
    (ids.value->>4)::"int4" as "id4",
    (ids.value->>5)::"text" as "id5",
    (ids.value->>6)::"int4" as "id6",
    (ids.value->>7)::"text" as "id7",
    (ids.value->>8)::"int4" as "id8",
    (ids.value->>9)::"text" as "id9"
  from json_array_elements($1::json) with ordinality as ids
) as __post_identifiers__,
lateral (
  select
    (select json_agg(_) from (
      select
        (row_number() over (partition by 1))::text as "0",
        to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "1"
      from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set__(v)
    ) _) as "0",
    (
      select array_agg(to_char(t, 'YYYY_MM_DD_HH24_MI_SS.US'::text))
      from unnest("a"."post_computed_interval_array"(__post__)) t
    )::text as "1",
    ("a"."post_computed_text_array"(__post__))::text as "2",
    __post_2::text as "3",
    __post_2."id"::text as "4",
    "a"."post_headline_trimmed_no_defaults"(
      __post__,
      __post_identifiers__."id6",
      __post_identifiers__."id7"
    ) as "5",
    "a"."post_headline_trimmed_no_defaults"(
      __post_3,
      __post_identifiers__."id8",
      __post_identifiers__."id9"
    ) as "6",
    __post_3."id"::text as "7",
    __post__::text as "8",
    "a"."post_headline_trimmed_strict"(
      __post__,
      __post_identifiers__."id4",
      __post_identifiers__."id5"
    ) as "9",
    "a"."post_headline_trimmed_strict"(
      __post__,
      __post_identifiers__."id3"
    ) as "10",
    "a"."post_headline_trimmed_strict"(__post__) as "11",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id1",
      __post_identifiers__."id2"
    ) as "12",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id0"
    ) as "13",
    "a"."post_headline_trimmed"(__post__) as "14",
    __post__."headline" as "15",
    __post_identifiers__.idx as "16"
  from "a"."post" as __post__
  left outer join lateral (select (__post__).*) as __post_2
  on TRUE
  left outer join lateral (select (__post__).*) as __post_3
  on TRUE
  order by __post__."id" asc
) as __post_result__;

select
  __person_first_post__."headline" as "0",
  __person_first_post__."id"::text as "1",
  (select json_agg(_) from (
    select
      (select json_agg(_) from (
        select
          "c"."person_first_name"(__person_friends__) as "0",
          __person_friends__."person_full_name" as "1",
          __person_friends__."id"::text as "2"
        from "c"."person_friends"(__person_friends_2) as __person_friends__
        limit 1
      ) _) as "0",
      __person_friends_2::text as "1",
      "c"."person_first_name"(__person_friends_2) as "2",
      __person_friends_2."person_full_name" as "3",
      __person_friends_2."id"::text as "4"
    from "c"."person_friends"(__person__) as __person_friends_2
  ) _) as "2",
  __person__::text as "3",
  "c"."person_first_name"(__person__) as "4",
  __person__."person_full_name" as "5"
from "c"."person" as __person__
left outer join "c"."person_first_post"(__person__) as __person_first_post__
on TRUE
order by __person__."id" asc;

select
  "c"."edge_case_computed"(__edge_case__) as "0",
  __edge_case__."wont_cast_easy"::text as "1",
  __edge_case__."not_null_has_default"::text as "2"
from "c"."edge_case" as __edge_case__;

select __post_computed_compound_type_array_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"a"."post" as "id0",
    (ids.value->>1)::"c"."compound_type" as "id1"
  from json_array_elements($1::json) with ordinality as ids
) as __post_computed_compound_type_array_identifiers__,
lateral (
  select
    __post_computed_compound_type_array__."foo_bar"::text as "0",
    to_char(__post_computed_compound_type_array__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "1",
    __post_computed_compound_type_array__."f"::text as "2",
    __post_computed_compound_type_array__."e"::text as "3",
    __post_computed_compound_type_array__."d" as "4",
    __post_computed_compound_type_array__."c"::text as "5",
    __post_computed_compound_type_array__."b" as "6",
    __post_computed_compound_type_array__."a"::text as "7",
    (not (__post_computed_compound_type_array__ is null))::text as "8",
    __post_computed_compound_type_array_identifiers__.idx as "9"
  from unnest("a"."post_computed_compound_type_array"(
    __post_computed_compound_type_array_identifiers__."id0",
    __post_computed_compound_type_array_identifiers__."id1"
  )) as __post_computed_compound_type_array__
) as __post_computed_compound_type_array_result__;