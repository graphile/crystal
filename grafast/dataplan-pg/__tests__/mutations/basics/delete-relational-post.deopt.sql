delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "1";

select __relational_posts_result__.*
from (select 0 as idx, $1::interfaces_and_unions.relational_posts as "id0") as __relational_posts_identifiers__,
lateral (
  select
    __relational_items__."author_id"::text as "0",
    __relational_posts__."id"::text as "1",
    __relational_posts__."title" as "2",
    __relational_posts__."description" as "3",
    __relational_posts__."note" as "4",
    __relational_posts_title_lower__.v as "5",
    __relational_posts_identifiers__.idx as "6"
  from (select (__relational_posts_identifiers__."id0").*) as __relational_posts__
  left outer join interfaces_and_unions.relational_items as __relational_items__
  on (
    (
      __relational_posts__."id"::"int4" = __relational_items__."id"
    ) and (
      /* WHERE becoming ON */ (
        true /* authorization checks */
      )
    )
  )
  left outer join interfaces_and_unions.relational_posts_title_lower(__relational_posts__) as __relational_posts_title_lower__(v)
  on (
  /* WHERE becoming ON */ (
    true /* authorization checks */
  ))
  where (
    true /* authorization checks */
  )
) as __relational_posts_result__;

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

delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "1";
