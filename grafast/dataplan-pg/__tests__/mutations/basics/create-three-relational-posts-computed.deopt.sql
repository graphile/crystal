select /* NOTHING?! */
from interfaces_and_unions.insert_post($1::"int4", $2::"text") as __relational_posts__
where (
  true /* authorization checks */
)
order by __relational_posts__."id" asc;

select /* NOTHING?! */
from interfaces_and_unions.insert_post($1::"int4", $2::"text") as __relational_posts__
where (
  true /* authorization checks */
)
order by __relational_posts__."id" asc;

select
  case when (__relational_posts__) is not distinct from null then null::text else json_build_array((((__relational_posts__)."id"))::text, ((__relational_posts__)."title"), ((__relational_posts__)."description"), ((__relational_posts__)."note"))::text end as "0",
  __relational_posts__."id"::text as "1"
from interfaces_and_unions.insert_post($1::"int4", $2::"text") as __relational_posts__
where (
  true /* authorization checks */
);

select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    true /* authorization checks */
  ) and (
    __relational_items__."id" = $1::"int4"
  );

select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    true /* authorization checks */
  ) and (
    __relational_items__."id" = $1::"int4"
  );

select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    true /* authorization checks */
  ) and (
    __relational_items__."id" = $1::"int4"
  );

select
  __relational_posts__."title" as "0",
  __relational_posts__."description" as "1",
  __relational_posts__."note" as "2",
  __relational_posts__."id"::text as "3"
from interfaces_and_unions.relational_posts as __relational_posts__
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );

select
  __relational_posts__."title" as "0",
  __relational_posts__."description" as "1",
  __relational_posts__."note" as "2",
  __relational_posts__."id"::text as "3"
from interfaces_and_unions.relational_posts as __relational_posts__
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );

select
  __relational_posts__."title" as "0",
  __relational_posts__."description" as "1",
  __relational_posts__."note" as "2",
  __relational_posts__."id"::text as "3"
from interfaces_and_unions.relational_posts as __relational_posts__
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );
