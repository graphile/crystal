select
  __forums__."id" as "0",
  __forums__."name" as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );
