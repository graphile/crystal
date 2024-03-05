select __relational_posts_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"text" as "id1") as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts_identifiers__.idx as "0"
  from interfaces_and_unions.insert_post(__relational_posts_identifiers__."id0", __relational_posts_identifiers__."id1") as __relational_posts__
  order by __relational_posts__."id" asc
) as __relational_posts_result__;

select __relational_posts_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"text" as "id1") as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts_identifiers__.idx as "0"
  from interfaces_and_unions.insert_post(__relational_posts_identifiers__."id0", __relational_posts_identifiers__."id1") as __relational_posts__
  order by __relational_posts__."id" asc
) as __relational_posts_result__;

select __relational_posts_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"text" as "id1") as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__::text as "0",
    __relational_posts__."id"::text as "1",
    __relational_posts_identifiers__.idx as "2"
  from interfaces_and_unions.insert_post(__relational_posts_identifiers__."id0", __relational_posts_identifiers__."id1") as __relational_posts__
) as __relational_posts_result__;

select __relational_items_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items__."id"::text as "1",
    __relational_items_identifiers__.idx as "2"
  from interfaces_and_unions.relational_items as __relational_items__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
) as __relational_items_result__;

select __relational_items_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items__."id"::text as "1",
    __relational_items_identifiers__.idx as "2"
  from interfaces_and_unions.relational_items as __relational_items__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
) as __relational_items_result__;

select __relational_items_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_items__."id"::text as "1",
    __relational_items_identifiers__.idx as "2"
  from interfaces_and_unions.relational_items as __relational_items__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
) as __relational_items_result__;

select __relational_posts_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."title" as "0",
    __relational_posts__."description" as "1",
    __relational_posts__."note" as "2",
    __relational_posts__."id"::text as "3",
    __relational_posts_identifiers__.idx as "4"
  from interfaces_and_unions.relational_posts as __relational_posts__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    )
) as __relational_posts_result__;

select __relational_posts_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."title" as "0",
    __relational_posts__."description" as "1",
    __relational_posts__."note" as "2",
    __relational_posts__."id"::text as "3",
    __relational_posts_identifiers__.idx as "4"
  from interfaces_and_unions.relational_posts as __relational_posts__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    )
) as __relational_posts_result__;

select __relational_posts_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __relational_posts_identifiers__,
lateral (
  select
    __relational_posts__."title" as "0",
    __relational_posts__."description" as "1",
    __relational_posts__."note" as "2",
    __relational_posts__."id"::text as "3",
    __relational_posts_identifiers__.idx as "4"
  from interfaces_and_unions.relational_posts as __relational_posts__
  where
    (
      true /* authorization checks */
    ) and (
      __relational_posts__."id" = __relational_posts_identifiers__."id0"
    )
) as __relational_posts_result__;
