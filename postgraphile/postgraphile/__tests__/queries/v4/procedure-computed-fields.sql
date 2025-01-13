select __person_result__.*
from (select 0 as idx, $16::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    ("c"."person_optional_missing_middle_1"(
      __person__,
      $1::"int4",
      "c" := $2::"int4"
    ))::text as "0",
    ("c"."person_optional_missing_middle_1"(
      __person__,
      $3::"int4",
      $4::"int4",
      $5::"int4"
    ))::text as "1",
    ("c"."person_optional_missing_middle_2"(
      __person__,
      $6::"int4",
      "c" := $7::"int4"
    ))::text as "2",
    ("c"."person_optional_missing_middle_3"(
      __person__,
      $8::"int4",
      "c" := $9::"int4"
    ))::text as "3",
    ("c"."person_optional_missing_middle_4"(
      __person__,
      $10::"int4",
      $11::"int4",
      $12::"int4"
    ))::text as "4",
    ("c"."person_optional_missing_middle_5"(
      __person__,
      $13::"int4",
      $14::"int4",
      $15::"int4"
    ))::text as "5",
    __person__."id"::text as "6",
    __person_identifiers__.idx as "7"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."foo_bar"::text as "1",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type__))::text as "2",
  (not (__frmcdc_compound_type__ is null))::text as "3",
  __frmcdc_compound_type_2."a"::text as "4",
  __frmcdc_compound_type_2."foo_bar"::text as "5",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_2))::text as "6",
  (not (__frmcdc_compound_type_2 is null))::text as "7",
  __frmcdc_compound_type_3."a"::text as "8",
  __frmcdc_compound_type_3."foo_bar"::text as "9",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_3))::text as "10",
  (not (__frmcdc_compound_type_3 is null))::text as "11",
  (not (__frmcdc_nested_compound_type__ is null))::text as "12",
  __frmcdc_compound_type_4."a"::text as "13",
  __frmcdc_compound_type_4."foo_bar"::text as "14",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_4))::text as "15",
  (not (__frmcdc_compound_type_4 is null))::text as "16",
  __frmcdc_compound_type_5."a"::text as "17",
  __frmcdc_compound_type_5."foo_bar"::text as "18",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_5))::text as "19",
  (not (__frmcdc_compound_type_5 is null))::text as "20",
  __frmcdc_compound_type_6."a"::text as "21",
  __frmcdc_compound_type_6."foo_bar"::text as "22",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_6))::text as "23",
  (not (__frmcdc_compound_type_6 is null))::text as "24",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "25",
  case when (__types__."compound_type") is not distinct from null then null::text else json_build_array((((__types__."compound_type")."a"))::text, ((__types__."compound_type")."b"), (((__types__."compound_type")."c"))::text, ((__types__."compound_type")."d"), (((__types__."compound_type")."e"))::text, (((__types__."compound_type")."f"))::text, to_char(((__types__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."compound_type")."foo_bar"))::text)::text end as "26"
from "b"."types" as __types__
left outer join lateral (select (__types__."compound_type").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__types__."nested_compound_type").*) as __frmcdc_nested_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_3
on TRUE
left outer join lateral (select (__types__."nullable_compound_type").*) as __frmcdc_compound_type_4
on TRUE
left outer join lateral (select (__types__."nullable_nested_compound_type").*) as __frmcdc_nested_compound_type_2
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."a").*) as __frmcdc_compound_type_5
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type_2."b").*) as __frmcdc_compound_type_6
on TRUE
order by __types__."id" asc;

select
  __post__."headline" as "0",
  (select json_agg(s) from (
    select
      __post_computed_compound_type_array__."a"::text as "0",
      __post_computed_compound_type_array__."b" as "1",
      __post_computed_compound_type_array__."c"::text as "2",
      __post_computed_compound_type_array__."d" as "3",
      __post_computed_compound_type_array__."e"::text as "4",
      __post_computed_compound_type_array__."f"::text as "5",
      to_char(__post_computed_compound_type_array__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
      __post_computed_compound_type_array__."foo_bar"::text as "7",
      (not (__post_computed_compound_type_array__ is null))::text as "8"
    from unnest("a"."post_computed_compound_type_array"(
      __post_2,
      $1::"c"."compound_type"
    )) as __post_computed_compound_type_array__
  ) s) as "1",
  (select json_agg(s) from (
    select
      to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0",
      (row_number() over (partition by 1))::text as "1"
    from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set__(v)
  ) s) as "2",
  "a"."post_headline_trimmed"(__post__) as "3",
  "a"."post_headline_trimmed"(
    __post__,
    $2::"int4"
  ) as "4",
  "a"."post_headline_trimmed"(
    __post__,
    $3::"int4",
    $4::"text"
  ) as "5",
  "a"."post_headline_trimmed_strict"(__post__) as "6",
  "a"."post_headline_trimmed_strict"(
    __post__,
    $5::"int4"
  ) as "7",
  "a"."post_headline_trimmed_strict"(
    __post__,
    $6::"int4",
    $7::"text"
  ) as "8",
  "a"."post_headline_trimmed_no_defaults"(
    __post__,
    $8::"int4",
    $9::"text"
  ) as "9",
  "a"."post_headline_trimmed_no_defaults"(
    __post__,
    $10::"int4",
    $11::"text"
  ) as "10",
  ("a"."post_computed_text_array"(__post__))::text as "11",
  (case when ("a"."post_computed_interval_array"(__post__)) is not distinct from null then null::text else array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest("a"."post_computed_interval_array"(__post__)) __entry__
  )::text end) as "12"
from "a"."post" as __post__
left outer join lateral (select (__post__).*) as __post_2
on TRUE
order by __post__."id" asc;

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
  __person_first_post__."id"::text as "2",
  __person_first_post__."headline" as "3",
  "c"."person_first_name"(__person__) as "4"
from "c"."person" as __person__
left outer join "c"."person_first_post"(__person__) as __person_first_post__
on TRUE
order by __person__."id" asc;

select
  __edge_case__."not_null_has_default"::text as "0",
  __edge_case__."wont_cast_easy"::text as "1",
  "c"."edge_case_computed"(__edge_case__) as "2"
from "c"."edge_case" as __edge_case__;