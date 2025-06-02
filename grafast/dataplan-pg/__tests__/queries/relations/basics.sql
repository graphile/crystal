select
  __messages__."id" as "0",
  __messages__."body" as "1",
  __messages__."forum_id" as "2",
  __forums__."name" as "3"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
/* WHERE becoming ON */
  (
    __forums__."id" = __messages__."forum_id"
  ) and (
    true /* authorization checks */
  )
)
where
  (
    __messages__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );
