select __messages_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __messages_identifiers__,
lateral (
  select
    __messages__."id" as "0",
    __messages__."featured"::text as "1",
    __messages__."body" as "2",
    (__messages__.archived_at is not null)::text as "3",
    __forums__."name" as "4",
    (__forums__.archived_at is not null)::text as "5",
    __users__."gravatar_url" as "6",
    __users__."username" as "7",
    __messages__."forum_id" as "8",
    __messages_identifiers__.idx as "9"
  from app_public.messages as __messages__
  left outer join app_public.forums as __forums__
  on (__messages__."forum_id"::"uuid" = __forums__."id")
  left outer join app_public.users as __users__
  on (__messages__."author_id"::"uuid" = __users__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
) as __messages_result__;

select __messages_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __messages_identifiers__,
lateral (
  select
    __messages__."id" as "0",
    __messages__."featured"::text as "1",
    __messages__."body" as "2",
    (__messages__.archived_at is not null)::text as "3",
    __forums__."name" as "4",
    (__forums__.archived_at is not null)::text as "5",
    __users__."gravatar_url" as "6",
    __users__."username" as "7",
    __messages__."forum_id" as "8",
    __messages_identifiers__.idx as "9"
  from app_public.messages as __messages__
  left outer join app_public.forums as __forums__
  on (__messages__."forum_id"::"uuid" = __forums__."id")
  left outer join app_public.users as __users__
  on (__messages__."author_id"::"uuid" = __users__."id")
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
) as __messages_result__;
