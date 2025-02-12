select
  __forums__."id" as "0",
  __forums__."name" as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is null
  )
order by __forums__."id" asc;

select
  __forums__."name" as "0"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is null
  )
order by __forums__."id" asc;
