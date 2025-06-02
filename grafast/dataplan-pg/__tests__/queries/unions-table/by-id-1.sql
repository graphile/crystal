select
  __union_items__."type"::text as "0",
  __union_items__."id"::text as "1"
from interfaces_and_unions.union_items as __union_items__
where
  (
    __union_items__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );

select
  __union_topics__."id"::text as "0",
  __union_topics__."title" as "1"
from interfaces_and_unions.union_topics as __union_topics__
where
  (
    __union_topics__."id" = $1::"int4"
  ) and (
    true /* authorization checks */
  );
