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
    __posts__."author_id"::text as "4",
    __posts__."body" as "5",
    __entity_search__."post_id"::text as "6",
    __comments__."comment_id"::text as "7",
    __comments__."author_id"::text as "8",
    __comments__."post_id"::text as "9",
    __comments__."body" as "10",
    __entity_search__."comment_id"::text as "11",
    (__entity_search__ is distinct from null)::text as "12",
    __entity_search_identifiers__.idx as "13"
  from interfaces_and_unions.search(__entity_search_identifiers__."id0") as __entity_search__
  left outer join interfaces_and_unions.people as __people__
  on (__entity_search__."person_id"::"int4" = __people__."person_id")
  left outer join interfaces_and_unions.posts as __posts__
  on (__entity_search__."post_id"::"int4" = __posts__."post_id")
  left outer join interfaces_and_unions.comments as __comments__
  on (__entity_search__."comment_id"::"int4" = __comments__."comment_id")
  where (
    true /* authorization checks */
  )
) as __entity_search_result__

select __people_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __people_identifiers__,
lateral (
  select
    __people__."username" as "0",
    __people_identifiers__.idx as "1"
  from interfaces_and_unions.people as __people__
  where
    (
      true /* authorization checks */
    ) and (
      __people__."person_id" = __people_identifiers__."id0"
    )
  order by __people__."person_id" asc
) as __people_result__

select __posts_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __posts_identifiers__,
lateral (
  select
    __posts__."post_id"::text as "0",
    __posts__."body" as "1",
    __posts_identifiers__.idx as "2"
  from interfaces_and_unions.posts as __posts__
  where
    (
      true /* authorization checks */
    ) and (
      __posts__."post_id" = __posts_identifiers__."id0"
    )
  order by __posts__."post_id" asc
) as __posts_result__