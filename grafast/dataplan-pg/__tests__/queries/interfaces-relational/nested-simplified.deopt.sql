select
  __people__."username" as "0",
  __people__."person_id"::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc
limit 1;

select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1",
  __relational_items__."type2"::text as "2",
  __relational_items__."parent_id"::text as "3"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    __relational_items__."author_id" = $1::"int4"
  ) and (
    true /* authorization checks */
  )
order by __relational_items__."id" asc
limit 1
offset 1;

select
  __relational_items__."type"::text as "0",
  __relational_items__."id"::text as "1",
  __relational_items__."type2"::text as "2"
from interfaces_and_unions.relational_items as __relational_items__
where
  (
    __relational_items__."id" = $1::"int4"
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
