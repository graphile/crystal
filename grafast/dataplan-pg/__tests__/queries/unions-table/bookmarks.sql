select
  __people__."person_id"::text as "0",
  __people__."username" as "1",
  array(
    select array[
      __person_bookmarks__."id"::text,
      __person_bookmarks__."bookmarked_entity"::text,
      ((__person_bookmarks__."bookmarked_entity")."person_id")::text,
      ((__person_bookmarks__."bookmarked_entity")."post_id")::text,
      ((__person_bookmarks__."bookmarked_entity")."comment_id")::text,
      __people_2."username"
    ]::text[]
    from interfaces_and_unions.person_bookmarks as __person_bookmarks__
    left outer join interfaces_and_unions.people as __people_2
    on (
    /* WHERE becoming ON */
      (
        __people_2."person_id" = __person_bookmarks__."person_id"
      ) and (
        true /* authorization checks */
      )
    )
    where
      (
        __person_bookmarks__."person_id" = __people__."person_id"
      ) and (
        true /* authorization checks */
      )
    order by __person_bookmarks__."id" asc
  )::text as "2"
from interfaces_and_unions.people as __people__
where
  (
    __people__."person_id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __posts__."post_id"::text as "0",
  __posts__."body" as "1",
  __people__."username" as "2"
from interfaces_and_unions.posts as __posts__
left outer join interfaces_and_unions.people as __people__
on (
/* WHERE becoming ON */
  (
    __people__."person_id" = __posts__."author_id"
  ) and (
    true /* authorization checks */
  )
)
where
  (
    __posts__."post_id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __comments__."comment_id"::text as "0",
  __comments__."body" as "1",
  __people__."username" as "2",
  __posts__."body" as "3"
from interfaces_and_unions.comments as __comments__
left outer join interfaces_and_unions.people as __people__
on (
/* WHERE becoming ON */
  (
    __people__."person_id" = __comments__."author_id"
  ) and (
    true /* authorization checks */
  )
)
left outer join interfaces_and_unions.posts as __posts__
on (
/* WHERE becoming ON */
  (
    __posts__."post_id" = __comments__."post_id"
  ) and (
    true /* authorization checks */
  )
)
where
  (
    __comments__."comment_id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );
