select 
  __forums__."name"::text as "0",
  __forums__."id"::text as "1",
  __forums__."archived_at"::text as "2"
from app_public.forums as __forums__
where (
  true /* authorization checks */
)
order by __forums__."id" asc

select __messages_result__.*
from (
  select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __messages_identifiers__,
lateral (
  select 
    __messages__."body"::text as "0",
    __messages_identifiers__.idx as "1"
  from app_public.messages as __messages__
  where (
    (__messages__.archived_at is null) = ($2::timestamptz is null)
  ) and (
    __messages__."forum_id" = __messages_identifiers__."id0"
  )
  order by __messages__."id" asc
  limit 2
) as __messages_result__

select __messages_result__.*
from (
  select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __messages_identifiers__,
lateral (
  select 
    __messages__."body"::text as "0",
    __messages_identifiers__.idx as "1"
  from app_public.messages as __messages__
  where (
    (__messages__.archived_at is null) = ($2::timestamptz is null)
  ) and (
    __messages__."forum_id" = __messages_identifiers__."id0"
  )
  order by __messages__."id" asc
  limit 2
) as __messages_result__