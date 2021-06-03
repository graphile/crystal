select 
  __forums__."name"::text as "0",
  array(
    select array[
      __messages__."body"::text,
      __users__."username"::text,
      __users__."gravatar_url"::text,
      __messages__."author_id"::text,
      424242 /* TODO: CURSOR */,
      __users_2."username"::text,
      __users_2."gravatar_url"::text
    ]::text[]
    from app_public.messages as __messages__
    left outer join app_public.users as __users__
    on ((__messages__."author_id"::"uuid" = __users__."id"))
    left outer join app_public.users as __users_2
    on ((__messages__."author_id"::"uuid" = __users_2."id"))
    where (
      (__messages__.archived_at is null) = (__forums__."archived_at" is null)
    ) and (
      __forums__."id"::"uuid" = __messages__."forum_id"
    )
    order by __messages__."id" asc
  ) as "1",
  __forums__."id"::text as "2",
  __forums__."archived_at"::text as "3"
from app_public.forums as __forums__
where (
  __forums__.archived_at is not null
) and (
  true /* authorization checks */
)
order by __forums__."id" asc