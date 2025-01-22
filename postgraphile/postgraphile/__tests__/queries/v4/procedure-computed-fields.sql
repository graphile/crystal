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
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "1",
  case when (__types__."nullable_compound_type") is not distinct from null then null::text else json_build_array((((__types__."nullable_compound_type")."a"))::text, ((__types__."nullable_compound_type")."b"), (((__types__."nullable_compound_type")."c"))::text, ((__types__."nullable_compound_type")."d"), (((__types__."nullable_compound_type")."e"))::text, (((__types__."nullable_compound_type")."f"))::text, to_char(((__types__."nullable_compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."nullable_compound_type")."foo_bar"))::text)::text end as "2",
  case when (__types__."nullable_nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nullable_nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."a"))."a"))::text, ((((__types__."nullable_nested_compound_type")."a"))."b"), (((((__types__."nullable_nested_compound_type")."a"))."c"))::text, ((((__types__."nullable_nested_compound_type")."a"))."d"), (((((__types__."nullable_nested_compound_type")."a"))."e"))::text, (((((__types__."nullable_nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nullable_nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nullable_nested_compound_type")."b"))."a"))::text, ((((__types__."nullable_nested_compound_type")."b"))."b"), (((((__types__."nullable_nested_compound_type")."b"))."c"))::text, ((((__types__."nullable_nested_compound_type")."b"))."d"), (((((__types__."nullable_nested_compound_type")."b"))."e"))::text, (((((__types__."nullable_nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nullable_nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nullable_nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nullable_nested_compound_type")."baz_buz"))::text)::text end as "3"
from "b"."types" as __types__
order by __types__."id" asc;

select
  __post__."headline" as "0",
  case when (__post__) is not distinct from null then null::text else json_build_array((((__post__)."id"))::text, ((__post__)."headline"), ((__post__)."body"), (((__post__)."author_id"))::text, (((__post__)."enums"))::text, (case when (((__post__)."comptypes")) is not distinct from null then null::text else array(
    select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
    from unnest(((__post__)."comptypes")) __comptype__
  )::text end))::text end as "1",
  "a"."post_headline_trimmed"(__post__) as "2",
  "a"."post_headline_trimmed"(
    __post__,
    $1::"int4"
  ) as "3",
  "a"."post_headline_trimmed"(
    __post__,
    $2::"int4",
    $3::"text"
  ) as "4",
  "a"."post_headline_trimmed_strict"(__post__) as "5",
  "a"."post_headline_trimmed_strict"(
    __post__,
    $4::"int4"
  ) as "6",
  "a"."post_headline_trimmed_strict"(
    __post__,
    $5::"int4",
    $6::"text"
  ) as "7",
  "a"."post_headline_trimmed_no_defaults"(
    __post__,
    $7::"int4",
    $8::"text"
  ) as "8",
  "a"."post_headline_trimmed_no_defaults"(
    __post__,
    $9::"int4",
    $10::"text"
  ) as "9",
  ("a"."post_computed_text_array"(__post__))::text as "10",
  (case when ("a"."post_computed_interval_array"(__post__)) is not distinct from null then null::text else array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest("a"."post_computed_interval_array"(__post__)) __entry__
  )::text end) as "11"
from "a"."post" as __post__
order by __post__."id" asc;

select
  __person__."person_full_name" as "0",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "1",
  "c"."person_first_name"(__person__) as "2"
from "c"."person" as __person__
order by __person__."id" asc;

select
  __edge_case__."not_null_has_default"::text as "0",
  __edge_case__."wont_cast_easy"::text as "1",
  "c"."edge_case_computed"(__edge_case__) as "2"
from "c"."edge_case" as __edge_case__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."foo_bar"::text as "1",
    ("c"."compound_type_computed_field"(__frmcdc_compound_type__))::text as "2",
    (not (__frmcdc_compound_type__ is null))::text as "3",
    __frmcdc_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_nested_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."nested_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_nested_compound_type_identifiers__,
lateral (
  select
    case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
    case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
    (not (__frmcdc_nested_compound_type__ is null))::text as "2",
    __frmcdc_nested_compound_type_identifiers__.idx as "3"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
) as __frmcdc_nested_compound_type_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."foo_bar"::text as "1",
    ("c"."compound_type_computed_field"(__frmcdc_compound_type__))::text as "2",
    (not (__frmcdc_compound_type__ is null))::text as "3",
    __frmcdc_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_nested_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"b"."nested_compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_nested_compound_type_identifiers__,
lateral (
  select
    case when (__frmcdc_nested_compound_type__."a") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."a")."a"))::text, ((__frmcdc_nested_compound_type__."a")."b"), (((__frmcdc_nested_compound_type__."a")."c"))::text, ((__frmcdc_nested_compound_type__."a")."d"), (((__frmcdc_nested_compound_type__."a")."e"))::text, (((__frmcdc_nested_compound_type__."a")."f"))::text, to_char(((__frmcdc_nested_compound_type__."a")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."a")."foo_bar"))::text)::text end as "0",
    case when (__frmcdc_nested_compound_type__."b") is not distinct from null then null::text else json_build_array((((__frmcdc_nested_compound_type__."b")."a"))::text, ((__frmcdc_nested_compound_type__."b")."b"), (((__frmcdc_nested_compound_type__."b")."c"))::text, ((__frmcdc_nested_compound_type__."b")."d"), (((__frmcdc_nested_compound_type__."b")."e"))::text, (((__frmcdc_nested_compound_type__."b")."f"))::text, to_char(((__frmcdc_nested_compound_type__."b")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__frmcdc_nested_compound_type__."b")."foo_bar"))::text)::text end as "1",
    (not (__frmcdc_nested_compound_type__ is null))::text as "2",
    __frmcdc_nested_compound_type_identifiers__.idx as "3"
  from (select (__frmcdc_nested_compound_type_identifiers__."id0").*) as __frmcdc_nested_compound_type__
) as __frmcdc_nested_compound_type_result__;

