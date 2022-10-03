select
  __forum_names_cases__.v::text as "0"
from app_public.forum_names_cases() as __forum_names_cases__(v)
where (
  true /* authorization checks */
);
