update interfaces_and_unions.relational_posts as __relational_posts__ set "description" = $1::"text" where (__relational_posts__."id" = $2::"int4") returning
  __relational_posts__."id"::text as "0";

select
  __relational_posts__."id"::text as "0",
  __relational_posts__."title" as "1",
  __relational_posts__."description" as "2",
  __relational_posts__."note" as "3",
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "4"
from interfaces_and_unions.relational_posts as __relational_posts__
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );

select
  __relational_posts_title_lower__.v as "0"
from interfaces_and_unions.relational_posts_title_lower($1::interfaces_and_unions.relational_posts) as __relational_posts_title_lower__(v)
where (
  true /* authorization checks */
);

select
  __relational_items__."is_explicitly_archived"::text as "0",
  __relational_items__."author_id"::text as "1"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    true /* authorization checks */
  ) and (
    __relational_items__."id" = $1::"int4"
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

update interfaces_and_unions.relational_posts as __relational_posts__ set "note" = $1::"text" where (__relational_posts__."id" = $2::"int4") returning
  __relational_posts__."id"::text as "0";

select
  __relational_posts__."id"::text as "0",
  __relational_posts__."title" as "1",
  __relational_posts__."description" as "2",
  __relational_posts__."note" as "3",
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "4"
from interfaces_and_unions.relational_posts as __relational_posts__
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );

select
  __relational_posts_title_lower__.v as "0"
from interfaces_and_unions.relational_posts_title_lower($1::interfaces_and_unions.relational_posts) as __relational_posts_title_lower__(v)
where (
  true /* authorization checks */
);

select
  __relational_items__."is_explicitly_archived"::text as "0",
  __relational_items__."author_id"::text as "1"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    true /* authorization checks */
  ) and (
    __relational_items__."id" = $1::"int4"
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

update interfaces_and_unions.relational_posts as __relational_posts__ set "description" = $1::"text" where (__relational_posts__."id" = $2::"int4") returning
  __relational_posts__."id"::text as "0";

select
  __relational_posts__."id"::text as "0",
  __relational_posts__."title" as "1",
  __relational_posts__."description" as "2",
  __relational_posts__."note" as "3",
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "4"
from interfaces_and_unions.relational_posts as __relational_posts__
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );

select
  __relational_posts_title_lower__.v as "0"
from interfaces_and_unions.relational_posts_title_lower($1::interfaces_and_unions.relational_posts) as __relational_posts_title_lower__(v)
where (
  true /* authorization checks */
);

select
  __relational_items__."is_explicitly_archived"::text as "0",
  __relational_items__."author_id"::text as "1"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    true /* authorization checks */
  ) and (
    __relational_items__."id" = $1::"int4"
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

update interfaces_and_unions.relational_posts as __relational_posts__ set "description" = $1::"text" where (__relational_posts__."id" = $2::"int4") returning
  __relational_posts__."id"::text as "0";
