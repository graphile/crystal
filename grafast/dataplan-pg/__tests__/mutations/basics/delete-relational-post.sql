delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "1";

select
  __relational_posts__."id"::text as "0",
  __relational_posts__."title" as "1",
  __relational_posts__."description" as "2",
  __relational_posts__."note" as "3",
  __relational_items__."author_id"::text as "4",
  __people__."person_id"::text as "5",
  __people__."username" as "6",
  __relational_posts_title_lower__.v as "7"
from (select ($1::interfaces_and_unions.relational_posts).*) as __relational_posts__
left outer join interfaces_and_unions.relational_items as __relational_items__
on (
/* WHERE becoming ON */
  (
    __relational_items__."id" = __relational_posts__."id"
  ) and (
    true /* authorization checks */
  )
)
left outer join interfaces_and_unions.people as __people__
on (
/* WHERE becoming ON */
  (
    __people__."person_id" = __relational_items__."author_id"
  ) and (
    true /* authorization checks */
  )
)
left outer join interfaces_and_unions.relational_posts_title_lower(__relational_posts__) as __relational_posts_title_lower__(v)
on (
/* WHERE becoming ON */ (
  true /* authorization checks */
))
where (
  true /* authorization checks */
);

delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "1";
