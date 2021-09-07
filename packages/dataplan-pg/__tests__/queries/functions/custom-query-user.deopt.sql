select
  __users__."username"::text as "0",
  __users__."gravatar_url"::text as "1"
from app_public.random_user() as __users__
where (
  true /* authorization checks */
)
order by __users__."id" asc