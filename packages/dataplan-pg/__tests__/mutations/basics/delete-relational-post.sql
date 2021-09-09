delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  __relational_posts__::text as "1"


select __relational_posts_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::interfaces_and_unions.relational_posts as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."id"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_posts_title_lower__.__relational_posts_title_lower__::text as "4",
    __relational_posts_identifiers__.idx as "5"
  from (select (__relational_posts_identifiers__."id0").*) as __relational_posts__
  left outer join interfaces_and_unions.relational_posts_title_lower(__relational_posts__) as __relational_posts_title_lower__
  on TRUE
  where (
    true /* authorization checks */
  )
  order by __relational_posts__."id" asc
) as __relational_posts_result__

delete from interfaces_and_unions.relational_posts as __relational_posts__ where (__relational_posts__."id" = $1::"int4") returning
  __relational_posts__."id"::text as "0",
  __relational_posts__::text as "1"
