select 
  __forums__."id"::text as "0",
  __forums__."name"::text as "1"
from app_public.forums as __forums__
where (
  __forums__.archived_at is null
) and (
  true /* authorization checks */
)
order by __forums__."id" asc