update interfaces_and_unions.relational_posts as __relational_posts__ set "description" = $1::"text" where (__relational_posts__."id" = $2::"int4") returning
  __relational_posts__."id"::text as "0"


select __relational_posts_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."id"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_posts_identifiers__.idx as "4"
  from interfaces_and_unions.relational_posts as __relational_posts__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    )
  order by __relational_posts__."id" asc
) as __relational_posts_result__

update interfaces_and_unions.relational_posts as __relational_posts__ set "note" = $1::"text" where (__relational_posts__."id" = $2::"int4") returning
  __relational_posts__."id"::text as "0"


select __relational_posts_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."id"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_posts_identifiers__.idx as "4"
  from interfaces_and_unions.relational_posts as __relational_posts__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    )
  order by __relational_posts__."id" asc
) as __relational_posts_result__

update interfaces_and_unions.relational_posts as __relational_posts__ set "description" = $1::"text" where (__relational_posts__."id" = $2::"int4") returning
  __relational_posts__."id"::text as "0"


select __relational_posts_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."id"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_posts_identifiers__.idx as "4"
  from interfaces_and_unions.relational_posts as __relational_posts__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    )
  order by __relational_posts__."id" asc
) as __relational_posts_result__