select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1",
  __relational_items__."parent_id"::text as "2"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    true /* authorization checks */
  ) and (
    __relational_items__."id" = $1::"int4"
  );

select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1",
  __relational_items__."author_id"::text as "2"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    true /* authorization checks */
  ) and (
    __relational_items__."id" = $1::"int4"
  );

select
  __relational_posts__."id"::text as "0"
from interfaces_and_unions.relational_posts as __relational_posts__
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );

select
  __relational_topics__."id"::text as "0"
from interfaces_and_unions.relational_topics as __relational_topics__
where
  (
    true /* authorization checks */
  ) and (
    __relational_topics__."id" = $1::"int4"
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
