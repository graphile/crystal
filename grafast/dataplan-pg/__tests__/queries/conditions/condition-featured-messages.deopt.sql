select
  __forums__."name" as "0",
  __forums__."id" as "1",
  to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc;

select __messages_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0", (ids.value->>1)::"timestamptz" as "id1" from json_array_elements($2::json) with ordinality as ids) as __messages_identifiers__,
lateral (
  select
    __messages__."body" as "0",
    __messages__."author_id" as "1",
    __messages__."id" as "2",
    __messages_identifiers__.idx as "3"
  from app_public.messages as __messages__
  where
    (
      __messages__.featured = $1::"bool"
    ) and (
      (__messages__.archived_at is null) = (__messages_identifiers__."id1" is null)
    ) and (
      __messages__."forum_id" = __messages_identifiers__."id0"
    )
  order by __messages__."id" asc
  limit 6
) as __messages_result__;

select __messages_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0", (ids.value->>1)::"timestamptz" as "id1" from json_array_elements($2::json) with ordinality as ids) as __messages_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __messages_identifiers__.idx as "1"
  from app_public.messages as __messages__
  where
    (
      __messages__.featured = $1::"bool"
    ) and (
      (__messages__.archived_at is null) = (__messages_identifiers__."id1" is null)
    ) and (
      __messages__."forum_id" = __messages_identifiers__."id0"
    )
) as __messages_result__;

select
  __users__."username" as "0",
  __users__."gravatar_url" as "1"
from app_public.users as __users__
where
  (
    true /* authorization checks */
  ) and (
    __users__."id" = $1::"uuid"
  );
