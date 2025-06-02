select
  __forums__."name" as "0",
  __messages__."body" as "1",
  __users__."username" as "2",
  __users__."gravatar_url" as "3"
from app_public.forums as __forums__
left outer join app_public.messages as __messages__
on (
/* WHERE becoming ON */
  (
    __messages__."forum_id" = __forums__."id"
  ) and (
    __messages__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  )
)
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
    __forums__."id" = $2::"uuid"
  ) and (
    true /* authorization checks */
  );
