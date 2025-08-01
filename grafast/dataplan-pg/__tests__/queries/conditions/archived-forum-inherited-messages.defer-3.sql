select
  __forums__."name" as "0",
  array(
    select array[
      __messages__."body",
      __messages__."author_id",
      __messages__."id"
    ]::text[]
    from app_public.messages as __messages__
    where
      (
        __messages__."forum_id" = __forums__."id"
      ) and (
        (__messages__.archived_at is null) = (__forums__."archived_at" is null)
      )
    order by __messages__."id" asc
  )::text as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is not null
  )
order by __forums__."id" asc;

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
      __users__."id" = __users_identifiers__."id0"
    ) and (
      true /* authorization checks */
    )
) as __users_result__;
