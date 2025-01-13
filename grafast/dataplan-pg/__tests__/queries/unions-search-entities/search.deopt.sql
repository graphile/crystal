select
  __entity_search__."person_id"::text as "0",
  __entity_search__."post_id"::text as "1",
  __entity_search__."comment_id"::text as "2",
  (not (__entity_search__ is null))::text as "3"
from interfaces_and_unions.search("query" := $1::"text") as __entity_search__
where (
  true /* authorization checks */
);

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
  __posts__."post_id"::text as "0",
  __posts__."body" as "1"
from interfaces_and_unions.posts as __posts__
where
  (
    true /* authorization checks */
  ) and (
    __posts__."post_id" = $1::"int4"
  );
