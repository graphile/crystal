select
  __forums__."name" as "0",
  array(
    select array[
      __messages__."body",
      __users__."username",
      __users__."gravatar_url",
      __messages__."id"
    ]::text[]
    from app_public.messages as __messages__
    left outer join app_public.users as __users__
    on (
    /* WHERE becoming ON */
      (
        __users__."id" = __messages__."author_id"
      ) and (
        true /* authorization checks */
      )
    )
    where
      (
        __messages__."forum_id" = __forums__."id"
      ) and (
        (__messages__.archived_at is null) = (__forums__."archived_at" is null)
      )
    order by __messages__."id" asc
  )::text as "1",
  array(
    select array[
      (count(*))::text
    ]::text[]
    from app_public.messages as __messages__
    where
      (
        __messages__."forum_id" = __forums__."id"
      ) and (
        (__messages__.archived_at is null) = (__forums__."archived_at" is null)
      )
  )::text as "2"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is not null
  )
order by __forums__."id" asc;
