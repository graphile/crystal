select
  (count(*))::text as "0"
from "c"."person" as __person__;

select
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "0",
  __person__."id"::text as "1"
from "c"."person" as __person__
order by __person__."id" asc;

select
  (count(*))::text as "0"
from "c"."table_set_query"() as __table_set_query__;

select __person_friends_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"c"."person" as "id0" from json_array_elements($1::json) with ordinality as ids) as __person_friends_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __person_friends_identifiers__.idx as "1"
  from "c"."person_friends"(__person_friends_identifiers__."id0") as __person_friends__
) as __person_friends_result__;