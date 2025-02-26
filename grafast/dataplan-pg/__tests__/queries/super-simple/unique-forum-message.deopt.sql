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
  __messages__."author_id" as "1"
from app_public.messages as __messages__
where
  (
    __messages__."forum_id" = $1::"uuid"
  ) and (
    __messages__."id" = $2::"uuid"
  ) and (
    true /* authorization checks */
  );

select
  __users__."username" as "0",
  __users__."gravatar_url" as "1"
from app_public.users as __users__
where
  (
    __users__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );
