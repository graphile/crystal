select
  __messages__."id" as "0",
  __messages__."body" as "1",
  __messages__."forum_id" as "2"
from app_public.messages as __messages__
where
  (
    __messages__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );

select
  __forums__."name" as "0"
from app_public.forums as __forums__
where
  (
    __forums__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );
