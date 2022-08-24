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
    __relational_topics__."id"::text as "1",
    __relational_dividers__."id"::text as "2",
    __relational_checklists__."id"::text as "3",
    __relational_checklist_items__."id"::text as "4",
    __relational_posts__."title" as "5",
    __relational_posts__."description" as "6",
    __relational_posts__."note" as "7",
    __relational_posts__."id"::text as "8",
    __relational_items__."id"::text as "9",
    __relational_items_identifiers__.idx as "10"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
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
    __relational_topics__."id"::text as "1",
    __relational_dividers__."id"::text as "2",
    __relational_checklists__."id"::text as "3",
    __relational_checklist_items__."id"::text as "4",
    __relational_posts__."title" as "5",
    __relational_posts__."description" as "6",
    __relational_posts__."note" as "7",
    __relational_posts__."id"::text as "8",
    __relational_items__."id"::text as "9",
    __relational_items_identifiers__.idx as "10"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
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
    __relational_topics__."id"::text as "1",
    __relational_dividers__."id"::text as "2",
    __relational_checklists__."id"::text as "3",
    __relational_checklist_items__."id"::text as "4",
    __relational_posts__."title" as "5",
    __relational_posts__."description" as "6",
    __relational_posts__."note" as "7",
    __relational_posts__."id"::text as "8",
    __relational_items__."id"::text as "9",
    __relational_items_identifiers__.idx as "10"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
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
    __relational_posts__."note" as "0",
    __relational_posts__."description" as "1",
    __relational_posts__."title" as "2",
    __relational_posts__."id"::text as "3",
    __relational_checklist_items__."id"::text as "4",
    __relational_checklists__."id"::text as "5",
    __relational_dividers__."id"::text as "6",
    __relational_topics__."id"::text as "7",
    __relational_items__."type"::text as "8",
    __relational_items__."id"::text as "9",
    __relational_items_identifiers__.idx as "10"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
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
    __relational_posts__."note" as "0",
    __relational_posts__."description" as "1",
    __relational_posts__."title" as "2",
    __relational_posts__."id"::text as "3",
    __relational_checklist_items__."id"::text as "4",
    __relational_checklists__."id"::text as "5",
    __relational_dividers__."id"::text as "6",
    __relational_topics__."id"::text as "7",
    __relational_items__."id"::text as "8",
    __relational_items__."type"::text as "9",
    __relational_items_identifiers__.idx as "10"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
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
    __relational_posts__."note" as "0",
    __relational_posts__."description" as "1",
    __relational_posts__."title" as "2",
    __relational_posts__."id"::text as "3",
    __relational_checklist_items__."id"::text as "4",
    __relational_checklists__."id"::text as "5",
    __relational_dividers__."id"::text as "6",
    __relational_topics__."id"::text as "7",
    __relational_items__."id"::text as "8",
    __relational_items__."type"::text as "9",
    __relational_items_identifiers__.idx as "10"
  from interfaces_and_unions.relational_items as __relational_items__
  left outer join interfaces_and_unions.relational_posts as __relational_posts__
  on (__relational_items__."id"::"int4" = __relational_posts__."id")
  left outer join interfaces_and_unions.relational_checklist_items as __relational_checklist_items__
  on (__relational_items__."id"::"int4" = __relational_checklist_items__."id")
  left outer join interfaces_and_unions.relational_checklists as __relational_checklists__
  on (__relational_items__."id"::"int4" = __relational_checklists__."id")
  left outer join interfaces_and_unions.relational_dividers as __relational_dividers__
  on (__relational_items__."id"::"int4" = __relational_dividers__."id")
  left outer join interfaces_and_unions.relational_topics as __relational_topics__
  on (__relational_items__."id"::"int4" = __relational_topics__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __relational_items__."id" = __relational_items_identifiers__."id0"
    )
  order by __relational_items__."id" asc
) as __relational_items_result__