select __people_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __people_identifiers__,
lateral (
  select
    array(
      select array[
        __person_bookmarks__."id"::text,
        __people__."username"::text,
        __person_bookmarks__."person_id"::text,
        __person_bookmarks__."bookmarked_entity"::text,
        __people_2."person_id"::text,
        __people_2."username"::text,
        ((__person_bookmarks__."bookmarked_entity")."person_id")::text,
        __posts__."post_id"::text,
        __people_3."username"::text,
        __posts__."author_id"::text,
        __posts__."body"::text,
        ((__person_bookmarks__."bookmarked_entity")."post_id")::text,
        __comments__."comment_id"::text,
        __people_4."username"::text,
        __comments__."author_id"::text,
        __posts_2."body"::text,
        __comments__."post_id"::text,
        __comments__."body"::text,
        ((__person_bookmarks__."bookmarked_entity")."comment_id")::text
      ]::text[]
      from interfaces_and_unions.person_bookmarks as __person_bookmarks__
      left outer join interfaces_and_unions.people as __people__
      on (__person_bookmarks__."person_id"::"int4" = __people__."person_id")
      left outer join interfaces_and_unions.people as __people_2
      on ((__person_bookmarks__."bookmarked_entity")."person_id"::"int4" = __people_2."person_id")
      left outer join interfaces_and_unions.posts as __posts__
      on ((__person_bookmarks__."bookmarked_entity")."post_id"::"int4" = __posts__."post_id")
      left outer join interfaces_and_unions.people as __people_3
      on (__posts__."author_id"::"int4" = __people_3."person_id")
      left outer join interfaces_and_unions.comments as __comments__
      on ((__person_bookmarks__."bookmarked_entity")."comment_id"::"int4" = __comments__."comment_id")
      left outer join interfaces_and_unions.people as __people_4
      on (__comments__."author_id"::"int4" = __people_4."person_id")
      left outer join interfaces_and_unions.posts as __posts_2
      on (__comments__."post_id"::"int4" = __posts_2."post_id")
      where
        (
          __people_5."person_id"::"int4" = __person_bookmarks__."person_id"
        ) and (
          true /* authorization checks */
        )
      order by __person_bookmarks__."id" asc
    ) as "0",
    __people_5."person_id"::text as "1",
    __people_5."username"::text as "2",
    __people_identifiers__.idx as "3"
  from interfaces_and_unions.people as __people_5
  where
    (
      true /* authorization checks */
    ) and (
      __people_5."person_id" = __people_identifiers__."id0"
    )
  order by __people_5."person_id" asc
) as __people_result__