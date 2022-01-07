select __messages_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::bool as "id0",
    (ids.value->>1)::"uuid" as "id1"
  from json_array_elements($1::json) with ordinality as ids
) as __messages_identifiers__,
lateral (
  select
    __messages__."id"::text as "0",
    __messages__."body"::text as "1",
    __messages__."author_id"::text as "2",
    __messages_identifiers__.idx as "3"
  from app_public.messages as __messages__
  where
    (
      __messages__.archived_at is null
    ) and (
      ((__messages__."id" < __messages_identifiers__."id1")) or (__messages_identifiers__."id0" is true)
    ) and (
      true /* authorization checks */
    )
  order by __messages__."id" desc
  limit 3
) as __messages_result__

select
  (count(*))::text as "0"
from app_public.messages as __messages__
where
  (
    __messages__.archived_at is null
  ) and (
    true /* authorization checks */
  )


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