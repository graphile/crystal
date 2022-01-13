select
  __random_user_array_set__."username"::text as "0",
  __random_user_array_set__."gravatar_url"::text as "1",
  __random_user_array_set_idx__::text as "2"
from app_public.random_user_array_set() with ordinality as __random_user_array_set_array__ (arr, __random_user_array_set_idx__) cross join lateral unnest (arr) as __random_user_array_set__
where (
  true /* authorization checks */
)