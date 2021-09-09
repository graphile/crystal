delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  __relational_posts__::text as "1",
  ((__relational_posts__)."id")::text as "2",
  ((__relational_posts__)."title")::text as "3",
  ((__relational_posts__)."description")::text as "4",
  ((__relational_posts__)."note")::text as "5"


delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  __relational_posts__::text as "1",
  ((__relational_posts__)."id")::text as "2",
  ((__relational_posts__)."title")::text as "3",
  ((__relational_posts__)."description")::text as "4",
  ((__relational_posts__)."note")::text as "5"
