select
  __messages__."id" as "0",
  __messages__."body" as "1",
  __messages__."forum_id" as "2"
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );

select
  __forums__."id" as "0"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );
