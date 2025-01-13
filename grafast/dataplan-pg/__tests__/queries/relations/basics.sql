select
  __messages__."id" as "0",
  __messages__."body" as "1",
  __forums__."name" as "2",
  __messages__."forum_id" as "3"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
  (
    __messages__."forum_id"::"uuid" = __forums__."id"
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
    __messages__."id" = $1::"uuid"
  );
