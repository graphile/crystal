select
  __featured_messages__."body" as "0"
from app_public.featured_messages() as __featured_messages__
where (
  true /* authorization checks */
);
