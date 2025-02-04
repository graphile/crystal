select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  "a"."post_headline_trimmed"(__post__) as "2",
  __post__."author_id"::text as "3"
from "a"."post" as __post__
order by __post__."id" asc;

select __person_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "2",
    "c"."person_first_name"(__person__) as "3",
    __person_identifiers__.idx as "4"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_first_post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."person" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_first_post_identifiers__,
lateral (
  select
    __person_first_post__."id"::text as "0",
    __person_first_post__."headline" as "1",
    "a"."post_headline_trimmed"(__person_first_post__) as "2",
    __person_first_post__."author_id"::text as "3",
    __person_first_post_identifiers__.idx as "4"
  from "c"."person_first_post"(__person_first_post_identifiers__."id0") as __person_first_post__
) as __person_first_post_result__;

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

select __person_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    "c"."person_first_name"(__person__) as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;