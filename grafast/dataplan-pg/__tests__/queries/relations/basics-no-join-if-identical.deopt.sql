select __messages_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __messages_identifiers__,
lateral (
  select
    __messages__."id" as "0",
    __messages__."body" as "1",
    __messages__."forum_id" as "2",
    __messages_identifiers__.idx as "3"
  from app_public.messages as __messages__
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
) as __messages_result__;

select __forums_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __forums_identifiers__,
lateral (
  select
    __forums__."id" as "0",
    __forums_identifiers__.idx as "1"
  from app_public.forums as __forums__
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
  order by __forums__."id" asc
) as __forums_result__;
