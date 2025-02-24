select
  __forums__."name" as "0",
  __forums__."id" as "1",
  to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is not null
  )
order by __forums__."id" asc;

select
  __messages__."body" as "0",
  __messages__."author_id" as "1"
from app_public.messages as __messages__
where
  (
    (__messages__.archived_at is null) = ($1::"timestamptz" is null)
  ) and (
    __messages__."forum_id" = $2::"uuid"
  )
order by __messages__."id" asc;

select
  __messages__."body" as "0",
  __messages__."author_id" as "1",
  __messages__."id" as "2"
from app_public.messages as __messages__
where
  (
    (__messages__.archived_at is null) = ($1::"timestamptz" is null)
  ) and (
    __messages__."forum_id" = $2::"uuid"
  )
order by __messages__."id" asc;

select __users_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0" from json_array_elements($1::json) with ordinality as ids) as __users_identifiers__,
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
