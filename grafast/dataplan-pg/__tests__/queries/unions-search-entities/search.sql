select
  __entity_search__."person_id"::text as "0",
  __entity_search__."post_id"::text as "1",
  __entity_search__."comment_id"::text as "2",
  (not (__entity_search__ is null))::text as "3"
from interfaces_and_unions.search($1::"text") as __entity_search__
where (
  true /* authorization checks */
);

select
  __people__."person_id"::text as "0",
  __people__."username" as "1"
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
  __posts__."post_id"::text as "3",
  __posts__."body" as "4"
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
