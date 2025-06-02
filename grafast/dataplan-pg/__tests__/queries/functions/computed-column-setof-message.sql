select
  __forums__."id" as "0",
  array(
    select array[
      __forums_featured_messages__."body"
    ]::text[]
    from app_public.forums_featured_messages(__forums__) as __forums_featured_messages__
    where (
      true /* authorization checks */
    )
  )::text as "1"
from app_public.forums as __forums__
where
  (
    __forums__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );
