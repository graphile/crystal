select __forums_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __forums_identifiers__,
lateral (
  select
    __forums__::text as "0",
    __forums__."id" as "1",
    __forums_identifiers__.idx as "2"
  from app_public.forums as __forums__
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
  order by __forums__."id" asc
) as __forums_result__;

select __forums_featured_messages_result__.*
from (select 0 as idx, $1::app_public.forums as "id0") as __forums_featured_messages_identifiers__,
lateral (
  select
    __forums_featured_messages__."body" as "0",
    __forums_featured_messages_identifiers__.idx as "1"
  from app_public.forums_featured_messages(__forums_featured_messages_identifiers__."id0") as __forums_featured_messages__
  where (
    true /* authorization checks */
  )
) as __forums_featured_messages_result__;
