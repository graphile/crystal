select
  __forum_names_array__.__forum_names_array__::text as "0"
from app_public.forum_names_array() as __forum_names_array__
where (
  true /* authorization checks */
)