select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"a"."post" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select
    case when (__post__) is not distinct from null then null::text else json_build_array((((__post__)."id"))::text, ((__post__)."headline"), ((__post__)."body"), (((__post__)."author_id"))::text, (((__post__)."enums"))::text, (case when (((__post__)."comptypes")) is not distinct from null then null::text else array(
      select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
      from unnest(((__post__)."comptypes")) __comptype__
    )::text end))::text end as "0",
    __post__."id"::text as "1",
    __post_identifiers__.idx as "2"
  from (select (__post_identifiers__."id0").*) as __post__
) as __post_result__;

select __post_computed_interval_set_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"a"."post" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_computed_interval_set_identifiers__,
lateral (
  select
    to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0",
    (row_number() over (partition by 1))::text as "1",
    __post_computed_interval_set_identifiers__.idx as "2"
  from "a"."post_computed_interval_set"(__post_computed_interval_set_identifiers__."id0") as __post_computed_interval_set__(v)
) as __post_computed_interval_set_result__;

select __person_friends_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."person" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_friends_identifiers__,
lateral (
  select
    __person_friends__."person_full_name" as "0",
    case when (__person_friends__) is not distinct from null then null::text else json_build_array((((__person_friends__)."id"))::text, ((__person_friends__)."person_full_name"), (((__person_friends__)."aliases"))::text, ((__person_friends__)."about"), ((__person_friends__)."email"), case when (((__person_friends__)."site")) is not distinct from null then null::text else json_build_array(((((__person_friends__)."site"))."url"))::text end, (((__person_friends__)."config"))::text, (((__person_friends__)."last_login_from_ip"))::text, (((__person_friends__)."last_login_from_subnet"))::text, (((__person_friends__)."user_mac"))::text, to_char(((__person_friends__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "1",
    "c"."person_first_name"(__person_friends__) as "2",
    __person_friends_identifiers__.idx as "3"
  from "c"."person_friends"(__person_friends_identifiers__."id0") as __person_friends__
) as __person_friends_result__;

select __person_first_post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."person" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_first_post_identifiers__,
lateral (
  select
    __person_first_post__."id"::text as "0",
    __person_first_post__."headline" as "1",
    __person_first_post_identifiers__.idx as "2"
  from "c"."person_first_post"(__person_first_post_identifiers__."id0") as __person_first_post__
) as __person_first_post_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."foo_bar"::text as "1",
    ("c"."compound_type_computed_field"(__frmcdc_compound_type__))::text as "2",
    (not (__frmcdc_compound_type__ is null))::text as "3",
    __frmcdc_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __frmcdc_compound_type_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."compound_type" as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_compound_type_identifiers__,
lateral (
  select
    __frmcdc_compound_type__."a"::text as "0",
    __frmcdc_compound_type__."foo_bar"::text as "1",
    ("c"."compound_type_computed_field"(__frmcdc_compound_type__))::text as "2",
    (not (__frmcdc_compound_type__ is null))::text as "3",
    __frmcdc_compound_type_identifiers__.idx as "4"
  from (select (__frmcdc_compound_type_identifiers__."id0").*) as __frmcdc_compound_type__
) as __frmcdc_compound_type_result__;

select __post_computed_compound_type_array_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"a"."post" as "id0" from json_array_elements($2::json) with ordinality as ids) as __post_computed_compound_type_array_identifiers__,
lateral (
  select
    __post_computed_compound_type_array__."a"::text as "0",
    __post_computed_compound_type_array__."b" as "1",
    __post_computed_compound_type_array__."c"::text as "2",
    __post_computed_compound_type_array__."d" as "3",
    __post_computed_compound_type_array__."e"::text as "4",
    __post_computed_compound_type_array__."f"::text as "5",
    to_char(__post_computed_compound_type_array__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
    __post_computed_compound_type_array__."foo_bar"::text as "7",
    (not (__post_computed_compound_type_array__ is null))::text as "8",
    __post_computed_compound_type_array_identifiers__.idx as "9"
  from unnest("a"."post_computed_compound_type_array"(
    __post_computed_compound_type_array_identifiers__."id0",
    $1::"c"."compound_type"
  )) as __post_computed_compound_type_array__
) as __post_computed_compound_type_array_result__;

select __person_friends_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."person" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_friends_identifiers__,
lateral (
  select
    __person_friends__."person_full_name" as "0",
    "c"."person_first_name"(__person_friends__) as "1",
    __person_friends_identifiers__.idx as "2"
  from "c"."person_friends"(__person_friends_identifiers__."id0") as __person_friends__
  limit 1
) as __person_friends_result__;