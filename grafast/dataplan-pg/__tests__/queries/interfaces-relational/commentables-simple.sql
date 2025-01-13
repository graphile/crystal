select
  __relational_commentables__."type"::text as "0",
  __relational_commentables__."id"::text as "1"
from interfaces_and_unions.relational_commentables as __relational_commentables__
where (
  true /* authorization checks */
)
order by __relational_commentables__.id asc
limit 1;

select
  __relational_items__."type"::text as "0",
  __relational_items__."type2"::text as "1",
  __relational_items__."position"::text as "2",
  __relational_posts__."id"::text as "3"
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
where
  (
    true /* authorization checks */
  ) and (
    __relational_posts__."id" = $1::"int4"
  );
