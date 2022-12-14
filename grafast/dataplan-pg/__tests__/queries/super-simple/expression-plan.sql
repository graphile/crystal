select
  __forums__."name" as "0",
  (__forums__."archived_at" is not null is true)::text as "1"
from app_public.forums as __forums__
where (
  true /* authorization checks */
)
order by __forums__."id" asc;
