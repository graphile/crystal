select __forums_result__.*
from (select 0 as idx, $1::"bool" as "id0") as __forums_identifiers__,
lateral (
  select
    __forums__."name" as "0",
    __forums__."id" as "1",
    to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "2",
    __forums_identifiers__.idx as "3"
  from app_public.forums as __forums__
  where
    (
      __forums__.archived_at is null
    ) and (
      exists(
        select 1
        from app_public.messages as __messages_filter__
        where
          (
            __forums__."id" = __messages_filter__."forum_id"
          ) and (
            __messages_filter__.featured = __forums_identifiers__."id0"
          )
      )
    ) and (
      true /* authorization checks */
    )
  order by __forums__."id" asc
) as __forums_result__;

select __messages_result__.*
from (select 0 as idx, $1::"uuid" as "id0", $2::"bool" as "id1", $3::"timestamptz" as "id2") as __messages_identifiers__,
lateral (
  select
    __messages__."body" as "0",
    __messages__."featured"::text as "1",
    __messages_identifiers__.idx as "2"
  from app_public.messages as __messages__
  where
    (
      __messages__.featured <> __messages_identifiers__."id1"
    ) and (
      (__messages__.archived_at is null) = (__messages_identifiers__."id2" is null)
    ) and (
      __messages__."forum_id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
) as __messages_result__;
