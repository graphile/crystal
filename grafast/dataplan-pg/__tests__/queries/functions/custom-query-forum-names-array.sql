select
  __forum_names_array__.v::text as "0"
from app_public.forum_names_array() as __forum_names_array__(v)
where (
  true /* authorization checks */
);
