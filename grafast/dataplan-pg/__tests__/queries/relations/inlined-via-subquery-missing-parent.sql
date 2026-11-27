select
  __forums__."name" as "0",
  array(
    select array[
      (
        select array[
          __users__."username"
        ]::text[]
        from app_public.users as __users__
        where
          (
            __users__."id" = __messages__."author_id"
          ) and (
            true /* authorization checks */
          )
      )::text
    ]::text[]
    from app_public.messages as __messages__
    where
      (
        __messages__."forum_id" = __forums__."id"
      ) and (
        __messages__."featured" = $1::"bool"
      ) and (
        true /* authorization checks */
      )
    order by __messages__."created_at" asc
    limit 1
  )::text as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is null
  )
order by __forums__."id" asc;
