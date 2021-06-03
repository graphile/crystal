select 
  424242 /* TODO: CURSOR */ as "0",
  __messages__."body"::text as "1",
  __users__."username"::text as "2",
  __users__."gravatar_url"::text as "3",
  __messages__."author_id"::text as "4"
from app_public.messages as __messages__
left outer join app_public.users as __users__
on ((__messages__."author_id"::"uuid" = __users__."id"))
where (
  __messages__.archived_at is null
) and (
  true /* authorization checks */
)
order by __messages__."id" asc