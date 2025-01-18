select
  (select json_agg(s) from (
    select
      __person_bookmarks__."id"::text as "0",
      __people__."username" as "1",
      __person_bookmarks__."bookmarked_entity"::text as "2",
      ((__person_bookmarks__."bookmarked_entity")."person_id")::text as "3",
      ((__person_bookmarks__."bookmarked_entity")."post_id")::text as "4",
      ((__person_bookmarks__."bookmarked_entity")."comment_id")::text as "5"
    from interfaces_and_unions.person_bookmarks as __person_bookmarks__
    left outer join interfaces_and_unions.people as __people__
    on (
      (
        __person_bookmarks__."person_id"::"int4" = __people__."person_id"
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
        __people_2."person_id"::"int4" = __person_bookmarks__."person_id"
      )
    order by __person_bookmarks__."id" asc
  ) s) as "0",
  __people_2."person_id"::text as "1",
  __people_2."username" as "2"
from interfaces_and_unions.people as __people_2
where
  (
    true /* authorization checks */
  ) and (
    __people_2."person_id" = $1::"int4"
  );

select
  __posts__."post_id"::text as "0",
  __people__."username" as "1",
  __posts__."body" as "2"
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
    __posts__."post_id" = $1::"int4"
  );

select
  __comments__."comment_id"::text as "0",
  __people__."username" as "1",
  __posts__."body" as "2",
  __comments__."body" as "3"
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
    __comments__."comment_id" = $1::"int4"
  );
