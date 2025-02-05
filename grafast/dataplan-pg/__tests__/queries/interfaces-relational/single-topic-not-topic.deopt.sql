select
  __relational_topics__."id"::text as "0",
  __relational_topics__."title" as "1"
from interfaces_and_unions.relational_topics as __relational_topics__
where
  (
    true /* authorization checks */
  ) and (
    __relational_topics__."id" = $1::"int4"
  );
