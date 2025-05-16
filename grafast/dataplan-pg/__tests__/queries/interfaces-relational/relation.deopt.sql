select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1",
  __relational_items__."parent_id"::text as "2"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    __relational_items__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1",
  __relational_items__."author_id"::text as "2"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    __relational_items__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __people__."username" as "0"
from interfaces_and_unions.people as __people__
where
  (
    __people__."person_id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __relational_posts__."id"::text as "0"
from interfaces_and_unions.relational_posts as __relational_posts__
where
  (
    __relational_posts__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __relational_topics__."id"::text as "0"
from interfaces_and_unions.relational_topics as __relational_topics__
where
  (
    __relational_topics__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );
