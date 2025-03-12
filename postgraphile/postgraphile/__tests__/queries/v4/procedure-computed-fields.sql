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
  __person__."id"::text as "6"
from "c"."person" as __person__
where (
  __person__."id" = $16::"int4"
);

select
  case when (__types__."compound_type") is not distinct from null then null::text else json_build_array((((__types__."compound_type")."a"))::text, ((__types__."compound_type")."b"), (((__types__."compound_type")."c"))::text, ((__types__."compound_type")."d"), (((__types__."compound_type")."e"))::text, (((__types__."compound_type")."f"))::text, to_char(((__types__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."compound_type")."foo_bar"))::text)::text end as "0",
  __frmcdc_compound_type__."a"::text as "1",
  __frmcdc_compound_type__."foo_bar"::text as "2",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type__))::text as "3",
  (not (__frmcdc_compound_type__ is null))::text as "4",
  (not (__frmcdc_nested_compound_type__ is null))::text as "5",
  __frmcdc_compound_type_2."a"::text as "6",
  __frmcdc_compound_type_2."foo_bar"::text as "7",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_2))::text as "8",
  (not (__frmcdc_compound_type_2 is null))::text as "9",
  __frmcdc_compound_type_3."a"::text as "10",
  __frmcdc_compound_type_3."foo_bar"::text as "11",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_3))::text as "12",
  (not (__frmcdc_compound_type_3 is null))::text as "13",
  __frmcdc_compound_type_4."a"::text as "14",
  __frmcdc_compound_type_4."foo_bar"::text as "15",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_4))::text as "16",
  (not (__frmcdc_compound_type_4 is null))::text as "17",
  (not (__frmcdc_nested_compound_type_2 is null))::text as "18",
  __frmcdc_compound_type_5."a"::text as "19",
  __frmcdc_compound_type_5."foo_bar"::text as "20",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_5))::text as "21",
  (not (__frmcdc_compound_type_5 is null))::text as "22",
  __frmcdc_compound_type_6."a"::text as "23",
  __frmcdc_compound_type_6."foo_bar"::text as "24",
  ("c"."compound_type_computed_field"(__frmcdc_compound_type_6))::text as "25",
  (not (__frmcdc_compound_type_6 is null))::text as "26"
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
  "a"."post_headline_trimmed"(__post__) as "1",
  "a"."post_headline_trimmed"(
    __post__,
    $1::"int4"
  ) as "2",
  "a"."post_headline_trimmed"(
    __post__,
    $2::"int4",
    $3::"text"
  ) as "3",
  "a"."post_headline_trimmed_strict"(__post__) as "4",
  "a"."post_headline_trimmed_strict"(
    __post__,
    $4::"int4"
  ) as "5",
  "a"."post_headline_trimmed_strict"(
    __post__,
    $5::"int4",
    $6::"text"
  ) as "6",
  "a"."post_headline_trimmed_no_defaults"(
    __post__,
    $7::"int4",
    $8::"text"
  ) as "7",
  "a"."post_headline_trimmed_no_defaults"(
    __post__,
    $9::"int4",
    $10::"text"
  ) as "8",
  ("a"."post_computed_text_array"(__post__))::text as "9",
  (case when ("a"."post_computed_interval_array"(__post__)) is not distinct from null then null::text else array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest("a"."post_computed_interval_array"(__post__)) __entry__
  )::text end) as "10",
  array(
    select array[
      __post_computed_compound_type_array__."a"::text,
      __post_computed_compound_type_array__."b",
      __post_computed_compound_type_array__."c"::text,
      __post_computed_compound_type_array__."d",
      __post_computed_compound_type_array__."e"::text,
      __post_computed_compound_type_array__."f"::text,
      to_char(__post_computed_compound_type_array__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text),
      __post_computed_compound_type_array__."foo_bar"::text,
      (not (__post_computed_compound_type_array__ is null))::text
    ]::text[]
    from unnest("a"."post_computed_compound_type_array"(
      __post__,
      $11::"c"."compound_type"
    )) as __post_computed_compound_type_array__
  )::text as "11",
  array(
    select array[
      to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text),
      (row_number() over (partition by 1))::text
    ]::text[]
    from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set__(v)
  )::text as "12"
from "a"."post" as __post__
order by __post__."id" asc;

select
  __person__."person_full_name" as "0",
  "c"."person_first_name"(__person__) as "1",
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
  )::text as "2",
  __person_first_post__."id"::text as "3",
  __person_first_post__."headline" as "4"
from "c"."person" as __person__
left outer join "c"."person_first_post"(__person__) as __person_first_post__
on TRUE
order by __person__."id" asc;

select
  __edge_case__."not_null_has_default"::text as "0",
  __edge_case__."wont_cast_easy"::text as "1",
  "c"."edge_case_computed"(__edge_case__) as "2"
from "c"."edge_case" as __edge_case__;