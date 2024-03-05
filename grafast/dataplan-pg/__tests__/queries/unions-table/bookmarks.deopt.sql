select __people_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __people_identifiers__,
lateral (
  select
    (select json_agg(s) from (
      select
        __person_bookmarks__."id"::text as "0",
        __person_bookmarks__."person_id"::text as "1",
        __person_bookmarks__."bookmarked_entity"::text as "2",
        ((__person_bookmarks__."bookmarked_entity")."person_id")::text as "3",
        ((__person_bookmarks__."bookmarked_entity")."post_id")::text as "4",
        ((__person_bookmarks__."bookmarked_entity")."comment_id")::text as "5"
      from interfaces_and_unions.person_bookmarks as __person_bookmarks__
      where
        (
          true /* authorization checks */
        ) and (
          __people__."person_id"::"int4" = __person_bookmarks__."person_id"
        )
      order by __person_bookmarks__."id" asc
    ) s) as "0",
    __people__."person_id"::text as "1",
    __people__."username" as "2",
    __people_identifiers__.idx as "3"
  from interfaces_and_unions.people as __people__
  where
    (
      true /* authorization checks */
    ) and (
      __people__."person_id" = __people_identifiers__."id0"
    )
) as __people_result__;

select __people_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __people_identifiers__,
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
) as __people_result__;

select __posts_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __posts_identifiers__,
lateral (
  select
    __posts__."post_id"::text as "0",
    __posts__."author_id"::text as "1",
    __posts__."body" as "2",
    __posts_identifiers__.idx as "3"
  from interfaces_and_unions.posts as __posts__
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
    __comments__."author_id"::text as "1",
    __comments__."post_id"::text as "2",
    __comments__."body" as "3",
    __comments_identifiers__.idx as "4"
  from interfaces_and_unions.comments as __comments__
  where
    (
      true /* authorization checks */
    ) and (
      __comments__."comment_id" = __comments_identifiers__."id0"
    )
) as __comments_result__;

select __people_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __people_identifiers__,
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
) as __people_result__;

select __posts_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __posts_identifiers__,
lateral (
  select
    __posts__."body" as "0",
    __posts_identifiers__.idx as "1"
  from interfaces_and_unions.posts as __posts__
  where
    (
      true /* authorization checks */
    ) and (
      __posts__."post_id" = __posts_identifiers__."id0"
    )
) as __posts_result__;
