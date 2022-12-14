select
  __random_user_array_set__."username" as "0",
  __random_user_array_set__."gravatar_url" as "1",
  __random_user_array_set_idx__::text as "2",
  __random_user_array_set__."id" as "3"
from app_public.random_user_array_set() with ordinality as __random_user_array_set_tmp__ (arr, __random_user_array_set_idx__) cross join lateral unnest (__random_user_array_set_tmp__.arr) as __random_user_array_set__
where (
  true /* authorization checks */
);
