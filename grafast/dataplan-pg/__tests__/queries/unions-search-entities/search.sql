select __entity_search_result__.*
from (select 0 as idx, $1::"text" as "id0") as __entity_search_identifiers__,
lateral (
  select
    __entity_search__."person_id"::text as "0",
    __entity_search__."post_id"::text as "1",
    __entity_search__."comment_id"::text as "2",
    (not (__entity_search__ is null))::text as "3",
    __entity_search_identifiers__.idx as "4"
  from interfaces_and_unions.search("query" := __entity_search_identifiers__."id0") as __entity_search__
  where (
    true /* authorization checks */
  )
) as __entity_search_result__;

select __people_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __people_identifiers__,
lateral (
  select
    __people__."person_id"::text as "0",
    __people__."username" as "1",
    __people_identifiers__.idx as "2"
  from interfaces_and_unions.people as __people__
  where
    (
      true /* authorization checks */
    ) and (
      __people__."person_id" = __people_identifiers__."id0"
    )
) as __people_result__;

select __posts_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __posts_identifiers__,
lateral (
  select
    __posts__."post_id"::text as "0",
    __people__."username" as "1",
    __posts__."body" as "2",
    __posts_identifiers__.idx as "3"
  from interfaces_and_unions.posts as __posts__
  left outer join interfaces_and_unions.people as __people__
  on (
    (
      __posts__."author_id"::"int4" = __people__."person_id"
    ) and (
      /* WHERE becoming ON */ (
        true /* authorization checks */
      )
    )
  )
  where
    (
      true /* authorization checks */
    ) and (
      __posts__."post_id" = __posts_identifiers__."id0"
    )
) as __posts_result__;

select __comments_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __comments_identifiers__,
lateral (
  select
    __comments__."comment_id"::text as "0",
    __people__."username" as "1",
    __posts__."post_id"::text as "2",
    __posts__."body" as "3",
    __comments__."body" as "4",
    __comments_identifiers__.idx as "5"
  from interfaces_and_unions.comments as __comments__
  left outer join interfaces_and_unions.people as __people__
  on (
    (
      __comments__."author_id"::"int4" = __people__."person_id"
    ) and (
      /* WHERE becoming ON */ (
        true /* authorization checks */
      )
    )
  )
  left outer join interfaces_and_unions.posts as __posts__
  on (
    (
      __comments__."post_id"::"int4" = __posts__."post_id"
    ) and (
      /* WHERE becoming ON */ (
        true /* authorization checks */
      )
    )
  )
  where
    (
      true /* authorization checks */
    ) and (
      __comments__."comment_id" = __comments_identifiers__."id0"
    )
) as __comments_result__;
