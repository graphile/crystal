select
  (count(*))::text as "0"
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__.archived_at is null
  );

select
  __messages__."body" as "0",
  __users__."username" as "1",
  __users__."gravatar_url" as "2",
  __messages__."id" as "3"
from app_public.messages as __messages__
left outer join app_public.users as __users__
on (
/* WHERE becoming ON */
  (
    __users__."id" = __messages__."author_id"
  ) and (
    true /* authorization checks */
  )
)
where
  (
    true /* authorization checks */
  ) and (
    __messages__.archived_at is null
  )
order by __messages__."id" asc
limit 4;
