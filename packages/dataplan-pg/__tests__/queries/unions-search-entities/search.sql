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
    __people__."username"::text as "1",
    __entity_search__."person_id"::text as "2",
    __posts__."post_id"::text as "3",
    __people_2."username"::text as "4",
    __posts__."author_id"::text as "5",
    __posts__."body"::text as "6",
    __entity_search__."post_id"::text as "7",
    __comments__."comment_id"::text as "8",
    __people_3."username"::text as "9",
    __comments__."author_id"::text as "10",
    __posts_2."post_id"::text as "11",
    __posts_2."body"::text as "12",
    __comments__."post_id"::text as "13",
    __comments__."body"::text as "14",
    __entity_search__."comment_id"::text as "15",
    __entity_search_identifiers__.idx as "16"
  from interfaces_and_unions.search(__entity_search_identifiers__."id0") as __entity_search__
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