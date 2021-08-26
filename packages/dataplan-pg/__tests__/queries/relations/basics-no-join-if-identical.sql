select __messages_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __messages_identifiers__,
lateral (
  select
    __messages__."id"::text as "0",
    __messages__."body"::text as "1",
    __messages__."forum_id"::text as "2",
    __messages_identifiers__.idx as "3"
  from app_public.messages as __messages__
  left outer join app_public.forums as __forums__
  on (__messages__."forum_id"::"uuid" = __forums__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
) as __messages_result__