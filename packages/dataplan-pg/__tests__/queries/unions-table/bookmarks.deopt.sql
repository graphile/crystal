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
        __person_bookmarks__."person_id"::text,
        __person_bookmarks__."bookmarked_entity"::text,
        __people__."person_id"::text,
        __people__."username"::text,
        ((__person_bookmarks__."bookmarked_entity")."person_id")::text,
        __posts__."post_id"::text,
        __posts__."author_id"::text,
        __posts__."body"::text,
        ((__person_bookmarks__."bookmarked_entity")."post_id")::text,
        __comments__."comment_id"::text,
        __comments__."author_id"::text,
        __comments__."post_id"::text,
        __comments__."body"::text,
        ((__person_bookmarks__."bookmarked_entity")."comment_id")::text
      ]::text[]
      from interfaces_and_unions.person_bookmarks as __person_bookmarks__
      left outer join interfaces_and_unions.people as __people__
      on ((__person_bookmarks__."bookmarked_entity")."person_id"::"int4" = __people__."person_id")
      left outer join interfaces_and_unions.posts as __posts__
      on ((__person_bookmarks__."bookmarked_entity")."post_id"::"int4" = __posts__."post_id")
      left outer join interfaces_and_unions.comments as __comments__
      on ((__person_bookmarks__."bookmarked_entity")."comment_id"::"int4" = __comments__."comment_id")
      where
        (
          __people_2."person_id"::"int4" = __person_bookmarks__."person_id"
        ) and (
          true /* authorization checks */
        )
      order by __person_bookmarks__."id" asc
    ) as "0",
    __people_2."person_id"::text as "1",
    __people_2."username"::text as "2",
    __people_identifiers__.idx as "3"
  from interfaces_and_unions.people as __people_2
  where
    (
      true /* authorization checks */
    ) and (
      __people_2."person_id" = __people_identifiers__."id0"
    )
  order by __people_2."person_id" asc
) as __people_result__

select __people_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __people_identifiers__,
lateral (
  select
    __people__."username"::text as "0",
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

select __people_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __people_identifiers__,
lateral (
  select
    __people__."username"::text as "0",
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
    __posts__."body"::text as "0",
    __posts_identifiers__.idx as "1"
  from interfaces_and_unions.posts as __posts__
  where
    (
      true /* authorization checks */
    ) and (
      __posts__."post_id" = __posts_identifiers__."id0"
    )
  order by __posts__."post_id" asc
) as __posts_result__