select
  __forum_names__.v as "0"
from app_public.forum_names() as __forum_names__(v)
where (
  true /* authorization checks */
);
