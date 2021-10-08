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
    __messages__."featured"::text as "1",
    __messages__."body"::text as "2",
    (__messages__.archived_at is not null)::text as "3",
    __messages__."forum_id"::text as "4",
    __messages__."author_id"::text as "5",
    __messages_identifiers__.idx as "6"
  from app_public.messages as __messages__
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
) as __messages_result__

select __forums_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __forums_identifiers__,
lateral (
  select
    __forums__."name"::text as "0",
    (__forums__.archived_at is not null)::text as "1",
    __forums_identifiers__.idx as "2"
  from app_public.forums as __forums__
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
  order by __forums__."id" asc
) as __forums_result__

select __users_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __users_identifiers__,
lateral (
  select
    __users__."username"::text as "0",
    __users__."gravatar_url"::text as "1",
    __users_identifiers__.idx as "2"
  from app_public.users as __users__
  where
    (
      true /* authorization checks */
    ) and (
      __users__."id" = __users_identifiers__."id0"
    )
  order by __users__."id" asc
) as __users_result__

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
    __messages__."featured"::text as "1",
    __messages__."body"::text as "2",
    (__messages__.archived_at is not null)::text as "3",
    __messages__."forum_id"::text as "4",
    __messages__."author_id"::text as "5",
    __messages_identifiers__.idx as "6"
  from app_public.messages as __messages__
  where
    (
      true /* authorization checks */
    ) and (
      __messages__."id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
) as __messages_result__

select __users_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __users_identifiers__,
lateral (
  select
    __users__."username"::text as "0",
    __users__."gravatar_url"::text as "1",
    __users_identifiers__.idx as "2"
  from app_public.users as __users__
  where
    (
      true /* authorization checks */
    ) and (
      __users__."id" = __users_identifiers__."id0"
    )
  order by __users__."id" asc
) as __users_result__