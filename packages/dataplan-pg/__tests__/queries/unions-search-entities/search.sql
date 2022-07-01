select __entity_search_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"text" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __entity_search_identifiers__,
lateral (
  select
    __people__."person_id"::text as "0",
    __people__."username" as "1",
    __entity_search__."person_id"::text as "2",
    __posts__."post_id"::text as "3",
    __people_2."username" as "4",
    __posts__."body" as "5",
    __entity_search__."post_id"::text as "6",
    __comments__."comment_id"::text as "7",
    __people_3."username" as "8",
    __posts_2."post_id"::text as "9",
    __posts_2."body" as "10",
    __comments__."body" as "11",
    __entity_search__."comment_id"::text as "12",
    (not (__entity_search__ is null))::text as "13",
    __entity_search_identifiers__.idx as "14"
  from interfaces_and_unions.search("query" := __entity_search_identifiers__."id0") as __entity_search__
  left outer join interfaces_and_unions.people as __people__
  on (__entity_search__."person_id"::"int4" = __people__."person_id")
  left outer join interfaces_and_unions.posts as __posts__
  on (__entity_search__."post_id"::"int4" = __posts__."post_id")
  left outer join interfaces_and_unions.people as __people_2
  on (__posts__."author_id"::"int4" = __people_2."person_id")
  left outer join interfaces_and_unions.comments as __comments__
  on (__entity_search__."comment_id"::"int4" = __comments__."comment_id")
  left outer join interfaces_and_unions.people as __people_3
  on (__comments__."author_id"::"int4" = __people_3."person_id")
  left outer join interfaces_and_unions.posts as __posts_2
  on (__comments__."post_id"::"int4" = __posts_2."post_id")
  where (
    true /* authorization checks */
  )
) as __entity_search_result__