select
  (select json_agg(s) from (
    select
      __forums_featured_messages__."body" as "0"
    from app_public.forums_featured_messages(__forums__) as __forums_featured_messages__
    where (
      true /* authorization checks */
    )
  ) s) as "0",
  __forums__."id" as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );
