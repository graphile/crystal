delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  __relational_posts__::text as "1";

select __relational_posts_result__.*
from (select 0 as idx, $1::interfaces_and_unions.relational_posts as "id0") as __relational_posts_identifiers__,
lateral (
  select
    __people__."person_id"::text as "0",
    __people__."username" as "1",
    __relational_items__."author_id"::text as "2",
    __relational_posts__."id"::text as "3",
    __relational_posts__."title" as "4",
    __relational_posts__."description" as "5",
    __relational_posts__."note" as "6",
    __relational_posts_title_lower__.v as "7",
    __relational_posts_identifiers__.idx as "8"
  from (select (__relational_posts_identifiers__."id0").*) as __relational_posts__
  left outer join interfaces_and_unions.relational_items as __relational_items__
  on (__relational_posts__."id"::"int4" = __relational_items__."id")
  left outer join interfaces_and_unions.people as __people__
  on (__relational_items__."author_id"::"int4" = __people__."person_id")
  left outer join interfaces_and_unions.relational_posts_title_lower(__relational_posts__) as __relational_posts_title_lower__(v)
  on TRUE
  where (
    true /* authorization checks */
  )
  order by __relational_posts__."id" asc
) as __relational_posts_result__;

delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  __relational_posts__::text as "1";
