insert into interfaces_and_unions.relational_items as __relational_items__ ("type", "author_id") values ($1::interfaces_and_unions.item_type, $2::"int4") returning
  __relational_items__."id"::text as "0";

insert into interfaces_and_unions.relational_posts as __relational_posts__ ("id", "title", "description", "note") values ($1::"int4", $2::"text", $3::"text", $4::"text") returning
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "0",
  ((__relational_posts__)."id")::text as "1";

select
  __relational_items__."is_explicitly_archived"::text as "0",
  __people__."person_id"::text as "1",
  __people__."username" as "2",
  __relational_posts__."id"::text as "3",
  __relational_posts__."title" as "4",
  __relational_posts__."description" as "5",
  __relational_posts__."note" as "6",
  __relational_posts_title_lower__.v as "7"
from interfaces_and_unions.relational_posts as __relational_posts__
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
left outer join interfaces_and_unions.people as __people__
on (
  (
    __relational_items__."author_id"::"int4" = __people__."person_id"
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
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );
