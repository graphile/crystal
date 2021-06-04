select 
  __forums__."name"::text as "0"
from app_public.forums as __forums__
where (
  __forums__.archived_at is null
) and (
  true /* authorization checks */
)
order by __forums__."id" asc