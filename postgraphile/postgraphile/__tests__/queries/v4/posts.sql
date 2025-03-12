select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  "a"."post_headline_trimmed"(__post__) as "2",
  __person__."id"::text as "3",
  __person__."person_full_name" as "4",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "5",
  "c"."person_first_name"(__person__) as "6",
  __person_first_post__."id"::text as "7",
  __person_first_post__."headline" as "8",
  "a"."post_headline_trimmed"(__person_first_post__) as "9",
  __person_2."id"::text as "10",
  __person_2."person_full_name" as "11",
  "c"."person_first_name"(__person_2) as "12"
from "a"."post" as __post__
left outer join "c"."person" as __person__
on (
/* WHERE becoming ON */ (
  __person__."id" = __post__."author_id"
))
left outer join "c"."person_first_post"(__person__) as __person_first_post__
on TRUE
left outer join "c"."person" as __person_2
on (
/* WHERE becoming ON */ (
  __person_2."id" = __person_first_post__."author_id"
))
order by __post__."id" asc;

select __person_friends_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."person" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_friends_identifiers__,
lateral (
  select
    __person_friends__."id"::text as "0",
    __person_friends__."person_full_name" as "1",
    "c"."person_first_name"(__person_friends__) as "2",
    (row_number() over (partition by 1))::text as "3",
    __person_friends_identifiers__.idx as "4"
  from "c"."person_friends"(__person_friends_identifiers__."id0") as __person_friends__
) as __person_friends_result__;

select __person_friends_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."person" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_friends_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __person_friends_identifiers__.idx as "1"
  from "c"."person_friends"(__person_friends_identifiers__."id0") as __person_friends__
) as __person_friends_result__;