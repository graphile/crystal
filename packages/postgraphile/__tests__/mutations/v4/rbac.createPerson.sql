insert into "c"."person" as __person__ ("person_full_name", "aliases", "about", "email", "site") values ($1::"varchar", $2::"text"[], $3::"text", $4::"b"."email", $5::"b"."wrapped_url") returning
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."aliases"::text as "2",
  __person__."about" as "3",
  __person__."email" as "4",
  __person__."site"::text as "5"


select __wrapped_url_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"b"."wrapped_url" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __wrapped_url_identifiers__,
lateral (
  select
    __wrapped_url__."url" as "0",
    (not (__wrapped_url__ is null))::text as "1",
    __wrapped_url_identifiers__.idx as "2"
  from (select (__wrapped_url_identifiers__."id0").*) as __wrapped_url__
) as __wrapped_url_result__