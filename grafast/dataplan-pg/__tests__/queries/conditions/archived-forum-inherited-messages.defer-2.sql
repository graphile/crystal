select
  __forums__."name" as "0",
  to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "1",
  __forums__."id" as "2"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is not null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc;

select __messages_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0",
    (ids.value->>1)::"timestamptz" as "id1"
  from json_array_elements($1::json) with ordinality as ids
) as __messages_identifiers__,
lateral (
  select
    __messages__."body" as "0",
    __users__."username" as "1",
    __users__."gravatar_url" as "2",
    __users_2."gravatar_url" as "3",
    __users_2."username" as "4",
    __messages__."id" as "5",
    __messages_identifiers__.idx as "6"
  from app_public.messages as __messages__
  left outer join app_public.users as __users__
  on (__messages__."author_id"::"uuid" = __users__."id")
  left outer join app_public.users as __users_2
  on (__messages__."author_id"::"uuid" = __users_2."id")
  where
    (
      (__messages__.archived_at is null) = (__messages_identifiers__."id1" is null)
    ) and (
      __messages__."forum_id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
) as __messages_result__;
