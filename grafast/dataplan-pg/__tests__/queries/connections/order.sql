select
  (count(*))::text as "0"
from app_public.messages as __messages__
left outer join app_public.users as __author__
on (__messages__."author_id" = __author__."id")
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
  __messages__."id" as "3",
  __author__.username as "4",
  __messages__.body as "5"
from app_public.messages as __messages__
left outer join app_public.users as __author__
on (__messages__."author_id" = __author__."id")
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
order by __author__.username desc, __messages__.body asc, __messages__."id" asc
limit 6;
