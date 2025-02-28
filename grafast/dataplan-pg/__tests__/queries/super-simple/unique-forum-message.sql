select
  __forums__."name" as "0",
  __forums__."id" as "1"
from app_public.forums as __forums__
where
  (
    __forums__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );

select
  __messages__."body" as "0",
  __users__."username" as "1",
  __users__."gravatar_url" as "2"
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
    __messages__."forum_id" = $1::"uuid"
  ) and (
    __messages__."id" = $2::"uuid"
  ) and (
    true /* authorization checks */
  );
