select __forums_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __forums_identifiers__,
lateral (
  select
    (select json_agg(s) from (
      select
        __forums_featured_messages__."body" as "0"
      from app_public.forums_featured_messages(__forums__) as __forums_featured_messages__
      where (
        true /* authorization checks */
      )
    ) s) as "0",
    __forums__."id" as "1",
    __forums_identifiers__.idx as "2"
  from app_public.forums as __forums__
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
) as __forums_result__;
