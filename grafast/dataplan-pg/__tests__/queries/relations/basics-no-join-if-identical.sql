select __messages_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __messages_identifiers__,
lateral (
  select
    __messages__."id" as "0",
    __messages__."body" as "1",
    __forums__."id" as "2",
    __messages__."forum_id" as "3",
    __messages_identifiers__.idx as "4"
  from app_public.messages as __messages__
  left outer join app_public.forums as __forums__
  on (
    (
      __messages__."forum_id"::"uuid" = __forums__."id"
    ) and (
      /* WHERE becoming ON */ (
        true /* authorization checks */
      )
    )
  )
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
) as __messages_result__;
