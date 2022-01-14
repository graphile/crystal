select
  __forums__."name"::text as "0",
  __forums__."id"::text as "1"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc

select
  __messages__."body"::text as "0",
  __messages__."featured"::text as "1",
  __messages__."forum_id"::text as "2"
from app_public.messages as __messages__
where (
  true /* authorization checks */
)
order by __messages__."id" asc