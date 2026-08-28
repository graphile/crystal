select
  __forums__."name" as "0",
  (
    select array[
      __messages__."body",
      __users__."username",
      __users__."gravatar_url"
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
        __messages__."id" = $1::"uuid"
      ) and (
        true /* authorization checks */
      )
  )::text as "1"
from app_public.forums as __forums__
where
  (
    __forums__."id" = $2::"uuid"
  ) and (
    true /* authorization checks */
  );
