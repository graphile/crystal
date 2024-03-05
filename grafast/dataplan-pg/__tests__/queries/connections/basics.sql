select
  __messages__."id" as "0",
  __messages__."body" as "1",
  __users__."username" as "2",
  __users__."gravatar_url" as "3"
from app_public.messages as __messages__
left outer join app_public.users as __users__
on (
  (
    __messages__."author_id"::"uuid" = __users__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
where
  (
    __messages__.archived_at is null
  ) and (
    true /* authorization checks */
  )
order by __messages__."id" asc;

select
  (count(*))::text as "0"
from app_public.messages as __messages__
where
  (
    __messages__.archived_at is null
  ) and (
    true /* authorization checks */
  );
