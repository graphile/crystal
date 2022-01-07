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
    __users__."username"::text as "2",
    __users__."gravatar_url"::text as "3",
    __messages_identifiers__.idx as "4"
  from app_public.messages as __messages__
  left outer join app_public.users as __users__
  on (__messages__."author_id"::"uuid" = __users__."id")
  where
    (
      __messages__.archived_at is null
    ) and (
      ((__messages__."id" < __messages_identifiers__."id1")) or (__messages_identifiers__."id0" is true)
    ) and (
      true /* authorization checks */
    )
  order by __messages__."id" asc
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
