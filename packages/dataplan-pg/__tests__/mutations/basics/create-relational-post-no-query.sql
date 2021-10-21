insert into interfaces_and_unions.relational_items as __relational_items__ ("type", "author_id") values ($1::interfaces_and_unions.item_type, $2::"int4") returning
  __relational_items__."id"::text as "0"


insert into interfaces_and_unions.relational_posts as __relational_posts__ ("id", "title", "description", "note") values ($1::"int4", $2::"text", $3::"text", $4::"text") returning
  __relational_posts__::text as "0"


insert into interfaces_and_unions.relational_items as __relational_items__ ("type", "author_id") values ($1::interfaces_and_unions.item_type, $2::"int4") returning
  __relational_items__."id"::text as "0"


insert into interfaces_and_unions.relational_posts as __relational_posts__ ("id", "title", "description", "note") values ($1::"int4", $2::"text", $3::"text", $4::"text") returning
  __relational_posts__::text as "0"


select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_items__."id"::text as "4",
    __relational_items_identifiers__.idx as "5"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_items__."id"::text as "4",
    __relational_items_identifiers__.idx as "5"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_items__."id"::text as "4",
    __relational_items_identifiers__.idx as "5"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__

insert into interfaces_and_unions.relational_items as __relational_items__ ("type", "author_id") values ($1::interfaces_and_unions.item_type, $2::"int4") returning
  __relational_items__."id"::text as "0"


insert into interfaces_and_unions.relational_posts as __relational_posts__ ("id", "title", "description", "note") values ($1::"int4", $2::"text", $3::"text", $4::"text") returning
  __relational_posts__::text as "0"


select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_items__."id"::text as "4",
    __relational_items_identifiers__.idx as "5"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_items__."id"::text as "4",
    __relational_items_identifiers__.idx as "5"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__

select __relational_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __relational_items_identifiers__,
lateral (
  select
    __relational_items__."type"::text as "0",
    __relational_posts__."title"::text as "1",
    __relational_posts__."description"::text as "2",
    __relational_posts__."note"::text as "3",
    __relational_items__."id"::text as "4",
    __relational_items_identifiers__.idx as "5"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__