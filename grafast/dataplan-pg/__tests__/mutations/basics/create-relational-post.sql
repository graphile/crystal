insert into interfaces_and_unions.relational_items as __relational_items__ ("type", "author_id") values ($1::interfaces_and_unions.item_type, $2::"int4") returning
  __relational_items__."id"::text as "0";

insert into interfaces_and_unions.relational_posts as __relational_posts__ ("id", "title", "description", "note") values ($1::"int4", $2::"text", $3::"text", $4::"text") returning
  __relational_posts__::text as "0",
  ((__relational_posts__)."id")::text as "1";

select __relational_posts_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_posts_identifiers__,
lateral (
  select
    __relational_items__."is_explicitly_archived"::text as "0",
    __people__."person_id"::text as "1",
    __people__."username" as "2",
    __relational_posts__."id"::text as "3",
    __relational_posts__."title" as "4",
    __relational_posts__."description" as "5",
    __relational_posts__."note" as "6",
    __relational_posts_title_lower__.v as "7",
    __relational_posts_identifiers__.idx as "8"
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
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    )
) as __relational_posts_result__;
