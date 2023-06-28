select
  __random_user__."username" as "0",
  __random_user__."gravatar_url" as "1"
from app_public.random_user() as __random_user__
where (
  true /* authorization checks */
);
