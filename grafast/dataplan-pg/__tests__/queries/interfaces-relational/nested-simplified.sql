select
  __people__."username" as "0",
  array(
    select array[
      __relational_items_2."type"::text,
      __relational_items_2."id"::text,
      __relational_items_2."type2"::text,
      __relational_items__."type"::text,
      __relational_items__."id"::text,
      __relational_items__."type2"::text
    ]::text[]
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
    where
      (
        __relational_items_2."author_id" = __people__."person_id"
      ) and (
        true /* authorization checks */
      )
    order by __relational_items_2."id" asc
    limit 1
    offset 1
  )::text as "1"
from interfaces_and_unions.people as __people__
where (
  true /* authorization checks */
)
order by __people__."person_id" asc
limit 1;

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
