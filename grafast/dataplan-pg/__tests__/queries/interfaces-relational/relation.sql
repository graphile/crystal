select
  __relational_items_2."id"::text as "0",
  __relational_items_2."type"::text as "1",
  __relational_items__."id"::text as "2",
  __relational_items__."type"::text as "3",
  __people__."username" as "4"
from interfaces_and_unions.relational_items as __relational_items_2
left outer join interfaces_and_unions.relational_items as __relational_items__
on (
/* WHERE becoming ON */
  (
    __relational_items__."id" = __relational_items_2."parent_id"
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
where
  (
    __relational_items_2."id" = $1::"int4"
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
