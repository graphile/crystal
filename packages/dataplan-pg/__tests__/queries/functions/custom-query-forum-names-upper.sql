select
  __forum_names__.__forum_names__::text as "0"
from app_public.forum_names() as __forum_names__
where (
  true /* authorization checks */
)