select
  __forums__."name" as "0",
  array(
    select array[
      __messages__."body",
      __messages__."featured"::text
    ]::text[]
    from app_public.messages as __messages__
    where
      (
        __messages__."forum_id" = __forums__."id"
      ) and (
        __messages__.featured <> $1::"bool"
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
    __forums__.archived_at is null
  ) and (
    exists(
      select 1
      from app_public.messages as __messages_filter__
      where
        (
          __forums__."id" = __messages_filter__."forum_id"
        ) and (
          __messages_filter__.featured = $2::"bool"
        )
    )
  )
order by __forums__."id" asc;
