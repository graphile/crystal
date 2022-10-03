select
  __random_user_array__."username" as "0",
  __random_user_array__."gravatar_url" as "1"
from unnest(app_public.random_user_array()) as __random_user_array__
where (
  true /* authorization checks */
);
