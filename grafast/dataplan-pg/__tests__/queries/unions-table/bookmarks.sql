select
  __people__."person_id"::text as "0",
  __people__."username" as "1"
from interfaces_and_unions.people as __people__
where
  (
    true /* authorization checks */
  ) and (
    __people__."person_id" = $1::"int4"
  );

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
    __person_bookmarks__."person_id" = $1::"int4"
  )
order by __person_bookmarks__."id" asc;

select __people_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __people_identifiers__,
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

select
  __posts__."post_id"::text as "0",
  __posts__."author_id"::text as "1",
  __posts__."body" as "2"
from interfaces_and_unions.posts as __posts__
where
  (
    true /* authorization checks */
  ) and (
    __posts__."post_id" = $1::"int4"
  );

select
  __comments__."comment_id"::text as "0",
  __comments__."author_id"::text as "1",
  __comments__."post_id"::text as "2",
  __comments__."body" as "3"
from interfaces_and_unions.comments as __comments__
where
  (
    true /* authorization checks */
  ) and (
    __comments__."comment_id" = $1::"int4"
  );

select
  __people__."username" as "0"
from interfaces_and_unions.people as __people__
where
  (
    true /* authorization checks */
  ) and (
    __people__."person_id" = $1::"int4"
  );

select
  __people__."username" as "0"
from interfaces_and_unions.people as __people__
where
  (
    true /* authorization checks */
  ) and (
    __people__."person_id" = $1::"int4"
  );

select
  __posts__."body" as "0"
from interfaces_and_unions.posts as __posts__
where
  (
    true /* authorization checks */
  ) and (
    __posts__."post_id" = $1::"int4"
  );
