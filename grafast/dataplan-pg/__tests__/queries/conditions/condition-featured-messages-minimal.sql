select __forums_result__.*
from (select 0 as idx) as __forums_identifiers__,
lateral (
  select
    (select json_agg(s) from (
      select /* NOTHING?! */
      from app_public.messages as __messages__
      where
        (
          __messages__.featured = $1::"bool"
        ) and (
          (__messages__.archived_at is null) = (__forums__."archived_at" is null)
        ) and (
          __forums__."id"::"uuid" = __messages__."forum_id"
        )
      order by __messages__."id" asc
      limit 6
    ) s) as "0",
    (select json_agg(s) from (
      select
        (count(*))::text as "0"
      from app_public.messages as __messages__
      where
        (
          __messages__.featured = $1::"bool"
        ) and (
          (__messages__.archived_at is null) = (__forums__."archived_at" is null)
        ) and (
          __forums__."id"::"uuid" = __messages__."forum_id"
        )
    ) s) as "1",
    __forums__."id" as "2",
    __forums_identifiers__.idx as "3"
  from app_public.forums as __forums__
  where
    (
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
  order by __forums__."id" asc
) as __forums_result__;
