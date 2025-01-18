select
  __messages__."body" as "0",
  __users__."username" as "1",
  __users__."gravatar_url" as "2",
  __forums__."name" as "3"
from app_public.forums as __forums__
left outer join app_public.messages as __messages__
on (
  (
    __forums__."id"::"uuid" = __messages__."forum_id"
  ) and (
    $1::"uuid" = __messages__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
left outer join app_public.users as __users__
on (
  (
    __messages__."author_id"::"uuid" = __users__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $2::"uuid"
  );
