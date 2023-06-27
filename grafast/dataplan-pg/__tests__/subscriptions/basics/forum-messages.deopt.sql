select __messages_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __messages_identifiers__,
lateral (
  select
    __messages__."id" as "0",
    __messages__."featured"::text as "1",
    __messages__."body" as "2",
    (__messages__.archived_at is not null)::text as "3",
    __messages__."forum_id" as "4",
    __messages__."author_id" as "5",
    __messages_identifiers__.idx as "6"
  from app_public.messages as __messages__
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
) as __messages_result__;

select __forums_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __forums_identifiers__,
lateral (
  select
    __forums__."name" as "0",
    (__forums__.archived_at is not null)::text as "1",
    __forums_identifiers__.idx as "2"
  from app_public.forums as __forums__
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
) as __forums_result__;

select __users_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __users_identifiers__,
lateral (
  select
    __users__."username" as "0",
    __users__."gravatar_url" as "1",
    __users_identifiers__.idx as "2"
  from app_public.users as __users__
  where
    (
      true /* authorization checks */
    ) and (
      __users__."id" = __users_identifiers__."id0"
    )
) as __users_result__;

select __messages_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __messages_identifiers__,
lateral (
  select
    __messages__."id" as "0",
    __messages__."featured"::text as "1",
    __messages__."body" as "2",
    (__messages__.archived_at is not null)::text as "3",
    __messages__."forum_id" as "4",
    __messages__."author_id" as "5",
    __messages_identifiers__.idx as "6"
  from app_public.messages as __messages__
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
) as __messages_result__;

select __users_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __users_identifiers__,
lateral (
  select
    __users__."username" as "0",
    __users__."gravatar_url" as "1",
    __users_identifiers__.idx as "2"
  from app_public.users as __users__
  where
    (
      true /* authorization checks */
    ) and (
      __users__."id" = __users_identifiers__."id0"
    )
) as __users_result__;
