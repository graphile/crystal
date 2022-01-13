select
  __random_user_array__."username"::text as "0",
  __random_user_array__."gravatar_url"::text as "1"
from unnest(app_public.random_user_array()) as __random_user_array__
where (
  true /* authorization checks */
)